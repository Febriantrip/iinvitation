import { Copy, ExternalLink, Frame, Globe2, KeyRound, QrCode, ToggleLeft, ToggleRight } from 'lucide-react'
import type { EventData } from '../../types'

interface Props {
  event: EventData
  onChange: (event: EventData) => void
  onOpenGuestbook: () => void
  onOpenFrame: () => void
}

function Toggle({ enabled, onClick }: { enabled: boolean; onClick: () => void }) {
  return <button className={`feature-toggle ${enabled ? 'on' : ''}`} onClick={onClick} type="button" aria-pressed={enabled}>
    {enabled ? <ToggleRight size={26}/> : <ToggleLeft size={26}/>}<span>{enabled ? 'Aktif' : 'Nonaktif'}</span>
  </button>
}

export function ClientFeatures({ event, onChange, onOpenGuestbook, onOpenFrame }: Props) {
  const base = window.location.origin
  const invitation = `${base}/invite/${event.slug}`
  const invitationPreview = `${invitation}?preview=${encodeURIComponent(event.previewToken)}&to=${encodeURIComponent('Preview')}`
  const guestbook = `${base}/checkin/${event.slug}`
  const frame = `${base}/frame/${event.slug}`
  const copy = (value: string) => navigator.clipboard.writeText(value)
  const regeneratePin = () => onChange({ ...event, guestbookPin: String(Math.floor(Math.random() * 1_000_000)).padStart(6, '0') })

  return <section>
    <div className="page-heading"><div><span className="eyebrow">Client Modules</span><h1>Fitur Klien</h1><p>Tentukan layanan yang aktif untuk klien ini. Setiap klien dapat memiliki kombinasi Wedding Website, Digital Guestbook, dan Wedding Frame yang berbeda.</p></div></div>

    <div className="feature-admin-grid">
      <article className="panel feature-admin-card">
        <div className="feature-admin-icon"><Globe2 size={23}/></div>
        <div className="feature-admin-head"><div><span className="eyebrow">01 / WEBSITE</span><h3>Wedding Website</h3></div><Toggle enabled={event.featureWebsite} onClick={() => onChange({ ...event, featureWebsite: !event.featureWebsite })}/></div>
        <p>Halaman undangan personal, RSVP, galeri, musik, dan link per tamu.</p>
        <div className="feature-access"><code>{invitation}</code><button onClick={() => copy(invitation)}><Copy size={15}/></button><button disabled={!event.featureWebsite} title={event.publicationStatus === 'published' ? 'Buka website publik' : 'Buka preview draft'} onClick={() => window.open(event.publicationStatus === 'published' ? invitation : invitationPreview, '_blank')}><ExternalLink size={15}/></button></div>
      </article>

      <article className="panel feature-admin-card">
        <div className="feature-admin-icon"><QrCode size={23}/></div>
        <div className="feature-admin-head"><div><span className="eyebrow">02 / GUESTBOOK</span><h3>Digital Guestbook</h3></div><Toggle enabled={event.featureGuestbook} onClick={() => onChange({ ...event, featureGuestbook: !event.featureGuestbook })}/></div>
        <p>Check-in tamu real dari data tamu klien, mendukung pencarian, QR, pax, dan pencatatan waktu.</p>
        <div className="guestbook-pin-box"><span><KeyRound size={15}/> PIN operator</span><strong>{event.guestbookPin || '------'}</strong><button onClick={regeneratePin}>Buat PIN baru</button></div>
        <div className="feature-access"><code>{guestbook}</code><button onClick={() => copy(guestbook)}><Copy size={15}/></button><button onClick={onOpenGuestbook} title={event.featureGuestbook ? 'Buka Mode Operator' : 'Aktifkan dan buka Mode Operator'}><ExternalLink size={15}/></button></div>
      </article>

      <article className="panel feature-admin-card">
        <div className="feature-admin-icon"><Frame size={23}/></div>
        <div className="feature-admin-head"><div><span className="eyebrow">03 / FRAME</span><h3>Wedding Frame</h3></div><Toggle enabled={event.featureFrame} onClick={() => onChange({ ...event, featureFrame: !event.featureFrame })}/></div>
        <p>Frame publik khusus klien untuk upload foto, atur posisi, dan download PNG siap story.</p>
        <div className="feature-access"><code>{frame}</code><button onClick={() => copy(frame)}><Copy size={15}/></button><button onClick={onOpenFrame} title={event.featureFrame ? 'Buka Wedding Frame' : 'Aktifkan dan buka Wedding Frame'}><ExternalLink size={15}/></button></div>
      </article>
    </div>
  </section>
}
