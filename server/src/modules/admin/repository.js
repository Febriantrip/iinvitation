import { randomUUID } from 'node:crypto'
import { pool, withTransaction } from '../../db/pool.js'

const defaultImageEdit = { positionX: 50, positionY: 50, zoom: 1, rotate: 0, brightness: 100, contrast: 100, saturation: 100, grayscale: 0, sepia: 0, blur: 0, flipX: false, flipY: false, aspect: 'cover' }
const defaultGalleryEdit = { ...defaultImageEdit, aspect: 'square' }
const defaultTemplateSettings = {
  displayFont: 'theme', bodyFont: 'theme', scriptFont: 'theme', titleScale: 1, recipientScale: 1, dateScale: 1,
  sectionTitleScale: 1, letterSpacing: 0, coverTitleX: 0, coverTitleY: 0, recipientX: 0, recipientY: 0,
  dateX: 0, dateY: 0, sectionTitleX: 0, sectionTitleY: 0, textAlign: 'theme',
}
const PROJECT_STATUSES = new Set(['draft','awaiting_data','design','client_review','revision','approved','published','completed'])
const PUBLICATION_STATUSES = new Set(['draft','published','expired'])
const REVIEW_STATUSES = new Set(['not_sent','pending','revision_requested','approved'])
const token = () => randomUUID().replaceAll('-', '')

export const defaultWhatsappTemplate = `Kepada Yth.\n{guest_name}\n\nAssalamualaikum Warahmatullahi Wabarakaatuh\n\nDengan memohon rahmat dan ridho Allah SWT, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara pernikahan kami :\n\n🧕🏻 {bride_full_name}\n\ndengan\n\n🤵🏻 {groom_full_name}\n\nUntuk informasi detail mengenai acara, silakan kunjungi link di bawah ini :\n{invitation_link}\n\nMerupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan untuk hadir dan memberikan doa restu.\nAtas kehadiran dan doa restunya kami ucapkan terima kasih.\n\nWassalamualaikum Warahmatullahi Wabarakaatuh\n\nHormat kami,\n{couple_name}`

function parseJson(value, fallback) {
  if (!value) return { ...fallback }
  try { return { ...fallback, ...JSON.parse(value) } } catch { return { ...fallback } }
}

function parseSectionSettings(value) {
  if (!value) return []
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed.filter(item => item && typeof item.key === 'string').map((item, index) => ({
      key: String(item.key), enabled: item.enabled !== false, order: Number.isFinite(Number(item.order)) ? Number(item.order) : index, customTitle: String(item.customTitle || ''),
    })) : []
  } catch { return [] }
}

const bool = value => Boolean(Number(value))
const num = (value, fallback = 0) => Number.isFinite(Number(value)) ? Number(value) : fallback

const mapEvent = row => ({
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
  gallery: [],
  featureWebsite: bool(row.feature_website ?? 1),
  featureGuestbook: bool(row.feature_guestbook),
  featureFrame: bool(row.feature_frame),
  guestbookPin: String(row.guestbook_pin || ''),
  framePreset: ['heritage','botanical','editorial'].includes(row.frame_preset) ? row.frame_preset : 'heritage',
  frameNames: String(row.frame_names || `${row.bride_name} & ${row.groom_name}`),
  frameDateLabel: String(row.frame_date_label || ''),
  frameOverlay: Math.max(0, Math.min(70, num(row.frame_overlay, 22))),
  templateSettings: parseJson(row.template_settings_json, defaultTemplateSettings),
  sectionSettings: parseSectionSettings(row.section_settings_json),
  projectStatus: PROJECT_STATUSES.has(row.project_status) ? row.project_status : 'draft',
  publicationStatus: PUBLICATION_STATUSES.has(row.publication_status) ? row.publication_status : 'draft',
  reviewStatus: REVIEW_STATUSES.has(row.review_status) ? row.review_status : 'not_sent',
  reviewToken: String(row.review_token || ''),
  previewToken: String(row.preview_token || ''),
  publishedAt: row.published_at ? new Date(row.published_at).toISOString() : null,
  expiresAt: row.expires_at ? new Date(row.expires_at).toISOString() : null,
})

