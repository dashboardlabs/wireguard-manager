import { ObjectId } from 'mongodb'
import { User } from './users'

export interface Key {
  _id?: ObjectId
  deviceName: string
  publicKey: string
  user?: User
  userId: ObjectId
  isDeleted?: boolean
  ip: string
  config?: string
}
