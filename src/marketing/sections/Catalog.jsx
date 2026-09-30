import React, { useMemo } from 'react'
import { ArrowRight } from 'lucide-react'
import InvitationMock from '../components/InvitationMock'
import { catalog } from '../data/siteData'

const highlights = [
  { label: 'Heritage', image: 'heritage', themeId: 'heritage-aruna' },
  { label: 'Floral', image: 'floral', themeId: 'premium-flara-10' },
  { label: 'Moody', image: 'moody', themeId: 'moody-wave' },
  { label: 'Signature', image: 'signature', themeId: 'premium-ivanna-09' },
  { label: 'Minimal', image: 'minimal', themeId: 'premium-alyssa-04' },
  { label: 'Modern', image: 'modern', themeId: 'sculpted-arch' },
]

export default function Catalog({ onPreview, search, showAll, onShowAll }) {
  const cards = useMemo(() => {
    const featured = highlights.map(item => ({ ...item, design: catalog.find(d => d.id === item.themeId) || catalog[0] }))
    if (!showAll && !search.trim()) return featured
    const extra = catalog.filter(item => !highlights.some(card => card.themeId === item.id)).map(design => ({ label: design.name, design }))
    const all = [...featured, ...extra]
    const term = search.trim().toLocaleLowerCase('id')
    return term ? all.filter(item => [item.label, item.design.name, item.design.series, item.design.category].some(value => value.toLocaleLowerCase('id').includes(term))) : all
  }, [search, showAll])

  return <section className="ref-catalog" id="catalog">
    <div className="ref-catalog-heading"><span className="ref-eyebrow">TEMPLATE PILIHAN</span><h2>Pilih Desain<br/>Favoritmu.</h2><p>Berbagai tema desain yang terinspirasi dari kisah cinta nyata, untuk hari istimewamu.</p><button type="button" className="ref-pill ref-pill-outline ref-see-all" onClick={onShowAll}>{showAll ? 'Semua Template' : 'Lihat Semua Template'} <ArrowRight size={15}/></button></div>
    <div className="ref-catalog-grid">
      {cards.map(item => <article className="ref-template-card" key={item.design.id}>
        <button className="ref-template-visual" type="button" onClick={() => onPreview(item.design)} aria-label={`Lihat template ${item.label}`}>
          {item.image ? <img src={`/marketing/template-${item.image}.webp`} alt={`Contoh visual template ${item.label}`} loading="lazy"/> : <InvitationMock design={item.design} compact />}
        </button>
        <h3>{item.label}</h3>
        <button className="ref-template-button" type="button" onClick={() => onPreview(item.design)}>Lihat Template <ArrowRight size={14}/></button>
      </article>)}
      {cards.length === 0 && <p className="ref-no-results">Belum ada template yang cocok. Coba kata kunci lain, ya.</p>}
    </div>
  </section>
}
