import { ArrowRight, Circle } from 'lucide-react'
import type { InvitationTemplateProps } from '../shared'
import { Countdown } from '../shared'
import { AccessCard, CollectionControls, EventPair, GalleryStrip, Photo, RsvpBlock, useCollectionReveal } from './shared'
import '../../../../styles.attari-collection.css'

export function PremiumBeancaTemplate(props: InvitationTemplateProps) {
  const { event, guestName, opened, onOpen } = props
  const hero = event.heroImage || event.gallery[0]?.url || ''
  useCollectionReveal(opened)
  if (!opened) return <section className="beanca-cover"><div className="beanca-cover-grid"><div className="beanca-photo"><Photo fallback={hero} fallbackEdit={event.heroEdit} alt="Wedding"/></div><div className="beanca-blank"><Circle/><span>THE WEDDING OF</span><h1>{event.brideName}<br/><i>&</i><br/>{event.groomName}</h1><small>{props.formattedDate}</small></div></div><div className="beanca-guest"><em>DEAR</em><strong>{guestName}</strong><button onClick={onOpen}>ENTER <ArrowRight size={15}/></button></div></section>
  return <div className="ac-template ac-beanca" data-invite-body><CollectionControls {...props}/>
    <section className="beanca-hero"><div className="beanca-hero-left"><span>01 / HOME</span><h1 data-ac-reveal>{event.brideName}<i>&</i>{event.groomName}</h1><p>{event.openingText}</p></div><div className="beanca-hero-right"><Photo fallback={hero} fallbackEdit={event.heroEdit} alt="Wedding"/></div></section>
    <section className="beanca-couple"><article data-ac-reveal><div className="beanca-num">02</div><Photo item={event.gallery[0]} fallback={hero} fallbackEdit={event.heroEdit} alt={event.brideFullName}/><div><span>BRIDE</span><h2>{event.brideFullName}</h2><p>{event.brideParents}</p></div></article><article data-ac-reveal><div className="beanca-num">03</div><div><span>GROOM</span><h2>{event.groomFullName}</h2><p>{event.groomParents}</p></div><Photo item={event.gallery[1]} fallback={hero} fallbackEdit={event.heroEdit} alt={event.groomFullName}/></article></section>
    <section className="beanca-date ac-pad"><span>04 / DATE</span><h2>{props.formattedDate}</h2><Countdown date={event.eventDate}/></section>
    <section className="beanca-events ac-pad"><span>05 / EVENT</span><EventPair props={props} variant="beanca-event-pair"/></section>
    {event.featureGuestbook && <section className="beanca-access ac-pad"><span>06 / ACCESS</span><AccessCard props={props}/></section>}
    <section className="beanca-gallery ac-pad"><span>07 / GALLERY</span><GalleryStrip props={props} className="beanca-gallery-strip"/></section>
    <section className="beanca-rsvp ac-pad"><span>08 / RSVP</span><RsvpBlock props={props}/></section>
    <section className="beanca-close"><span>09 / FIN</span><h2>See you<br/>there.</h2><p>{event.brideName} & {event.groomName}</p></section>
  </div>
}
