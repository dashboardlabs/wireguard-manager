import { ObjectId } from 'mongodb'
import { User } from './users'

export interface Key {
  _id?: ObjectId
  deviceName: string
  publicKey: string
  user?: User
  userId: ObjectId
  ip: string
  config?: string
}
