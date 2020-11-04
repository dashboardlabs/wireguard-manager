import { AuthenticationError } from 'apollo-server-express'
import { Context } from 'backend/_types/context'
import { Key } from 'backend/_types/keys'
import findIPAddress from '../../../_utils/findIPAddress'
import { ObjectId } from 'mongodb'
import { exec } from 'child_process'

const { Wg } = require('wireguard-wrapper')

export default async (_root: undefined, args: { deviceName: string }, context: Context): Promise<Key> => {
  if (!context.currentUserEmail) {
    throw new AuthenticationError('Unable to retrieve access token')
  }

  const interfaces = await Wg.show('wg0')

  const privateKey = await Wg.genkey()
  const publicKey = await Wg.pubkey(privateKey)

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

  const config = `
    [Interface]
    Address = ${ip}
    PrivateKey = ${privateKey}
    DNS = 1.1.1.2, 1.0.0.2, 2606:4700:4700::1112, 2606:4700:4700::1002
    
    [Peer]
    PublicKey = ${interfaces.wg0._publicKey}
    AllowedIPs = 0.0.0.0/0, ::/0
    Endpoint = ${process.env.WIREGUARD_ENDPOINT}
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
