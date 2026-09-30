import { Heart, Sparkles } from 'lucide-react'
import type { InvitationTemplateProps } from '../shared'
import { Countdown } from '../shared'
import { CollectionControls, EventPair, GalleryStrip, Photo, RsvpBlock, useCollectionReveal } from './shared'
import '../../../../styles.attari-collection.css'

export function PremiumAriyaTemplate(props: InvitationTemplateProps) {
  const { event, guestName, opened, onOpen } = props
  const hero = event.heroImage || event.gallery[0]?.url || ''
  useCollectionReveal(opened)
  if (!opened) return <section className="ariya-cover"><div className="ariya-arch"><Photo fallback={hero} fallbackEdit={event.heroEdit} alt="Wedding"/></div><div className="ariya-rays"/><div className="ariya-cover-copy"><Sparkles/><span>THE WEDDING OF</span><h1>{event.brideName}<i>&</i>{event.groomName}</h1><small>{props.formattedDate}</small><div><em>FOR</em><strong>{guestName}</strong></div><button onClick={onOpen}><Heart size={14}/> BUKA UNDANGAN</button></div></section>
  return <div className="ac-template ac-ariya" data-invite-body><CollectionControls {...props}/>
    <section className="ariya-hero"><div className="ariya-hero-arch"><Photo fallback={hero} fallbackEdit={event.heroEdit} alt="Wedding"/></div><div className="ariya-hero-copy" data-ac-reveal><span>THE WEDDING OF</span><h1>{event.brideName}<i>&</i>{event.groomName}</h1><p>{event.openingText}</p></div></section>
    <section className="ariya-couple ac-pad"><header data-ac-reveal><small>TWO HEARTS</small><h2>One sacred<br/>promise.</h2></header><div className="ariya-couple-grid"><article data-ac-reveal><div className="ariya-small-arch"><Photo item={event.gallery[0]} fallback={hero} fallbackEdit={event.heroEdit} alt={event.brideFullName}/></div><span>THE BRIDE</span><h3>{event.brideFullName}</h3><p>{event.brideParents}</p></article><article data-ac-reveal><div className="ariya-small-arch"><Photo item={event.gallery[1]} fallback={hero} fallbackEdit={event.heroEdit} alt={event.groomFullName}/></div><span>THE GROOM</span><h3>{event.groomFullName}</h3><p>{event.groomParents}</p></article></div></section>
    <section className="ariya-date ac-pad"><span>SAVE THE DATE</span><Countdown date={event.eventDate}/></section>
    <section className="ariya-events ac-pad"><EventPair props={props} variant="ariya-event-pair"/></section>
    <section className="ariya-story ac-pad" data-ac-reveal><Sparkles/><span>OUR JOURNEY</span><p>{event.storyText}</p></section>
    <section className="ariya-gallery ac-pad"><h2>Our<br/>Moments</h2><GalleryStrip props={props} className="ariya-gallery-strip"/></section>
    <section className="ariya-rsvp ac-pad"><RsvpBlock props={props}/></section>
    <section className="ariya-close"><div className="ariya-close-arch"><h2>{event.brideName}<br/><i>&</i><br/>{event.groomName}</h2><p>{event.closingText}</p></div></section>
  </div>
}
