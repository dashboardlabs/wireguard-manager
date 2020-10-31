import jwt from 'jsonwebtoken'
import axios from 'axios'

export const verifyJWT = async (token: string): Promise<string> => {
  const { data } = await axios.get(`${process.env.CF_ACCESS_URI}/cdn-cgi/access/certs`)
  const secret = data?.public_cert?.cert?.replace('\\n', '')
  try {
    return (jwt.verify(token, secret) as { email: string }).email
  } catch {
    return
  }
}
