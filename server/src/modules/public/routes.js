import express from 'express'
import { randomUUID } from 'node:crypto'
import { pool } from '../../db/pool.js'
import { broadcast } from '../../realtime/hub.js'

export const publicRouter = express.Router()

const defaultImageEdit = { positionX: 50, positionY: 50, zoom: 1, rotate: 0, brightness: 100, contrast: 100, saturation: 100, grayscale: 0, sepia: 0, blur: 0, flipX: false, flipY: false, aspect: 'cover' }
const defaultGalleryEdit = { ...defaultImageEdit, aspect: 'square' }
const defaultTemplateSettings = {
  displayFont: 'theme', bodyFont: 'theme', scriptFont: 'theme', titleScale: 1, recipientScale: 1, dateScale: 1,
  sectionTitleScale: 1, letterSpacing: 0, coverTitleX: 0, coverTitleY: 0, recipientX: 0, recipientY: 0,
  dateX: 0, dateY: 0, sectionTitleX: 0, sectionTitleY: 0, textAlign: 'theme',
}
const parseJson = (value, fallback) => { try { return value ? { ...fallback, ...JSON.parse(value) } : { ...fallback } } catch { return { ...fallback } } }
const parseSectionSettings = value => { try { const parsed = value ? JSON.parse(value) : []; return Array.isArray(parsed) ? parsed : [] } catch { return [] } }
const bool = value => Boolean(Number(value))
const pax = value => Math.max(1, Math.min(20, Number(value || 1)))

const mapEvent = (row, gallery) => ({
  id: row.id,
  clientName: row.client_name || `${row.bride_name} & ${row.groom_name}`,
  themeId: row.theme_id || 'botanical-serenity',
  slug: row.slug,
  groomName: row.groom_name,
  groomFullName: row.groom_full_name,
  brideName: row.bride_name,
  brideFullName: row.bride_full_name,
  groomParents: row.groom_parents,
  brideParents: row.bride_parents,
  eventDate: row.event_date,
  akadTime: row.akad_time,
  receptionTime: row.reception_time,
  venueName: row.venue_name,
  venueAddress: row.venue_address,
  mapUrl: row.map_url,
  openingText: row.opening_text,
  storyText: row.story_text,
  closingText: row.closing_text,
  heroImage: row.hero_image,
  heroEdit: parseJson(row.hero_edit_json, defaultImageEdit),
  musicUrl: row.music_url,
  gallery: gallery.map(item => ({ id: item.id, url: item.url, caption: item.caption, edit: parseJson(item.edit_json, defaultGalleryEdit) })),
  featureWebsite: bool(row.feature_website ?? 1),
  featureGuestbook: bool(row.feature_guestbook),
  featureFrame: bool(row.feature_frame),
  guestbookPin: '',
  framePreset: ['heritage','botanical','editorial'].includes(row.frame_preset) ? row.frame_preset : 'heritage',
  frameNames: row.frame_names || `${row.bride_name} & ${row.groom_name}`,
  frameDateLabel: row.frame_date_label || '',
  frameOverlay: Math.max(0, Math.min(70, Number(row.frame_overlay ?? 22))),
  templateSettings: parseJson(row.template_settings_json, defaultTemplateSettings),
  sectionSettings: parseSectionSettings(row.section_settings_json),
  projectStatus: row.project_status || 'draft',
  publicationStatus: row.publication_status || 'draft',
  reviewStatus: row.review_status || 'not_sent',
  reviewToken: '',
  previewToken: '',
  publishedAt: row.published_at ? new Date(row.published_at).toISOString() : null,
  expiresAt: row.expires_at ? new Date(row.expires_at).toISOString() : null,
})

async function invitationBySlug(slug) {
  const result = await pool.query('SELECT * FROM invitations WHERE slug=? LIMIT 1', [slug])
  return result.rows[0] || null
}

