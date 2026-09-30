import type { FormEvent } from 'react'
import { CalendarDays, Heart, LoaderCircle, MapPin, Send } from 'lucide-react'
import type { EventData, ImageEdit } from '../../../types'
import { imageStyle } from '../../../lib/imageEdit'
import { useEffect, useState } from 'react'

export interface InvitationTemplateProps {
  event: EventData
  guestName: string
  opened: boolean
  onOpen: () => void
  formattedDate: string
  attendance: 'Hadir' | 'Tidak hadir'
  onAttendanceChange: (value: 'Hadir' | 'Tidak hadir') => void
  pax: number
  maxPax: number
  onPaxChange: (value: number) => void
  message: string
  onMessageChange: (value: string) => void
  sent: boolean
  sending: boolean
  sendError: string
  onSubmit: (event: FormEvent) => void
  /** Optional media controls used by immersive layouts. */
  playing?: boolean
  hasMusic?: boolean
  onToggleMusic?: () => void | Promise<void>
}

export function Countdown({ date, compact = false }: { date: string; compact?: boolean }) {
  const calc = () => {
    const diff = Math.max(0, new Date(date).getTime() - Date.now())
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff / 3600000) % 24),
      minutes: Math.floor((diff / 60000) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    }
  }
  const [left, setLeft] = useState(calc)
  useEffect(() => { const id = setInterval(() => setLeft(calc()), 1000); return () => clearInterval(id) }, [date])
  const labels: Record<keyof typeof left, string> = { days: 'Hari', hours: 'Jam', minutes: 'Menit', seconds: 'Detik' }
  return <div className={`countdown ${compact ? 'countdown-compact' : ''}`}>
    {Object.entries(left).map(([key, value]) => <div key={key}><strong>{String(value).padStart(2, '0')}</strong><span>{labels[key as keyof typeof left]}</span></div>)}
  </div>
}

export function EditedImage({ url, alt, edit, className = '' }: { url: string; alt: string; edit?: Partial<ImageEdit>; className?: string }) {
  if (!url) return <div className={`public-edited-image public-image-empty ${className}`} role="img" aria-label={alt}><span>Foto belum ditambahkan</span></div>
  return <div className={`public-edited-image ${className}`}><img src={url} alt={alt} style={imageStyle(edit)}/></div>
}

export function RsvpPanel({ guestName, attendance, onAttendanceChange, pax, maxPax, onPaxChange, message, onMessageChange, sent, sending, sendError, onSubmit, variant = '' }: InvitationTemplateProps & { variant?: string }) {
  if (sent) return <div className={`rsvp-success ${variant}`}><Heart size={28}/><strong>Terima kasih, {guestName}.</strong><span>Konfirmasi dan doa Anda sudah tersimpan.</span></div>
  return <form className={`rsvp-form ${variant}`} onSubmit={onSubmit}>
    <label>Nama<input value={guestName} readOnly /></label>
    <div className="form-grid two">
      <label>Kehadiran<select value={attendance} onChange={event => onAttendanceChange(event.target.value as 'Hadir' | 'Tidak hadir')}><option>Hadir</option><option>Tidak hadir</option></select></label>
      <label>Jumlah tamu<input type="number" min="1" max={maxPax} value={pax} onChange={event => onPaxChange(Number(event.target.value))}/></label>
    </div>
    <label>Ucapan & doa<textarea rows={4} value={message} onChange={event => onMessageChange(event.target.value)} placeholder="Tuliskan doa terbaik..."/></label>
    {sendError && <div className="login-error">{sendError}</div>}
    <button className="rsvp-submit" disabled={sending}>{sending ? <LoaderCircle size={16} className="spin"/> : <Send size={16}/>} {sending ? 'Mengirim...' : 'Kirim Konfirmasi'}</button>
  </form>
}

export function EventInfo({ event, formattedDate, title, time, icon = 'heart', className = '' }: { event: EventData; formattedDate: string; title: string; time: string; icon?: 'heart' | 'calendar'; className?: string }) {
  return <article className={`template-event-card ${className}`}>
    <span className="event-icon">{icon === 'heart' ? <Heart size={19}/> : <CalendarDays size={19}/>}</span>
    <h3>{title}</h3><strong>{formattedDate}</strong><p>{time}</p>
    <div className="venue"><MapPin size={16}/><div><b>{event.venueName}</b><span>{event.venueAddress}</span></div></div>
    <a href={event.mapUrl} target="_blank" rel="noreferrer">Buka Google Maps</a>
  </article>
}

export function GuestRecipient({ guestName, compact = false }: { guestName: string; compact?: boolean }) {
  return <div className={`template-recipient ${compact ? 'compact' : ''}`}><span>Kepada Yth.</span><strong>{guestName}</strong>{!compact && <small>Mohon maaf apabila ada kesalahan penulisan nama/gelar.</small>}</div>
}
