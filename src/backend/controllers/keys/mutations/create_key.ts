import { AuthenticationError } from 'apollo-server-express'
import { Context } from 'backend/_types/context'
import { Key } from 'backend/_types/keys'
import { ObjectId } from 'mongodb'

export default async (_root: undefined, args: { deviceName: string }, context: Context): Promise<Key> => {

  if (!context.currentUserEmail) {
    throw new AuthenticationError('Unable to retrieve access token')
  }

  const user = await context.database.users.findOne({
    email: context.currentUserEmail
  })

  const createKeyResponse = await context.database.keys.insertOne({
    deviceName: args.deviceName,
    publicKey: 'THIS IS NOT A REAL PUBLIC KEY',
    userId: new ObjectId(user._id)
  })

  await context.database.users.findOneAndUpdate({
    email: context.currentUserEmail
  }, {
    $push: {
      keys: createKeyResponse.insertedId
    }
  })

  return createKeyResponse.ops[0]
}
