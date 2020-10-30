import { ApolloClient, InMemoryCache, NormalizedCacheObject } from '@apollo/client'
import Cookies from 'js-cookie'

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  cache: new InMemoryCache(),
  uri: '/graphql',
  headers: {
    accessToken: Cookies.get('CF_Authorization')
  }
})

export default client
