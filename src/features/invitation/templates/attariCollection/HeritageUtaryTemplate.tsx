import { Crown, Heart } from 'lucide-react'
import type { InvitationTemplateProps } from '../shared'
import { Countdown } from '../shared'
import { AccessCard, CollectionControls, EventPair, GalleryStrip, Photo, RsvpBlock, useCollectionReveal } from './shared'
import '../../../../styles.attari-collection.css'

export function HeritageUtaryTemplate(props: InvitationTemplateProps) {
  const { event, guestName, opened, onOpen } = props
  const hero = event.heroImage || event.gallery[0]?.url || ''
  useCollectionReveal(opened)
  if (!opened) return <section className="utary-cover"><div className="utary-border"><i/><i/><i/><i/></div><div className="utary-cover-photo"><Photo fallback={hero} fallbackEdit={event.heroEdit} alt="Wedding"/></div><div className="utary-wash"/><div className="utary-seal"><Crown/><span>{event.brideName[0]}{event.groomName[0]}</span></div><div className="utary-cover-copy"><span>HERITAGE WEDDING</span><h1>{event.brideName}<i>&</i>{event.groomName}</h1><small>{props.formattedDate}</small><div><em>Kepada Yth.</em><strong>{guestName}</strong></div><button onClick={onOpen}><Heart size={14}/> BUKA UNDANGAN</button></div></section>
  return <div className="ac-template ac-utary" data-invite-body><CollectionControls {...props}/>
    <section className="utary-hero"><div className="utary-pattern"/><div className="utary-hero-photo"><Photo fallback={hero} fallbackEdit={event.heroEdit} alt="Wedding"/></div><div className="utary-hero-copy" data-ac-reveal><Crown/><span>THE WEDDING OF</span><h1>{event.brideName}<i>&</i>{event.groomName}</h1><p>{event.openingText}</p></div></section>
    <section className="utary-couple ac-pad"><header data-ac-reveal><span>PUTRA & PUTRI</span><h2>Two families,<br/>one celebration.</h2></header><div className="utary-couple-grid"><article data-ac-reveal><div className="utary-frame"><Photo item={event.gallery[0]} fallback={hero} fallbackEdit={event.heroEdit} alt={event.brideFullName}/></div><h3>{event.brideFullName}</h3><p>{event.brideParents}</p></article><article data-ac-reveal><div className="utary-frame"><Photo item={event.gallery[1]} fallback={hero} fallbackEdit={event.heroEdit} alt={event.groomFullName}/></div><h3>{event.groomFullName}</h3><p>{event.groomParents}</p></article></div></section>
    <section className="utary-count ac-pad"><Crown/><span>SAVE THE DATE</span><Countdown date={event.eventDate}/></section>
    <section className="utary-events ac-pad"><EventPair props={props} variant="utary-event-pair"/></section>
    {event.featureGuestbook && <section className="utary-access ac-pad"><AccessCard props={props}/></section>}
    <section className="utary-story ac-pad" data-ac-reveal><span>KISAH KAMI</span><p>{event.storyText}</p></section>
    <section className="utary-gallery ac-pad"><GalleryStrip props={props} className="utary-gallery-strip"/></section>
    <section className="utary-rsvp ac-pad"><RsvpBlock props={props}/></section>
    <section className="utary-close"><Crown/><h2>{event.brideName} & {event.groomName}</h2><p>{event.closingText}</p></section>
  </div>
}
