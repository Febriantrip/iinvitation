import { Leaf, Heart } from 'lucide-react'
import type { InvitationTemplateProps } from '../shared'
import { Countdown } from '../shared'
import { CollectionControls, EventPair, GalleryStrip, Photo, RsvpBlock, useCollectionReveal } from './shared'
import '../../../../styles.attari-collection.css'

export function PremiumSageTemplate(props: InvitationTemplateProps) {
  const { event, guestName, opened, onOpen } = props
  const hero = event.heroImage || event.gallery[0]?.url || ''
  useCollectionReveal(opened)
  if (!opened) return <section className="sage-cover"><div className="sage-leaf l1"><Leaf/></div><div className="sage-leaf l2"><Leaf/></div><div className="sage-frame"><div className="sage-photo"><Photo fallback={hero} fallbackEdit={event.heroEdit} alt="Wedding"/></div></div><div className="sage-cover-copy"><Leaf/><span>THE WEDDING OF</span><h1>{event.brideName}<i>&</i>{event.groomName}</h1><small>{props.formattedDate}</small><div><em>DEAR</em><strong>{guestName}</strong></div><button onClick={onOpen}><Heart size={14}/> BUKA UNDANGAN</button></div></section>
  return <div className="ac-template ac-sage" data-invite-body><CollectionControls {...props}/>
    <section className="sage-hero"><div className="sage-hero-photo"><Photo fallback={hero} fallbackEdit={event.heroEdit} alt="Wedding"/></div><div className="sage-hero-card" data-ac-reveal><Leaf/><span>THE WEDDING OF</span><h1>{event.brideName}<br/><i>&</i><br/>{event.groomName}</h1><p>{event.openingText}</p></div></section>
    <section className="sage-couple ac-pad"><header data-ac-reveal><span>ROOTED IN LOVE</span><h2>Two lives,<br/>one garden.</h2></header><div className="sage-couple-grid"><article data-ac-reveal><Photo item={event.gallery[0]} fallback={hero} fallbackEdit={event.heroEdit} alt={event.brideFullName}/><h3>{event.brideFullName}</h3><p>{event.brideParents}</p></article><article data-ac-reveal><Photo item={event.gallery[1]} fallback={hero} fallbackEdit={event.heroEdit} alt={event.groomFullName}/><h3>{event.groomFullName}</h3><p>{event.groomParents}</p></article></div></section>
    <section className="sage-count ac-pad"><Leaf/><span>COUNTDOWN</span><Countdown date={event.eventDate}/></section>
    <section className="sage-events ac-pad"><EventPair props={props} variant="sage-event-pair"/></section>
    <section className="sage-story ac-pad" data-ac-reveal><Leaf/><h2>Growing together</h2><p>{event.storyText}</p></section>
    <section className="sage-gallery ac-pad"><GalleryStrip props={props} className="sage-gallery-strip"/></section>
    <section className="sage-rsvp ac-pad"><RsvpBlock props={props}/></section>
    <section className="sage-close"><Leaf/><span>WITH GRATITUDE</span><h2>{event.brideName} & {event.groomName}</h2></section>
  </div>
}
