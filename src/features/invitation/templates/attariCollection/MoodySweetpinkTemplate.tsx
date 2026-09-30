import { Heart, Star } from 'lucide-react'
import type { InvitationTemplateProps } from '../shared'
import { Countdown } from '../shared'
import { CollectionControls, EventPair, GalleryStrip, Photo, RsvpBlock, useCollectionReveal } from './shared'
import '../../../../styles.attari-collection.css'

export function MoodySweetpinkTemplate(props: InvitationTemplateProps) {
  const { event, guestName, opened, onOpen } = props
  const hero = event.heroImage || event.gallery[0]?.url || ''
  useCollectionReveal(opened)
  if (!opened) return <section className="sweet-cover"><div className="sweet-checker"/><div className="sweet-ticket"><span>ADMIT TWO</span><small>{props.formattedDate}</small></div><div className="sweet-photo"><Photo fallback={hero} fallbackEdit={event.heroEdit} alt="Wedding"/></div><div className="sweet-copy"><Star/><span>THE WEDDING CLUB</span><h1>{event.brideName}<i>&</i>{event.groomName}</h1><div><small>FOR</small><strong>{guestName}</strong></div><button onClick={onOpen}>OPEN INVITATION <Heart size={14} fill="currentColor"/></button></div></section>
  return <div className="ac-template ac-sweetpink" data-invite-body><CollectionControls {...props}/>
    <section className="sweet-hero"><div className="sweet-hero-copy" data-ac-reveal><span>WE'RE GETTING MARRIED!</span><h1>{event.brideName}<br/><i>loves</i><br/>{event.groomName}</h1><p>{props.formattedDate}</p></div><div className="sweet-hero-photo"><Photo fallback={hero} fallbackEdit={event.heroEdit} alt="Wedding"/></div><div className="sweet-heart">♡</div></section>
    <section className="sweet-couple ac-pad"><div className="sweet-bubble" data-ac-reveal>{event.openingText}</div><div className="sweet-cards"><article data-ac-reveal><Photo item={event.gallery[0]} fallback={hero} fallbackEdit={event.heroEdit} alt={event.brideFullName}/><span>BRIDE</span><h3>{event.brideFullName}</h3></article><article data-ac-reveal><Photo item={event.gallery[1]} fallback={hero} fallbackEdit={event.heroEdit} alt={event.groomFullName}/><span>GROOM</span><h3>{event.groomFullName}</h3></article></div></section>
    <section className="sweet-count ac-pad"><span>♡ SAVE THE DATE ♡</span><Countdown date={event.eventDate}/></section>
    <section className="sweet-events ac-pad"><EventPair props={props} variant="sweet-event-pair"/></section>
    <section className="sweet-story ac-pad" data-ac-reveal><span>HOW IT STARTED</span><h2>Our cute little story</h2><p>{event.storyText}</p></section>
    <section className="sweet-gallery ac-pad"><h2>Memories<br/>we adore</h2><GalleryStrip props={props} className="sweet-gallery-strip"/></section>
    <section className="sweet-rsvp ac-pad"><RsvpBlock props={props}/></section>
    <section className="sweet-close"><span>THANK YOU, LOVE!</span><h2>{event.brideName} ♥ {event.groomName}</h2></section>
  </div>
}