function publicationActive(invitation) {
  if (!invitation || invitation.publication_status !== 'published') return false
  if (invitation.expires_at && new Date(invitation.expires_at).getTime() <= Date.now()) return false
  return true
}

function previewAllowed(invitation, supplied) {
  return Boolean(invitation?.preview_token) && String(supplied || '') === String(invitation.preview_token)
}

const mapReviewNote = row => ({
  id: row.id, author: row.author === 'client' ? 'client' : 'admin', kind: row.kind || 'comment', sectionKey: row.section_key || 'general', message: row.message || '', createdAt: new Date(row.created_at).toISOString(),
})

function validPin(invitation, supplied) {
  return Boolean(invitation?.guestbook_pin) && String(supplied || '').trim() === String(invitation.guestbook_pin)
}

publicRouter.get('/public/invitations/:slug', async (req, res, next) => {
  try {
    const invitation = await invitationBySlug(req.params.slug)
    if (!invitation || !bool(invitation.feature_website ?? 1)) return res.status(404).json({ message: 'Undangan tidak ditemukan atau fitur Wedding Website tidak aktif.' })
    const canPreview = previewAllowed(invitation, req.query.preview)
    if (!publicationActive(invitation) && !canPreview) return res.status(404).json({ message: 'Undangan belum dipublikasikan.' })
    const gallery = await pool.query('SELECT id,url,caption,edit_json FROM gallery_items WHERE invitation_id=? ORDER BY position,id', [invitation.id])
    const token = String(req.query.guest || '')
    let guest = null
    if (token) {
      const guestResult = await pool.query('SELECT id,name,token,status,invited_pax FROM guests WHERE invitation_id=? AND token=?', [invitation.id, token])
      guest = guestResult.rows[0] || null
    }
    const fallbackName = String(req.query.to || req.query.kepada || '').trim()
    res.json({
      event: mapEvent(invitation, gallery.rows),
      guest: guest ? { id: guest.id, name: guest.name, token: guest.token, status: guest.status, invitedPax: pax(guest.invited_pax) } : null,
      guestName: guest?.name || fallbackName || 'Bapak/Ibu/Saudara/i',
    })
  } catch (error) { next(error) }
})

publicRouter.post('/public/invitations/:slug/open', async (req, res, next) => {
  try {
    const token = String(req.body?.guestToken || '')
    if (!token) return res.json({ ok: true })
    const invitation = await pool.query('SELECT id,feature_website,publication_status,expires_at FROM invitations WHERE slug=?', [req.params.slug])
    if (!invitation.rowCount || !bool(invitation.rows[0].feature_website ?? 1) || !publicationActive(invitation.rows[0])) return res.status(404).json({ message: 'Undangan tidak ditemukan.' })
    const guestResult = await pool.query('SELECT id,status FROM guests WHERE invitation_id=? AND token=? LIMIT 1', [invitation.rows[0].id, token])
    const guest = guestResult.rows[0]
    if (guest?.status === 'Belum dibuka') {
      const updated = await pool.query(`UPDATE guests SET status='Sudah dibuka' WHERE invitation_id=? AND id=? AND status='Belum dibuka'`, [invitation.rows[0].id, guest.id])
      if (updated.rowCount) broadcast('guest_opened', { invitationId: invitation.rows[0].id, guestId: guest.id })
    }
    res.json({ ok: true })
  } catch (error) { next(error) }
})

