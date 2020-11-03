import { AuthenticationError } from 'apollo-server-express'
import { Context } from 'backend/_types/context'
import { Key } from 'backend/_types/keys'
import findIPAddress from '../../../_utils/findIPAddress';
import { ObjectId } from 'mongodb'
import { exec } from 'child_process'

const { Wg } = require('wireguard-wrapper');

export default async (_root: undefined, args: { deviceName: string }, context: Context): Promise<Key> => {

  if (!context.currentUserEmail) {
    throw new AuthenticationError('Unable to retrieve access token')
  }

  const interfaces = await Wg.show('wg0')
  
  const offset = await context.database.keys.count({})

  const ip = findIPAddress(offset)

  const privateKey = await Wg.genkey()
  const publicKey = await Wg.pubkey(privateKey)
  exec(`wg set wg0 peer ${publicKey} allowed-ips ${ip}`)

  const config = `
    [Interface]\n
    Address = ${ip}\n
    PrivateKey = ${privateKey}\n
    DNS = 1.1.1.2, 1.0.0.2, 2606:4700:4700::1112, 2606:4700:4700::1002\n
    \n
    [Peer]\n
    PublicKey = ${interfaces.wg0._publicKey}\n
    AllowedIPs = 0.0.0.0/0, ::/0\n
    Endpoint = ${process.env.WIREGUARD_ENDPOINT}
  `

  const user = await context.database.users.findOne({
    email: context.currentUserEmail
  })

  const createKeyResponse = await context.database.keys.insertOne({
    deviceName: args.deviceName,
    publicKey,
    ip,
    userId: new ObjectId(user._id)
  })

  await context.database.users.findOneAndUpdate({
    email: context.currentUserEmail
  }, {
    $push: {
      keys: createKeyResponse.insertedId
    }
  })

  return {
    ...(createKeyResponse.ops[0]),
    config
  }
}
