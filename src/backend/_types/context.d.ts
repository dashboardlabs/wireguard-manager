import { Collection } from 'mongodb'
import { Key } from './keys'
import { User } from './users'

export interface Context {
  ip?: string | string[]
  currentUserEmail?: string
  database?: {
    users: Collection<User>
    keys: Collection<Key>
  }
}
