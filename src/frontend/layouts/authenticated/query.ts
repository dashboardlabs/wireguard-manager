import { gql } from '@apollo/client'

export default gql`
  query {
    user: current_user {
      _id
      name
      email
      superuser
    }
  }
`
