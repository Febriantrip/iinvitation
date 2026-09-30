import { useEffect, useMemo, useRef, useState } from 'react'
import {
  CalendarDays,
  Camera,
  Clock3,
  Copy,
  Download,
  ExternalLink,
  Flower2,
  Gift,
  Heart,
  MapPin,
  Maximize2,
  Menu,
  Minimize2,
  Navigation2,
  ScanLine,
  Sparkles,
  Video,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react'
import type { GalleryItem } from '../../../types'
import type { InvitationTemplateProps } from './shared'
import { Countdown, EditedImage, RsvpPanel } from './shared'

function useArunaReveal(opened: boolean, rootRef: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    if (!opened) return
    const root = rootRef.current
    if (!root) return
    const nodes = Array.from(root.querySelectorAll<HTMLElement>('[data-aruna-reveal]'))
    if (!('IntersectionObserver' in window)) {
      nodes.forEach(node => node.classList.add('is-visible'))
      return
    }
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('is-visible')
      })
    }, { root, threshold: 0.16, rootMargin: '-4% 0px -8% 0px' })
    nodes.forEach(node => observer.observe(node))
    return () => observer.disconnect()
  }, [opened, rootRef])
}

function storySteps(text: string) {
  const explicit = text.split(/\n+/).map(value => value.trim()).filter(Boolean)
  if (explicit.length >= 2) return explicit.slice(0, 4)
  const sentences = text.split(/(?<=[.!?])\s+/).map(value => value.trim()).filter(Boolean)
  if (sentences.length <= 1) return [text || 'Kisah kami dimulai dari sebuah pertemuan sederhana yang perlahan tumbuh menjadi rumah.']
  const size = Math.max(1, Math.ceil(sentences.length / 4))
  return Array.from({ length: 4 }, (_, index) => sentences.slice(index * size, (index + 1) * size).join(' ')).filter(Boolean)
}

function uniquePhotos(hero: string, heroEdit: InvitationTemplateProps['event']['heroEdit'], gallery: GalleryItem[]) {
  const pool = [{ id: 'hero', url: hero, edit: heroEdit, caption: '' }, ...gallery]
  const seen = new Set<string>()
  return pool.filter(item => item.url && !seen.has(item.url) && seen.add(item.url)).slice(0, 10)
}

function PseudoQr({ seed }: { seed: string }) {
  const source = [...seed].reduce((acc, char, index) => (acc + char.charCodeAt(0) * (index + 11)) % 2147483647, 7727)
  const bits = Array.from({ length: 225 }, (_, index) => {
    const row = Math.floor(index / 15)
    const col = index % 15
    const finder = (row < 5 && col < 5) || (row < 5 && col > 9) || (row > 9 && col < 5)
    if (finder) {
      const localRow = row > 9 ? row - 10 : row
      const localCol = col > 9 ? col - 10 : col
      return localRow === 0 || localRow === 4 || localCol === 0 || localCol === 4 || (localRow >= 2 && localRow <= 2 && localCol >= 2 && localCol <= 2)
    }
    return ((source * (index + 23) + index * index * 29 + row * 31 + col * 17) % 13) < 6
  })
  return <div className="aruna-qr" aria-label="QR check-in visual">
    {bits.map((on, index) => <i key={index} className={on ? 'on' : ''}/>) }
  </div>
}

function ArunaMonogram({ bride, groom }: { bride: string; groom: string }) {
  const b = (bride || 'B').trim().charAt(0).toUpperCase()
  const g = (groom || 'G').trim().charAt(0).toUpperCase()
  return <div className="aruna-monogram" aria-hidden="true"><span>{b}</span><i>♥</i><span>{g}</span></div>
}

function BotanicalCorner({ side }: { side: 'left' | 'right' }) {
  return <div className={`aruna-botanical aruna-botanical-${side}`} aria-hidden="true">
    <i className="leaf l1"/><i className="leaf l2"/><i className="leaf l3"/><i className="leaf l4"/>
    <i className="flower f1"/><i className="flower f2"/><i className="flower f3"/>
    <b className="stem s1"/><b className="stem s2"/>
  </div>
}

function OrnamentLine() {
  return <div className="aruna-ornament-line" aria-hidden="true"><span/><i>✦</i><b/><i>✦</i><span/></div>
}

