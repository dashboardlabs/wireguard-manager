import { Key } from 'backend/_types/keys'
import { User } from 'backend/_types/users'
import { Context } from 'backend/_types/context'
import { ObjectId } from 'mongodb'

const { Wg } = require('wireguard-wrapper')

export default {
  Key: {
    info: async (key: Key): Promise<{ ip: string; time: number }> => {
      const interfaces = await Wg.show('wg0')
      const peer = interfaces?.wg0?._peers?.[key.publicKey]
      return {
        ip: peer?._endpoint?.split(':')[0],
        time: peer?._latestHandshake
      }
    },
    user: async (key: Key, _args: unknown, context: Context): Promise<User> => {
      return await context.database.users.findOne({
        _id: new ObjectId(key.userId)
      })
    }
  }
}