const mapGuest = row => ({
  id: row.id,
  name: row.name,
  phone: row.phone,
  group: row.guest_group,
  token: row.token,
  status: row.status,
  invitedPax: Math.max(1, Math.min(20, num(row.invited_pax, 1))),
  createdAt: new Date(row.created_at).toISOString(),
})

const mapRsvp = row => ({
  id: row.id,
  guestId: row.guest_id || undefined,
  guestName: row.guest_name,
  attendance: row.attendance,
  pax: Number(row.pax),
  message: row.message,
  createdAt: new Date(row.created_at).toISOString(),
})

const mapCheckin = row => ({
  id: row.id,
  guestId: row.guest_id,
  guestName: row.guest_name,
  guestGroup: row.guest_group,
  invitedPax: Math.max(1, Math.min(20, num(row.invited_pax, 1))),
  pax: Math.max(1, Math.min(20, num(row.pax, 1))),
  checkedInAt: new Date(row.checked_in_at).toISOString(),
  source: ['operator','qr','manual'].includes(row.source) ? row.source : 'operator',
})

const mapSummary = row => ({
  id: row.id,
  clientName: row.client_name || `${row.bride_name} & ${row.groom_name}`,
  slug: row.slug,
  brideName: row.bride_name,
  groomName: row.groom_name,
  themeId: row.theme_id || 'botanical-serenity',
  eventDate: row.event_date,
  heroImage: row.hero_image,
  guestCount: Number(row.guest_count || 0),
  rsvpCount: Number(row.rsvp_count || 0),
  checkinCount: Number(row.checkin_count || 0),
  featureWebsite: bool(row.feature_website ?? 1),
  featureGuestbook: bool(row.feature_guestbook),
  featureFrame: bool(row.feature_frame),
  projectStatus: PROJECT_STATUSES.has(row.project_status) ? row.project_status : 'draft',
  publicationStatus: PUBLICATION_STATUSES.has(row.publication_status) ? row.publication_status : 'draft',
  reviewStatus: REVIEW_STATUSES.has(row.review_status) ? row.review_status : 'not_sent',
  reviewToken: String(row.review_token || ''),
  previewToken: String(row.preview_token || ''),
  updatedAt: new Date(row.updated_at).toISOString(),
})

const mapReviewNote = row => ({
  id: row.id,
  author: row.author === 'client' ? 'client' : 'admin',
  kind: ['comment','revision','approval','system'].includes(row.kind) ? row.kind : 'comment',
  sectionKey: row.section_key || 'general',
  message: row.message || '',
  createdAt: new Date(row.created_at).toISOString(),
})

export async function listInvitations(client = pool) {
  const result = await client.query(`SELECT i.*,
    (SELECT COUNT(*) FROM guests g WHERE g.invitation_id=i.id) AS guest_count,
    (SELECT COUNT(*) FROM rsvps r WHERE r.invitation_id=i.id) AS rsvp_count,
    (SELECT COUNT(*) FROM guest_checkins c WHERE c.invitation_id=i.id) AS checkin_count
    FROM invitations i ORDER BY i.updated_at DESC, i.created_at DESC`)
  return result.rows.map(mapSummary)
}

export async function getInvitationById(invitationId, client = pool) {
  let result
  if (invitationId) result = await client.query('SELECT * FROM invitations WHERE id=? LIMIT 1', [invitationId])
  else result = await client.query('SELECT * FROM invitations ORDER BY updated_at DESC, created_at ASC LIMIT 1')
  if (!result.rowCount) throw Object.assign(new Error('Invitation not found'), { status: 404 })
  return result.rows[0]
}

