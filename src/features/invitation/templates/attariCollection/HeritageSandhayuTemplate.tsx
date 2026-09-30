import { Sun, Heart } from 'lucide-react'
import type { InvitationTemplateProps } from '../shared'
import { Countdown } from '../shared'
import { CollectionControls, EventPair, GalleryStrip, Photo, RsvpBlock, useCollectionReveal } from './shared'
import '../../../../styles.attari-collection.css'

export function HeritageSandhayuTemplate(props: InvitationTemplateProps) {
  const { event, guestName, opened, onOpen } = props
  const hero = event.heroImage || event.gallery[0]?.url || ''
  useCollectionReveal(opened)
  if (!opened) return <section className="sandhayu-cover"><div className="sandhayu-sun"><Sun/></div><div className="sandhayu-gate"><div className="sandhayu-photo"><Photo fallback={hero} fallbackEdit={event.heroEdit} alt="Wedding"/></div></div><div className="sandhayu-cover-copy"><span>THE WEDDING OF</span><h1>{event.brideName}<i>&</i>{event.groomName}</h1><small>{props.formattedDate}</small><div><em>Yth.</em><strong>{guestName}</strong></div><button onClick={onOpen}><Heart size={14}/> BUKA UNDANGAN</button></div></section>
  return <div className="ac-template ac-sandhayu" data-invite-body><CollectionControls {...props}/>
    <section className="sandhayu-hero"><div className="sandhayu-terrace"><i/><i/><i/></div><div className="sandhayu-hero-photo"><Photo fallback={hero} fallbackEdit={event.heroEdit} alt="Wedding"/></div><div className="sandhayu-hero-copy" data-ac-reveal><Sun/><span>HERITAGE SERIES</span><h1>{event.brideName}<br/><i>&</i><br/>{event.groomName}</h1><p>{event.openingText}</p></div></section>
    <section className="sandhayu-couple ac-pad"><div className="sandhayu-sunline"/><article data-ac-reveal><Photo item={event.gallery[0]} fallback={hero} fallbackEdit={event.heroEdit} alt={event.brideFullName}/><div><span>THE BRIDE</span><h2>{event.brideFullName}</h2><p>{event.brideParents}</p></div></article><article data-ac-reveal><div><span>THE GROOM</span><h2>{event.groomFullName}</h2><p>{event.groomParents}</p></div><Photo item={event.gallery[1]} fallback={hero} fallbackEdit={event.heroEdit} alt={event.groomFullName}/></article></section>
    <section className="sandhayu-count ac-pad"><Sun/><span>MENUJU HARI BAHAGIA</span><Countdown date={event.eventDate}/></section>
    <section className="sandhayu-events ac-pad"><EventPair props={props} variant="sandhayu-event-pair"/></section>
    <section className="sandhayu-story ac-pad" data-ac-reveal><span>JOURNEY</span><h2>From dusk<br/>to forever.</h2><p>{event.storyText}</p></section>
    <section className="sandhayu-gallery ac-pad"><GalleryStrip props={props} className="sandhayu-gallery-strip"/></section>
    <section className="sandhayu-rsvp ac-pad"><RsvpBlock props={props}/></section>
    <section className="sandhayu-close"><Sun/><h2>{event.brideName} & {event.groomName}</h2></section>
  </div>
}
