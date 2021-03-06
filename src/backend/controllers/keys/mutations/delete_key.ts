import { AuthenticationError, ForbiddenError } from 'apollo-server-express'
import { Context } from 'backend/_types/context'
import { Key } from 'backend/_types/keys'
import { ObjectId } from 'mongodb'
import execa from 'execa'

export default async (_root: undefined, args: { _id: string }, context: Context): Promise<Key> => {
  if (!context.currentUserEmail) {
    throw new AuthenticationError('Unable to retrieve access token')
  }

  const userId = await context.database.users.findOne({
    email: context.currentUserEmail
  })

  const key = await context.database.keys.findOne({
    _id: new ObjectId(args._id)
  })

  if (!(key.userId.equals(userId._id) || userId.superuser)) {
    throw new ForbiddenError('Access Denied')
  }

  await execa.command(`wg set wg0 peer ${key.publicKey} remove`)
  await execa.command('wg-quick down wg0')
  await execa.command('wg-quick up wg0')

  await context.database.users.findOneAndUpdate(
    {
      email: context.currentUserEmail
    },
    {
      $pull: {
        keys: key._id
      }
    }
  )

  await context.database.keys.findOneAndUpdate(
    {
      _id: key._id
    },
    {
      $set: {
        deviceName: '',
        publicKey: '',
        userId: null,
        isDeleted: true
      }
    }
  )

  return key
}