export async function getAdminState(invitationId, client = pool) {
  const invitation = await getInvitationById(invitationId, client)
  const [gallery, guests, rsvps, checkins, invitations, reviewNotes] = await Promise.all([
    client.query('SELECT id,url,caption,edit_json FROM gallery_items WHERE invitation_id=? ORDER BY position,id', [invitation.id]),
    client.query('SELECT * FROM guests WHERE invitation_id=? ORDER BY created_at DESC', [invitation.id]),
    client.query('SELECT * FROM rsvps WHERE invitation_id=? ORDER BY created_at ASC', [invitation.id]),
    client.query(`SELECT c.*,g.name AS guest_name,g.guest_group,g.invited_pax
      FROM guest_checkins c JOIN guests g ON g.id=c.guest_id
      WHERE c.invitation_id=? ORDER BY c.checked_in_at DESC`, [invitation.id]),
    listInvitations(client),
    client.query('SELECT * FROM client_review_notes WHERE invitation_id=? ORDER BY created_at ASC', [invitation.id]),
  ])
  const event = mapEvent(invitation)
  event.gallery = gallery.rows.map(row => ({ id: row.id, url: row.url, caption: row.caption, edit: parseJson(row.edit_json, defaultGalleryEdit) }))
  return {
    event,
    guests: guests.rows.map(mapGuest),
    rsvps: rsvps.rows.map(mapRsvp),
    checkins: checkins.rows.map(mapCheckin),
    whatsappTemplate: invitation.whatsapp_template,
    invitations,
    reviewNotes: reviewNotes.rows.map(mapReviewNote),
  }
}

const text = value => String(value ?? '').trim()
const boundedPax = value => Math.max(1, Math.min(20, Number(value || 1)))
const boundedOverlay = value => Math.max(0, Math.min(70, Number(value ?? 22)))

export async function saveAdminState(state, invitationId) {
  return withTransaction(async client => {
    const current = await getInvitationById(invitationId || state?.event?.id, client)
    const event = state.event || {}
    await client.query(`UPDATE invitations SET
      slug=?,client_name=?,theme_id=?,groom_name=?,groom_full_name=?,bride_name=?,bride_full_name=?,groom_parents=?,bride_parents=?,event_date=?,
      akad_time=?,reception_time=?,venue_name=?,venue_address=?,map_url=?,opening_text=?,story_text=?,closing_text=?,
      hero_image=?,hero_edit_json=?,music_url=?,feature_website=?,feature_guestbook=?,feature_frame=?,guestbook_pin=?,frame_preset=?,frame_names=?,frame_date_label=?,frame_overlay=?,template_settings_json=?,section_settings_json=?,whatsapp_template=?,updated_at=CURRENT_TIMESTAMP(3)
      WHERE id=?`, [
      text(event.slug) || current.slug,
      text(event.clientName) || `${text(event.brideName)} & ${text(event.groomName)}`,
      text(event.themeId) || 'botanical-serenity',
      text(event.groomName), text(event.groomFullName), text(event.brideName), text(event.brideFullName),
      text(event.groomParents), text(event.brideParents), text(event.eventDate), text(event.akadTime), text(event.receptionTime), text(event.venueName),
      text(event.venueAddress), text(event.mapUrl), text(event.openingText), text(event.storyText), text(event.closingText), text(event.heroImage),
      JSON.stringify(event.heroEdit || defaultImageEdit), text(event.musicUrl), event.featureWebsite === false ? 0 : 1, event.featureGuestbook ? 1 : 0,
      event.featureFrame ? 1 : 0, text(event.guestbookPin).slice(0,12), ['heritage','botanical','editorial'].includes(event.framePreset) ? event.framePreset : 'heritage',
      text(event.frameNames).slice(0,255), text(event.frameDateLabel).slice(0,120), boundedOverlay(event.frameOverlay), JSON.stringify(event.templateSettings || defaultTemplateSettings), JSON.stringify(Array.isArray(event.sectionSettings) ? event.sectionSettings : []), String(state.whatsappTemplate ?? current.whatsapp_template), current.id,
    ])

    await client.query('DELETE FROM gallery_items WHERE invitation_id=?', [current.id])
    const gallery = Array.isArray(event.gallery) ? event.gallery : []
    for (let i = 0; i < gallery.length; i++) {
      const item = gallery[i]
      if (!item?.url) continue
      await client.query('INSERT INTO gallery_items(id,invitation_id,url,caption,edit_json,position) VALUES(?,?,?,?,?,?)', [
        item.id || randomUUID(), current.id, text(item.url), text(item.caption), JSON.stringify(item.edit || defaultGalleryEdit), i,
      ])
    }

    const guests = Array.isArray(state.guests) ? state.guests : []
    const ids = []
    for (const guest of guests) {
      if (!guest?.name || !guest?.token) continue
      const id = guest.id || randomUUID()
      ids.push(id)
      const createdAt = guest.createdAt ? new Date(guest.createdAt) : new Date()
      const updated = await client.query(`UPDATE guests SET name=?,phone=?,guest_group=?,token=?,invited_pax=?
        WHERE id=? AND invitation_id=?`, [text(guest.name), text(guest.phone), text(guest.group) || 'Umum', text(guest.token), boundedPax(guest.invitedPax), id, current.id])
      if (!updated.rowCount) {
        await client.query(`INSERT INTO guests(id,invitation_id,name,phone,guest_group,token,status,invited_pax,created_at)
          VALUES(?,?,?,?,?,?,?,?,?)`, [id, current.id, text(guest.name), text(guest.phone), text(guest.group) || 'Umum', text(guest.token), text(guest.status) || 'Belum dibuka', boundedPax(guest.invitedPax), createdAt])
      }
    }
    if (ids.length) {
      const placeholders = ids.map(() => '?').join(',')
      await client.query(`DELETE FROM guests WHERE invitation_id=? AND id NOT IN (${placeholders})`, [current.id, ...ids])
    } else await client.query('DELETE FROM guests WHERE invitation_id=?', [current.id])

    return getAdminState(current.id, client)
  })
}

