import { createHash } from 'node:crypto'
import { PASSWORD_SECRET_KEY } from '~/configs/envKey'

export function sha256(content: string) {
  return createHash('sha256').update(content).digest('hex')
}

export function hashPassword(password: string) {
  return sha256(password + PASSWORD_SECRET_KEY)
}
