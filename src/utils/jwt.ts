import jwt, { SignOptions } from 'jsonwebtoken'
import { JWT_SECRET_KEY } from '~/configs/envKey'

export const signToken = ({
  payload,
  privateKey = JWT_SECRET_KEY as string,
  options = { algorithm: 'HS256' }
}: {
  payload: string | Buffer | object
  privateKey?: string
  options?: SignOptions
}): Promise<string> => {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, privateKey, options, (error, token) => {
      if (error || !token) {
        throw reject(error)
      } else {
        resolve(token)
      }
    })
  })
}
