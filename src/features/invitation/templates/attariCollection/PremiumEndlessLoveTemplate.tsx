import { Heart, Infinity } from 'lucide-react'
import type { InvitationTemplateProps } from '../shared'
import { Countdown } from '../shared'
import { CollectionControls, EventPair, GalleryStrip, Photo, RsvpBlock, useCollectionReveal } from './shared'
import '../../../../styles.attari-collection.css'

export function PremiumEndlessLoveTemplate(props: InvitationTemplateProps) {
  const { event, guestName, opened, onOpen } = props
  const hero = event.heroImage || event.gallery[0]?.url || ''
  useCollectionReveal(opened)
  if (!opened) return <section className="endless-cover"><div className="endless-loop a"/><div className="endless-loop b"/><div className="endless-cover-photo"><Photo fallback={hero} fallbackEdit={event.heroEdit} alt="Wedding"/></div><div className="endless-cover-copy"><Infinity/><span>AN ENDLESS LOVE STORY</span><h1>{event.brideName}<i>&</i>{event.groomName}</h1><small>{props.formattedDate}</small><div><em>FOR</em><strong>{guestName}</strong></div><button onClick={onOpen}>BEGIN FOREVER <Heart size={14} fill="currentColor"/></button></div></section>
  return <div className="ac-template ac-endless" data-invite-body><CollectionControls {...props}/>
    <section className="endless-hero"><div className="endless-ribbon">FOREVER STARTS HERE · FOREVER STARTS HERE · FOREVER STARTS HERE ·</div><div className="endless-photo"><Photo fallback={hero} fallbackEdit={event.heroEdit} alt="Wedding"/></div><div className="endless-hero-copy" data-ac-reveal><Infinity/><h1>{event.brideName}<i>&</i>{event.groomName}</h1><p>{event.openingText}</p></div></section>
    <section className="endless-couple ac-pad"><div className="endless-line"/><article data-ac-reveal><Photo item={event.gallery[0]} fallback={hero} fallbackEdit={event.heroEdit} alt={event.brideFullName}/><div><span>HER</span><h2>{event.brideFullName}</h2><p>{event.brideParents}</p></div></article><article data-ac-reveal><div><span>HIM</span><h2>{event.groomFullName}</h2><p>{event.groomParents}</p></div><Photo item={event.gallery[1]} fallback={hero} fallbackEdit={event.heroEdit} alt={event.groomFullName}/></article></section>
    <section className="endless-count ac-pad"><Infinity/><span>UNTIL OUR DAY</span><Countdown date={event.eventDate}/></section>
    <section className="endless-events ac-pad"><EventPair props={props} variant="endless-event-pair"/></section>
    <section className="endless-story ac-pad" data-ac-reveal><h2>The line that<br/>keeps going.</h2><p>{event.storyText}</p></section>
    <section className="endless-gallery ac-pad"><GalleryStrip props={props} className="endless-gallery-strip"/></section>
    <section className="endless-rsvp ac-pad"><RsvpBlock props={props}/></section>
    <section className="endless-close"><Infinity/><h2>Endless,<br/>always.</h2><p>{event.brideName} & {event.groomName}</p></section>
  </div>
}
