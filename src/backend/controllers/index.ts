import sample from './sample'
import { gql } from 'apollo-server-express'

const emptyDefs = gql`
  type Query
  type Mutation
`

export const resolvers = [sample.resolvers]

export const typeDefs = [emptyDefs, sample.typeDefs]
