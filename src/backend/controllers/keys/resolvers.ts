import { Key } from "backend/_types/keys";

const { Wg } = require('wireguard-wrapper')

export default {
  Key: {
    info: async (key: Key): Promise<{ ip: string, time: number }> => {
      const interfaces = await Wg.show('wg0')
      const peer = interfaces?.wg0?._peers?.[key.publicKey]
      return {
        ip: peer?._endpoint?.split(':')[0],
        time: peer?._latestHandshake
      }
    }
  }
}
