import { ObjectId } from 'mongodb'
import { Key } from './keys'

export interface User {
  _id?: ObjectId
  email: string
  name?: string
  superuser: boolean
  keys: Key[]
}
