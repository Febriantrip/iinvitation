import React from 'react'
import { ArrowUpRight, HeartIcon, MessageIcon } from '../components/Icons'

const services=[
  {id:'website',no:'01',title:'Wedding Website',text:'Undangan digital lengkap dengan personalized guest, acara, galeri, RSVP, gift, dan musik.',symbol:'WWW'},
  {id:'guestbook',no:'02',title:'Digital Guestbook',text:'Check-in tamu berbasis QR untuk membantu pencatatan kehadiran di hari acara.',symbol:'QR'},
  {id:'frame',no:'03',title:'Wedding Frame',text:'Frame digital untuk photo booth, story, dan konten tamu agar visual acara lebih konsisten.',symbol:'FRAME'},
]
export default function Services({onOpen}){return <section className="services section-dark" id="services">
  <div className="services-head"><div className="section-kicker light">04 / SERVICES</div><h2>More than an<br/><em>invitation link.</em></h2></div>
  <div className="service-list">{services.map(s=><button type="button" className="service-row" key={s.no} onClick={()=>onOpen?.(s.id)}><span className="service-no">{s.no}</span><span className="service-symbol">{s.symbol}</span><span className="service-copy"><strong>{s.title}</strong><small>{s.text}</small></span><span className="service-arrow"><ArrowUpRight size={25}/></span></button>)}</div>
  <div className="service-note"><HeartIcon/><span>Built for the day before, the day itself, and the memories after.</span><MessageIcon/></div>
</section>}
