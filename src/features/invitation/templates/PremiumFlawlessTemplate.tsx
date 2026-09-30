import { useEffect, useMemo, useRef, useState } from 'react'
import {
  CalendarDays, Camera, ChevronDown, Copy, Download, Gift, Heart, MapPin,
  Maximize2, Menu, Minimize2, QrCode, Video, Volume2, VolumeX, X,
} from 'lucide-react'
import type { GalleryItem } from '../../../types'
import type { InvitationTemplateProps } from './shared'
import { Countdown, EditedImage, RsvpPanel } from './shared'
import '../../../styles.premium-flawless.css'

function useFlawlessReveal(opened: boolean, rootRef: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!opened) return
    const root = rootRef.current
    if (!root) return
    const nodes = Array.from(root.querySelectorAll<HTMLElement>('[data-fl-reveal]'))
    if (!('IntersectionObserver' in window)) {
      nodes.forEach(node => node.classList.add('is-visible'))
      return
    }
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('is-visible')
      })
    }, { root: null, threshold: 0.14, rootMargin: '0px 0px -7% 0px' })
    nodes.forEach(node => observer.observe(node))
    return () => observer.disconnect()
  }, [opened, rootRef])
}

function initials(a: string, b: string) {
  return `${(a || 'B').trim().charAt(0).toUpperCase()} ${(b || 'G').trim().charAt(0).toUpperCase()}`
}

function FlawlessMonogram({ bride, groom, light = false }: { bride: string; groom: string; light?: boolean }) {
  return <div className={`fl-monogram ${light ? 'is-light' : ''}`} aria-label={`${bride} and ${groom}`}>
    <span>{(bride || 'B').trim().charAt(0).toUpperCase()}</span>
    <small>AND</small>
    <span>{(groom || 'G').trim().charAt(0).toUpperCase()}</span>
  </div>
}

function FloralLine({ className = '' }: { className?: string }) {
  return <svg className={`fl-floral-line ${className}`} viewBox="0 0 240 240" aria-hidden="true">
    <g fill="none" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 228c27-31 41-61 48-91 7-29 3-57 18-82 10-17 29-31 54-40"/>
      <path d="M46 161c-23-4-35-19-36-42 25 2 42 14 49 35"/>
      <path d="M60 129c18-19 38-24 61-14-9 23-27 34-53 31"/>
      <path d="M71 91c-11-22-5-42 17-57 17 20 18 41 2 61"/>
      <path d="M98 55c10-20 28-30 54-27-1 25-15 41-41 47"/>
      <path d="M118 31c21-13 42-11 63 8-15 19-35 25-60 16"/>
      <path d="M37 184c14-15 30-20 49-14-4 20-17 31-40 34"/>
      <path d="M88 113c13-9 25-7 36 5-7 13-20 18-36 13"/>
      <path d="M139 24c8-17 23-24 44-20 0 20-11 32-32 37"/>
      <path d="M20 208c8-10 18-13 29-9-2 12-10 19-24 20"/>
      <circle cx="89" cy="83" r="3"/><circle cx="129" cy="50" r="2.4"/><circle cx="56" cy="151" r="2.2"/>
    </g>
  </svg>
}

function FauxQr({ token }: { token: string }) {
  const seed = Array.from(token || 'IINVITATION').reduce((sum, char) => sum + char.charCodeAt(0), 0)
  return <div className="fl-qr" aria-label="QR check-in">
    {Array.from({ length: 121 }).map((_, index) => {
      const x = index % 11
      const y = Math.floor(index / 11)
      const finder = (x < 3 && y < 3) || (x > 7 && y < 3) || (x < 3 && y > 7)
      const on = finder || ((index * 17 + seed * 7 + x * y) % 5 < 2)
      return <i key={index} className={on ? 'on' : ''}/>
    })}
  </div>
}

function collectPhotos(hero: string, heroEdit: InvitationTemplateProps['event']['heroEdit'], gallery: GalleryItem[]) {
  const source = [{ id: 'hero', url: hero, caption: '', edit: heroEdit }, ...gallery]
  const seen = new Set<string>()
  return source.filter(item => item.url && !seen.has(item.url) && seen.add(item.url)).slice(0, 12)
}

