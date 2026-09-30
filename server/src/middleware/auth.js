import { pool } from '../db/pool.js'
import { hashToken, readCookie, sessionCookie } from '../security/session.js'

export async function requireAdmin(req, res, next) {
  try {
    const token = readCookie(req, sessionCookie)
    if (!token) return res.status(401).json({ message: 'Unauthorized' })
    const result = await pool.query(`SELECT u.id, u.email
      FROM admin_sessions s
      JOIN admin_users u ON u.id=s.admin_user_id
      WHERE s.token_hash=? AND s.expires_at > CURRENT_TIMESTAMP(3)`, [hashToken(token)])
    if (!result.rowCount) return res.status(401).json({ message: 'Unauthorized' })
    req.admin = result.rows[0]
    next()
  } catch (error) {
    next(error)
  }
}
