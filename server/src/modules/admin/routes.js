import { randomUUID } from 'node:crypto'
import express from 'express'
import { pool } from '../../db/pool.js'
import { config } from '../../config.js'
import { verifyPassword } from '../../security/password.js'
import { clearCookieHeader, cookieHeader, createSessionToken, hashToken, readCookie, sessionCookie, sessionExpiry } from '../../security/session.js'
import { requireAdmin } from '../../middleware/auth.js'
import { addClient } from '../../realtime/hub.js'
import { addReviewNote, createInvitation, deleteInvitation, getAdminState, listInvitations, saveAdminState, sendForClientReview, updateWorkflow } from './repository.js'

export const adminRouter = express.Router()
const attempts = new Map()

function isPrivateLanOrigin(origin) {
  if (!origin || !config.allowPrivateLanOrigins) return false
  try {
    const { protocol, hostname, port } = new URL(origin)
    if (!['http:', 'https:'].includes(protocol)) return false
    const numericPort = Number(port || 80)
    if (numericPort < 1 || numericPort > 65535) return false
    if (hostname === 'localhost' || hostname === '127.0.0.1') return true
    if (/^10\./.test(hostname)) return true
    if (/^192\.168\./.test(hostname)) return true
    const match = hostname.match(/^172\.(\d+)\./)
    return Boolean(match && Number(match[1]) >= 16 && Number(match[1]) <= 31)
  } catch {
    return false
  }
}

adminRouter.use((req, res, next) => {
  if (!['POST','PUT','PATCH','DELETE'].includes(req.method)) return next()
  const origin = req.headers.origin
  if (!origin || config.allowedOrigins.includes(origin) || isPrivateLanOrigin(origin)) return next()
  return res.status(403).json({ message: 'Origin tidak diizinkan.' })
})

function loginAllowed(ip) {
  const now = Date.now()
  const current = attempts.get(ip) || []
  const recent = current.filter(ts => now - ts < 60_000)
  recent.push(now)
  attempts.set(ip, recent)
  return recent.length <= 10
}

adminRouter.post('/auth/login', async (req, res, next) => {
  try {
    if (!loginAllowed(req.ip || 'unknown')) return res.status(429).json({ message: 'Terlalu banyak percobaan login. Coba lagi sebentar.' })
    const email = String(req.body?.email || '').trim().toLowerCase()
    const password = String(req.body?.password || '')
    const result = await pool.query('SELECT * FROM admin_users WHERE email=?', [email])
    const user = result.rows[0]
    if (!user || !verifyPassword(password, user.password_salt, user.password_hash)) return res.status(401).json({ message: 'Email atau password salah.' })
    const token = createSessionToken()
    const expiresAt = sessionExpiry()
    await pool.query('INSERT INTO admin_sessions(token_hash,admin_user_id,expires_at) VALUES(?,?,?)', [hashToken(token), user.id, expiresAt])
    res.setHeader('Set-Cookie', cookieHeader(token, expiresAt))
    res.json({ user: { id: user.id, email: user.email } })
  } catch (error) { next(error) }
})

adminRouter.post('/auth/logout', async (req, res, next) => {
  try {
    const token = readCookie(req, sessionCookie)
    if (token) await pool.query('DELETE FROM admin_sessions WHERE token_hash=?', [hashToken(token)])
    res.setHeader('Set-Cookie', clearCookieHeader())
    res.status(204).end()
  } catch (error) { next(error) }
})

adminRouter.get('/auth/me', requireAdmin, (req, res) => res.json({ user: req.admin }))
adminRouter.get('/admin/invitations', requireAdmin, async (_req, res, next) => {
  try { res.json({ invitations: await listInvitations() }) } catch (error) { next(error) }
})
adminRouter.post('/admin/invitations', requireAdmin, async (req, res, next) => {
  try { res.status(201).json(await createInvitation(req.body || {})) } catch (error) { next(error) }
})
adminRouter.delete('/admin/invitations/:id', requireAdmin, async (req, res, next) => {
  try { res.json(await deleteInvitation(req.params.id)) } catch (error) { next(error) }
})
adminRouter.patch('/admin/invitations/:id/workflow', requireAdmin, async (req, res, next) => {
  try { res.json(await updateWorkflow(String(req.params.id || ''), req.body || {})) } catch (error) { next(error) }
})
adminRouter.post('/admin/invitations/:id/review/send', requireAdmin, async (req, res, next) => {
  try { res.json(await sendForClientReview(String(req.params.id || ''))) } catch (error) { next(error) }
})
adminRouter.post('/admin/invitations/:id/review/notes', requireAdmin, async (req, res, next) => {
  try { res.status(201).json(await addReviewNote(String(req.params.id || ''), { ...req.body, author: 'admin' })) } catch (error) { next(error) }
})

