import React from 'react'
import { ShieldCheck, UsersRound, Send, Sparkles, ChartNoAxesColumnIncreasing } from 'lucide-react'

const features = [
  { icon: ShieldCheck, title: 'Server Stabil', description: 'Akses lancar kapan saja.', service: 'website' },
  { icon: UsersRound, title: 'Tamu Unlimited', description: 'Undang lebih banyak orang.', service: 'guestbook' },
  { icon: Send, title: 'Mudah Dibagikan', description: 'Kirim lewat WhatsApp, Instagram, atau link.', service: 'website' },
  { icon: Sparkles, title: 'Desain Estetik', description: 'Template kekinian yang selalu up to date.', service: 'website' },
  { icon: ChartNoAxesColumnIncreasing, title: 'Dashboard Praktis', description: 'Kelola tamu dan ucapan dengan mudah.', service: 'guestbook' },
]

export default function About({ onOpen }) {
  return <section className="ref-features" id="features">
    <div className="ref-features-title"><span className="ref-eyebrow">KENAPA PILIH</span><h2>iinvitation?</h2></div>
    <div className="ref-features-grid">{features.map(({ icon: Icon, title, description, service }) => <button type="button" className="ref-feature-card" key={title} onClick={() => onOpen(service)} aria-label={`${title}: ${description}. Lihat selengkapnya`}>
      <span className="ref-feature-icon"><Icon size={24} strokeWidth={1.5}/></span>
      <strong>{title}</strong><p>{description}</p>
    </button>)}</div>
  </section>
}
