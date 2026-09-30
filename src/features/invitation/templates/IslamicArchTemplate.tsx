import { Heart, MapPin, MoonStar } from 'lucide-react'
import type { InvitationTemplateProps } from './shared'
import { Countdown, EditedImage, GuestRecipient, RsvpPanel } from './shared'

export function IslamicArchTemplate(props: InvitationTemplateProps) {
  const { event, guestName, opened, onOpen, formattedDate } = props
  const gallery = event.gallery
  return <div className="structural-template template-islamic-arch">
    <section className="tpl-arch-cover">
      <div className="arch-pattern" aria-hidden="true"/><div className="arch-moon"><MoonStar size={24}/></div>
      <div className="arch-portrait"><EditedImage url={event.heroImage} edit={event.heroEdit} alt={`${event.brideName} & ${event.groomName}`}/></div>
      <div className="arch-cover-copy"><span>Bismillahirrahmanirrahim</span><small>THE WEDDING OF</small><h1>{event.brideName}<i>&</i>{event.groomName}</h1><p>{formattedDate}</p><GuestRecipient guestName={guestName}/><button onClick={onOpen}><Heart size={15}/> Buka Undangan</button></div>
    </section>

    <div data-invite-body className={`structural-body ${opened ? 'visible' : ''}`}>
      <section className="arch-section blessing"><div className="arch-section-frame"><MoonStar size={22}/><span>Assalamu’alaikum Warahmatullahi Wabarakatuh</span><h2>Dengan rahmat dan ridho Allah SWT</h2><p>{event.openingText}</p></div></section>
      <section className="arch-section couple"><article><div className="arch-photo">{gallery[0] ? <EditedImage url={gallery[0].url} edit={gallery[0].edit} alt={event.brideFullName}/> : <EditedImage url={event.heroImage} edit={event.heroEdit} alt={event.brideFullName}/>}</div><span>Mempelai Wanita</span><h3>{event.brideFullName}</h3><p>{event.brideParents}</p></article><div className="arch-and">و</div><article><div className="arch-photo">{gallery[1] ? <EditedImage url={gallery[1].url} edit={gallery[1].edit} alt={event.groomFullName}/> : <EditedImage url={event.heroImage} edit={event.heroEdit} alt={event.groomFullName}/>}</div><span>Mempelai Pria</span><h3>{event.groomFullName}</h3><p>{event.groomParents}</p></article></section>
      <section className="arch-section countdown-wrap"><span>Menuju Hari Bahagia</span><h2>{formattedDate}</h2><Countdown date={event.eventDate}/></section>
      <section className="arch-section events"><header><MoonStar size={20}/><span>Rangkaian Acara</span><h2>Insya Allah akan dilaksanakan</h2></header><div><article><span>AKAD NIKAH</span><h3>{event.akadTime}</h3><strong>{formattedDate}</strong></article><article><span>RESEPSI</span><h3>{event.receptionTime}</h3><strong>{formattedDate}</strong></article></div><aside><MapPin size={19}/><h3>{event.venueName}</h3><p>{event.venueAddress}</p><a href={event.mapUrl} target="_blank" rel="noreferrer">Buka Google Maps</a></aside></section>
      <section className="arch-section story"><div className="arch-quote"><span>Our Story</span><p>{event.storyText}</p></div></section>
      <section className="arch-section gallery"><header><span>Gallery</span><h2>Jejak kasih yang kami syukuri</h2></header><div>{gallery.map((img,index)=><figure key={img.id} className={index===0?'large':''}><EditedImage url={img.url} edit={img.edit} alt={img.caption || `Gallery ${index+1}`}/></figure>)}</div></section>
      <section className="arch-section rsvp"><div><MoonStar size={20}/><span>Konfirmasi Kehadiran</span><h2>Menjadi kehormatan bagi kami apabila Anda berkenan hadir.</h2><p>{event.closingText}</p></div><RsvpPanel {...props} variant="arch-rsvp-form"/></section>
      <footer className="arch-footer"><MoonStar size={18}/><strong>{event.brideName} & {event.groomName}</strong><span>Wassalamu’alaikum Warahmatullahi Wabarakatuh</span></footer>
    </div>
  </div>
}
