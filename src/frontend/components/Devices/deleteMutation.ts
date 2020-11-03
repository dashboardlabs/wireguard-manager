import { gql } from '@apollo/client'

export default gql`
  mutation ($_id: ID!) {
    keys: delete_key(_id: $deviceName) {
        _id
    }
  }
`
