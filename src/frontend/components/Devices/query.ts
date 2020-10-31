import { gql } from '@apollo/client'

export default gql`
  query {
    keys: current_user_keys {
      _id
      deviceName
    }
  }
`
