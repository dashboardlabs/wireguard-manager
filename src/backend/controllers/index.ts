import users from './users'
import keys from './keys'
import { gql } from 'apollo-server-express'

const emptyDefs = gql`
  type Query
  type Mutation
`

export const resolvers = [users.resolvers, keys.resolvers]

export const typeDefs = [emptyDefs, users.typeDefs, keys.typeDefs]