publicRouter.post('/public/invitations/:slug/rsvp', async (req, res, next) => {
  try {
    const invitationResult = await pool.query('SELECT id,feature_website,publication_status,expires_at FROM invitations WHERE slug=?', [req.params.slug])
    if (!invitationResult.rowCount || !bool(invitationResult.rows[0].feature_website ?? 1) || !publicationActive(invitationResult.rows[0])) return res.status(404).json({ message: 'Undangan tidak ditemukan.' })
    const invitationId = invitationResult.rows[0].id
    const guestToken = String(req.body?.guestToken || '')
    const attendance = req.body?.attendance === 'Tidak hadir' ? 'Tidak hadir' : 'Hadir'
    const requestedPax = pax(req.body?.pax)
    const message = String(req.body?.message || '').trim().slice(0, 2000)
    const submittedName = String(req.body?.guestName || '').trim().slice(0, 160)

    let guest = null
    if (guestToken) {
      const guestResult = await pool.query('SELECT id,name,invited_pax FROM guests WHERE invitation_id=? AND token=?', [invitationId, guestToken])
      guest = guestResult.rows[0] || null
    }
    const guestName = guest?.name || submittedName || 'Tamu Undangan'
    const effectivePax = guest ? Math.min(requestedPax, pax(guest.invited_pax)) : requestedPax

    let rsvpId
    if (guest) {
      const existing = await pool.query('SELECT id FROM rsvps WHERE invitation_id=? AND guest_id=? LIMIT 1', [invitationId, guest.id])
      if (existing.rowCount) {
        rsvpId = existing.rows[0].id
        await pool.query(`UPDATE rsvps SET guest_name=?,attendance=?,pax=?,message=?,updated_at=CURRENT_TIMESTAMP(3) WHERE id=?`, [guestName, attendance, effectivePax, message, rsvpId])
      } else {
        rsvpId = randomUUID()
        await pool.query(`INSERT INTO rsvps(id,invitation_id,guest_id,guest_name,attendance,pax,message) VALUES(?,?,?,?,?,?,?)`, [rsvpId, invitationId, guest.id, guestName, attendance, effectivePax, message])
      }
      await pool.query('UPDATE guests SET status=? WHERE invitation_id=? AND id=?', [attendance, invitationId, guest.id])
    } else {
      rsvpId = randomUUID()
      await pool.query(`INSERT INTO rsvps(id,invitation_id,guest_id,guest_name,attendance,pax,message) VALUES(?,?,NULL,?,?,?,?)`, [rsvpId, invitationId, guestName, attendance, effectivePax, message])
    }

    const result = await pool.query('SELECT * FROM rsvps WHERE id=?', [rsvpId])
    const rsvp = result.rows[0]
    broadcast('rsvp_changed', { invitationId, guestId: guest?.id || null, rsvpId: rsvp.id })
    res.status(201).json({ id: rsvp.id, guestId: rsvp.guest_id || undefined, guestName: rsvp.guest_name, attendance: rsvp.attendance, pax: Number(rsvp.pax), message: rsvp.message, createdAt: new Date(rsvp.created_at).toISOString() })
  } catch (error) { next(error) }
})

publicRouter.get('/public/review/:token', async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM invitations WHERE review_token=? LIMIT 1', [String(req.params.token || '')])
    const invitation = result.rows[0]
    if (!invitation) return res.status(404).json({ message: 'Link review tidak ditemukan.' })
    const [gallery, notes] = await Promise.all([
      pool.query('SELECT id,url,caption,edit_json FROM gallery_items WHERE invitation_id=? ORDER BY position,id', [invitation.id]),
      pool.query('SELECT * FROM client_review_notes WHERE invitation_id=? ORDER BY created_at ASC', [invitation.id]),
    ])
    res.json({
      clientName: invitation.client_name || `${invitation.bride_name} & ${invitation.groom_name}`,
      event: mapEvent(invitation, gallery.rows),
      reviewStatus: invitation.review_status || 'not_sent',
      projectStatus: invitation.project_status || 'draft',
      previewUrl: `/invite/${encodeURIComponent(invitation.slug)}?preview=${encodeURIComponent(invitation.preview_token)}&to=${encodeURIComponent('Client Review')}`,
      notes: notes.rows.map(mapReviewNote),
    })
  } catch (error) { next(error) }
})

