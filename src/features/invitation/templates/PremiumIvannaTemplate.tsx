import { useEffect, useMemo, useRef, useState } from 'react'
import {
  CalendarDays, Camera, ChevronLeft, ChevronRight, ExternalLink, Gift, Heart,
  MapPin, Maximize2, Menu, Minimize2, QrCode, Shirt, Sparkles, Video, Volume2, VolumeX, X,
} from 'lucide-react'
import type { GalleryItem } from '../../../types'
import type { InvitationTemplateProps } from './shared'
import '../../../styles.premium-ivanna.css'
import { Countdown, EditedImage, RsvpPanel } from './shared'

function useReveal(opened: boolean, rootRef: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!opened) return
    const root = rootRef.current
    if (!root) return
    const nodes = Array.from(root.querySelectorAll<HTMLElement>('[data-ivanna-reveal]'))
    if (!('IntersectionObserver' in window)) {
      nodes.forEach(node => node.classList.add('is-visible'))
      return
    }
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('is-visible')
        else entry.target.classList.remove('is-visible')
      })
    }, { root, threshold: 0.22, rootMargin: '-6% 0px -8% 0px' })
    nodes.forEach(node => observer.observe(node))
    return () => observer.disconnect()
  }, [opened, rootRef])
}

function Monogram({ bride, groom }: { bride: string; groom: string }) {
  const left = (bride || 'B').trim().charAt(0).toUpperCase()
  const right = (groom || 'G').trim().charAt(0).toUpperCase()
  return <div className="ivanna-monogram" aria-hidden="true"><span>{left}</span><i/><span>{right}</span></div>
}

function FauxQr() {
  return <div className="ivanna-qr" aria-label="QR check-in visual">
    {Array.from({ length: 81 }).map((_, i) => <i key={i} className={(i % 4 === 0 || i % 9 === 1 || [0,1,2,9,11,18,19,20,58,60,72,73,74,79,80].includes(i)) ? 'on' : ''}/>) }
  </div>
}

function SlideTitle({ kicker, title }: { kicker: string; title: string }) {
  return <div className="ivanna-slide-title" data-ivanna-reveal><span>{kicker}</span><h2>{title}</h2></div>
}

function uniquePhotos(hero: string, heroEdit: InvitationTemplateProps['event']['heroEdit'], gallery: GalleryItem[]) {
  const pool = [{ id: 'hero', url: hero, edit: heroEdit, caption: '' }, ...gallery]
  const seen = new Set<string>()
  return pool.filter(item => item.url && !seen.has(item.url) && seen.add(item.url)).slice(0, 8)
}