adminRouter.patch('/admin/invitations/:id/features', requireAdmin, async (req, res, next) => {
  try {
    const id = String(req.params.id || '')
    const current = await pool.query('SELECT feature_website,feature_guestbook,feature_frame FROM invitations WHERE id=? LIMIT 1', [id])
    if (!current.rowCount) return res.status(404).json({ message: 'Undangan tidak ditemukan.' })
    const row = current.rows[0]
    const featureWebsite = typeof req.body?.featureWebsite === 'boolean' ? req.body.featureWebsite : Boolean(row.feature_website)
    const featureGuestbook = typeof req.body?.featureGuestbook === 'boolean' ? req.body.featureGuestbook : Boolean(row.feature_guestbook)
    const featureFrame = typeof req.body?.featureFrame === 'boolean' ? req.body.featureFrame : Boolean(row.feature_frame)
    await pool.query('UPDATE invitations SET feature_website=?,feature_guestbook=?,feature_frame=?,updated_at=CURRENT_TIMESTAMP(3) WHERE id=?', [featureWebsite ? 1 : 0, featureGuestbook ? 1 : 0, featureFrame ? 1 : 0, id])
    res.json({ ok: true, featureWebsite, featureGuestbook, featureFrame })
  } catch (error) { next(error) }
})
adminRouter.get('/admin/state', requireAdmin, async (req, res, next) => {
  try { res.json(await getAdminState(String(req.query.invitationId || ''))) } catch (error) { next(error) }
})
adminRouter.put('/admin/state', requireAdmin, async (req, res, next) => {
  try { res.json(await saveAdminState(req.body || {}, String(req.query.invitationId || ''))) } catch (error) { next(error) }
})



adminRouter.post('/admin/guestbook/:invitationId/check-in', requireAdmin, async (req, res, next) => {
  try {
    const invitationId = String(req.params.invitationId || '')
    const guestId = String(req.body?.guestId || '')
    const source = ['operator','manual','qr'].includes(req.body?.source) ? req.body.source : 'operator'
    const guest = await pool.query('SELECT id,name,invited_pax FROM guests WHERE invitation_id=? AND id=? LIMIT 1', [invitationId, guestId])
    if (!guest.rowCount) return res.status(404).json({ message: 'Tamu tidak ditemukan.' })
    const invited = Math.max(1, Math.min(20, Number(guest.rows[0].invited_pax || 1)))
    const pax = Math.max(1, Math.min(invited, Number(req.body?.pax || 1)))
    const existing = await pool.query('SELECT id FROM guest_checkins WHERE invitation_id=? AND guest_id=? LIMIT 1', [invitationId, guestId])
    let id = existing.rows[0]?.id
    if (id) await pool.query('UPDATE guest_checkins SET pax=?,source=?,checked_in_at=CURRENT_TIMESTAMP(3),updated_at=CURRENT_TIMESTAMP(3) WHERE id=?', [pax, source, id])
    else {
      id = randomUUID()
      await pool.query('INSERT INTO guest_checkins(id,invitation_id,guest_id,pax,source) VALUES(?,?,?,?,?)', [id, invitationId, guestId, pax, source])
    }
    const { broadcast } = await import('../../realtime/hub.js')
    broadcast('checkin_changed', { invitationId, guestId, checkinId: id })
    res.json({ ok: true, id, guestId, pax })
  } catch (error) { next(error) }
})

adminRouter.delete('/admin/guestbook/:invitationId/check-in/:guestId', requireAdmin, async (req, res, next) => {
  try {
    const invitationId = String(req.params.invitationId || '')
    const guestId = String(req.params.guestId || '')
    await pool.query('DELETE FROM guest_checkins WHERE invitation_id=? AND guest_id=?', [invitationId, guestId])
    const { broadcast } = await import('../../realtime/hub.js')
    broadcast('checkin_changed', { invitationId, guestId, removed: true })
    res.status(204).end()
  } catch (error) { next(error) }
})

adminRouter.get('/admin/events', requireAdmin, (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache, no-transform')
  res.setHeader('Connection', 'keep-alive')
  res.flushHeaders?.()
  res.write(`event: connected\ndata: ${JSON.stringify({ ok: true })}\n\n`)
  const remove = addClient(res)
  const heartbeat = setInterval(() => res.write(': heartbeat\n\n'), 25_000)
  req.on('close', () => { clearInterval(heartbeat); remove() })
})
