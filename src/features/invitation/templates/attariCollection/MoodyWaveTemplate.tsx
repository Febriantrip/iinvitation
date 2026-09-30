import { ChevronDown, Heart } from 'lucide-react'
import type { InvitationTemplateProps } from '../shared'
import { Countdown } from '../shared'
import { CollectionControls, Cover, EventPair, GalleryStrip, Photo, RsvpBlock, useCollectionReveal } from './shared'
import '../../../../styles.attari-collection.css'

export function MoodyWaveTemplate(props: InvitationTemplateProps) {
  const { event, opened } = props
  const hero = event.heroImage || event.gallery[0]?.url || ''
  useCollectionReveal(opened)
  if (!opened) return <Cover props={props} className="wave-cover" label="THE WEDDING OF"><div className="wave-cut wave-cut-a"/><div className="wave-cut wave-cut-b"/><div className="wave-orbit">R · G</div></Cover>
  return <div className="ac-template ac-wave" data-invite-body>
    <CollectionControls {...props}/>
    <section className="wave-hero"><div className="wave-hero-photo"><Photo fallback={hero} fallbackEdit={event.heroEdit} alt="Wedding"/></div><div className="wave-liquid one"/><div className="wave-liquid two"/><div className="wave-hero-copy" data-ac-reveal><span>THE WEDDING OF</span><h1>{event.brideName}<br/><i>&</i> {event.groomName}</h1><p>{props.formattedDate}</p><ChevronDown/></div></section>
    <section className="wave-prayer ac-pad"><div className="wave-number">01</div><blockquote data-ac-reveal>{event.openingText}</blockquote><small>Q.S. AR-RUM · 21</small></section>
    <section className="wave-couple ac-pad"><div className="wave-title" data-ac-reveal><span>WE ARE</span><h2>Getting<br/>Married</h2></div><div className="wave-couple-grid"><article data-ac-reveal><Photo item={event.gallery[0]} fallback={hero} fallbackEdit={event.heroEdit} alt={event.brideFullName}/><span>THE BRIDE</span><h3>{event.brideFullName}</h3><p>{event.brideParents}</p></article><div className="wave-amp">&</div><article data-ac-reveal><Photo item={event.gallery[1]} fallback={hero} fallbackEdit={event.heroEdit} alt={event.groomFullName}/><span>THE GROOM</span><h3>{event.groomFullName}</h3><p>{event.groomParents}</p></article></div></section>
    <section className="wave-date ac-pad"><span>SAVE THE</span><h2>Date & Time</h2><Countdown date={event.eventDate}/></section>
    <section className="wave-events ac-pad"><EventPair props={props} variant="wave-events-pair"/></section>
    <section className="wave-story ac-pad"><div data-ac-reveal><span>OUR</span><h2>Love Story</h2><p>{event.storyText}</p></div><Heart fill="currentColor"/></section>
    <section className="wave-gallery ac-pad"><span>GALLERY</span><h2>Our Moment</h2><GalleryStrip props={props} className="wave-gallery-strip"/></section>
    <section className="wave-rsvp ac-pad"><RsvpBlock props={props}/></section>
    <section className="wave-close"><small>WITH LOVE</small><h2>{event.brideName} & {event.groomName}</h2><p>{event.closingText}</p></section>
  </div>
}