export function PremiumIvannaTemplate(props: InvitationTemplateProps) {
  const { event, guestName, opened, onOpen, formattedDate, playing = false, hasMusic = false, onToggleMusic } = props
  const hero = event.heroImage || event.gallery[0]?.url || ''
  const deckRef = useRef<HTMLDivElement>(null)
  const pointerStart = useRef<{ x: number; y: number } | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [fullscreen, setFullscreen] = useState(Boolean(document.fullscreenElement))
  const [photoIndex, setPhotoIndex] = useState(0)
  const photos = useMemo(() => uniquePhotos(hero, event.heroEdit, event.gallery), [hero, event.heroEdit, event.gallery])
  const bridePhoto = event.gallery[0]
  const groomPhoto = event.gallery[1] || event.gallery[0]

  useReveal(opened, deckRef)

  useEffect(() => {
    const handler = () => setFullscreen(Boolean(document.fullscreenElement))
    document.addEventListener('fullscreenchange', handler)
    return () => document.removeEventListener('fullscreenchange', handler)
  }, [])

  useEffect(() => {
    if (!opened || photos.length < 2) return
    const timer = window.setInterval(() => setPhotoIndex(index => (index + 1) % photos.length), 6500)
    return () => window.clearInterval(timer)
  }, [opened, photos.length])

  const go = (id: string) => {
    setMenuOpen(false)
    deckRef.current?.querySelector<HTMLElement>(`#${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const changePhoto = (step: number) => {
    if (!photos.length) return
    setPhotoIndex(index => (index + step + photos.length) % photos.length)
  }

  const onPointerDown = (event: React.PointerEvent) => {
    pointerStart.current = { x: event.clientX, y: event.clientY }
  }

  const onPointerUp = (event: React.PointerEvent) => {
    const start = pointerStart.current
    pointerStart.current = null
    if (!start) return
    const dx = event.clientX - start.x
    const dy = event.clientY - start.y
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.15) changePhoto(dx < 0 ? 1 : -1)
  }

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) await document.documentElement.requestFullscreen()
      else await document.exitFullscreen()
    } catch { /* browser may block fullscreen in embedded previews */ }
  }

  const eventDay = new Date(event.eventDate)
  const compactDate = eventDay.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }).toUpperCase()
  const weekDay = eventDay.toLocaleDateString('id-ID', { weekday: 'long' }).toUpperCase()
  const coverPhoto = photos[0]

  return <div className={`ivanna-template ${opened ? 'is-opened' : ''}`}>
    <section className={`ivanna-cover ${opened ? 'is-open' : ''}`}>
      <div className="ivanna-cover-media"><EditedImage url={coverPhoto?.url || hero} edit={coverPhoto?.edit || event.heroEdit} alt={`${event.brideName} & ${event.groomName}`}/></div>
      <div className="ivanna-cover-shade"/><div className="ivanna-cover-grain"/>
      <div className="ivanna-cover-content">
        <Monogram bride={event.brideName} groom={event.groomName}/>
        <span className="ivanna-cover-kicker">THE WEDDING OF</span>
        <h1>{event.brideName} <em>&</em> {event.groomName}</h1>
        <p className="ivanna-cover-date">{formattedDate}</p>
        <div className="ivanna-cover-recipient"><span>Yth. Bapak/Ibu/Saudara/i</span><strong>{guestName}</strong><p>Tanpa mengurangi rasa hormat,<br/>kami mengundang anda untuk menghadiri<br/>acara pernikahan kami.</p></div>
        <button className="ivanna-open-button" onClick={onOpen}><Heart size={15} fill="currentColor"/> BUKA UNDANGAN</button>
      </div>
    </section>

    <section className="ivanna-experience" aria-hidden={!opened}>
      <aside className="ivanna-poster" aria-label="Wedding poster">
        <div className="ivanna-poster-media"><EditedImage url={hero} edit={event.heroEdit} alt={`${event.brideName} & ${event.groomName}`}/></div>
        <div className="ivanna-poster-shade"/>
        <div className="ivanna-poster-copy">
          <Monogram bride={event.brideName} groom={event.groomName}/>
          <span>THE WEDDING OF</span>
          <h2>{event.brideName.toUpperCase()} <em>&</em> {event.groomName.toUpperCase()}</h2>
          <p>{weekDay}, {compactDate}</p>
        </div>
      </aside>

      <div className="ivanna-story-shell">
        <div className="ivanna-top-actions">
          <button className="ivanna-menu-button" type="button" onClick={() => setMenuOpen(true)} aria-label="Buka menu"><Menu size={26}/></button>
        </div>

        <div className={`ivanna-menu-drawer ${menuOpen ? 'is-open' : ''}`}>
          <button className="ivanna-menu-close" type="button" onClick={() => setMenuOpen(false)} aria-label="Tutup menu"><X size={22}/></button>
          <Monogram bride={event.brideName} groom={event.groomName}/>
          <span className="ivanna-menu-kicker">NAVIGATION</span>
          <nav>
            <button onClick={() => go('iv-home')}>01 <b>Home</b></button>
            <button onClick={() => go('iv-couple')}>02 <b>Bride & Groom</b></button>
            <button onClick={() => go('iv-story')}>03 <b>Love Story</b></button>
            <button onClick={() => go('iv-event')}>04 <b>Wedding Event</b></button>
            <button onClick={() => go('iv-gallery')}>05 <b>Gallery</b></button>
            <button onClick={() => go('iv-rsvp')}>06 <b>RSVP</b></button>
            <button onClick={() => go('iv-gift')}>07 <b>Gift</b></button>
          </nav>
        </div>

        <div className="ivanna-floating-controls">
          <button type="button" onClick={toggleFullscreen} aria-label={fullscreen ? 'Keluar fullscreen' : 'Fullscreen'}>{fullscreen ? <Minimize2 size={25}/> : <Maximize2 size={25}/>}</button>
          <button type="button" onClick={onToggleMusic} disabled={!hasMusic} aria-label={playing ? 'Matikan musik' : 'Nyalakan musik'}>{playing ? <Volume2 size={25}/> : <VolumeX size={25}/>}</button>
        </div>

        <div className="ivanna-deck" ref={deckRef} data-invite-body>
          <section id="iv-home" className="ivanna-slide ivanna-photo-slide" onPointerDown={onPointerDown} onPointerUp={onPointerUp}>
            <div className="ivanna-photo-carousel">
              {photos.map((photo, index) => <div key={photo.id} className={`ivanna-carousel-photo ${index === photoIndex ? 'is-active' : ''}`}><EditedImage url={photo.url} edit={photo.edit} alt={photo.caption || `Moment ${index + 1}`}/></div>)}
            </div>
            <div className="ivanna-slide-shade"/>
            <div className="ivanna-slide-copy hero-copy" data-ivanna-reveal>
              <Monogram bride={event.brideName} groom={event.groomName}/><span>THE WEDDING OF</span>
              <h2>{event.brideName.toUpperCase()} <em>&</em> {event.groomName.toUpperCase()}</h2>
              <blockquote>{event.openingText || 'Two are better than one, because they have a good reward for their toil.'}</blockquote>
              <small>ECCLESIASTES 4:9-10</small>
            </div>
            {photos.length > 1 && <div className="ivanna-photo-nav"><button onClick={() => changePhoto(-1)} aria-label="Foto sebelumnya"><ChevronLeft size={18}/></button><span>{String(photoIndex + 1).padStart(2,'0')} / {String(photos.length).padStart(2,'0')}</span><button onClick={() => changePhoto(1)} aria-label="Foto berikutnya"><ChevronRight size={18}/></button></div>}
          </section>

          <section id="iv-couple" className="ivanna-slide ivanna-paper-slide">
            <div className="ivanna-paper-inner">
              <SlideTitle kicker="THE BRIDE & GROOM" title="Two souls, one story"/>
              <div className="ivanna-couple-cards">
                <article data-ivanna-reveal><div className="ivanna-portrait"><EditedImage url={bridePhoto?.url || hero} edit={bridePhoto?.edit || event.heroEdit} alt={event.brideFullName}/></div><span>THE BRIDE</span><h3>{event.brideFullName}</h3><small>PUTRI DARI</small><p>{event.brideParents}</p></article>
                <article data-ivanna-reveal><div className="ivanna-portrait"><EditedImage url={groomPhoto?.url || hero} edit={groomPhoto?.edit || event.heroEdit} alt={event.groomFullName}/></div><span>THE GROOM</span><h3>{event.groomFullName}</h3><small>PUTRA DARI</small><p>{event.groomParents}</p></article>
              </div>
            </div>
          </section>

          <section id="iv-story" className="ivanna-slide ivanna-dark-slide">
            <div className="ivanna-dark-inner"><SlideTitle kicker="A PEAK OF LOVE" title="Our journey"/>
              <div className="ivanna-timeline">
                {['Awal Bertemu','Menjalin Hubungan','Bertunangan','Hari Pernikahan'].map((title,index) => <article key={title} data-ivanna-reveal><i>{String(index+1).padStart(2,'0')}</i><div><h3>{title}</h3><p>{event.storyText || 'Cerita kecil yang membawa kami menuju satu keputusan besar untuk berjalan bersama.'}</p></div></article>)}
              </div>
            </div>
          </section>

          <section id="iv-date" className="ivanna-slide ivanna-photo-slide ivanna-save-slide">
            <div className="ivanna-slide-bg"><EditedImage url={photos[1]?.url || hero} edit={photos[1]?.edit || event.heroEdit} alt="Save the date"/></div><div className="ivanna-slide-shade"/>
            <div className="ivanna-slide-copy" data-ivanna-reveal><span>SAVE THE DATE</span><h2>{compactDate}</h2><p>“Pernikahan adalah perjalanan untuk bertumbuh, mencintai, dan pulang pada orang yang sama.”</p><Countdown date={event.eventDate}/><a className="ivanna-line-button" href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`Wedding ${event.brideName} & ${event.groomName}`)}&dates=${event.eventDate.replaceAll('-','')}/${event.eventDate.replaceAll('-','')}`} target="_blank" rel="noreferrer"><CalendarDays size={15}/> SIMPAN TANGGAL</a></div>
          </section>

          <section id="iv-event" className="ivanna-slide ivanna-paper-slide">
            <div className="ivanna-paper-inner"><SlideTitle kicker={`${weekDay}, ${compactDate}`} title="Wedding Event"/>
              <div className="ivanna-event-list">
                <article data-ivanna-reveal><Heart size={18}/><span>HOLY MATRIMONY / AKAD</span><h3>{event.akadTime}</h3><strong>{event.venueName}</strong><p>{event.venueAddress}</p><a href={event.mapUrl} target="_blank" rel="noreferrer"><MapPin size={14}/> GOOGLE MAPS</a></article>
                <article data-ivanna-reveal><Sparkles size={18}/><span>RECEPTION</span><h3>{event.receptionTime}</h3><strong>{event.venueName}</strong><p>{event.venueAddress}</p><a href={event.mapUrl} target="_blank" rel="noreferrer"><MapPin size={14}/> GOOGLE MAPS</a></article>
              </div>
            </div>
          </section>

          {event.featureGuestbook && <section id="iv-access" className="ivanna-slide ivanna-access-slide">
            <div className="ivanna-paper-inner"><SlideTitle kicker="QR CHECK-IN" title="Kartu akses masuk"/><div className="ivanna-access-card" data-ivanna-reveal><div><Monogram bride={event.brideName} groom={event.groomName}/><small>KARTU AKSES MASUK</small><h3>{event.brideName} & {event.groomName}</h3><p>{event.venueName}</p><strong>{compactDate}</strong><b>{guestName}</b></div><FauxQr/></div><a className="ivanna-solid-button" href={`/checkin/${event.slug}`} target="_blank" rel="noreferrer"><QrCode size={15}/> BUKA QR CHECK-IN</a></div>
          </section>}

          <section id="iv-extra" className="ivanna-slide ivanna-dark-slide">
            <div className="ivanna-dark-inner"><SlideTitle kicker="DETAILS" title="For our special day"/><div className="ivanna-detail-stack">
              <article data-ivanna-reveal><Shirt size={22}/><span>A GUIDE TO ATTIRE</span><p>Kenakan nuansa earth, stone, charcoal, atau ivory.</p><div className="ivanna-swatches"><i/><i/><i/><i/><i/></div></article>
              <article data-ivanna-reveal><Video size={22}/><span>JOIN OUR WEDDING</span><p>Moment bahagia prosesi pernikahan dapat ditayangkan secara virtual.</p><button type="button">WATCH LIVE <ExternalLink size={13}/></button></article>
              {event.featureFrame && <article data-ivanna-reveal><Camera size={22}/><span>WEDDING FRAME</span><p>Abadikan momen kamu dengan frame khusus pasangan.</p><a href={`/frame/${event.slug}`} target="_blank" rel="noreferrer">OPEN FRAME <ExternalLink size={13}/></a></article>}
            </div></div>
          </section>

          <section id="iv-gallery" className="ivanna-slide ivanna-gallery-slide">
            <div className="ivanna-gallery-head"><SlideTitle kicker="OUR MOMENT" title="A collection of us"/></div>
            <div className="ivanna-gallery-strip" onPointerDown={onPointerDown} onPointerUp={onPointerUp}>{photos.map((photo,index) => <figure key={`${photo.id}-${index}`}><EditedImage url={photo.url} edit={photo.edit} alt={photo.caption || `Moment ${index+1}`}/></figure>)}</div>
            <p className="ivanna-swipe-hint">SWIPE TO EXPLORE</p>
          </section>

          <section id="iv-rsvp" className="ivanna-slide ivanna-rsvp-slide">
            <div className="ivanna-paper-inner"><SlideTitle kicker="RSVP & WISHES" title="Will you join us?"/><p className="ivanna-centered-copy" data-ivanna-reveal>Bagi tamu undangan yang akan hadir, silakan kirimkan konfirmasi dan doa terbaik.</p><div data-ivanna-reveal><RsvpPanel {...props} variant="ivanna-rsvp-form"/></div></div>
          </section>

          <section id="iv-gift" className="ivanna-slide ivanna-paper-slide">
            <div className="ivanna-paper-inner"><SlideTitle kicker="WEDDING GIFT" title="Your prayer is our greatest gift"/><div className="ivanna-gift-grid"><article data-ivanna-reveal><Gift size={20}/><span>E-AMPLOP</span><strong>BCA</strong><h3>0123 456 789</h3><p>Nama Penerima</p><button type="button" onClick={() => navigator.clipboard?.writeText('0123456789')}>SALIN</button></article><article data-ivanna-reveal><Gift size={20}/><span>E-WALLET</span><strong>GOPAY</strong><h3>0123 456 789</h3><p>Nama Penerima</p><button type="button" onClick={() => navigator.clipboard?.writeText('0123456789')}>SALIN</button></article></div></div>
          </section>

          <section id="iv-close" className="ivanna-slide ivanna-photo-slide ivanna-closing-slide">
            <div className="ivanna-slide-bg"><EditedImage url={photos.at(-1)?.url || hero} edit={photos.at(-1)?.edit || event.heroEdit} alt="Thank you"/></div><div className="ivanna-slide-shade"/><div className="ivanna-slide-copy" data-ivanna-reveal><span>THANK YOU FOR YOUR ATTENDANCE</span><p>{event.closingText}</p><h2>{event.brideName} <em>&</em> {event.groomName}</h2><strong>#WeddingHashtag</strong><small>Personalized for {guestName}</small></div>
          </section>
        </div>
      </div>
    </section>
  </div>
}
