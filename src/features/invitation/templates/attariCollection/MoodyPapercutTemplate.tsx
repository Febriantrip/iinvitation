import { Scissors, Sparkles } from 'lucide-react'
import type { InvitationTemplateProps } from '../shared'
import { Countdown } from '../shared'
import { CollectionControls, EventPair, GalleryStrip, Photo, RsvpBlock, useCollectionReveal } from './shared'
import '../../../../styles.attari-collection.css'

export function MoodyPapercutTemplate(props: InvitationTemplateProps) {
  const { event, guestName, opened, onOpen } = props
  const hero = event.heroImage || event.gallery[0]?.url || ''
  useCollectionReveal(opened)
  if (!opened) return <section className="paper-cover"><div className="paper-layer p1"/><div className="paper-layer p2"/><div className="paper-layer p3"/><div className="paper-cover-photo"><Photo fallback={hero} fallbackEdit={event.heroEdit} alt="Wedding"/></div><div className="paper-cover-card"><Scissors/><span>YOU'RE INVITED</span><h1>{event.brideName}<i>&</i>{event.groomName}</h1><small>{props.formattedDate}</small><div><em>Kepada</em><strong>{guestName}</strong></div><button onClick={onOpen}>OPEN THE PAPER <Sparkles size={14}/></button></div></section>
  return <div className="ac-template ac-papercut" data-invite-body><CollectionControls {...props}/>
    <section className="paper-intro ac-pad"><div className="paper-sticker">SAVE<br/>THE DATE</div><div data-ac-reveal><span>THE WEDDING OF</span><h1>{event.brideName} <i>&</i> {event.groomName}</h1><p>{event.openingText}</p></div></section>
    <section className="paper-couple ac-pad"><article className="paper-polaroid left" data-ac-reveal><Photo item={event.gallery[0]} fallback={hero} fallbackEdit={event.heroEdit} alt={event.brideFullName}/><b>{event.brideFullName}</b><small>{event.brideParents}</small></article><div className="paper-note" data-ac-reveal>two souls<br/><strong>one paper story</strong></div><article className="paper-polaroid right" data-ac-reveal><Photo item={event.gallery[1]} fallback={hero} fallbackEdit={event.heroEdit} alt={event.groomFullName}/><b>{event.groomFullName}</b><small>{event.groomParents}</small></article></section>
    <section className="paper-count ac-pad"><div className="paper-torn"/><span>COUNTING DOWN</span><Countdown date={event.eventDate}/></section>
    <section className="paper-events ac-pad"><h2 data-ac-reveal>Cut here for<br/><i>our special day</i></h2><EventPair props={props} variant="paper-event-pair"/></section>
    <section className="paper-story ac-pad" data-ac-reveal><span>OUR STORY</span><p>{event.storyText}</p></section>
    <section className="paper-gallery ac-pad"><h2>Photo<br/>scraps</h2><GalleryStrip props={props} className="paper-gallery-strip"/></section>
    <section className="paper-rsvp ac-pad"><RsvpBlock props={props}/></section>
    <section className="paper-close"><Scissors/><h2>{event.brideName} + {event.groomName}</h2><p>{event.closingText}</p></section>
  </div>
}
