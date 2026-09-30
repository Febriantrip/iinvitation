import { Clapperboard, Heart, MapPin } from 'lucide-react'
import type { InvitationTemplateProps } from './shared'
import { Countdown, EditedImage, RsvpPanel } from './shared'

export function CinematicChaptersTemplate(props: InvitationTemplateProps) {
  const { event, guestName, opened, onOpen, formattedDate } = props
  const gallery = event.gallery
  return <div className="structural-template template-cinematic-chapters">
    <section className="tpl-film-cover">
      <div className="tpl-film-image"><EditedImage url={event.heroImage} edit={event.heroEdit} alt={`${event.brideName} & ${event.groomName}`}/></div>
      <div className="tpl-film-letterbox top"/><div className="tpl-film-letterbox bottom"/>
      <div className="tpl-film-copy"><span><Clapperboard size={15}/> A WEDDING FILM</span><h1>{event.brideName}<i>&</i>{event.groomName}</h1><p>Premieres · {formattedDate}</p><div className="tpl-film-recipient">For <strong>{guestName}</strong></div><button onClick={onOpen}><Heart size={15} fill="currentColor"/> Start The Film</button></div>
      <div className="tpl-film-credit">A story written by two hearts · Presented with love</div>
    </section>

    <div data-invite-body className={`structural-body ${opened ? 'visible' : ''}`}>
      <section className="tpl-film-chapter dark"><div className="chapter-copy"><span>CHAPTER 01</span><h2>The opening scene.</h2><p>{event.openingText}</p></div><Countdown date={event.eventDate}/></section>
      <section className="tpl-film-chapter photo-chapter"><div className="chapter-bg">{gallery[0] ? <EditedImage url={gallery[0].url} edit={gallery[0].edit} alt={event.brideFullName}/> : <EditedImage url={event.heroImage} edit={event.heroEdit} alt={event.brideFullName}/>}</div><div className="chapter-overlay"><span>CAST · THE BRIDE</span><h2>{event.brideFullName}</h2><p>{event.brideParents}</p></div></section>
      <section className="tpl-film-chapter photo-chapter right"><div className="chapter-bg">{gallery[1] ? <EditedImage url={gallery[1].url} edit={gallery[1].edit} alt={event.groomFullName}/> : <EditedImage url={event.heroImage} edit={event.heroEdit} alt={event.groomFullName}/>}</div><div className="chapter-overlay"><span>CAST · THE GROOM</span><h2>{event.groomFullName}</h2><p>{event.groomParents}</p></div></section>
      <section className="tpl-film-chapter schedule"><div className="film-schedule-head"><span>CHAPTER 02</span><h2>The premiere schedule</h2></div><div className="film-schedule-grid"><article><span>SCENE A</span><h3>Akad Nikah</h3><strong>{formattedDate}</strong><p>{event.akadTime}</p></article><article><span>SCENE B</span><h3>Resepsi</h3><strong>{formattedDate}</strong><p>{event.receptionTime}</p></article><aside><MapPin size={18}/><strong>{event.venueName}</strong><p>{event.venueAddress}</p><a href={event.mapUrl} target="_blank" rel="noreferrer">Open location</a></aside></div></section>
      <section className="tpl-film-chapter story"><div><span>CHAPTER 03</span><h2>Previously, in our story...</h2><p>{event.storyText}</p></div></section>
      <section className="tpl-film-chapter montage"><header><span>MONTAGE</span><h2>Frames from our story</h2></header><div>{gallery.map((img,index) => <figure key={img.id} className={`shot shot-${index%5}`}><EditedImage url={img.url} edit={img.edit} alt={img.caption || `Shot ${index+1}`}/><figcaption>SHOT {String(index+1).padStart(2,'0')}</figcaption></figure>)}</div></section>
      <section className="tpl-film-chapter finale"><div className="finale-copy"><span>FINAL CHAPTER</span><h2>Join the ending<br/>that starts everything.</h2><p>{event.closingText}</p></div><RsvpPanel {...props} variant="film-rsvp-form"/></section>
      <footer className="tpl-film-end"><strong>THE BEGINNING</strong><span>{event.brideName} + {event.groomName}</span></footer>
    </div>
  </div>
}
