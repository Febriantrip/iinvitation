import { createHash, randomBytes } from 'node:crypto'
import { config } from '../config.js'

export const sessionCookie = 'iinvitation_session'
export const hashToken = token => createHash('sha256').update(token).digest('hex')
export const createSessionToken = () => randomBytes(32).toString('base64url')

export function sessionExpiry() {
  return new Date(Date.now() + config.sessionTtlHours * 60 * 60 * 1000)
}

export function cookieHeader(token, expiresAt) {
  const parts = [
    `${sessionCookie}=${encodeURIComponent(token)}`,
    'HttpOnly',
    'Path=/',
    'SameSite=Lax',
    `Max-Age=${Math.max(0, Math.floor((expiresAt.getTime() - Date.now()) / 1000))}`,
  ]
  if (config.cookieSecure) parts.push('Secure')
  return parts.join('; ')
}

export function clearCookieHeader() {
  const parts = [`${sessionCookie}=`, 'HttpOnly', 'Path=/', 'SameSite=Lax', 'Max-Age=0']
  if (config.cookieSecure) parts.push('Secure')
  return parts.join('; ')
}

export function readCookie(req, name) {
  const raw = req.headers.cookie || ''
  const found = raw.split(';').map(x => x.trim()).find(x => x.startsWith(`${name}=`))
  return found ? decodeURIComponent(found.slice(name.length + 1)) : ''
}
