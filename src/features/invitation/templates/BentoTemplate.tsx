import { CalendarDays, Heart, MapPin } from 'lucide-react'
import type { InvitationTemplateProps } from './shared'
import { Countdown, EditedImage, RsvpPanel } from './shared'

export function BentoTemplate(props: InvitationTemplateProps) {
  const { event, guestName, opened, onOpen, formattedDate } = props
  return <div className="structural-template template-bento">
    <section className="tpl-bento-cover">
      <div className="bento-grid-cover">
        <div className="bento-cell title"><span>THE WEDDING</span><h1>{event.brideName}<i>&</i>{event.groomName}</h1></div>
        <div className="bento-cell photo"><EditedImage url={event.heroImage} edit={event.heroEdit} alt={`${event.brideName} & ${event.groomName}`}/></div>
        <div className="bento-cell date"><CalendarDays size={20}/><strong>{formattedDate}</strong></div>
        <div className="bento-cell guest"><span>Specially for</span><strong>{guestName}</strong><button onClick={onOpen}><Heart size={15}/> Open</button></div>
        <div className="bento-cell mini-copy"><span>ONE DAY</span><span>TWO HEARTS</span><span>FOREVER</span></div>
      </div>
    </section>

    <div data-invite-body className={`structural-body ${opened ? 'visible' : ''}`}>
      <section className="bento-section intro"><div className="bento-cell statement"><span>01 / HELLO</span><h2>We are getting married.</h2><p>{event.openingText}</p></div><div className="bento-cell timer"><span>COUNTING DOWN</span><Countdown date={event.eventDate}/></div></section>
      <section className="bento-section couple"><article className="bento-cell bride">{event.gallery[0] ? <EditedImage url={event.gallery[0].url} edit={event.gallery[0].edit} alt={event.brideFullName}/> : <EditedImage url={event.heroImage} edit={event.heroEdit} alt={event.brideFullName}/>}<footer><span>THE BRIDE</span><h3>{event.brideFullName}</h3><p>{event.brideParents}</p></footer></article><div className="bento-cell amp">&</div><article className="bento-cell groom">{event.gallery[1] ? <EditedImage url={event.gallery[1].url} edit={event.gallery[1].edit} alt={event.groomFullName}/> : <EditedImage url={event.heroImage} edit={event.heroEdit} alt={event.groomFullName}/>}<footer><span>THE GROOM</span><h3>{event.groomFullName}</h3><p>{event.groomParents}</p></footer></article></section>
      <section className="bento-section schedule"><div className="bento-cell event"><span>02A</span><h3>Akad Nikah</h3><strong>{event.akadTime}</strong><p>{formattedDate}</p></div><div className="bento-cell event alt"><span>02B</span><h3>Resepsi</h3><strong>{event.receptionTime}</strong><p>{formattedDate}</p></div><div className="bento-cell location"><MapPin size={21}/><h3>{event.venueName}</h3><p>{event.venueAddress}</p><a href={event.mapUrl} target="_blank" rel="noreferrer">Maps ↗</a></div></section>
      <section className="bento-section story"><div className="bento-cell quote"><span>03 / OUR STORY</span><blockquote>{event.storyText}</blockquote></div><div className="bento-cell tiny"><strong>{event.brideName.slice(0,1)} + {event.groomName.slice(0,1)}</strong><span>since then, until forever.</span></div></section>
      <section className="bento-section gallery"><div className="bento-gallery">{event.gallery.map((img,index)=><figure key={img.id} className={`cell-${index%7}`}><EditedImage url={img.url} edit={img.edit} alt={img.caption || `Moment ${index+1}`}/></figure>)}</div></section>
      <section className="bento-section rsvp"><div className="bento-cell invite"><span>04 / RSVP</span><h2>One tap away from joining our day.</h2><p>{event.closingText}</p></div><div className="bento-cell form"><RsvpPanel {...props} variant="bento-rsvp-form"/></div></section>
      <footer className="bento-footer"><span>{formattedDate}</span><strong>{event.brideName} & {event.groomName}</strong><span>THANK YOU</span></footer>
    </div>
  </div>
}
