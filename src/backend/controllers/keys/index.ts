import mutations from './mutations'
import queries from './queries'
import resolvers from './resolvers'
import * as typeDefs from './typeDefs.graphql'

export default {
  typeDefs,
  resolvers: {
    ...resolvers,
    Query: queries,
    Mutation: mutations
  }
}