function SectionTitle({ eyebrow, title, script }: { eyebrow?: string; title: string; script?: string }) {
  return <div className="fl-section-title" data-fl-reveal>
    {eyebrow && <span>{eyebrow}</span>}
    {script && <em>{script}</em>}
    <h2>{title}</h2>
  </div>
}

export function PremiumFlawlessTemplate(props: InvitationTemplateProps) {
  const {
    event, guestName, opened, onOpen, formattedDate,
    playing = false, hasMusic = false, onToggleMusic,
  } = props

  const pageRef = useRef<HTMLDivElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [fullscreen, setFullscreen] = useState(Boolean(document.fullscreenElement))
  const [activeGallery, setActiveGallery] = useState(0)
  const [copied, setCopied] = useState(false)
  const hero = event.heroImage || event.gallery[0]?.url || ''
  const photos = useMemo(() => collectPhotos(hero, event.heroEdit, event.gallery), [hero, event.heroEdit, event.gallery])
  const bridePhoto = event.gallery[0]
  const groomPhoto = event.gallery[1] || event.gallery[0]
  const dateObj = new Date(event.eventDate)
  const compactDate = dateObj.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }).replaceAll('/', '.')
  const weekdayDate = dateObj.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase()

  useFlawlessReveal(opened, pageRef)

  useEffect(() => {
    const fn = () => setFullscreen(Boolean(document.fullscreenElement))
    document.addEventListener('fullscreenchange', fn)
    return () => document.removeEventListener('fullscreenchange', fn)
  }, [])

  useEffect(() => {
    if (!opened || photos.length < 2) return
    const id = window.setInterval(() => setActiveGallery(i => (i + 1) % photos.length), 7000)
    return () => window.clearInterval(id)
  }, [opened, photos.length])

  const jump = (id: string) => {
    setMenuOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen()
      else await document.documentElement.requestFullscreen()
    } catch { /* fullscreen can be blocked in preview iframe */ }
  }

  const copyVenue = async () => {
    try {
      await navigator.clipboard.writeText(event.venueAddress)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1400)
    } catch { /* no-op */ }
  }

  return <div className={`flawless-template ${opened ? 'is-opened' : ''}`} ref={pageRef}>
    <section className={`fl-cover ${opened ? 'is-leaving' : ''}`} aria-hidden={opened}>
      <div className="fl-cover-media"><EditedImage url={hero} edit={event.heroEdit} alt={`${event.brideName} & ${event.groomName}`}/></div>
      <div className="fl-cover-wash"/>
      <div className="fl-cover-frame"/>
      <FloralLine className="fl-cover-flower top-left"/>
      <FloralLine className="fl-cover-flower bottom-right"/>
      <div className="fl-cover-monogram"><FlawlessMonogram bride={event.brideName} groom={event.groomName}/></div>
      <div className="fl-cover-copy">
        <span className="fl-cover-kicker">THE WEDDING OF</span>
        <h1>{event.brideName} <i>&</i> {event.groomName}</h1>
        <p className="fl-cover-date">{compactDate}</p>
        <div className="fl-cover-recipient">
          <small>Yth. Bapak/Ibu/Saudara/i</small>
          <strong>{guestName}</strong>
          <p>Tanpa mengurangi rasa hormat,<br/>kami mengundang anda untuk menghadiri<br/>acara pernikahan kami.</p>
        </div>
        <button className="fl-open-btn" onClick={onOpen}><Heart size={15} fill="currentColor"/> BUKA UNDANGAN</button>
      </div>
      <span className="fl-cover-index">PREMIUM 02 · FLAWLESS</span>
    </section>

    <div className={`fl-body ${opened ? 'is-visible' : ''}`} data-invite-body>
      <header className="fl-floating-header">
        <FlawlessMonogram bride={event.brideName} groom={event.groomName}/>
        <button onClick={() => setMenuOpen(true)} aria-label="Buka navigasi"><Menu size={22}/></button>
      </header>

      <div className={`fl-menu ${menuOpen ? 'is-open' : ''}`}>
        <button className="fl-menu-close" onClick={() => setMenuOpen(false)} aria-label="Tutup menu"><X size={22}/></button>
        <FlawlessMonogram bride={event.brideName} groom={event.groomName}/>
        <span className="fl-menu-label">NAVIGATION</span>
        <nav>
          <button onClick={() => jump('fl-home')}><span>01</span>Home</button>
          <button onClick={() => jump('fl-prayer')}><span>02</span>Our Prayer</button>
          <button onClick={() => jump('fl-couple')}><span>03</span>Mempelai</button>
          <button onClick={() => jump('fl-event')}><span>04</span>Wedding Event</button>
          <button onClick={() => jump('fl-story')}><span>05</span>Love Story</button>
          <button onClick={() => jump('fl-gallery')}><span>06</span>Gallery</button>
          <button onClick={() => jump('fl-rsvp')}><span>07</span>RSVP & Wishes</button>
          <button onClick={() => jump('fl-gift')}><span>08</span>Wedding Gift</button>
        </nav>
      </div>

      <div className="fl-float-controls">
        <button onClick={toggleFullscreen} aria-label={fullscreen ? 'Keluar fullscreen' : 'Fullscreen'}>{fullscreen ? <Minimize2 size={20}/> : <Maximize2 size={20}/>}</button>
        <button onClick={onToggleMusic} disabled={!hasMusic} aria-label={playing ? 'Matikan musik' : 'Nyalakan musik'}>{playing ? <Volume2 size={20}/> : <VolumeX size={20}/>}</button>
      </div>

      <section id="fl-home" className="fl-hero">
        <div className="fl-hero-carousel">
          {(photos.length ? photos : [{ id: 'hero', url: hero, edit: event.heroEdit, caption: '' }]).slice(0, 5).map((photo, index) =>
            <div className={`fl-hero-photo ${index === activeGallery % Math.max(1, Math.min(photos.length, 5)) ? 'is-active' : ''}`} key={photo.id}>
              <EditedImage url={photo.url} edit={photo.edit} alt={photo.caption || `${event.brideName} & ${event.groomName}`}/>
            </div>)}
        </div>
        <div className="fl-hero-shade"/>
        <div className="fl-hero-frame"/>
        <div className="fl-hero-copy" data-fl-reveal>
          <FlawlessMonogram bride={event.brideName} groom={event.groomName} light/>
          <span>THE WEDDING OF</span>
          <h2>{event.brideName} <i>&</i> {event.groomName}</h2>
          <p>{compactDate}</p>
        </div>
        <button className="fl-swipe-cue" onClick={() => jump('fl-prayer')}><span>SWIPE UP</span><ChevronDown size={18}/></button>
      </section>

      <section id="fl-prayer" className="fl-prayer fl-paper-section">
        <FloralLine className="fl-prayer-flower left"/>
        <div className="fl-narrow">
          <SectionTitle eyebrow="OUR PRAYER" title="Sebuah doa untuk perjalanan kami"/>
          <blockquote data-fl-reveal>“Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya.”</blockquote>
          <span className="fl-verse" data-fl-reveal>Q.S. AR-RUM : 21</span>
          <div className="fl-prayer-rule"/>
          <p data-fl-reveal>{event.openingText || 'Dengan segala puji bagi Allah yang telah menciptakan makhluk-Nya berpasang-pasangan, izinkanlah kami merangkaikan cinta dalam ikatan pernikahan.'}</p>
        </div>
      </section>

      <section id="fl-couple" className="fl-couple fl-paper-section">
        <div className="fl-wide">
          <SectionTitle eyebrow="PASANGAN" script="Mempelai" title="Dua hati, satu perjalanan"/>
          <div className="fl-couple-grid">
            <article className="fl-person-card" data-fl-reveal>
              <div className="fl-person-photo"><EditedImage url={bridePhoto?.url || hero} edit={bridePhoto?.edit || event.heroEdit} alt={event.brideFullName}/><FloralLine className="fl-person-flower"/></div>
              <span>THE BRIDE</span><h3>{event.brideName}</h3><strong>{event.brideFullName}</strong><p>{event.brideParents}</p>
            </article>
            <div className="fl-couple-amp" data-fl-reveal>&</div>
            <article className="fl-person-card groom" data-fl-reveal>
              <div className="fl-person-photo"><EditedImage url={groomPhoto?.url || hero} edit={groomPhoto?.edit || event.heroEdit} alt={event.groomFullName}/><FloralLine className="fl-person-flower"/></div>
              <span>THE GROOM</span><h3>{event.groomName}</h3><strong>{event.groomFullName}</strong><p>{event.groomParents}</p>
            </article>
          </div>
        </div>
      </section>

      <section className="fl-countdown fl-image-section">
        <div className="fl-countdown-media"><EditedImage url={photos[2]?.url || hero} edit={photos[2]?.edit || event.heroEdit} alt="Save the date"/></div>
        <div className="fl-image-shade"/>
        <div className="fl-countdown-copy" data-fl-reveal>
          <span>HITUNG MUNDUR</span><h2>Hari Bahagia Kami</h2><strong>{weekdayDate}</strong>
          <Countdown date={event.eventDate}/>
          <button onClick={() => jump('fl-event')}><CalendarDays size={16}/> SIMPAN TANGGALNYA</button>
        </div>
      </section>

      <section id="fl-event" className="fl-event fl-paper-section">
        <div className="fl-wide">
          <SectionTitle eyebrow="WAKTU & TEMPAT" script="Pernikahan" title="Rangkaian hari bahagia"/>
          <p className="fl-event-intro" data-fl-reveal>Pernikahan adalah ibadah, dan setiap ibadah bermuara pada cinta-Nya sebagai tujuan.</p>
          <div className="fl-event-grid">
            <article data-fl-reveal><span>01</span><Heart size={19}/><h3>AKAD</h3><strong>{formattedDate}</strong><b>{event.akadTime}</b><p>{event.venueName}<br/>{event.venueAddress}</p><a href={event.mapUrl} target="_blank" rel="noreferrer"><MapPin size={15}/> LIHAT LOKASI</a></article>
            <article data-fl-reveal><span>02</span><CalendarDays size={19}/><h3>RESEPSI</h3><strong>{formattedDate}</strong><b>{event.receptionTime}</b><p>{event.venueName}<br/>{event.venueAddress}</p><a href={event.mapUrl} target="_blank" rel="noreferrer"><MapPin size={15}/> LIHAT LOKASI</a></article>
          </div>
          <div className="fl-dresscode" data-fl-reveal><span>DRESSCODE</span><h3>Monochrome</h3><div><i className="black"/><i className="white"/><i className="grey"/></div><small>Hitam · Putih · Abu</small></div>
        </div>
      </section>

      <section className="fl-registration fl-soft-section">
        <div className="fl-wide fl-registration-grid">
          <div data-fl-reveal><span className="fl-eyebrow">REGISTRATION</span><h2>QR Check-in</h2><p>Silahkan tunjukan QR Code ini kepada penerima tamu undangan di lokasi acara.</p><div className="fl-qr-wrap"><FauxQr token={guestName}/></div></div>
          <article className="fl-access-card" data-fl-reveal>
            <header><span>KARTU AKSES MASUK</span><FlawlessMonogram bride={event.brideName} groom={event.groomName}/></header>
            <div><small>THE WEDDING OF</small><h3>{event.brideName} & {event.groomName}</h3><p>{formattedDate}</p></div>
            <div className="fl-access-person"><span>Kepada Yth.</span><strong>{guestName}</strong></div>
            <footer><span>REGULER</span><b>{initials(event.brideName, event.groomName).replace(' ', '')}</b></footer>
          </article>
        </div>
      </section>

      <section className="fl-stream fl-image-section">
        <div className="fl-countdown-media"><EditedImage url={photos[3]?.url || hero} edit={photos[3]?.edit || event.heroEdit} alt="Live streaming"/></div><div className="fl-image-shade dark"/>
        <div className="fl-stream-copy" data-fl-reveal><Video size={25}/><span>LIVE STREAMING</span><h2>Join Our Celebration</h2><p>Jika anda berhalangan hadir, tetaplah menjadi bagian dari hari berbahagia kami melalui siaran langsung.</p><button>JOIN LIVE STREAM</button></div>
      </section>

      <section id="fl-story" className="fl-story fl-paper-section">
        <div className="fl-narrow">
          <SectionTitle eyebrow="SEBUAH KISAH" script="Perjalanan Cinta" title="Yang sederhana, menjadi selamanya"/>
          <p className="fl-story-lead" data-fl-reveal>{event.storyText}</p>
          <div className="fl-story-line">
            {['Awal Bertemu','Menjalani Hubungan','Bertunangan','Hari Pernikahan'].map((title, index) => <article key={title} data-fl-reveal><span>0{index + 1}</span><div><small>{index === 3 ? dateObj.getFullYear() : '20XX'}</small><h3>{title}</h3><p>{index === 3 ? 'Hari yang kami pilih untuk memulai perjalanan sebagai satu keluarga.' : 'Setiap pertemuan membawa kami satu langkah lebih dekat kepada hari ini.'}</p></div></article>)}
          </div>
        </div>
      </section>

      <section id="fl-gallery" className="fl-gallery fl-soft-section">
        <div className="fl-wide">
          <SectionTitle eyebrow="MOMENT KAMI" title="Captured in quiet moments"/>
          {photos.length ? <div className="fl-gallery-grid">{photos.slice(0, 8).map((photo, index) => <figure key={photo.id} className={index === 0 || index === 5 ? 'wide' : ''} data-fl-reveal><EditedImage url={photo.url} edit={photo.edit} alt={photo.caption || `Moment ${index + 1}`}/><span>{String(index + 1).padStart(2,'0')}</span></figure>)}</div> : <p>Foto belum ditambahkan.</p>}
        </div>
      </section>

      <section className="fl-frame fl-paper-section">
        <div className="fl-frame-card" data-fl-reveal>
          <Camera size={23}/><span>WEDDING FRAME</span><h2>Capture Your Moment</h2><p>Abadikan setiap momen bahagia dengan Wedding Frame milik {event.brideName} & {event.groomName}.</p><a href={`/frame/${event.slug}`} target="_blank" rel="noreferrer">BUKA WEDDING FRAME</a>
        </div>
      </section>

      <section id="fl-rsvp" className="fl-rsvp fl-soft-section">
        <div className="fl-narrow">
          <SectionTitle eyebrow="DOA & UCAPAN" script="Teruntuk Mempelai" title="Konfirmasi Kehadiran"/>
          <p className="fl-rsvp-intro" data-fl-reveal>Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.</p>
          <div data-fl-reveal><RsvpPanel {...props} variant="fl-rsvp-form"/></div>
        </div>
      </section>

      <section id="fl-gift" className="fl-gift fl-paper-section">
        <div className="fl-narrow">
          <Gift size={24}/><SectionTitle eyebrow="HADIAH PERNIKAHAN" title="Wedding Gift"/>
          <p data-fl-reveal>Doa restu Anda merupakan karunia yang sangat berarti bagi kami. Namun jika memberi adalah ungkapan tanda kasih, kami menerimanya dengan penuh syukur.</p>
          <div className="fl-gift-card" data-fl-reveal><span>E-AMPLOP</span><strong>0123 456 789</strong><small>Nama Penerima</small><button onClick={() => { navigator.clipboard?.writeText('0123456789'); setCopied(true); setTimeout(() => setCopied(false), 1400) }}><Copy size={14}/>{copied ? 'TERSALIN' : 'SALIN'}</button></div>
          <div className="fl-gift-address" data-fl-reveal><Download size={19}/><div><span>KIRIM KADO</span><p>{event.venueAddress}</p></div><button onClick={copyVenue}><Copy size={14}/> {copied ? 'TERSALIN' : 'SALIN'}</button></div>
        </div>
      </section>

      <section className="fl-closing fl-image-section">
        <div className="fl-countdown-media"><EditedImage url={photos[4]?.url || hero} edit={photos[4]?.edit || event.heroEdit} alt="Closing"/></div><div className="fl-image-shade"/>
        <div className="fl-closing-copy" data-fl-reveal><FloralLine className="fl-closing-flower"/><span>TERIMA KASIH</span><p>{event.closingText}</p><small>KAMI YANG BERBAHAGIA</small><h2>{event.brideName} <i>&</i> {event.groomName}</h2><b>#WeddingHastag</b></div>
      </section>
    </div>
  </div>
}