publicRouter.post('/public/review/:token/decision', async (req, res, next) => {
  try {
    const result = await pool.query('SELECT id FROM invitations WHERE review_token=? LIMIT 1', [String(req.params.token || '')])
    if (!result.rowCount) return res.status(404).json({ message: 'Link review tidak ditemukan.' })
    const invitationId = result.rows[0].id
    const action = req.body?.action === 'approve' ? 'approve' : 'revision'
    const message = String(req.body?.message || '').trim().slice(0,4000)
    const sectionKey = String(req.body?.sectionKey || 'general').trim().slice(0,80) || 'general'
    if (action === 'revision' && !message) return res.status(400).json({ message: 'Tuliskan revisi yang diminta.' })
    const kind = action === 'approve' ? 'approval' : 'revision'
    const noteMessage = message || 'Desain dan isi undangan disetujui oleh klien.'
    const noteId = randomUUID()
    await pool.query('INSERT INTO client_review_notes(id,invitation_id,author,kind,section_key,message) VALUES(?,?,?,?,?,?)', [noteId, invitationId, 'client', kind, sectionKey, noteMessage])
    if (action === 'approve') await pool.query(`UPDATE invitations SET review_status='approved',project_status='approved',updated_at=CURRENT_TIMESTAMP(3) WHERE id=?`, [invitationId])
    else await pool.query(`UPDATE invitations SET review_status='revision_requested',project_status='revision',updated_at=CURRENT_TIMESTAMP(3) WHERE id=?`, [invitationId])
    broadcast('review_changed', { invitationId, action, noteId })
    res.json({ ok: true, reviewStatus: action === 'approve' ? 'approved' : 'revision_requested' })
  } catch (error) { next(error) }
})

publicRouter.get('/public/frame/:slug', async (req, res, next) => {
  try {
    const invitation = await invitationBySlug(req.params.slug)
    if (!invitation || !bool(invitation.feature_frame)) return res.status(404).json({ message: 'Wedding Frame untuk klien ini tidak aktif.' })
    res.json({
      clientName: invitation.client_name,
      brideName: invitation.bride_name,
      groomName: invitation.groom_name,
      eventDate: invitation.event_date,
      heroImage: invitation.hero_image,
      framePreset: ['heritage','botanical','editorial'].includes(invitation.frame_preset) ? invitation.frame_preset : 'heritage',
      frameNames: invitation.frame_names || `${invitation.bride_name} & ${invitation.groom_name}`,
      frameDateLabel: invitation.frame_date_label || '',
      frameOverlay: Math.max(0, Math.min(70, Number(invitation.frame_overlay ?? 22))),
    })
  } catch (error) { next(error) }
})

publicRouter.post('/public/guestbook/:slug/auth', async (req, res, next) => {
  try {
    const invitation = await invitationBySlug(req.params.slug)
    if (!invitation || !bool(invitation.feature_guestbook)) return res.status(404).json({ message: 'Digital Guestbook untuk klien ini tidak aktif.' })
    if (!validPin(invitation, req.body?.pin)) return res.status(401).json({ message: 'PIN guestbook salah.' })
    const [guestCount, checkinCount, paxCount] = await Promise.all([
      pool.query('SELECT COUNT(*) AS total FROM guests WHERE invitation_id=?', [invitation.id]),
      pool.query('SELECT COUNT(*) AS total FROM guest_checkins WHERE invitation_id=?', [invitation.id]),
      pool.query('SELECT COALESCE(SUM(pax),0) AS total FROM guest_checkins WHERE invitation_id=?', [invitation.id]),
    ])
    res.json({ ok: true, clientName: invitation.client_name, brideName: invitation.bride_name, groomName: invitation.groom_name, guestCount: Number(guestCount.rows[0]?.total || 0), checkinCount: Number(checkinCount.rows[0]?.total || 0), checkedInPax: Number(paxCount.rows[0]?.total || 0) })
  } catch (error) { next(error) }
})

