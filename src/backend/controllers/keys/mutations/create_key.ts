import { AuthenticationError } from 'apollo-server-express'
import { Context } from 'backend/_types/context'
import { Key } from 'backend/_types/keys'
import findIPAddress from '../../../_utils/findIPAddress'
import { ObjectId } from 'mongodb'
import { exec } from 'child_process'
import genKey from '../../../_utils/genKey'
import getPublicIPAddressKube from '../../../_utils/getPublicIPAddressKube'

const { Wg } = require('wireguard-wrapper')

export default async (_root: undefined, args: { deviceName: string }, context: Context): Promise<Key> => {
  if (!context.currentUserEmail) {
    throw new AuthenticationError('Unable to retrieve access token')
  }

  const { privateKey, publicKey } = genKey()

  const user = await context.database.users.findOne({
    email: context.currentUserEmail
  })

  const existingIP = await context.database.keys.findOne({
    isDeleted: {
      $eq: true
    }
  })

  let ip: string

  if (existingIP) {
    ip = existingIP.ip
    await context.database.keys.findOneAndUpdate(
      {
        isDeleted: {
          $eq: true
        },
        ip
      },
      {
        $set: {
          deviceName: args.deviceName,
          publicKey,
          userId: new ObjectId(user._id),
          isDeleted: false
        }
      }
    )
  } else {
    const offset = await context.database.keys.count({})
    ip = findIPAddress(offset)
    await context.database.keys.insertOne({
      deviceName: args.deviceName,
      publicKey,
      ip,
      isDeleted: false,
      userId: new ObjectId(user._id)
    })
  }

  exec(`wg set wg0 peer ${publicKey} allowed-ips ${ip}`)

  const interfaces = await Wg.show('wg0')

  let dns = ''
  if (process.env.KUBERNETES_SERVICE_HOST) {
    dns = `DNS = ${process.env.KUBERNETES_SERVICE_HOST}0`
  } else if (!process.env.ALLOWED_IPS || process.env.ALLOWED_IPS === '0.0.0.0/0, ::/0') {
    dns = 'DNS = 1.1.1.2, 1.0.0.2, 2606:4700:4700::1112, 2606:4700:4700::1002'
  }
  const endpoint = process.env.WIREGUARD_ENDPOINT ? process.env.WIREGUARD_ENDPOINT : `${await getPublicIPAddressKube()}:51820`

  const config = `
    [Interface]
    Address = ${ip}
    ${dns}
    PrivateKey = ${privateKey}
    
    [Peer]
    PublicKey = ${interfaces.wg0._publicKey}
    AllowedIPs = ${process.env.ALLOWED_IPS ? process.env.ALLOWED_IPS : '0.0.0.0/0, ::/0'}
    Endpoint = ${endpoint}
  `

  const key = await context.database.keys.findOne({
    publicKey,
    ip
  })

  await context.database.users.findOneAndUpdate(
    {
      email: context.currentUserEmail
    },
    {
      $push: {
        keys: key._id
      }
    }
  )

  return {
    ...key,
    config
  }
}
