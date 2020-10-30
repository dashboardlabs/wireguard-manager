import jwt from 'jsonwebtoken'

const secret = process.env.JWT_SECRET || 'The quick brown fox jumps over the lazy dog.'

const jwtOptions = {
  expiresIn: '2h'
}

export const generateJWT = (id: string): string => {
  return jwt.sign({ id }, secret, jwtOptions)
}

export const verifyJWT = (
  token: string
): {
  id: string
  iat: number
  exp: number
} => {
  try {
    return jwt.verify(token, secret) as {
      id: string
      iat: number
      exp: number
    }
  } catch {
    return
  }
}
