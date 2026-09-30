import { useState } from 'react'
import { ExternalLink, Frame, Image as ImageIcon, LoaderCircle } from 'lucide-react'
import type { EventData, FramePreset } from '../../types'

const presets: { id: FramePreset; name: string; note: string }[] = [
  { id:'heritage', name:'Heritage', note:'Ornamen klasik dan garis emas.' },
  { id:'botanical', name:'Botanical', note:'Arch lembut dengan nuansa garden.' },
  { id:'editorial', name:'Editorial', note:'Tipografi modern dan clean.' },
]

interface Props {
  event: EventData
  onChange: (event: EventData) => void
  onOpenPublic: () => Promise<void>
}

export function FrameSettings({ event, onChange, onOpenPublic }: Props) {
  const [opening, setOpening] = useState(false)
  const openPublic = async () => {
    if (opening) return
    setOpening(true)
    try { await onOpenPublic() } finally { setOpening(false) }
  }

  return <section>
    <div className="page-heading"><div><span className="eyebrow">Client Photo Experience</span><h1>Wedding Frame</h1><p>Atur frame yang akan dipakai tamu klien. Nama, tanggal, preset, dan overlay tersimpan per undangan.</p></div><button className="primary-btn" disabled={opening} onClick={openPublic}>{opening ? <LoaderCircle className="spin" size={16}/> : <ExternalLink size={16}/>} {event.featureFrame ? 'Buka Frame Publik' : 'Aktifkan & Buka Frame'}</button></div>
    {!event.featureFrame && <div className="notice-bar">Wedding Frame belum aktif. Klik <b>Aktifkan & Buka Frame</b> dan sistem akan mengaktifkannya otomatis untuk klien ini.</div>}
    <div className="frame-admin-layout">
      <article className="panel form-card">
        <div className="form-section-title"><div><span>01</span><div><h3>Konten Frame</h3><p>Data ini tidak mengubah data utama undangan.</p></div></div></div>
        <div className="form-grid">
          <label>Nama yang tampil<input value={event.frameNames} onChange={e=>onChange({...event,frameNames:e.target.value})}/></label>
          <label>Label tanggal<input value={event.frameDateLabel} onChange={e=>onChange({...event,frameDateLabel:e.target.value})}/></label>
          <label>Overlay gelap <span className="range-inline-value">{event.frameOverlay}%</span><input type="range" min="0" max="70" value={event.frameOverlay} onChange={e=>onChange({...event,frameOverlay:Number(e.target.value)})}/></label>
        </div>
        <div className="divider"/>
        <div className="form-section-title"><div><span>02</span><div><h3>Preset Visual</h3><p>Setiap klien dapat memakai frame berbeda.</p></div></div></div>
        <div className="frame-preset-admin-grid">{presets.map(p => <button key={p.id} className={event.framePreset===p.id?'active':''} onClick={()=>onChange({...event,framePreset:p.id})}><Frame size={18}/><strong>{p.name}</strong><span>{p.note}</span></button>)}</div>
      </article>
      <article className={`frame-admin-preview frame-${event.framePreset}`} style={{backgroundImage:event.heroImage?`url(${event.heroImage})`:undefined}}><div className="frame-admin-shade" style={{background:`rgba(20,43,34,${event.frameOverlay/100})`}}/><div className="frame-admin-ornament"><ImageIcon size={22}/><small>THE WEDDING OF</small><strong>{event.frameNames}</strong><span>{event.frameDateLabel}</span></div></article>
    </div>
  </section>
}