publicRouter.post('/public/guestbook/:slug/search', async (req, res, next) => {
  try {
    const invitation = await invitationBySlug(req.params.slug)
    if (!invitation || !bool(invitation.feature_guestbook)) return res.status(404).json({ message: 'Digital Guestbook tidak aktif.' })
    if (!validPin(invitation, req.body?.pin)) return res.status(401).json({ message: 'PIN guestbook salah.' })
    const q = String(req.body?.query || '').trim().slice(0, 120)
    const token = String(req.body?.guestToken || '').trim().slice(0, 191)
    let result
    if (token) {
      result = await pool.query(`SELECT g.id,g.name,g.phone,g.guest_group,g.token,g.invited_pax,c.pax AS checked_pax,c.checked_in_at
        FROM guests g LEFT JOIN guest_checkins c ON c.guest_id=g.id AND c.invitation_id=g.invitation_id
        WHERE g.invitation_id=? AND g.token=? LIMIT 1`, [invitation.id, token])
    } else {
      const like = `%${q}%`
      result = await pool.query(`SELECT g.id,g.name,g.phone,g.guest_group,g.token,g.invited_pax,c.pax AS checked_pax,c.checked_in_at
        FROM guests g LEFT JOIN guest_checkins c ON c.guest_id=g.id AND c.invitation_id=g.invitation_id
        WHERE g.invitation_id=? AND (?='' OR g.name LIKE ? OR g.guest_group LIKE ? OR g.phone LIKE ? OR g.token LIKE ?)
        ORDER BY c.checked_in_at IS NULL DESC,g.name ASC LIMIT 30`, [invitation.id, q, like, like, like, like])
    }
    res.json({ guests: result.rows.map(row => ({ id: row.id, name: row.name, phone: row.phone, group: row.guest_group, token: row.token, invitedPax: pax(row.invited_pax), checkedIn: Boolean(row.checked_in_at), checkedPax: row.checked_pax ? Number(row.checked_pax) : 0, checkedInAt: row.checked_in_at ? new Date(row.checked_in_at).toISOString() : null })) })
  } catch (error) { next(error) }
})

publicRouter.post('/public/guestbook/:slug/check-in', async (req, res, next) => {
  try {
    const invitation = await invitationBySlug(req.params.slug)
    if (!invitation || !bool(invitation.feature_guestbook)) return res.status(404).json({ message: 'Digital Guestbook tidak aktif.' })
    if (!validPin(invitation, req.body?.pin)) return res.status(401).json({ message: 'PIN guestbook salah.' })
    const guestId = String(req.body?.guestId || '')
    const guestToken = String(req.body?.guestToken || '')
    const guestResult = guestId
      ? await pool.query('SELECT id,name,invited_pax FROM guests WHERE invitation_id=? AND id=? LIMIT 1', [invitation.id, guestId])
      : await pool.query('SELECT id,name,invited_pax FROM guests WHERE invitation_id=? AND token=? LIMIT 1', [invitation.id, guestToken])
    if (!guestResult.rowCount) return res.status(404).json({ message: 'Tamu tidak ditemukan.' })
    const guest = guestResult.rows[0]
    const effectivePax = Math.min(pax(req.body?.pax), pax(guest.invited_pax))
    const existing = await pool.query('SELECT id FROM guest_checkins WHERE invitation_id=? AND guest_id=? LIMIT 1', [invitation.id, guest.id])
    let id = existing.rows[0]?.id
    if (id) await pool.query('UPDATE guest_checkins SET pax=?,source=?,checked_in_at=CURRENT_TIMESTAMP(3),updated_at=CURRENT_TIMESTAMP(3) WHERE id=?', [effectivePax, 'qr', id])
    else {
      id = randomUUID()
      await pool.query('INSERT INTO guest_checkins(id,invitation_id,guest_id,pax,source) VALUES(?,?,?,?,?)', [id, invitation.id, guest.id, effectivePax, 'qr'])
    }
    broadcast('checkin_changed', { invitationId: invitation.id, guestId: guest.id, checkinId: id })
    res.json({ ok: true, id, guestName: guest.name, pax: effectivePax, checkedInAt: new Date().toISOString() })
  } catch (error) { next(error) }
})
