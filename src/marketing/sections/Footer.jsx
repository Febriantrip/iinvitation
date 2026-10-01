import React from 'react'
import { business } from '../data/siteData'

const InstagramGlyph = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
const YoutubeGlyph = () => <svg width="19" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M21.6 7.1c-.2-1.1-1-1.9-2.1-2.1C17.7 4.5 12 4.5 12 4.5s-5.7 0-7.5.5C3.4 5.2 2.6 6 2.4 7.1 2 8.9 2 12s.4 4.9.4 4.9c.2 1.1 1 1.9 2.1 2.1 1.8.5 7.5.5 7.5.5s5.7 0 7.5-.5c1.1-.2 1.9-1 2.1-2.1 0 0 .4-1.8.4-4.9s-.4-4.9-.4-4.9ZM10 15.5v-7l6 3.5-6 3.5Z"/></svg>
export default function Footer() {
  const base = import.meta.env.BASE_URL
  const wa = `https://wa.me/${business.whatsapp}?text=${encodeURIComponent('Halo Iinvitation, saya ingin bertanya tentang undangan digital.')}`
  return <footer className="ref-footer" id="about">
    <a className="ref-footer-logo" href="#top"><img src={`${base}marketing/brand-reference.png`} alt="iinvitation" width="120" height="30"/><span>Good People, Beautiful Days</span></a>
    <nav aria-label="Navigasi footer"><a href="#top">Home</a><a href="#catalog">Template</a><a href="#features">Fitur</a><a href="#packages">Harga</a><a href="#about">Tentang</a></nav>
    <div className="ref-footer-end"><div className="ref-socials"><a href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram"><InstagramGlyph/></a><a href="https://www.tiktok.com/" target="_blank" rel="noreferrer" aria-label="TikTok" className="ref-tiktok">♪</a><a href="https://www.youtube.com/" target="_blank" rel="noreferrer" aria-label="YouTube"><YoutubeGlyph/></a></div><span className="ref-copyright">© 2026 iinvitation. All rights reserved.</span></div>
  </footer>
}
