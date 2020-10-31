import { ObjectId } from 'mongodb'

export interface Key {
  _id?: ObjectId
  deviceName: string
}
