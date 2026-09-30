import { MoonStar, Heart } from 'lucide-react'
import type { InvitationTemplateProps } from '../shared'
import { Countdown } from '../shared'
import { AccessCard, CollectionControls, EventPair, GalleryStrip, Photo, RsvpBlock, useCollectionReveal } from './shared'
import '../../../../styles.attari-collection.css'

export function HeritageAmeeraTemplate(props: InvitationTemplateProps) {
  const { event, guestName, opened, onOpen } = props
  const hero = event.heroImage || event.gallery[0]?.url || ''
  useCollectionReveal(opened)
  if (!opened) return <section className="ameera-cover"><div className="ameera-lattice"/><div className="ameera-arch"><div className="ameera-photo"><Photo fallback={hero} fallbackEdit={event.heroEdit} alt="Wedding"/></div></div><div className="ameera-cover-copy"><MoonStar/><span>BISMILLAHIRRAHMANIRRAHIM</span><h1>{event.brideName}<i>&</i>{event.groomName}</h1><small>{props.formattedDate}</small><div><em>Kepada Yth.</em><strong>{guestName}</strong></div><button onClick={onOpen}><Heart size={14}/> BUKA UNDANGAN</button></div></section>
  return <div className="ac-template ac-ameera" data-invite-body><CollectionControls {...props}/>
    <section className="ameera-hero"><div className="ameera-pattern"/><div className="ameera-hero-inner"><div className="ameera-hero-photo"><Photo fallback={hero} fallbackEdit={event.heroEdit} alt="Wedding"/></div><div className="ameera-hero-copy" data-ac-reveal><MoonStar/><span>THE WEDDING OF</span><h1>{event.brideName}<i>&</i>{event.groomName}</h1><p>{event.openingText}</p></div></div></section>
    <section className="ameera-couple ac-pad"><header data-ac-reveal><span>OUR BELOVED</span><h2>Bride & Groom</h2></header><div className="ameera-couple-grid"><article data-ac-reveal><div className="ameera-small-arch"><Photo item={event.gallery[0]} fallback={hero} fallbackEdit={event.heroEdit} alt={event.brideFullName}/></div><h3>{event.brideFullName}</h3><p>{event.brideParents}</p></article><article data-ac-reveal><div className="ameera-small-arch"><Photo item={event.gallery[1]} fallback={hero} fallbackEdit={event.heroEdit} alt={event.groomFullName}/></div><h3>{event.groomFullName}</h3><p>{event.groomParents}</p></article></div></section>
    <section className="ameera-count ac-pad"><MoonStar/><span>SAVE THE DATE</span><Countdown date={event.eventDate}/></section>
    <section className="ameera-events ac-pad"><EventPair props={props} variant="ameera-event-pair"/></section>
    {event.featureGuestbook && <section className="ameera-access ac-pad"><AccessCard props={props}/></section>}
    <section className="ameera-story ac-pad" data-ac-reveal><MoonStar/><span>OUR STORY</span><p>{event.storyText}</p></section>
    <section className="ameera-gallery ac-pad"><GalleryStrip props={props} className="ameera-gallery-strip"/></section>
    <section className="ameera-rsvp ac-pad"><RsvpBlock props={props}/></section>
    <section className="ameera-close"><MoonStar/><h2>{event.brideName} & {event.groomName}</h2><p>{event.closingText}</p></section>
  </div>
}
