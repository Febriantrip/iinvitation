import 'dotenv/config'
import path from 'node:path'

const csv = value => String(value || '').split(',').map(v => v.trim()).filter(Boolean)

export const config = {
  port: Number(process.env.PORT || 8787),
  db: {
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'wedding_invitation',
  },
  adminEmail: process.env.ADMIN_EMAIL || 'admin@example.com',
  adminPassword: process.env.ADMIN_PASSWORD || 'replace-with-a-strong-local-password',
  sessionTtlHours: Number(process.env.SESSION_TTL_HOURS || 168),
  cookieSecure: String(process.env.COOKIE_SECURE || 'false').toLowerCase() === 'true',
  allowedOrigins: csv(process.env.ALLOWED_ORIGINS || 'http://localhost:5173'),
  allowPrivateLanOrigins: String(process.env.ALLOW_PRIVATE_LAN_ORIGINS || 'true').toLowerCase() === 'true',
  uploadDir: path.resolve(process.env.UPLOAD_DIR || './data/uploads'),
}
