import { ArrowDown, Heart } from 'lucide-react'
import type { InvitationTemplateProps } from '../shared'
import { Countdown } from '../shared'
import { AccessCard, CollectionControls, EventPair, GalleryStrip, Photo, RsvpBlock, useCollectionReveal } from './shared'
import '../../../../styles.attari-collection.css'

export function PremiumKilaTemplate(props: InvitationTemplateProps) {
  const { event, guestName, opened, onOpen } = props
  const hero = event.heroImage || event.gallery[0]?.url || ''
  const d = new Date(event.eventDate)
  const dd = String(d.getDate()).padStart(2,'0'), mm = String(d.getMonth()+1).padStart(2,'0'), yy = d.getFullYear()
  useCollectionReveal(opened)
  if (!opened) return <section className="kila-cover"><div className="kila-date-rail"><b>{dd}/{mm}</b><strong>{yy}</strong></div><div className="kila-cover-photo"><Photo fallback={hero} fallbackEdit={event.heroEdit} alt="Wedding"/></div><div className="kila-cover-copy"><span>THE WEDDING OF</span><h1>{event.brideName}<br/><i>&</i> {event.groomName}</h1><div className="kila-guest"><small>KEPADA</small><strong>{guestName}</strong><p>Dengan segala hormat, kami mengundang Anda untuk menghadiri acara pernikahan kami.</p></div><button onClick={onOpen}>BUKA UNDANGAN <ArrowDown size={14}/></button></div></section>
  return <div className="ac-template ac-kila" data-invite-body><CollectionControls {...props}/>
    <section className="kila-hero"><div className="kila-hero-photo"><Photo fallback={hero} fallbackEdit={event.heroEdit} alt="Wedding"/></div><div className="kila-grid-overlay"/><div className="kila-hero-copy" data-ac-reveal><small>{dd}/{mm} · {yy}</small><span>THE WEDDING OF</span><h1>{event.brideName}<br/><i>&</i><br/>{event.groomName}</h1></div></section>
    <section className="kila-prayer ac-pad"><span>01 / PRAYER</span><blockquote data-ac-reveal>{event.openingText}</blockquote></section>
    <section className="kila-couple ac-pad"><div className="kila-couple-head"><span>THE BRIDE</span><span>THE GROOM</span></div><div className="kila-couple-grid"><article data-ac-reveal><Photo item={event.gallery[0]} fallback={hero} fallbackEdit={event.heroEdit} alt={event.brideFullName}/><h3>{event.brideFullName}</h3><p>{event.brideParents}</p></article><article data-ac-reveal><Photo item={event.gallery[1]} fallback={hero} fallbackEdit={event.heroEdit} alt={event.groomFullName}/><h3>{event.groomFullName}</h3><p>{event.groomParents}</p></article></div></section>
    <section className="kila-story ac-pad"><span>JOURNEY OF LOVE</span><h2>Four chapters,<br/>one decision.</h2><p data-ac-reveal>{event.storyText}</p></section>
    <section className="kila-count ac-pad"><div className="kila-big-date">{dd}<i>/</i>{mm}</div><Countdown date={event.eventDate}/></section>
    <section className="kila-events ac-pad"><EventPair props={props} variant="kila-event-pair"/></section>
    {event.featureGuestbook && <section className="kila-access ac-pad"><AccessCard props={props} className="kila-access-card"/></section>}
    <section className="kila-gallery ac-pad"><h2>OUR<br/>MOMENT</h2><GalleryStrip props={props} className="kila-gallery-strip"/></section>
    <section className="kila-rsvp ac-pad"><RsvpBlock props={props}/></section>
    <section className="kila-close"><Heart/><span>THANK YOU</span><h2>{event.brideName} & {event.groomName}</h2></section>
  </div>
}
