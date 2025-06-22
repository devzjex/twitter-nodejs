import { SignOptions } from 'jsonwebtoken'

export const JWT_SECRET_KEY = process.env.JWT_SECRET
export const PASSWORD_SECRET_KEY = process.env.PASSWORD_SECRET

export const ACCESS_TOKEN_EXPIRES_IN: SignOptions['expiresIn'] = process.env
    .ACCESS_TOKEN_EXPIRES_IN as SignOptions['expiresIn']
export const REFRESH_TOKEN_EXPIRES_IN: SignOptions['expiresIn'] = process.env
    .REFRESH_TOKEN_EXPIRES_IN as SignOptions['expiresIn']
