import { gql } from '@apollo/client'

export default gql`
  mutation($deviceName: String!) {
    keys: create_key(deviceName: $deviceName) {
      _id
      deviceName
      config
      info {
        ip
        time
      }
    }
  }
`
