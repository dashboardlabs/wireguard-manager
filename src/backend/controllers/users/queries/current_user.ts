import { AuthenticationError } from 'apollo-server-express'
import { Context } from 'backend/_types/context'
import { User } from 'backend/_types/users'

export default async (_root: undefined, _args: null, context: Context): Promise<User> => {
  if (!context.currentUserEmail) {
    throw new AuthenticationError('Unable to retrieve access token')
  }

  const currentUser = await context.database.users.findOne({
    email: context.currentUserEmail
  })

  if (currentUser) {
    return currentUser
  }

  const response = await context.database.users.insertOne({
    email: context.currentUserEmail,
    superuser: false,
    keys: []
  })

  return response.ops[0]
}
