import { FormEvent, useEffect, useRef, useState } from 'react'
import { CalendarDays, ChevronDown, Gift, Heart, LoaderCircle, MapPin, Pause, Play, Send, Volume2 } from 'lucide-react'
import { useParams } from 'react-router-dom'
import { publicApi, type PublicInvitationPayload } from '../../lib/api'
import { getTheme } from '../../lib/themes'
import { imageStyle } from '../../lib/imageEdit'
import { normalizeTemplateSettings, templateEditorRoles, templateStyleVars, type TemplateEditorRole } from '../../lib/templateCustomization'
import { applySectionLayout, isSectionEnabled } from '../../lib/sectionManager'
import { StructuralTemplateRenderer, Countdown, EditedImage, type InvitationTemplateProps } from './templates'

const editorTargetSelectors: Record<TemplateEditorRole, string> = {
  coverTitle: '.cover-content > h1,.aruna-cover-copy > h1,.ivanna-cover-content > h1,.fl-cover-copy > h1,.tpl-editorial-title h1,.tpl-film-copy > h1,.arch-cover-copy > h1,.modern-cover-copy > h1,.museum-plaque h1,.tpl-news-headline h1,.scrap-cover-note h1,.book-page.left h1,.bento-cell.title h1,.ameera-cover-copy h1,.sandhayu-cover-copy h1,.utary-cover-copy h1,.flara-cover-copy h1,.kila-cover-copy h1,.danila-cover-copy h1,.beanca-blank h1,.ariya-cover-copy h1,.alyssa-cover-copy h1,.shakira-names,.endless-cover-copy h1,.sage-cover-copy h1,.paper-cover-card h1,.sweet-copy h1,.ac-cover-copy h1',
  recipient: '.cover-recipient,.aruna-recipient,.ivanna-cover-recipient,.fl-cover-recipient,.template-recipient,.tpl-film-recipient,.kila-guest,.beanca-guest,.ac-recipient,.ameera-cover-copy > div,.sandhayu-cover-copy > div,.utary-cover-copy > div,.flara-cover-copy > div,.danila-cover-copy > div,.ariya-cover-copy > div,.endless-cover-copy > div,.sage-cover-copy > div,.paper-cover-card > div,.sweet-copy > div,.alyssa-cover-copy > strong',
  date: '.cover-date,.aruna-cover-date,.ivanna-cover-date,.fl-cover-date,.tpl-editorial-date,.bento-cell.date,.kila-date-rail,.ameera-cover-copy > small,.sandhayu-cover-copy > small,.utary-cover-copy > small,.flara-cover-copy > small,.danila-cover-copy > small,.beanca-blank > small,.ariya-cover-copy > small,.alyssa-cover-copy > small,.endless-cover-copy > small,.sage-cover-copy > small,.paper-cover-card > small,.sweet-ticket > small,.ac-cover-copy > small',
  sectionTitle: '.section-pad > h2,.ivanna-slide-title h2,.fl-section-title h2,.aruna-title,.tpl-news-section > h2,.modern-section > h2,.bento-section > h2,.museum-room > h2,.book-page h2,.ac-pad > h2,[data-ac-reveal] > h2',
}

