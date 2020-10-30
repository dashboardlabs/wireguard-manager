import gql from 'graphql-tag'

export default gql`
  query {
    user: current_user {
      id
      name
      email
    }
  }
`
