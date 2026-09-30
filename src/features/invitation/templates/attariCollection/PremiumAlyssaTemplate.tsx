import { ArrowUpRight } from 'lucide-react'
import type { InvitationTemplateProps } from '../shared'
import { Countdown } from '../shared'
import { AccessCard, CollectionControls, EventPair, GalleryStrip, Photo, RsvpBlock, useCollectionReveal } from './shared'
import '../../../../styles.attari-collection.css'

export function PremiumAlyssaTemplate(props: InvitationTemplateProps) {
  const { event, guestName, opened, onOpen } = props
  const hero = event.heroImage || event.gallery[0]?.url || ''
  useCollectionReveal(opened)
  if (!opened) return <section className="alyssa-cover"><div className="alyssa-photo"><Photo fallback={hero} fallbackEdit={event.heroEdit} alt="Wedding"/></div><div className="alyssa-vertical">PREMIUM EDITION · IINVITATION</div><div className="alyssa-cover-copy"><span>THE WEDDING OF</span><h1>{event.brideName}<br/><i>&</i><br/>{event.groomName}</h1><small>{props.formattedDate}</small><hr/><em>Yth. Bapak/Ibu/Saudara/i</em><strong>{guestName}</strong><button onClick={onOpen}>BUKA UNDANGAN <ArrowUpRight size={14}/></button></div></section>
  return <div className="ac-template ac-alyssa" data-invite-body><CollectionControls {...props}/>
    <section className="alyssa-hero"><aside>01</aside><div className="alyssa-hero-copy" data-ac-reveal><span>THE WEDDING OF</span><h1>{event.brideName} <i>&</i> {event.groomName}</h1><p>{props.formattedDate}</p></div><div className="alyssa-hero-photo"><Photo fallback={hero} fallbackEdit={event.heroEdit} alt="Wedding"/></div></section>
    <section className="alyssa-prayer ac-pad"><aside>02</aside><div data-ac-reveal><span>OUR PRAYER</span><p>{event.openingText}</p></div></section>
    <section className="alyssa-couple"><article data-ac-reveal><div><span>BRIDE</span><h2>{event.brideFullName}</h2><p>{event.brideParents}</p></div><Photo item={event.gallery[0]} fallback={hero} fallbackEdit={event.heroEdit} alt={event.brideFullName}/></article><article data-ac-reveal><Photo item={event.gallery[1]} fallback={hero} fallbackEdit={event.heroEdit} alt={event.groomFullName}/><div><span>GROOM</span><h2>{event.groomFullName}</h2><p>{event.groomParents}</p></div></article></section>
    <section className="alyssa-date ac-pad"><aside>03</aside><div><span>SAVE THE DATE</span><Countdown date={event.eventDate}/></div></section>
    <section className="alyssa-events ac-pad"><aside>04</aside><EventPair props={props} variant="alyssa-event-pair"/></section>
    {event.featureGuestbook && <section className="alyssa-access ac-pad"><aside>05</aside><AccessCard props={props}/></section>}
    <section className="alyssa-gallery ac-pad"><aside>06</aside><div><span>OUR MOMENT</span><GalleryStrip props={props} className="alyssa-gallery-strip"/></div></section>
    <section className="alyssa-rsvp ac-pad"><aside>07</aside><RsvpBlock props={props}/></section>
    <section className="alyssa-close"><span>END NOTE</span><h2>{event.brideName} & {event.groomName}</h2><p>{event.closingText}</p></section>
  </div>
}
