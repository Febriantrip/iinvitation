import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Heart, Maximize2, Minimize2, Volume2, VolumeX, QrCode } from 'lucide-react'
import type { GalleryItem } from '../../../../types'
import type { InvitationTemplateProps } from '../shared'
import { EditedImage, RsvpPanel } from '../shared'

export function useCollectionReveal(opened: boolean, selector = '[data-ac-reveal]') {
  useEffect(() => {
    if (!opened) return
    const nodes = Array.from(document.querySelectorAll<HTMLElement>(selector))
    if (!('IntersectionObserver' in window)) { nodes.forEach(n => n.classList.add('is-visible')); return }
    const obs = new IntersectionObserver(entries => entries.forEach(e => e.isIntersecting && e.target.classList.add('is-visible')), { threshold: .14, rootMargin: '0px 0px -8% 0px' })
    nodes.forEach(n => obs.observe(n)); return () => obs.disconnect()
  }, [opened, selector])
}

export function useFullscreen() {
  const [fullscreen, setFullscreen] = useState(Boolean(document.fullscreenElement))
  useEffect(() => { const fn = () => setFullscreen(Boolean(document.fullscreenElement)); document.addEventListener('fullscreenchange', fn); return () => document.removeEventListener('fullscreenchange', fn) }, [])
  const toggle = async () => { try { if (document.fullscreenElement) await document.exitFullscreen(); else await document.documentElement.requestFullscreen() } catch {} }
  return { fullscreen, toggle }
}

export function CollectionControls({ playing=false, hasMusic=false, onToggleMusic }: Pick<InvitationTemplateProps,'playing'|'hasMusic'|'onToggleMusic'>) {
  const { fullscreen, toggle } = useFullscreen()
  return <div className="ac-controls"><button onClick={toggle} aria-label="Fullscreen">{fullscreen ? <Minimize2 size={19}/> : <Maximize2 size={19}/>}</button><button disabled={!hasMusic} onClick={onToggleMusic} aria-label="Music">{playing ? <Volume2 size={19}/> : <VolumeX size={19}/>}</button></div>
}

export function photosFor(props: InvitationTemplateProps, max=12) {
  const { event } = props
  return useMemo(() => {
    const all: GalleryItem[] = [{ id:'hero', url:event.heroImage, caption:'', edit:event.heroEdit }, ...event.gallery]
    const seen = new Set<string>()
    return all.filter(x => x.url && !seen.has(x.url) && seen.add(x.url)).slice(0,max)
  }, [event.heroImage, event.heroEdit, event.gallery, max])
}

export function Cover({ props, className, label, children }: { props: InvitationTemplateProps; className:string; label:string; children?: ReactNode }) {
  const { event, guestName, onOpen } = props
  return <section className={`ac-cover ${className}`}>
    <div className="ac-cover-photo"><EditedImage url={event.heroImage || event.gallery[0]?.url || ''} edit={event.heroEdit} alt={`${event.brideName} & ${event.groomName}`}/></div>
    <div className="ac-cover-overlay"/>{children}
    <div className="ac-cover-copy"><span>{label}</span><h1>{event.brideName} <i>&</i> {event.groomName}</h1><small>{props.formattedDate}</small><div className="ac-recipient"><em>Kepada Yth.</em><strong>{guestName}</strong></div><button onClick={onOpen}><Heart size={14} fill="currentColor"/> BUKA UNDANGAN</button></div>
  </section>
}

export function Photo({ item, fallback, fallbackEdit, alt, className='' }: { item?: GalleryItem; fallback:string; fallbackEdit:any; alt:string; className?:string }) {
  return <EditedImage className={className} url={item?.url || fallback} edit={item?.edit || fallbackEdit} alt={alt}/>
}

export function AccessCard({ props, className='' }: { props: InvitationTemplateProps; className?:string }) {
  const { event, guestName, formattedDate } = props
  return <div className={`ac-access ${className}`} data-ac-reveal><div><span>QR CHECK-IN</span><h3>{event.brideName} & {event.groomName}</h3><p>{event.venueName}</p><small>{formattedDate}</small><strong>{guestName}</strong></div><div className="ac-faux-qr">{Array.from({length:64},(_,i)=><i key={i} className={(i%3===0||i%7===0||[0,1,8,9,54,55,62,63].includes(i))?'on':''}/>)}</div><a href={`/checkin/${event.slug}`} target="_blank" rel="noreferrer"><QrCode size={15}/> Buka Check-in</a></div>
}

export function EventPair({ props, variant='' }: { props: InvitationTemplateProps; variant?:string }) {
  const { event, formattedDate } = props
  return <div className={`ac-event-pair ${variant}`} data-ac-reveal><article><span>01</span><small>AKAD NIKAH</small><h3>{event.akadTime}</h3><p>{formattedDate}</p><b>{event.venueName}</b><a href={event.mapUrl} target="_blank" rel="noreferrer">Maps ↗</a></article><article><span>02</span><small>RESEPSI</small><h3>{event.receptionTime}</h3><p>{formattedDate}</p><b>{event.venueName}</b><a href={event.mapUrl} target="_blank" rel="noreferrer">Maps ↗</a></article></div>
}

export function GalleryStrip({ props, className='' }: { props: InvitationTemplateProps; className?:string }) {
  const photos = photosFor(props,10)
  return <div className={`ac-gallery-strip ${className}`}>{photos.map((p,i)=><figure key={p.id} data-ac-reveal><EditedImage url={p.url} edit={p.edit} alt={p.caption || `Moment ${i+1}`}/><span>{String(i+1).padStart(2,'0')}</span></figure>)}</div>
}

export function RsvpBlock({ props, className='' }: { props: InvitationTemplateProps; className?:string }) { return <div className={`ac-rsvp ${className}`} data-ac-reveal><span>RSVP & WISHES</span><h2>Will you join us?</h2><RsvpPanel {...props} variant="ac-rsvp-form"/></div> }
