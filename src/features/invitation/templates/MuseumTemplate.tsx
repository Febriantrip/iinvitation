import { ArrowDownRight, Heart, MapPin } from 'lucide-react'
import type { InvitationTemplateProps } from './shared'
import { Countdown, EditedImage, RsvpPanel } from './shared'

export function MuseumTemplate(props: InvitationTemplateProps) {
  const { event, guestName, opened, onOpen, formattedDate } = props
  return <div className="structural-template template-museum">
    <section className="tpl-museum-cover">
      <header><span>PRIVATE EXHIBITION</span><span>{formattedDate}</span></header>
      <div className="museum-wall"><figure><EditedImage url={event.heroImage} edit={event.heroEdit} alt={`${event.brideName} & ${event.groomName}`}/></figure><div className="museum-plaque"><span>WORK NO. 001</span><h1>{event.brideName} & {event.groomName}</h1><p>Two lives in permanent collection.</p></div></div>
      <div className="museum-ticket"><span>ADMIT ONE · {guestName}</span><button onClick={onOpen}>Enter Exhibition <ArrowDownRight size={16}/></button></div>
    </section>

    <div data-invite-body className={`structural-body ${opened ? 'visible' : ''}`}>
      <section className="museum-section statement"><aside>ROOM 01<br/>ARTIST STATEMENT</aside><div><h2>An exhibition about choosing each other.</h2><p>{event.openingText}</p></div></section>
      <section className="museum-section portraits"><aside>ROOM 02<br/>PORTRAITS</aside><div className="museum-portrait-grid"><article>{event.gallery[0] ? <EditedImage url={event.gallery[0].url} edit={event.gallery[0].edit} alt={event.brideFullName}/> : <EditedImage url={event.heroImage} edit={event.heroEdit} alt={event.brideFullName}/>}<footer><span>002-A</span><h3>{event.brideFullName}</h3><p>{event.brideParents}</p></footer></article><article>{event.gallery[1] ? <EditedImage url={event.gallery[1].url} edit={event.gallery[1].edit} alt={event.groomFullName}/> : <EditedImage url={event.heroImage} edit={event.heroEdit} alt={event.groomFullName}/>}<footer><span>002-B</span><h3>{event.groomFullName}</h3><p>{event.groomParents}</p></footer></article></div></section>
      <section className="museum-section time"><aside>ROOM 03<br/>TIME PIECE</aside><div><h2>{formattedDate}</h2><Countdown date={event.eventDate}/></div></section>
      <section className="museum-section programme"><aside>ROOM 04<br/>PROGRAMME</aside><div className="museum-programme-grid"><article><span>04.1</span><h3>Akad Nikah</h3><p>{event.akadTime}</p><strong>{formattedDate}</strong></article><article><span>04.2</span><h3>Resepsi</h3><p>{event.receptionTime}</p><strong>{formattedDate}</strong></article><article className="location"><MapPin size={19}/><h3>{event.venueName}</h3><p>{event.venueAddress}</p><a href={event.mapUrl} target="_blank" rel="noreferrer">View location ↗</a></article></div></section>
      <section className="museum-section archive"><aside>ROOM 05<br/>ARCHIVE</aside><div className="museum-art-grid">{event.gallery.map((img,index)=><figure key={img.id} className={`museum-art art-${index%6}`}><EditedImage url={img.url} edit={img.edit} alt={img.caption || `Artwork ${index+1}`}/><figcaption><span>{String(index+1).padStart(3,'0')}</span>{img.caption || 'Untitled memory'}</figcaption></figure>)}</div></section>
      <section className="museum-section story"><aside>ROOM 06<br/>TEXT WORK</aside><blockquote>{event.storyText}</blockquote></section>
      <section className="museum-section response"><aside>FINAL ROOM<br/>GUEST BOOK</aside><div><h2>Leave your mark in the guest book.</h2><p>{event.closingText}</p><RsvpPanel {...props} variant="museum-rsvp-form"/></div></section>
      <footer className="museum-footer"><Heart size={16}/><span>END OF EXHIBITION · {event.brideName} & {event.groomName}</span></footer>
    </div>
  </div>
}
