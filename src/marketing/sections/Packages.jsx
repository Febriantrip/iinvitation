import React from 'react'
import { ArrowRight, Check, Music2, Camera, Palette, Globe2 } from 'lucide-react'
import { business } from '../data/siteData'

const offers = [
  { name: 'Heritage', subtitle: 'Elegan dan timeless.', price: 'Rp 149.000', popular: true, features: ['Desain eksklusif', 'Filter cerita cinta', 'Galeri foto & video', 'RSVP & ucapan tamu', 'Link nama custom'] },
  { name: 'Premium', subtitle: 'Lebih lengkap, lebih berkesan.', price: 'Rp 249.000', features: ['Semua fitur Heritage', 'Countdown acara', 'Lokasi dengan Google Maps', 'Buku tamu digital', 'Musik latar'] },
  { name: 'Moody', subtitle: 'Modern dan penuh karakter.', price: 'Rp 349.000', features: ['Semua fitur Premium', 'Desain editorial premium', 'Domain custom (opsional)', 'Analytics tamu', 'Dukungan prioritas'] },
]
const extras = [
  { icon: Music2, name: 'Musik Latar', price: 'Rp 25.000' },
  { icon: Camera, name: 'Galeri Video', price: 'Rp 25.000' },
  { icon: Palette, name: 'Custom Warna', price: 'Rp 25.000' },
  { icon: Globe2, name: 'Domain Custom', price: 'Rp 50.000' },
]
export default function Packages() {
  const order = packageName => `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(`Halo Iinvitation, saya tertarik paket ${packageName}. Bisa info lebih lanjut?`)}`
  return <section className="ref-pricing" id="packages">
    <div className="ref-pricing-intro"><span className="ref-eyebrow">FITUR &amp; PAKET</span><h2>Paket yang<br/>Sesuai Dengan<br/>Kebutuhanmu.</h2><p>Pilih paket terbaik dan mulai buat undangan impianmu hari ini.</p><a href="#package-comparison" className="ref-compare">Lihat Perbandingan Paket <ArrowRight size={14}/></a></div>
    <div className="ref-pricing-grid" id="package-comparison">{offers.map(offer => <article key={offer.name} className="ref-pricing-card">
      <div className="ref-pricing-title"><h3>{offer.name}</h3>{offer.popular && <span>POPULER</span>}</div>
      <p className="ref-pricing-subtitle">{offer.subtitle}</p>
      <ul>{offer.features.map(feature => <li key={feature}><Check size={15} strokeWidth={1.75}/><span>{feature}</span></li>)}</ul>
      <div className="ref-pricing-bottom"><div><small>Mulai dari</small><strong>{offer.price}</strong></div><a href={order(offer.name)} target="_blank" rel="noreferrer" aria-label={`Pilih paket ${offer.name}`}><ArrowRight size={18}/></a></div>
    </article>)}</div>
    <div className="ref-addons"><span className="ref-eyebrow">TAMBAH LEBIH SPESIAL</span><h2>Fitur Tambahan</h2><p>Lengkapi undanganmu dengan fitur pilihan berikut.</p><div className="ref-addon-list">{extras.map(({icon:Icon,name,price}) => <a href={order(`fitur ${name}`)} target="_blank" rel="noreferrer" className="ref-addon" key={name}><Icon size={16}/><span>{name}</span><small>{price}</small></a>)}</div></div>
  </section>
}
