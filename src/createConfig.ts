import genkey from './backend/_utils/genKey'
import fs from 'fs'

const path = '/etc/wireguard/wg0.conf'

const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

const config = (privateKey: string): string => {
  return `[Interface]
Address = 10.69.0.1/16
SaveConfig = true
PostUp = iptables -A FORWARD -i %i -j ACCEPT; iptables -A FORWARD -o %i -j ACCEPT; iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
PostDown = iptables -D FORWARD -i %i -j ACCEPT; iptables -D FORWARD -o %i -j ACCEPT; iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE
ListenPort = 51820
PrivateKey = ${privateKey}`
}

(async () => {
  await delay(1000)
  if (!fs.existsSync(path)) {
    fs.writeFileSync(path, config(genkey().privateKey))
  }
})()
