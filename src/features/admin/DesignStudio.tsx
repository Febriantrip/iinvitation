import { useMemo, useState } from 'react'
import { Check, Eye, Globe2, LayoutTemplate, Move, Palette, Search, Sparkles } from 'lucide-react'
import type { EventData } from '../../types'
import { getTheme, themeCategories, themes } from '../../lib/themes'
import { ThemeMiniPreview } from '../../components/ThemeMiniPreview'
import { TemplateEditor } from './TemplateEditor'

const WEBSITE_FILTER = 'Katalog Website'

export function DesignStudio({ event, onChange }: { event: EventData; onChange: (event: EventData) => void }) {
  const current = getTheme(event.themeId)
  const [category, setCategory] = useState<string>(WEBSITE_FILTER)
  const [query, setQuery] = useState('')
  const [editorOpen, setEditorOpen] = useState(false)

  const websiteCount = useMemo(() => themes.filter(theme => theme.catalog).length, [])
  const filteredThemes = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return themes.filter(theme => {
      if (category === WEBSITE_FILTER && !theme.catalog) return false
      if (category !== 'Semua' && category !== WEBSITE_FILTER && theme.category !== category) return false
      if (!needle) return true
      const haystack = [
        theme.name,
        theme.category,
        theme.description,
        ...(theme.keywords || []),
        theme.catalog?.series,
        theme.catalog?.category,
      ].filter(Boolean).join(' ').toLowerCase()
      return haystack.includes(needle)
    })
  }, [category, query])

  const preview = (themeId: string) => window.open(
    `/invite/${encodeURIComponent(event.slug)}?preview=${encodeURIComponent(event.previewToken)}&to=${encodeURIComponent('Bapak/Ibu/Saudara/i')}&theme=${encodeURIComponent(themeId)}`,
    '_blank',
    'noopener,noreferrer',
  )

  return <section>
    <div className="page-heading">
      <div>
        <span className="eyebrow">Design Library</span>
        <h1>Pilih Desain Undangan</h1>
        <p>Katalog website dan Design Studio sekarang memakai sumber desain yang sama. Desain berlabel <strong>Katalog Web</strong> adalah desain yang persis ditawarkan di website Iinvitation dan dapat langsung dipakai untuk klien.</p>
      </div>
      <div className="design-heading-actions">
        <button className="design-editor-launch" onClick={() => setEditorOpen(true)}><Move size={15}/> Edit Font & Posisi</button>
        <div className="current-theme-chip"><Palette size={16}/><span>Desain aktif</span><strong>{current.name}</strong></div>
      </div>
    </div>

    <div className="catalog-sync-banner panel">
      <Globe2 size={18}/>
      <div><strong>Katalog tersinkron</strong><span>{websiteCount} desain dari website tersedia langsung di admin. Tambah katalog berikutnya cukup dari satu sumber data.</span></div>
    </div>

    <div className="theme-toolbar panel">
      <div className="theme-search"><Search size={16}/><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Cari desain: Aruna, garden, gold, formal, muslim..."/></div>
      <div className="theme-category-list">
        {[WEBSITE_FILTER, 'Semua', ...themeCategories].map(item => <button key={item} className={category === item ? 'active' : ''} onClick={() => setCategory(item)}>{item}</button>)}
      </div>
      <div className="theme-result-count"><Sparkles size={14}/><span>{filteredThemes.length} desain</span></div>
    </div>

    {filteredThemes.length ? <div className="theme-grid">
      {filteredThemes.map(theme => {
        const selected = theme.id === event.themeId
        return <article className={`theme-card ${selected ? 'selected' : ''}`} key={theme.id}>
          <ThemeMiniPreview theme={theme} event={event}/>
          <div className="theme-card-body">
            <div className="theme-title-row">
              <div><span>{theme.catalog?.series || theme.category}</span><h3>{theme.name}</h3></div>
              <div className="theme-status-stack">
                {theme.catalog && <span className="theme-web-chip"><Globe2 size={10}/> Katalog Web</span>}
                {theme.layout && theme.layout !== 'classic-flow' && <span className="theme-structure-chip">Layout unik</span>}
                {selected && <span className="theme-selected"><Check size={13}/> Dipakai</span>}
              </div>
            </div>
            <p>{theme.description}</p>
            {theme.catalog && <div className="theme-commerce-row">
              <span>{theme.catalog.category}</span>
              {theme.catalog.badge && <b>{theme.catalog.badge}</b>}
              <strong>{theme.catalog.price}</strong>
              <del>{theme.catalog.oldPrice}</del>
            </div>}
            <div className="theme-palette">{theme.palette.map(color => <i key={color} style={{ background: color }}/>)}</div>
            <div className="theme-actions">
              <button className="secondary-btn" onClick={() => preview(theme.id)}><Eye size={15}/> Preview</button>
              <button className={selected ? 'ghost-btn theme-use disabled-choice' : 'primary-btn theme-use'} disabled={selected} onClick={() => onChange({ ...event, themeId: theme.id })}>
                <LayoutTemplate size={15}/>{selected ? 'Desain Aktif' : 'Gunakan Desain'}
              </button>
            </div>
          </div>
        </article>
      })}
    </div> : <div className="panel theme-empty"><Search size={24}/><strong>Desain tidak ditemukan</strong><span>Coba kategori atau kata kunci lain.</span></div>}

    <div className="design-note panel"><LayoutTemplate size={20}/><div><strong>Satu sumber desain</strong><span>Website tidak lagi mempunyai daftar katalog terpisah dari admin. Metadata katalog menempel pada theme renderer yang sama, sehingga nama, ID desain, harga, series, dan ketersediaannya tidak drift lagi.</span></div></div>
    {editorOpen && <TemplateEditor event={event} onChange={onChange} onClose={() => setEditorOpen(false)}/>} 
  </section>
}
