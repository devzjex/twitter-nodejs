import { config } from 'dotenv'
import jwt, { SignOptions } from 'jsonwebtoken'
import { JWT_SECRET_KEY } from '~/configs/envKey'
import { TokenPayload } from '~/models/requests/User.request'

config()

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

export const verifyToken = ({
    token,
    secretOrPublicKey = JWT_SECRET_KEY as string
}: {
    token: string
    secretOrPublicKey?: string
}) => {
    return new Promise<TokenPayload>((resolve, reject) => {
        jwt.verify(token, secretOrPublicKey, (error, decoded) => {
            if (error || !decoded) {
                throw reject(error)
            } else {
                resolve(decoded as TokenPayload)
            }
        })
    })
}
