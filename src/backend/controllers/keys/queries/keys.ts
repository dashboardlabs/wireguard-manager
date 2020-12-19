import { AuthenticationError } from 'apollo-server-express'
import { Context } from 'backend/_types/context'
import { Key } from 'backend/_types/keys'

export default async (_root: undefined, _args: null, context: Context): Promise<Key[]> => {
  if (!context.currentUserEmail) {
    throw new AuthenticationError('Unable to retrieve access token')
  }

  const user = await context.database.users.findOne({
    email: context.currentUserEmail
  })

  if (!user.superuser) {
    return []
  }

  return await context.database.keys
    .find({
      isDeleted: {
        $ne: true
      }
    })
    .toArray()
}