function slugify(value) {
  return String(value || '').toLowerCase().normalize('NFKD').replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').replace(/-+/g, '-').slice(0, 150)
}

function pinFromId(id) {
  let hash = 0
  for (const ch of id) hash = ((hash * 31) + ch.charCodeAt(0)) >>> 0
  return String(hash % 1_000_000).padStart(6, '0')
}

export async function createInvitation(input) {
  const id = randomUUID()
  const brideName = text(input?.brideName) || 'Mempelai Wanita'
  const groomName = text(input?.groomName) || 'Mempelai Pria'
  const clientName = text(input?.clientName) || `${brideName} & ${groomName}`
  let slug = slugify(input?.slug || `${brideName}-${groomName}`) || `undangan-${Date.now()}`
  const themeId = text(input?.themeId) || 'botanical-serenity'

  const exists = await pool.query('SELECT id FROM invitations WHERE slug=? LIMIT 1', [slug])
  if (exists.rowCount) slug = `${slug}-${String(Date.now()).slice(-5)}`

  const date = text(input?.eventDate) || '2026-12-12T10:00'
  const dateLabel = new Date(date).toLocaleDateString('id-ID', { day:'2-digit', month:'2-digit', year:'numeric' })
  await pool.query(`INSERT INTO invitations(
    id,slug,client_name,theme_id,groom_name,groom_full_name,bride_name,bride_full_name,groom_parents,bride_parents,event_date,
    akad_time,reception_time,venue_name,venue_address,map_url,opening_text,story_text,closing_text,hero_image,hero_edit_json,music_url,
    feature_website,feature_guestbook,feature_frame,guestbook_pin,frame_preset,frame_names,frame_date_label,frame_overlay,project_status,publication_status,review_status,review_token,preview_token,whatsapp_template
  ) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`, [
    id, slug, clientName, themeId, groomName, groomName, brideName, brideName, 'Putra dari Bapak & Ibu', 'Putri dari Bapak & Ibu', date,
    '08.00 - 10.00 WIB', '11.00 - 14.00 WIB', 'Lokasi Acara', 'Isi alamat lengkap acara.', 'https://maps.google.com',
    'Dengan memohon rahmat dan ridho Allah SWT, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara pernikahan kami.',
    'Tuliskan perjalanan singkat kedua mempelai di bagian ini.',
    'Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.',
    '', JSON.stringify(defaultImageEdit), '', 1, 0, 0, pinFromId(id), 'heritage', `${brideName} & ${groomName}`, dateLabel, 22, 'draft', 'draft', 'not_sent', token(), token(), defaultWhatsappTemplate,
  ])
  return getAdminState(id)
}


