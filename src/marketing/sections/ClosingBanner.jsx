import React from 'react'
import { ArrowRight } from 'lucide-react'
import { business } from '../data/siteData'

export default function ClosingBanner() {
  const order = `https://wa.me/${business.whatsapp}?text=${encodeURIComponent('Halo Iinvitation, saya ingin membuat undangan digital.')}`
  return <section className="ref-cta" aria-label="Mulai membuat undangan">
    <div className="ref-cta-content"><h2>Siap Membagikan<br/>Kisah Cinta Kalian?</h2><p>Buat undangan digital yang simple, cantik,<br/>dan tak terlupakan bersama iinvitation.</p><a href={order} target="_blank" rel="noreferrer">Mulai Sekarang <ArrowRight size={15}/></a></div>
  </section>
}
