import { MoveRight, Sparkles } from 'lucide-react'
import type { InvitationTemplateProps } from '../shared'
import { Countdown } from '../shared'
import { CollectionControls, EventPair, GalleryStrip, Photo, RsvpBlock, useCollectionReveal } from './shared'
import '../../../../styles.attari-collection.css'

export function PremiumShakiraTemplate(props: InvitationTemplateProps) {
  const { event, guestName, opened, onOpen } = props
  const hero = event.heroImage || event.gallery[0]?.url || ''
  useCollectionReveal(opened)
  if (!opened) return <section className="shakira-cover"><div className="shakira-poster"><div className="shakira-photo"><Photo fallback={hero} fallbackEdit={event.heroEdit} alt="Wedding"/></div><div className="shakira-type"><span>THE</span><strong>WEDDING</strong><span>OF</span></div><div className="shakira-names">{event.brideName}<i>&</i>{event.groomName}</div></div><div className="shakira-cover-meta"><small>{props.formattedDate}</small><em>INVITED</em><strong>{guestName}</strong><button onClick={onOpen}>OPEN <MoveRight size={16}/></button></div></section>
  return <div className="ac-template ac-shakira" data-invite-body><CollectionControls {...props}/>
    <section className="shakira-hero"><div className="shakira-marquee">LOVE • VOWS • FOREVER • LOVE • VOWS • FOREVER •</div><div className="shakira-hero-photo"><Photo fallback={hero} fallbackEdit={event.heroEdit} alt="Wedding"/></div><div className="shakira-hero-copy" data-ac-reveal><small>ISSUE 01</small><h1>{event.brideName.toUpperCase()}<br/><i>&</i> {event.groomName.toUpperCase()}</h1><p>{event.openingText}</p></div></section>
    <section className="shakira-couple ac-pad"><div className="shakira-label">COUPLE FILE</div><div className="shakira-couple-grid"><article data-ac-reveal><Photo item={event.gallery[0]} fallback={hero} fallbackEdit={event.heroEdit} alt={event.brideFullName}/><h2>{event.brideFullName}</h2><span>THE BRIDE</span></article><article data-ac-reveal><h2>{event.groomFullName}</h2><span>THE GROOM</span><Photo item={event.gallery[1]} fallback={hero} fallbackEdit={event.heroEdit} alt={event.groomFullName}/></article></div></section>
    <section className="shakira-date ac-pad"><Sparkles/><h2>SAVE<br/>THE DATE</h2><Countdown date={event.eventDate}/></section>
    <section className="shakira-events ac-pad"><EventPair props={props} variant="shakira-event-pair"/></section>
    <section className="shakira-story ac-pad" data-ac-reveal><div className="shakira-label">THE STORY</div><p>{event.storyText}</p></section>
    <section className="shakira-gallery ac-pad"><GalleryStrip props={props} className="shakira-gallery-strip"/></section>
    <section className="shakira-rsvp ac-pad"><RsvpBlock props={props}/></section>
    <section className="shakira-close"><span>THANKS FOR READING</span><h2>{event.brideName} × {event.groomName}</h2></section>
  </div>
}
