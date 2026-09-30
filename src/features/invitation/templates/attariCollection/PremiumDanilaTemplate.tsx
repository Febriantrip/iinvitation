import { Film, Heart } from 'lucide-react'
import type { InvitationTemplateProps } from '../shared'
import { Countdown } from '../shared'
import { CollectionControls, EventPair, GalleryStrip, Photo, RsvpBlock, useCollectionReveal } from './shared'
import '../../../../styles.attari-collection.css'

export function PremiumDanilaTemplate(props: InvitationTemplateProps) {
  const { event, guestName, opened, onOpen } = props
  const hero = event.heroImage || event.gallery[0]?.url || ''
  useCollectionReveal(opened)
  if (!opened) return <section className="danila-cover"><div className="danila-filmbar top"/><div className="danila-filmbar bottom"/><div className="danila-cover-photo"><Photo fallback={hero} fallbackEdit={event.heroEdit} alt="Wedding"/></div><div className="danila-cover-copy"><Film/><span>A WEDDING FILM</span><h1>{event.brideName}<i>+</i>{event.groomName}</h1><small>{props.formattedDate}</small><div><em>FEATURING</em><strong>{guestName}</strong></div><button onClick={onOpen}>PLAY INVITATION ▶</button></div></section>
  return <div className="ac-template ac-danila" data-invite-body><CollectionControls {...props}/>
    <section className="danila-hero"><div className="danila-grain"/><div className="danila-hero-photo"><Photo fallback={hero} fallbackEdit={event.heroEdit} alt="Wedding"/></div><div className="danila-hero-copy" data-ac-reveal><span>SCENE 01</span><h1>{event.brideName.toUpperCase()}<br/>×<br/>{event.groomName.toUpperCase()}</h1><small>{props.formattedDate}</small></div></section>
    <section className="danila-credits ac-pad" data-ac-reveal><span>OPENING MONOLOGUE</span><p>{event.openingText}</p></section>
    <section className="danila-cast ac-pad"><header><Film/><span>CAST</span><h2>Starring</h2></header><div><article data-ac-reveal><Photo item={event.gallery[0]} fallback={hero} fallbackEdit={event.heroEdit} alt={event.brideFullName}/><small>THE BRIDE</small><h3>{event.brideFullName}</h3></article><article data-ac-reveal><Photo item={event.gallery[1]} fallback={hero} fallbackEdit={event.heroEdit} alt={event.groomFullName}/><small>THE GROOM</small><h3>{event.groomFullName}</h3></article></div></section>
    <section className="danila-date ac-pad"><span>PREMIERES IN</span><Countdown date={event.eventDate}/></section>
    <section className="danila-events ac-pad"><h2 data-ac-reveal>SCENE 02 · THE CEREMONY</h2><EventPair props={props} variant="danila-event-pair"/></section>
    <section className="danila-story ac-pad" data-ac-reveal><span>DIRECTOR'S NOTE</span><p>{event.storyText}</p></section>
    <section className="danila-gallery ac-pad"><span>CONTACT SHEET</span><GalleryStrip props={props} className="danila-gallery-strip"/></section>
    <section className="danila-rsvp ac-pad"><RsvpBlock props={props}/></section>
    <section className="danila-close"><small>END CREDITS</small><h2>{event.brideName} & {event.groomName}</h2><p>{event.closingText}</p><Heart/></section>
  </div>
}
