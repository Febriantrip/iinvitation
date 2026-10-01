import React, { useEffect, useRef, useState } from 'react'
import { Menu, X, Search, ArrowRight } from 'lucide-react'
import { business } from '../data/siteData'

const links = [
  ['#top', 'Home'],
  ['#catalog', 'Template'],
  ['#features', 'Fitur'],
  ['#packages', 'Harga'],
  ['#about', 'Tentang'],
]

export default function Header({ search, onSearch, onShowCatalog }) {
  const base = import.meta.env.BASE_URL
  const [open, setOpen] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const inputRef = useRef(null)
  const order = `https://wa.me/${business.whatsapp}?text=${encodeURIComponent('Halo Iinvitation, saya ingin membuat undangan digital.')}`

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 25)
    window.addEventListener('scroll', update, { passive: true })
    update()
    return () => window.removeEventListener('scroll', update)
  }, [])
  useEffect(() => {
    if (showSearch) inputRef.current?.focus()
  }, [showSearch])
  useEffect(() => {
    if (!open && !showSearch) return
    const onKey = e => {
      if (e.key === 'Escape') { setOpen(false); setShowSearch(false) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, showSearch])

  return <header className={`ref-header ${scrolled ? 'is-scrolled' : ''}`}>
    <a className="ref-logo" href="#top" onClick={() => setOpen(false)} aria-label="Iinvitation, ke beranda">
      <img src={`${base}marketing/brand-reference.png`} alt="iinvitation" width="189" height="48" />
    </a>
    <nav className={`ref-nav ${open ? 'is-open' : ''}`} aria-label="Navigasi utama">
      {links.map(([href, title], i) => <a key={href} href={href} onClick={() => setOpen(false)} className={i === 0 ? 'is-home' : ''}>{title}</a>)}
      <a className="ref-nav-mobile-order" href={order} target="_blank" rel="noreferrer" onClick={() => setOpen(false)}>Buat Undangan <ArrowRight size={16}/></a>
    </nav>
    <div className="ref-header-actions">
      <button type="button" className="ref-search-trigger" aria-label="Cari template undangan" aria-expanded={showSearch} onClick={() => setShowSearch(v => !v)}>{showSearch ? <X size={17}/> : <Search size={17}/>}</button>
      <a className="ref-order" target="_blank" rel="noreferrer" href={order}>Buat Undangan <ArrowRight size={17}/></a>
      <button type="button" className="ref-menu-trigger" aria-label={open ? 'Tutup menu' : 'Buka menu'} aria-expanded={open} onClick={() => setOpen(v => !v)}>{open ? <X size={23}/> : <Menu size={23}/>}</button>
    </div>
    {showSearch && <form className="ref-search-panel" onSubmit={e => {e.preventDefault(); onShowCatalog(); setShowSearch(false)}} role="search">
      <Search size={18}/>
      <input ref={inputRef} value={search} onChange={e => onSearch(e.target.value)} placeholder="Cari template favoritmu..." aria-label="Nama atau kategori template"/>
      <button type="submit">Cari <ArrowRight size={15}/></button>
    </form>}
  </header>
}