export function HeritageArunaTemplate(props: InvitationTemplateProps) {
  const { event, guestName, opened, onOpen, formattedDate, playing = false, hasMusic = false, onToggleMusic } = props
  const deckRef = useRef<HTMLDivElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [fullscreen, setFullscreen] = useState(Boolean(document.fullscreenElement))
  const hero = event.heroImage || event.gallery[0]?.url || ''
  const photos = useMemo(() => uniquePhotos(hero, event.heroEdit, event.gallery), [hero, event.heroEdit, event.gallery])
  const bridePhoto = event.gallery[0]
  const groomPhoto = event.gallery[1] || event.gallery[0]
  const steps = storySteps(event.storyText)
  const stepTitles = ['Awal Bertemu', 'Menjalin Hubungan', 'Bertunangan', 'Hari Pernikahan']
  const eventDay = new Date(event.eventDate)
  const dayName = eventDay.toLocaleDateString('id-ID', { weekday: 'long' })
  const compactDate = eventDay.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })

  useArunaReveal(opened, deckRef)

  useEffect(() => {
    const handler = () => setFullscreen(Boolean(document.fullscreenElement))
    document.addEventListener('fullscreenchange', handler)
    return () => document.removeEventListener('fullscreenchange', handler)
  }, [])

  const go = (id: string) => {
    setMenuOpen(false)
    deckRef.current?.querySelector<HTMLElement>(`#${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const openAndGo = (id?: string) => {
    onOpen()
    if (id) window.setTimeout(() => deckRef.current?.querySelector<HTMLElement>(`#${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 900)
  }

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) await document.documentElement.requestFullscreen()
      else await document.exitFullscreen()
    } catch { /* fullscreen can be blocked by embedded previews */ }
  }

  return <div className={`aruna-template ${opened ? 'is-opened' : ''}`}>
    <section className={`aruna-opening ${opened ? 'is-open' : ''}`} id="home">
      <div className="aruna-opening-media"><EditedImage url={hero} edit={event.heroEdit} alt={`${event.brideName} & ${event.groomName}`}/></div>
      <div className="aruna-opening-shade"/>
      <div className="aruna-opening-paper"/>
      <BotanicalCorner side="left"/><BotanicalCorner side="right"/>
      <div className="aruna-opening-frame"><i/><i/><i/><i/></div>
      <div className="aruna-opening-copy">
        <ArunaMonogram bride={event.brideName} groom={event.groomName}/>
        <span className="aruna-overline">THE WEDDING OF</span>
        <h1>{event.brideName} <em>&</em> {event.groomName}</h1>
        <p className="aruna-opening-date">{formattedDate}</p>
        <p className="aruna-opening-quote">“Dua perjalanan yang dipertemukan, lalu memilih satu arah untuk pulang.”</p>
        <div className="aruna-recipient">
          <span>Yth. Bapak/Ibu/Saudara/i</span>
          <strong>{guestName}</strong>
        </div>
        <div className="aruna-opening-actions">
          <button onClick={() => openAndGo()} className="aruna-btn aruna-btn-primary"><Heart size={14} fill="currentColor"/> BUKA UNDANGAN</button>
          <button onClick={() => openAndGo('aruna-access')} className="aruna-btn aruna-btn-ghost"><ScanLine size={14}/> QR CHECK-IN</button>
        </div>
      </div>
    </section>

    <section className="aruna-experience" aria-hidden={!opened}>
      <aside className="aruna-poster" aria-label="Wedding poster">
        <div className="aruna-poster-media"><EditedImage url={photos[1]?.url || hero} edit={photos[1]?.edit || event.heroEdit} alt={`${event.brideName} & ${event.groomName}`}/></div>
        <div className="aruna-poster-shade"/>
        <BotanicalCorner side="left"/>
        <div className="aruna-poster-frame"/>
        <div className="aruna-poster-copy">
          <ArunaMonogram bride={event.brideName} groom={event.groomName}/>
          <span>THE WEDDING OF</span>
          <h2>{event.brideName}<em>&</em>{event.groomName}</h2>
          <p>{dayName}, {compactDate}</p>
        </div>
      </aside>

      <div className="aruna-story-shell">
        <button className="aruna-menu-button" type="button" onClick={() => setMenuOpen(true)} aria-label="Buka menu"><Menu size={24}/></button>
        <div className={`aruna-menu-drawer ${menuOpen ? 'is-open' : ''}`}>
          <button className="aruna-menu-close" type="button" onClick={() => setMenuOpen(false)} aria-label="Tutup menu"><X size={22}/></button>
          <ArunaMonogram bride={event.brideName} groom={event.groomName}/>
          <span className="aruna-menu-kicker">HERITAGE ARUNA</span>
          <nav>
            <button onClick={() => go('aruna-prayer')}>01 <b>Opening</b></button>
            <button onClick={() => go('aruna-couple')}>02 <b>Bride & Groom</b></button>
            <button onClick={() => go('aruna-story')}>03 <b>Journey of Love</b></button>
            <button onClick={() => go('aruna-event')}>04 <b>Wedding Event</b></button>
            <button onClick={() => go('aruna-gallery')}>05 <b>Gallery</b></button>
            <button onClick={() => go('aruna-rsvp')}>06 <b>RSVP</b></button>
            <button onClick={() => go('aruna-gift')}>07 <b>Gift</b></button>
          </nav>
        </div>

        <div className="aruna-floating-controls">
          <button type="button" onClick={toggleFullscreen} aria-label={fullscreen ? 'Keluar fullscreen' : 'Fullscreen'}>{fullscreen ? <Minimize2 size={22}/> : <Maximize2 size={22}/>}</button>
          <button type="button" onClick={onToggleMusic} disabled={!hasMusic} aria-label={playing ? 'Matikan musik' : 'Nyalakan musik'}>{playing ? <Volume2 size={22}/> : <VolumeX size={22}/>}</button>
        </div>

        <div className="aruna-deck" ref={deckRef} data-invite-body>
          <section className="aruna-envelope-scene aruna-panel aruna-paper-panel" id="aruna-prayer">
            <BotanicalCorner side="left"/><BotanicalCorner side="right"/>
            <div className="aruna-envelope-content" data-aruna-reveal>
              <span className="aruna-script">the story begins...</span>
              <div className="aruna-envelope-wrap" aria-hidden="true">
                <div className="aruna-envelope-back"/>
                <div className="aruna-envelope-letter"><ArunaMonogram bride={event.brideName} groom={event.groomName}/><strong>OPEN THE ENVELOPE</strong><small>{formattedDate}</small></div>
                <div className="aruna-envelope-flap"/>
                <div className="aruna-envelope-front"/>
                <div className="aruna-wax"><Heart size={18} fill="currentColor"/></div>
              </div>
              <OrnamentLine/>
              <blockquote>{event.openingText || 'Dengan penuh syukur, kami memohon doa terbaik untuk langkah baru yang kami mulai bersama.'}</blockquote>
            </div>
          </section>

          <section className="aruna-prayer aruna-panel aruna-olive-panel">
            <div className="aruna-arch-frame" data-aruna-reveal>
              <span className="aruna-kicker">Our Prayer</span>
              <h2>Dalam kasih dan doa</h2>
              <p>Semoga hari yang kami nantikan menjadi awal dari perjalanan yang dipenuhi ketenangan, kebaikan, dan kasih yang terus bertumbuh.</p>
              <OrnamentLine/>
            </div>
          </section>

          <section className="aruna-couple aruna-panel aruna-paper-panel" id="aruna-couple">
            <BotanicalCorner side="right"/>
            <div className="aruna-section-head" data-aruna-reveal><span className="aruna-kicker">Bride & Groom</span><h2>Two souls,<br/>one beautiful promise</h2><p>{event.openingText}</p></div>
            <div className="aruna-couple-stack">
              <article className="aruna-person" data-aruna-reveal>
                <div className="aruna-vintage-frame"><div className="aruna-frame-photo"><EditedImage url={bridePhoto?.url || hero} edit={bridePhoto?.edit || event.heroEdit} alt={event.brideFullName}/></div><span className="aruna-frame-top"/><span className="aruna-frame-bottom"/></div>
                <div className="aruna-person-copy"><small>THE BRIDE</small><h3>{event.brideName}</h3><strong>{event.brideFullName}</strong><p>{event.brideParents}</p></div>
              </article>
              <span className="aruna-ampersand" data-aruna-reveal>&</span>
              <article className="aruna-person reverse" data-aruna-reveal>
                <div className="aruna-vintage-frame"><div className="aruna-frame-photo"><EditedImage url={groomPhoto?.url || hero} edit={groomPhoto?.edit || event.heroEdit} alt={event.groomFullName}/></div><span className="aruna-frame-top"/><span className="aruna-frame-bottom"/></div>
                <div className="aruna-person-copy"><small>THE GROOM</small><h3>{event.groomName}</h3><strong>{event.groomFullName}</strong><p>{event.groomParents}</p></div>
              </article>
            </div>
          </section>

          <section className="aruna-journey aruna-panel aruna-sand-panel" id="aruna-story">
            <div className="aruna-section-head" data-aruna-reveal><span className="aruna-kicker">Journey of Love</span><h2>Our Story</h2></div>
            <div className="aruna-timeline">
              {steps.map((step, index) => <article key={`${step}-${index}`} data-aruna-reveal><span className="aruna-timeline-index">0{index + 1}</span><div><h3>{stepTitles[index] || `Chapter ${index + 1}`}</h3><p>{step}</p></div></article>)}
            </div>
          </section>

          <section className="aruna-save-date aruna-photo-panel" id="aruna-event">
            <div className="aruna-photo-bg"><EditedImage url={photos[2]?.url || hero} edit={photos[2]?.edit || event.heroEdit} alt="Save the date"/></div>
            <div className="aruna-photo-shade"/>
            <div className="aruna-save-content" data-aruna-reveal><span className="aruna-script">Save the Date</span><h2>{formattedDate}</h2><Countdown date={event.eventDate}/><button className="aruna-btn aruna-btn-light"><CalendarDays size={15}/> INGATKAN ACARA</button></div>
          </section>

          <section className="aruna-events aruna-panel aruna-paper-panel">
            <BotanicalCorner side="left"/>
            <div className="aruna-section-head" data-aruna-reveal><span className="aruna-kicker">Wedding Event</span><h2>Rangkaian Hari Bahagia</h2></div>
            <div className="aruna-event-grid">
              <article data-aruna-reveal><span className="aruna-event-no">01</span><Heart size={22}/><h3>Akad</h3><b>{formattedDate}</b><p><Clock3 size={14}/>{event.akadTime}</p><p><MapPin size={14}/>{event.venueName}</p><small>{event.venueAddress}</small><a href={event.mapUrl} target="_blank" rel="noreferrer"><Navigation2 size={14}/> LIHAT LOKASI</a></article>
              <article data-aruna-reveal><span className="aruna-event-no">02</span><Sparkles size={22}/><h3>Resepsi</h3><b>{formattedDate}</b><p><Clock3 size={14}/>{event.receptionTime}</p><p><MapPin size={14}/>{event.venueName}</p><small>{event.venueAddress}</small><a href={event.mapUrl} target="_blank" rel="noreferrer"><Navigation2 size={14}/> LIHAT LOKASI</a></article>
            </div>
          </section>

          <section className="aruna-dresscode aruna-panel aruna-olive-panel">
            <div className="aruna-section-head light" data-aruna-reveal><span className="aruna-kicker">a Guide to Dresscodes</span><h2>Heritage Palette</h2><p>Kami dengan hormat menganjurkan tamu mengenakan warna yang selaras dengan suasana hari istimewa kami.</p></div>
            <div className="aruna-swatches" data-aruna-reveal><i/><i/><i/><i/><i/></div>
          </section>

          <section className="aruna-access aruna-panel aruna-sand-panel" id="aruna-access">
            <div className="aruna-ticket" data-aruna-reveal>
              <div className="aruna-ticket-head"><span>KARTU AKSES MASUK</span><h2>{event.brideName} & {event.groomName}</h2></div>
              <div className="aruna-ticket-body"><div className="aruna-ticket-info"><small>Tempat Acara</small><strong>{event.venueName}</strong><small>Tanggal Acara</small><strong>{formattedDate}</strong><span>REGULER</span></div><div className="aruna-ticket-code"><PseudoQr seed={`${guestName}-${event.slug}`}/><small>QR Check-in</small></div></div>
              <div className="aruna-ticket-recipient"><span>Kepada Yth.</span><strong>{guestName}</strong></div>
              <p>Silakan tunjukkan QR ini kepada penerima tamu di lokasi acara.</p>
            </div>
            <button className="aruna-btn aruna-btn-dark" data-aruna-reveal><Download size={15}/> DOWNLOAD KARTU AKSES</button>
          </section>

          <section className="aruna-live aruna-panel aruna-paper-panel">
            <div className="aruna-section-head" data-aruna-reveal><span className="aruna-kicker">Live Streaming</span><h2>Ikuti Momen Kami</h2><p>Kami menyiapkan ruang virtual untuk keluarga dan sahabat yang berhalangan hadir secara langsung.</p></div>
            <div className="aruna-live-card" data-aruna-reveal><Video size={28}/><div><strong>{formattedDate}</strong><span>{event.akadTime}</span></div><button><ExternalLink size={14}/> JOIN LIVE</button></div>
          </section>

          <section className="aruna-frame-section aruna-panel aruna-sand-panel">
            <Camera size={25}/><span className="aruna-script" data-aruna-reveal>Capture Your Moments</span><h2 data-aruna-reveal>Wedding Frame</h2><p data-aruna-reveal>Abadikan momen Anda bersama kami melalui frame digital yang telah disiapkan.</p>
            <div className="aruna-frame-preview" data-aruna-reveal><div className="aruna-frame-preview-photo"><EditedImage url={photos[3]?.url || hero} edit={photos[3]?.edit || event.heroEdit} alt="Wedding frame preview"/></div><div className="aruna-frame-preview-border"><ArunaMonogram bride={event.brideName} groom={event.groomName}/><strong>{event.brideName} & {event.groomName}</strong><small>{formattedDate}</small></div></div>
            <div className="aruna-frame-actions" data-aruna-reveal><button onClick={() => { window.location.href = `/frame/${event.slug}` }}><ExternalLink size={14}/> OPEN FRAME</button><button><Camera size={14}/> UPLOAD PHOTOS</button></div>
          </section>

          <section className="aruna-portrait aruna-panel aruna-olive-panel" id="aruna-gallery">
            <div className="aruna-section-head light" data-aruna-reveal><span className="aruna-kicker">a Portrait of</span><h2>Our Moments</h2><p>Setiap foto menyimpan potongan kecil dari perjalanan yang membawa kami sampai di hari ini.</p></div>
            <div className="aruna-gallery-strip" data-aruna-reveal>{photos.map((item, index) => <figure key={item.id}><EditedImage url={item.url} edit={item.edit} alt={item.caption || `Moment ${index + 1}`}/>{item.caption && <figcaption>{item.caption}</figcaption>}</figure>)}</div>
            <span className="aruna-swipe-hint">SWIPE TO EXPLORE →</span>
          </section>

          <section className="aruna-rsvp aruna-panel aruna-paper-panel" id="aruna-rsvp">
            <div className="aruna-section-head" data-aruna-reveal><span className="aruna-kicker">RSVP & Wishes</span><h2>Kami Menunggu Kehadiranmu</h2><p>Silakan isi formulir konfirmasi di bawah ini.</p></div>
            <div data-aruna-reveal><RsvpPanel {...props} variant="aruna-rsvp-form"/></div>
          </section>

          <section className="aruna-gift aruna-panel aruna-sand-panel" id="aruna-gift">
            <Gift size={26}/><div className="aruna-section-head" data-aruna-reveal><span className="aruna-kicker">Wedding Gift</span><h2>Tanda Kasih</h2><p>Doa restu Anda merupakan karunia yang sangat berarti. Jika memberi adalah ungkapan kasih, kami menerimanya dengan penuh syukur.</p></div>
            <div className="aruna-gift-tabs" data-aruna-reveal><button className="active">E-Amplop</button><button>Gift Registry</button></div>
            <div className="aruna-bank-card" data-aruna-reveal><small>BANK TRANSFER</small><strong>Rekening dapat diisi dari pengaturan hadiah</strong><span>Nama penerima</span><button><Copy size={14}/> SALIN</button></div>
          </section>

          <section className="aruna-closing aruna-photo-panel">
            <div className="aruna-photo-bg"><EditedImage url={photos[4]?.url || photos[0]?.url || hero} edit={photos[4]?.edit || photos[0]?.edit || event.heroEdit} alt="Closing"/></div><div className="aruna-photo-shade deep"/>
            <div className="aruna-closing-copy" data-aruna-reveal><OrnamentLine/><p>{event.closingText}</p><span>Salam hangat,</span><h2>{event.brideName}<em>&</em>{event.groomName}</h2><strong>#WeddingDay</strong></div>
          </section>
        </div>
      </div>
    </section>
  </div>
}
