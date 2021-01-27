const detox_crypto = require('@detox/crypto')

const genKey = (): { privateKey: string, publicKey: string } => {
  const keypair = detox_crypto.create_keypair().x25519
  return {
    privateKey: Buffer.from(keypair.private).toString('base64'),
    publicKey: Buffer.from(keypair.public).toString('base64')
  }
}

export default genKey
