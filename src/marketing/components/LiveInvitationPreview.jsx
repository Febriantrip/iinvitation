import React, { useMemo, useRef, useState } from 'react'

const sample = {
  guest: 'Bapak/Ibu/Saudara/i',
  bride: 'Alya',
  brideFull: 'Alya Maharani',
  groom: 'Raka',
  groomFull: 'Raka Wijaya',
  date: '12.12.2026',
}

const toneMap = {
  sand: ['#cdb58c','#253a30','#f4ead7'],
  sage: ['#859a83','#18352b','#edf0e7'],
  ivory: ['#d9c39b','#43594e','#f8f3e8'],
  paper: ['#e8e0cf','#1f2925','#fbf8ef'],
  night: ['#171a18','#c9ac73','#e9e1d2'],
  pink: ['#d7a5a8','#6e4c50','#fbefea'],
  white: ['#e9e7df','#202d28','#ffffff'],
  cream: ['#cfbd96','#344137','#f3ead7'],
  mint: ['#aec6b7','#294137','#eef4ef'],
  stone: ['#a49b8f','#2f3732','#f1ede6'],
  green: ['#617d6a','#e7d6ac','#edf0e7'],
  black: ['#151714','#c5a467','#eee6d8'],
}

export default function LiveInvitationPreview({ design }) {
  const [opened, setOpened] = useState(false)
  const [musicOn, setMusicOn] = useState(false)
  const [rsvpDone, setRsvpDone] = useState(false)
  const scroller = useRef(null)
  const [accent, dark, paper] = toneMap[design.tone] || toneMap.ivory

  const styleVars = useMemo(() => ({
    '--demo-accent': accent,
    '--demo-dark': dark,
    '--demo-paper': paper,
  }), [accent, dark, paper])

  const go = id => {
    const root = scroller.current
    const el = root?.querySelector(`[data-demo-section="${id}"]`)
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return <div className={`live-invite live-layout-${design.layout} live-tone-${design.tone} live-design-${design.id} ${opened ? 'is-opened' : ''}`} style={styleVars}>
    {!opened ? <div className="live-cover">
      <div className="live-cover-border" />
      <div className="live-cover-visual"><span>I</span><i>&</i><span>D</span></div>
      <div className="live-cover-copy">
        <small>THE WEDDING OF</small>
        <h2>{sample.bride} <em>&</em> {sample.groom}</h2>
        <p>{sample.date}</p>
        <div className="live-guest"><span>Kepada Yth.</span><strong>{sample.guest}</strong></div>
        <button onClick={() => { setOpened(true); setMusicOn(true) }}>Buka Undangan <span>↓</span></button>
      </div>
      <div className="live-cover-series">{design.series} SERIES · {design.name}</div>
    </div> : <>
      <div className="live-demo-scroll" ref={scroller}>
        <section className="live-hero" data-demo-section="home">
          <div className="live-hero-art"><span>I</span><b>&</b><span>D</span></div>
          <div className="live-hero-text"><small>WE ARE GETTING MARRIED</small><h2>{sample.bride}<i>&</i>{sample.groom}</h2><p>{sample.date}</p></div>
        </section>

        <section className="live-quote live-section">
          <span className="live-section-no">01</span>
          <p>“Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan untukmu, agar kamu merasa tenteram kepadanya.”</p>
          <small>AR-RUM · 21</small>
        </section>

        <section className="live-couple live-section" data-demo-section="couple">
          <div className="live-section-title"><small>THE BRIDE & GROOM</small><h3>Two souls,<br/><em>one story.</em></h3></div>
          <div className="live-couple-grid">
            <article><div className="live-portrait bride"><span>01</span></div><small>THE BRIDE</small><h4>{sample.brideFull}</h4><p>Putri dari Bapak & Ibu</p><a href="#" onClick={e=>e.preventDefault()}>@alya ↗</a></article>
            <article><div className="live-portrait groom"><span>02</span></div><small>THE GROOM</small><h4>{sample.groomFull}</h4><p>Putra dari Bapak & Ibu</p><a href="#" onClick={e=>e.preventDefault()}>@raka ↗</a></article>
          </div>
        </section>

        <section className="live-date live-section" data-demo-section="event">
          <div className="live-section-title light"><small>SAVE THE DATE</small><h3>Sunday,<br/><em>12 December 2026</em></h3></div>
          <div className="live-countdown"><div><strong>93</strong><span>Days</span></div><div><strong>08</strong><span>Hours</span></div><div><strong>24</strong><span>Minutes</span></div><div><strong>16</strong><span>Seconds</span></div></div>
        </section>

        <section className="live-events live-section">
          <div className="live-section-title"><small>OUR SPECIAL DAY</small><h3>Wedding<br/><em>schedule.</em></h3></div>
          <div className="live-event-grid">
            <article><span>01</span><small>AKAD NIKAH</small><h4>09.00 WIB</h4><p>Minggu, 12 Desember 2026</p><p>Grand Ballroom Iinvitation<br/>Jakarta, Indonesia</p><button>Google Maps ↗</button></article>
            <article><span>02</span><small>RESEPSI</small><h4>11.00 WIB</h4><p>Minggu, 12 Desember 2026</p><p>Grand Ballroom Iinvitation<br/>Jakarta, Indonesia</p><button>Google Maps ↗</button></article>
          </div>
        </section>

        <section className="live-story live-section" data-demo-section="story">
          <div className="live-section-title"><small>JOURNEY OF LOVE</small><h3>Our little<br/><em>timeline.</em></h3></div>
          <div className="live-story-list">
            <article><span>2023</span><div><h4>First Hello</h4><p>Sebuah pertemuan sederhana menjadi awal dari cerita yang tidak kami rencanakan.</p></div></article>
            <article><span>2025</span><div><h4>The Promise</h4><p>Kami memilih berjalan ke arah yang sama dan membawa dua keluarga menjadi lebih dekat.</p></div></article>
            <article><span>2026</span><div><h4>Forever Starts</h4><p>Di hari ini, kami mengundang orang-orang terkasih untuk menjadi bagian dari langkah baru kami.</p></div></article>
          </div>
        </section>

        <section className="live-gallery live-section" data-demo-section="gallery">
          <div className="live-section-title"><small>OUR GALLERY</small><h3>Pieces of<br/><em>us.</em></h3></div>
          <div className="live-gallery-grid">{Array.from({length:7},(_,i)=><div key={i} className={`g${i+1}`}><span>{String(i+1).padStart(2,'0')}</span></div>)}</div>
        </section>

        <section className="live-gift live-section" data-demo-section="gift">
          <div className="live-section-title"><small>WEDDING GIFT</small><h3>Your prayer is<br/><em>our greatest gift.</em></h3></div>
          <p>Tanpa mengurangi rasa hormat, bagi keluarga dan sahabat yang ingin memberikan tanda kasih.</p>
          <div className="live-bank-card"><small>BANK BCA</small><strong>0000 0000 0000</strong><span>a.n. Alya Maharani</span><button onClick={() => navigator.clipboard?.writeText('000000000000')}>Salin nomor rekening</button></div>
        </section>

        <section className="live-rsvp live-section" data-demo-section="rsvp">
          <div className="live-section-title light"><small>RSVP & WISHES</small><h3>Will you<br/><em>join us?</em></h3></div>
          {!rsvpDone ? <form onSubmit={e=>{e.preventDefault();setRsvpDone(true)}}>
            <input placeholder="Nama kamu" defaultValue="Tamu Demo 01" />
            <select defaultValue="hadir"><option value="hadir">Ya, saya akan hadir</option><option value="tidak">Maaf, tidak dapat hadir</option></select>
            <textarea placeholder="Tulis ucapan untuk kedua mempelai..." rows="4" />
            <button type="submit">Kirim RSVP</button>
          </form> : <div className="live-rsvp-success"><strong>Terima kasih ♡</strong><p>Konfirmasi dan ucapanmu sudah masuk ke dashboard pasangan.</p><button onClick={()=>setRsvpDone(false)}>Isi ulang demo</button></div>}
        </section>

        <section className="live-closing live-section">
          <small>THANK YOU</small><h3>{sample.bride} <em>&</em> {sample.groom}</h3><p>Merupakan kehormatan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.</p><span>IINVITATION · DIGITAL WEDDING EXPERIENCE</span>
        </section>
      </div>

      <button className={`live-music ${musicOn?'playing':''}`} onClick={()=>setMusicOn(v=>!v)} aria-label="Toggle music"><span>{musicOn?'♫':'♪'}</span><b>{musicOn?'ON':'OFF'}</b></button>
      <nav className="live-nav" aria-label="Navigasi demo undangan">
        <button onClick={()=>go('home')}>⌂<span>Home</span></button>
        <button onClick={()=>go('couple')}>♡<span>Couple</span></button>
        <button onClick={()=>go('event')}>◷<span>Event</span></button>
        <button onClick={()=>go('gallery')}>▦<span>Gallery</span></button>
        <button onClick={()=>go('rsvp')}>✉<span>RSVP</span></button>
      </nav>
    </>}
  </div>
}
