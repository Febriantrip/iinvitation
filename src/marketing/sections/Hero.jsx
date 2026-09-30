import React from 'react'
import { ArrowRight, Play } from 'lucide-react'
import { business, catalog } from '../data/siteData'

const avatars = [1, 2, 3, 4]
export default function Hero({ onPreview }) {
  return <section className="ref-hero" id="top" aria-label="Undangan digital Iinvitation">
    <div className="ref-hero-copy">
      <span className="ref-eyebrow">LEBIH DARI SEKEDAR UNDANGAN</span>
      <h1>Undangan digital<br/>yang simple, cantik,<br/>dan <em>terasa dekat.</em></h1>
      <p>Rayakan kisah cinta kalian dengan undangan digital modern yang mudah, berkesan, dan penuh makna.</p>
      <div className="ref-hero-actions">
        <a href={`https://wa.me/${business.whatsapp}?text=${encodeURIComponent('Halo Iinvitation, saya ingin membuat undangan digital.')}`} target="_blank" rel="noreferrer" className="ref-pill ref-pill-dark">Buat Undangan <ArrowRight size={17}/></a>
        <button className="ref-pill ref-pill-outline" type="button" onClick={() => onPreview(catalog.find(d => d.id === 'heritage-aruna') || catalog[0])}><span className="ref-play"><Play size={13} fill="currentColor"/></span>Lihat Template</button>
      </div>
      <div className="ref-social-proof">
        <div className="ref-avatars" aria-hidden="true">{avatars.map(id => <img key={id} src={`/marketing/avatar-${id}.png`} alt="" width="34" height="34" />)}</div>
        <div className="ref-proof-copy"><span>Dipercaya oleh 10.000+ pasangan</span><div><span className="ref-stars" aria-label="5 bintang">★★★★★</span><b>4.9/5</b></div></div>
      </div>
    </div>
    <img className="ref-hero-art" src="/marketing/hero-art.webp" alt="Pasangan pengantin di alam terbuka dengan ilustrasi kartu Iinvitation" fetchPriority="high" width="603" height="426" />
  </section>
}
