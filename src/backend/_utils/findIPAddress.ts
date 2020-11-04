const ip = process.env.WIREGUARD_START_IP?.split('.')

const findIPAddress = (offset: number): string => {
  return `${ip[0]}.${ip[1]}.${Math.floor(offset / 253)}.${(offset % 253) + 2}/32`
}

export default findIPAddress
