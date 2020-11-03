import { ObjectId } from 'mongodb'

export interface Key {
  _id?: ObjectId
  deviceName: string
  info?: {
    ip?: string,
    time?: number
  }
}
