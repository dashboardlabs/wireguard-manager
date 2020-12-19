import { gql } from '@apollo/client'

export default gql`
  query {
    keys: keys {
      _id
      deviceName
      info {
        ip
        time
      }
      user {
        name
        email
      }
    }
  }
`
