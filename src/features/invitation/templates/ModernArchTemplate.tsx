import { ArrowUpRight, Heart, MapPin } from 'lucide-react'
import type { InvitationTemplateProps } from './shared'
import { Countdown, EditedImage, GuestRecipient, RsvpPanel } from './shared'

export function ModernArchTemplate(props: InvitationTemplateProps) {
  const { event, guestName, opened, onOpen, formattedDate } = props
  return <div className="structural-template template-modern-arch">
    <section className="tpl-modern-cover">
      <div className="modern-cover-copy"><span>THE WEDDING OF</span><h1>{event.brideName}<i>&</i>{event.groomName}</h1><p>{formattedDate}</p><GuestRecipient guestName={guestName}/><button onClick={onOpen}><Heart size={15}/> Enter</button></div>
      <div className="modern-arch-photo"><EditedImage url={event.heroImage} edit={event.heroEdit} alt={`${event.brideName} & ${event.groomName}`}/></div>
      <div className="modern-side-label">01 · FOREVER STARTS HERE</div>
    </section>

    <div data-invite-body className={`structural-body ${opened ? 'visible' : ''}`}>
      <section className="modern-section intro"><span>01</span><div><h2>We found home<br/>in each other.</h2><p>{event.openingText}</p></div></section>
      <section className="modern-section couple"><div className="modern-couple-photo">{event.gallery[0] ? <EditedImage url={event.gallery[0].url} edit={event.gallery[0].edit} alt={event.brideFullName}/> : <EditedImage url={event.heroImage} edit={event.heroEdit} alt={event.brideFullName}/>}</div><article><span>THE BRIDE</span><h3>{event.brideFullName}</h3><p>{event.brideParents}</p><i>&</i><span>THE GROOM</span><h3>{event.groomFullName}</h3><p>{event.groomParents}</p></article><div className="modern-couple-photo second">{event.gallery[1] ? <EditedImage url={event.gallery[1].url} edit={event.gallery[1].edit} alt={event.groomFullName}/> : <EditedImage url={event.heroImage} edit={event.heroEdit} alt={event.groomFullName}/>}</div></section>
      <section className="modern-section date"><header><span>02</span><h2>Save the date.</h2></header><div><strong>{formattedDate}</strong><Countdown date={event.eventDate}/></div></section>
      <section className="modern-section events"><article><span>03A</span><h3>Akad Nikah</h3><strong>{event.akadTime}</strong><p>{formattedDate}</p></article><article><span>03B</span><h3>Resepsi</h3><strong>{event.receptionTime}</strong><p>{formattedDate}</p></article><aside><MapPin size={18}/><h3>{event.venueName}</h3><p>{event.venueAddress}</p><a href={event.mapUrl} target="_blank" rel="noreferrer">Open Maps <ArrowUpRight size={14}/></a></aside></section>
      <section className="modern-section story"><span>04 · STORY</span><blockquote>{event.storyText}</blockquote></section>
      <section className="modern-section gallery"><header><span>05</span><h2>Selected memories.</h2></header><div>{event.gallery.map((img,index)=><figure key={img.id} className={`modern-frame-${index%5}`}><EditedImage url={img.url} edit={img.edit} alt={img.caption || `Memory ${index+1}`}/></figure>)}</div></section>
      <section className="modern-section rsvp"><div><span>06</span><h2>See you there?</h2><p>{event.closingText}</p></div><RsvpPanel {...props} variant="modern-rsvp-form"/></section>
      <footer className="modern-footer"><strong>{event.brideName} / {event.groomName}</strong><span>THANK YOU FOR CELEBRATING WITH US</span></footer>
    </div>
  </div>
}
