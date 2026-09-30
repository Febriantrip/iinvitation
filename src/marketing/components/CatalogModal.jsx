import React, { useEffect, useState } from 'react'
import LiveInvitationPreview from './LiveInvitationPreview'
import { ArrowUpRight, CloseIcon } from './Icons'
import { business } from '../data/siteData'

export default function CatalogModal({design, onClose}){
  const [device,setDevice]=useState('mobile')
  useEffect(()=>{
    if(!design) return
    setDevice('mobile')
    const onKey = e => e.key === 'Escape' && onClose()
    document.body.classList.add('modal-open')
    window.addEventListener('keydown', onKey)
    return ()=>{document.body.classList.remove('modal-open'); window.removeEventListener('keydown', onKey)}
  },[design,onClose])
  if(!design) return null
  const msg = encodeURIComponent(`Halo Iinvitation, saya tertarik dengan desain ${design.name} (${design.series}). Bisa info lebih lanjut?`)
  return <div className="modal-backdrop live-preview-backdrop" onMouseDown={e=>e.target===e.currentTarget && onClose()}>
    <div className="live-preview-modal" role="dialog" aria-modal="true" aria-label={`Live preview ${design.name}`}>
      <header className="live-preview-toolbar">
        <div className="live-preview-title"><small>LIVE INVITATION PREVIEW</small><strong>{design.name}</strong><span>{design.series} Series</span></div>
        <div className="device-switch" aria-label="Ukuran preview">
          <button className={device==='mobile'?'active':''} onClick={()=>setDevice('mobile')}><span>▯</span> Mobile</button>
          <button className={device==='desktop'?'active':''} onClick={()=>setDevice('desktop')}><span>▭</span> Desktop</button>
        </div>
        <div className="live-preview-actions">
          <div className="toolbar-price"><strong>{design.price}</strong><del>{design.old}</del></div>
          <a target="_blank" rel="noreferrer" href={`https://wa.me/${business.whatsapp}?text=${msg}`}>Order desain <ArrowUpRight size={16}/></a>
          <button className="live-preview-close" onClick={onClose} aria-label="Tutup preview"><CloseIcon /></button>
        </div>
      </header>
      <div className={`live-device-stage device-${device}`}>
        <div className="live-device-shell">
          <div className="device-browser-bar"><i/><i/><i/><span>preview.iinvitation.id/{design.id}</span></div>
          <LiveInvitationPreview key={`${design.id}-${device}`} design={design}/>
        </div>
        <aside className="preview-hint"><span>INTERACTIVE DEMO</span><p>Klik <b>Buka Undangan</b>, scroll seluruh section, coba navigasi bawah, music toggle, dan kirim RSVP demo.</p></aside>
      </div>
    </div>
  </div>
}