function InvitationContent({ payload, slug }: { payload: PublicInvitationPayload; slug: string }) {
  const themeOverride = new URLSearchParams(window.location.search).get('theme') || undefined
  const event = themeOverride ? { ...payload.event, themeId: themeOverride } : payload.event
  const theme = getTheme(event.themeId)
  const { guest, guestName } = payload
  const coverEnabled = isSectionEnabled(event.sectionSettings, 'cover')
  const rootRef = useRef<HTMLElement>(null)
  const editorMode = new URLSearchParams(window.location.search).get('editor') === '1'
  const [templateSettings, setTemplateSettings] = useState(() => normalizeTemplateSettings(event.templateSettings))
  const [editorRole, setEditorRole] = useState<TemplateEditorRole>('coverTitle')
  const templateSettingsRef = useRef(templateSettings)
  const editorRoleRef = useRef(editorRole)
  templateSettingsRef.current = templateSettings
  editorRoleRef.current = editorRole
  const [opened, setOpened] = useState(() => !coverEnabled)
  const [playing, setPlaying] = useState(false)
  const [attendance, setAttendance] = useState<'Hadir' | 'Tidak hadir'>('Hadir')
  const [pax, setPax] = useState(1)
  const maxPax = guest?.invitedPax || 20
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState('')
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    setTemplateSettings(normalizeTemplateSettings(event.templateSettings))
  }, [event.id])

  useEffect(() => {
    if (!editorMode) return
    const receive = (message: MessageEvent) => {
      if (message.origin !== window.location.origin || message.data?.type !== 'iinvitation-template-editor') return
      const next = normalizeTemplateSettings(message.data.settings)
      const nextRole = message.data.role && editorTargetSelectors[message.data.role as TemplateEditorRole] ? message.data.role as TemplateEditorRole : editorRoleRef.current
      templateSettingsRef.current = next
      editorRoleRef.current = nextRole
      setTemplateSettings(next)
      setEditorRole(nextRole)
    }
    window.addEventListener('message', receive)
    return () => window.removeEventListener('message', receive)
  }, [editorMode])

  useEffect(() => {
    if (!editorMode) return
    const markTargets = () => {
      document.querySelectorAll('.template-editor-active-target').forEach(node => node.classList.remove('template-editor-active-target'))
      document.querySelectorAll(editorTargetSelectors[editorRoleRef.current]).forEach(node => node.classList.add('template-editor-active-target'))
    }
    markTargets()
    const observer = new MutationObserver(() => requestAnimationFrame(markTargets))
    observer.observe(document.body, { childList: true, subtree: true })

    let drag: { startX: number; startY: number; baseX: number; baseY: number; role: TemplateEditorRole } | null = null
    let frame = 0
    const down = (pointer: PointerEvent) => {
      const target = pointer.target instanceof Element ? pointer.target.closest(editorTargetSelectors[editorRoleRef.current]) : null
      if (!target) return
      pointer.preventDefault()
      pointer.stopPropagation()
      const activeRole = editorRoleRef.current
      const meta = templateEditorRoles[activeRole]
      const current = templateSettingsRef.current
      window.parent.postMessage({ type: 'iinvitation-template-editor-drag-start', settings: current }, window.location.origin)
      drag = { startX: pointer.clientX, startY: pointer.clientY, baseX: Number(current[meta.x]) || 0, baseY: Number(current[meta.y]) || 0, role: activeRole }
    }
    const move = (pointer: PointerEvent) => {
      if (!drag) return
      pointer.preventDefault()
      if (frame) cancelAnimationFrame(frame)
      const x = Math.round(drag.baseX + pointer.clientX - drag.startX)
      const y = Math.round(drag.baseY + pointer.clientY - drag.startY)
      frame = requestAnimationFrame(() => {
        if (!drag) return
        const meta = templateEditorRoles[drag.role]
        const next = normalizeTemplateSettings({ ...templateSettingsRef.current, [meta.x]: x, [meta.y]: y })
        templateSettingsRef.current = next
        setTemplateSettings(next)
        window.parent.postMessage({ type: 'iinvitation-template-editor-drag', settings: next }, window.location.origin)
      })
    }
    const up = () => { drag = null }
    document.addEventListener('pointerdown', down, true)
    document.addEventListener('pointermove', move, { passive: false })
    document.addEventListener('pointerup', up)
    return () => {
      observer.disconnect()
      if (frame) cancelAnimationFrame(frame)
      document.removeEventListener('pointerdown', down, true)
      document.removeEventListener('pointermove', move)
      document.removeEventListener('pointerup', up)
      document.querySelectorAll('.template-editor-active-target').forEach(node => node.classList.remove('template-editor-active-target'))
    }
  }, [editorMode, editorRole])

  useEffect(() => {
    if (!coverEnabled) publicApi.markOpened(slug, guest?.token || '').catch(() => {})
  }, [coverEnabled, slug, guest?.token])

  useEffect(() => {
    const root = rootRef.current
    const settings = Array.isArray(event.sectionSettings) ? event.sectionSettings : []
    if (!root || !settings.length) return
    const apply = () => applySectionLayout(root, settings)
    const frame = requestAnimationFrame(apply)
    const timer = window.setTimeout(apply, opened ? 180 : 40)
    return () => { cancelAnimationFrame(frame); window.clearTimeout(timer) }
  }, [event.sectionSettings, event.themeId, opened])

  const openInvitation = async () => {
    setOpened(true)
    publicApi.markOpened(slug, guest?.token || '').catch(() => {})
    if (audioRef.current && event.musicUrl) {
      try { await audioRef.current.play(); setPlaying(true) } catch { setPlaying(false) }
    }
    setTimeout(() => (document.querySelector('[data-invite-body]') || document.getElementById('invitation-content'))?.scrollIntoView({ behavior: 'smooth' }), 120)
  }
  const toggleMusic = async () => {
    if (!audioRef.current) return
    if (audioRef.current.paused) { await audioRef.current.play(); setPlaying(true) }
    else { audioRef.current.pause(); setPlaying(false) }
  }
  const submitRsvp = async (e: FormEvent) => {
    e.preventDefault(); setSending(true); setSendError('')
    try {
      await publicApi.submitRsvp(slug, { guestToken: guest?.token || '', guestName, attendance, pax, message: message.trim() })
      setSent(true)
    } catch (error) {
      setSendError(error instanceof Error ? error.message : 'Konfirmasi gagal dikirim.')
    } finally { setSending(false) }
  }
  const formattedDate = new Date(event.eventDate).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  const bridePhoto = event.gallery[0]
  const groomPhoto = event.gallery[1]

  const templateProps: InvitationTemplateProps = {
    event,
    guestName,
    opened,
    onOpen: openInvitation,
    formattedDate,
    attendance,
    onAttendanceChange: setAttendance,
    pax,
    maxPax,
    onPaxChange: setPax,
    message,
    onMessageChange: setMessage,
    sent,
    sending,
    sendError,
    onSubmit: submitRsvp,
    playing,
    hasMusic: Boolean(event.musicUrl),
    onToggleMusic: toggleMusic,
  }

  const structuralLayout = theme.layout && theme.layout !== 'classic-flow'

  return <main ref={rootRef} className={`invitation-page ${theme.className} ${structuralLayout ? 'has-structural-layout' : ''}`} data-theme={theme.id} data-layout={theme.layout || 'classic-flow'} data-template-customized="true" data-template-editor={editorMode ? 'true' : 'false'} data-font-display={templateSettings.displayFont} data-font-body={templateSettings.bodyFont} data-font-script={templateSettings.scriptFont} data-text-align={templateSettings.textAlign} style={templateStyleVars(templateSettings)}>
    {event.musicUrl && <audio ref={audioRef} src={event.musicUrl} loop preload="metadata" />}

    {structuralLayout ? <StructuralTemplateRenderer layout={theme.layout!} props={templateProps}/> : <>
      <section className={`invite-cover ${opened ? 'opened' : ''}`}>
        {event.heroImage ? <div className="cover-media"><img src={event.heroImage} alt={`${event.brideName} & ${event.groomName}`} style={imageStyle(event.heroEdit)}/></div> : <div className="cover-media cover-media-empty"/>}
        <div className="cover-shade" />
        <div className="cover-frame" aria-hidden="true"><i/><i/><i/><i/></div>
        <div className="cover-content"><span className="cover-kicker">The Wedding Of</span><h1>{event.brideName} <i>&</i> {event.groomName}</h1><span className="cover-date">{formattedDate}</span><div className="cover-recipient"><span>Kepada Yth.</span><strong>{guestName}</strong><small>Mohon maaf apabila ada kesalahan penulisan nama/gelar.</small></div><button onClick={openInvitation} className="open-invite-btn"><Heart size={16} fill="currentColor" /> Buka Undangan</button></div><ChevronDown className="cover-chevron" size={24} />
      </section>

      <div id="invitation-content" className={opened ? 'invite-body visible' : 'invite-body'}>
        <section className="intro-section section-pad"><span className="ornament">✦</span><span className="script-kicker">The Wedding of</span><h2>{event.brideName} <i>&</i> {event.groomName}</h2><p>{event.openingText}</p><div className="date-pill"><CalendarDays size={16} />{formattedDate}</div></section>
        <section className="couple-section section-pad">
          <div className="couple-card"><EditedImage className="portrait bride" url={bridePhoto?.url || event.heroImage} edit={bridePhoto?.edit || event.heroEdit} alt={event.brideFullName}/><span>The Bride</span><h3>{event.brideFullName}</h3><p>{event.brideParents}</p></div>
          <div className="couple-and">&</div>
          <div className="couple-card"><EditedImage className="portrait groom" url={groomPhoto?.url || event.heroImage} edit={groomPhoto?.edit || event.heroEdit} alt={event.groomFullName}/><span>The Groom</span><h3>{event.groomFullName}</h3><p>{event.groomParents}</p></div>
        </section>
        <section className="countdown-section section-pad"><span className="script-kicker light">Save The Date</span><h2>Menuju Hari Bahagia</h2><Countdown date={event.eventDate} /></section>
        <section className="event-section section-pad"><span className="eyebrow centered">Wedding Event</span><h2>Rangkaian Acara</h2><div className="event-grid">
          <article><span className="event-icon"><Heart size={20} /></span><h3>Akad Nikah</h3><strong>{formattedDate}</strong><p>{event.akadTime}</p><div className="venue"><MapPin size={16} /><div><b>{event.venueName}</b><span>{event.venueAddress}</span></div></div><a href={event.mapUrl} target="_blank" rel="noreferrer">Buka Google Maps</a></article>
          <article><span className="event-icon"><CalendarDays size={20} /></span><h3>Resepsi</h3><strong>{formattedDate}</strong><p>{event.receptionTime}</p><div className="venue"><MapPin size={16} /><div><b>{event.venueName}</b><span>{event.venueAddress}</span></div></div><a href={event.mapUrl} target="_blank" rel="noreferrer">Buka Google Maps</a></article>
        </div></section>
        <section className="story-section section-pad"><span className="script-kicker">Our Story</span><h2>Satu Cerita, Satu Tujuan</h2><p>{event.storyText}</p></section>
        <section className="gallery-section section-pad"><span className="eyebrow centered">Captured Moments</span><h2>Galeri Kami</h2>{event.gallery.length ? <div className="public-gallery">{event.gallery.map((img, index) => <figure className={`${index === 0 ? 'featured' : ''} aspect-${img.edit?.aspect || 'square'}`} key={img.id}><EditedImage url={img.url} edit={img.edit} alt={img.caption || `Foto ${index + 1}`}/>{img.caption && <figcaption>{img.caption}</figcaption>}</figure>)}</div> : <p className="muted centered-copy">Foto belum ditambahkan.</p>}</section>
        <section className="gift-section section-pad"><span className="gift-icon"><Gift size={23} /></span><span className="script-kicker light">Wedding Gift</span><h2>Doa Restu Anda adalah hadiah terindah</h2><p>Bagian rekening dan kirim kado siap ditambahkan saat data hadiah sudah tersedia.</p></section>
        <section className="rsvp-section section-pad"><span className="eyebrow centered">RSVP & Wishes</span><h2>Konfirmasi Kehadiran</h2>{sent ? <div className="rsvp-success"><Heart size={28} /><strong>Terima kasih, {guestName}.</strong><span>Konfirmasi dan doa Anda sudah tersimpan.</span></div> : <form className="rsvp-form" onSubmit={submitRsvp}><label>Nama<input value={guestName} readOnly /></label><div className="form-grid two"><label>Kehadiran<select value={attendance} onChange={e => setAttendance(e.target.value as 'Hadir' | 'Tidak hadir')}><option>Hadir</option><option>Tidak hadir</option></select></label><label>Jumlah tamu<input type="number" min="1" max={maxPax} value={pax} onChange={e => setPax(Number(e.target.value))} /></label></div><label>Ucapan & doa<textarea rows={4} value={message} onChange={e => setMessage(e.target.value)} placeholder="Tuliskan doa terbaik..." /></label>{sendError && <div className="login-error">{sendError}</div>}<button className="rsvp-submit" disabled={sending}>{sending ? <LoaderCircle size={16} className="spin"/> : <Send size={16} />}{sending ? ' Mengirim...' : ' Kirim Konfirmasi'}</button></form>}</section>
        <section className="closing-section section-pad"><span className="ornament">✦</span><p>{event.closingText}</p><h2>{event.brideName} <i>&</i> {event.groomName}</h2><small>Thank you</small></section>
      </div>
    </>}

    {opened && event.musicUrl && theme.layout !== 'premium-ivanna' && theme.layout !== 'premium-flawless' && theme.layout !== 'heritage-aruna' && <button className="music-fab" onClick={toggleMusic} title={playing ? 'Pause music' : 'Play music'}>{playing ? <Pause size={18} /> : <Play size={18} />}<Volume2 size={13} /></button>}
  </main>
}

export function InvitationPage() {
  const { slug = '' } = useParams()
  const [payload, setPayload] = useState<PublicInvitationPayload | null>(null)
  const [error, setError] = useState('')
  useEffect(() => {
    let cancelled = false
    publicApi.getInvitation(slug, window.location.search)
      .then(data => { if (!cancelled) setPayload(data) })
      .catch(err => { if (!cancelled) setError(err instanceof Error ? err.message : 'Undangan tidak dapat dimuat.') })
    return () => { cancelled = true }
  }, [slug])
  if (error) return <main className="public-state"><Heart size={28}/><h1>Undangan tidak tersedia</h1><p>{error}</p></main>
  if (!payload) return <main className="public-state"><LoaderCircle className="spin" size={28}/><h1>Menyiapkan undangan...</h1></main>
  return <InvitationContent payload={payload} slug={slug} />
}