export async function updateWorkflow(invitationId, input) {
  const current = await getInvitationById(invitationId)
  const projectStatus = PROJECT_STATUSES.has(input?.projectStatus) ? input.projectStatus : current.project_status
  const publicationStatus = PUBLICATION_STATUSES.has(input?.publicationStatus) ? input.publicationStatus : current.publication_status
  const reviewStatus = REVIEW_STATUSES.has(input?.reviewStatus) ? input.reviewStatus : current.review_status
  const expiresAt = Object.prototype.hasOwnProperty.call(input || {}, 'expiresAt') ? (input?.expiresAt ? new Date(input.expiresAt) : null) : current.expires_at
  const publishedAt = publicationStatus === 'published' ? (current.published_at || new Date()) : current.published_at
  const derivedProjectStatus = publicationStatus === 'published' && projectStatus !== 'completed' ? 'published' : projectStatus
  await pool.query(`UPDATE invitations SET project_status=?,publication_status=?,review_status=?,published_at=?,expires_at=?,updated_at=CURRENT_TIMESTAMP(3) WHERE id=?`, [derivedProjectStatus, publicationStatus, reviewStatus, publishedAt, expiresAt, invitationId])
  return getAdminState(invitationId)
}

export async function sendForClientReview(invitationId) {
  await getInvitationById(invitationId)
  await pool.query(`UPDATE invitations SET project_status='client_review',review_status='pending',updated_at=CURRENT_TIMESTAMP(3) WHERE id=?`, [invitationId])
  await addReviewNote(invitationId, { author:'admin', kind:'system', sectionKey:'general', message:'Preview dikirim untuk review klien.' })
  return getAdminState(invitationId)
}

export async function addReviewNote(invitationId, input) {
  await getInvitationById(invitationId)
  const author = input?.author === 'client' ? 'client' : 'admin'
  const kind = ['comment','revision','approval','system'].includes(input?.kind) ? input.kind : 'comment'
  const sectionKey = text(input?.sectionKey).slice(0,80) || 'general'
  const message = text(input?.message).slice(0,4000)
  if (!message) throw Object.assign(new Error('Catatan tidak boleh kosong.'), { status: 400 })
  const id = randomUUID()
  await pool.query('INSERT INTO client_review_notes(id,invitation_id,author,kind,section_key,message) VALUES(?,?,?,?,?,?)', [id, invitationId, author, kind, sectionKey, message])
  const result = await pool.query('SELECT * FROM client_review_notes WHERE id=?', [id])
  return mapReviewNote(result.rows[0])
}

export async function deleteInvitation(invitationId) {
  const count = await pool.query('SELECT COUNT(*) AS count FROM invitations')
  if (Number(count.rows[0]?.count || 0) <= 1) throw Object.assign(new Error('Minimal harus ada satu undangan.'), { status: 400 })
  const deleted = await pool.query('DELETE FROM invitations WHERE id=?', [invitationId])
  if (!deleted.rowCount) throw Object.assign(new Error('Undangan tidak ditemukan.'), { status: 404 })
  const remaining = await listInvitations()
  return { ok: true, nextInvitationId: remaining[0]?.id || null }
}
