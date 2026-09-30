import React, { useEffect } from 'react'
import { CloseIcon } from './Icons'
import LiveInvitationPreview from './LiveInvitationPreview'
import DigitalGuestbookDemo from './DigitalGuestbookDemo'
import WeddingFrameStudio from './WeddingFrameStudio'
import { catalog } from '../data/siteData'

const meta={
  website:{eyebrow:'01 / WEDDING WEBSITE',title:'Try the invitation experience.',desc:'Buka cover, scroll section, coba navigasi, music toggle, dan RSVP seperti calon tamu.'},
  guestbook:{eyebrow:'02 / DIGITAL GUESTBOOK',title:'Guest check-in, made simple.',desc:'Demo frontend untuk alur check-in QR, pencarian tamu, status kehadiran, dan export data.'},
  frame:{eyebrow:'03 / WEDDING FRAME',title:'Create, frame, and share.',desc:'Studio frame digital yang bisa memakai foto pengunjung sendiri dan diexport sebagai PNG.'}
}

export default function ServiceExperienceModal({service,onClose}){
  useEffect(()=>{
    if(!service)return
    const key=e=>e.key==='Escape'&&onClose(); document.body.classList.add('modal-open'); window.addEventListener('keydown',key)
    return()=>{document.body.classList.remove('modal-open');window.removeEventListener('keydown',key)}
  },[service,onClose])
  if(!service)return null
  const m=meta[service]
  return <div className="service-modal-backdrop" onMouseDown={e=>e.target===e.currentTarget&&onClose()}>
    <div className={`service-modal service-modal-${service}`} role="dialog" aria-modal="true">
      <header className="service-modal-head"><div><small>{m.eyebrow}</small><h2>{m.title}</h2><p>{m.desc}</p></div><button onClick={onClose} aria-label="Tutup"><CloseIcon size={24}/></button></header>
      <div className="service-modal-body">
        {service==='website'&&<div className="service-website-demo"><div className="service-phone-shell"><LiveInvitationPreview design={catalog[0]}/></div><aside><span>INTERACTIVE</span><h3>Ini bukan screenshot.</h3><p>Tekan <b>Buka Undangan</b> lalu eksplor seluruh flow undangan. Demo menggunakan desain Aruna sebagai contoh.</p><ul><li>Personalized cover</li><li>Acara & countdown</li><li>Love story & gallery</li><li>Gift, RSVP & wishes</li><li>Music & floating navigation</li></ul></aside></div>}
        {service==='guestbook'&&<DigitalGuestbookDemo/>}
        {service==='frame'&&<WeddingFrameStudio/>}
      </div>
    </div>
  </div>
}
