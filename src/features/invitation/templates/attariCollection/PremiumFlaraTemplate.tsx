import { Flower2, Heart } from 'lucide-react'
import type { InvitationTemplateProps } from '../shared'
import { Countdown } from '../shared'
import { CollectionControls, EventPair, GalleryStrip, Photo, RsvpBlock, useCollectionReveal } from './shared'
import '../../../../styles.attari-collection.css'

export function PremiumFlaraTemplate(props: InvitationTemplateProps) {
  const { event, guestName, opened, onOpen } = props
  const hero = event.heroImage || event.gallery[0]?.url || ''
  useCollectionReveal(opened)
  if (!opened) return <section className="flara-cover"><div className="flara-flower f1"><Flower2/></div><div className="flara-flower f2"><Flower2/></div><div className="flara-photo"><Photo fallback={hero} fallbackEdit={event.heroEdit} alt="Wedding"/></div><div className="flara-cover-copy"><span>THE WEDDING OF</span><h1>{event.brideName}<i>&</i>{event.groomName}</h1><small>{props.formattedDate}</small><div><em>TO</em><strong>{guestName}</strong></div><button onClick={onOpen}><Heart size={14}/> OPEN INVITATION</button></div></section>
  return <div className="ac-template ac-flara" data-invite-body><CollectionControls {...props}/>
    <section className="flara-hero"><div className="flara-copy" data-ac-reveal><small>WE FOUND LOVE</small><h1>{event.brideName}<br/><i>&</i><br/>{event.groomName}</h1><p>{event.openingText}</p></div><div className="flara-photo-stack"><Photo fallback={hero} fallbackEdit={event.heroEdit} alt="Wedding"/><Photo item={event.gallery[2]} fallback={hero} fallbackEdit={event.heroEdit} alt="Moment"/></div></section>
    <section className="flara-couple ac-pad"><h2 data-ac-reveal>Blooming<br/>together.</h2><div className="flara-couple-grid"><article data-ac-reveal><Photo item={event.gallery[0]} fallback={hero} fallbackEdit={event.heroEdit} alt={event.brideFullName}/><span>THE BRIDE</span><h3>{event.brideFullName}</h3></article><article data-ac-reveal><Photo item={event.gallery[1]} fallback={hero} fallbackEdit={event.heroEdit} alt={event.groomFullName}/><span>THE GROOM</span><h3>{event.groomFullName}</h3></article></div></section>
    <section className="flara-count ac-pad"><span>COUNTING THE PETALS</span><Countdown date={event.eventDate}/></section>
    <section className="flara-events ac-pad"><EventPair props={props} variant="flara-event-pair"/></section>
    <section className="flara-story ac-pad" data-ac-reveal><Flower2/><span>OUR STORY</span><p>{event.storyText}</p></section>
    <section className="flara-gallery ac-pad"><GalleryStrip props={props} className="flara-gallery-strip"/></section>
    <section className="flara-rsvp ac-pad"><RsvpBlock props={props}/></section>
    <section className="flara-close"><Flower2/><h2>Forever<br/>in bloom</h2><p>{event.brideName} & {event.groomName}</p></section>
  </div>
}
