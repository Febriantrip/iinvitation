import { Heart } from 'lucide-react'
import type { InvitationTemplateProps } from './shared'
import { Countdown, EditedImage, EventInfo, GuestRecipient, RsvpPanel } from './shared'

export function EditorialSplitTemplate(props: InvitationTemplateProps) {
  const { event, guestName, opened, onOpen, formattedDate } = props
  const bridePhoto = event.gallery[0]
  const groomPhoto = event.gallery[1]
  return <div className="structural-template template-editorial-split">
    <section className="tpl-editorial-cover">
      <div className="tpl-editorial-copy">
        <span className="tpl-index">VOL. 01 · WEDDING EDITION</span>
        <div className="tpl-editorial-title"><small>The marriage of</small><h1>{event.brideName}<i>&</i>{event.groomName}</h1></div>
        <p className="tpl-editorial-date">{formattedDate}</p>
        <GuestRecipient guestName={guestName}/>
        <button className="tpl-open-button" onClick={onOpen}><Heart size={16} fill="currentColor"/> Open Invitation</button>
      </div>
      <div className="tpl-editorial-hero"><EditedImage url={event.heroImage} edit={event.heroEdit} alt={`${event.brideName} & ${event.groomName}`}/><span>01 / portrait</span></div>
    </section>

    <div data-invite-body className={`structural-body ${opened ? 'visible' : ''}`}>
      <section className="tpl-editorial-intro">
        <div><span className="tpl-section-no">01</span><h2>Two names.<br/>One chapter.</h2></div>
        <div><p>{event.openingText}</p><Countdown date={event.eventDate} compact/></div>
      </section>

      <section className="tpl-editorial-couple">
        <article><EditedImage url={bridePhoto?.url || event.heroImage} edit={bridePhoto?.edit || event.heroEdit} alt={event.brideFullName}/><div><span>THE BRIDE</span><h3>{event.brideFullName}</h3><p>{event.brideParents}</p></div></article>
        <div className="tpl-editorial-amp">&</div>
        <article className="reverse"><EditedImage url={groomPhoto?.url || event.heroImage} edit={groomPhoto?.edit || event.heroEdit} alt={event.groomFullName}/><div><span>THE GROOM</span><h3>{event.groomFullName}</h3><p>{event.groomParents}</p></div></article>
      </section>

      <section className="tpl-editorial-events">
        <header><span>02 / THE DATE</span><h2>Where the story becomes a celebration.</h2></header>
        <div className="tpl-event-rail"><EventInfo event={event} formattedDate={formattedDate} title="Akad Nikah" time={event.akadTime}/><EventInfo event={event} formattedDate={formattedDate} title="Resepsi" time={event.receptionTime} icon="calendar"/></div>
      </section>

      <section className="tpl-editorial-story"><span>03 / OUR STORY</span><blockquote>{event.storyText}</blockquote></section>

      <section className="tpl-editorial-gallery">
        <header><span>04 / SELECTED FRAMES</span><h2>Moments, left unpolished.</h2></header>
        <div>{event.gallery.map((img, index) => <figure key={img.id} className={`frame-${(index % 4) + 1}`}><EditedImage url={img.url} edit={img.edit} alt={img.caption || `Frame ${index + 1}`}/><figcaption>{String(index + 1).padStart(2,'0')} {img.caption || 'A moment to remember'}</figcaption></figure>)}</div>
      </section>

      <section className="tpl-editorial-rsvp"><div><span>05 / RSVP</span><h2>Save a seat<br/>in our story.</h2><p>{event.closingText}</p></div><RsvpPanel {...props} variant="editorial-rsvp-form"/></section>
      <footer className="tpl-editorial-footer"><strong>{event.brideName} × {event.groomName}</strong><span>Thank you for being part of our beginning.</span></footer>
    </div>
  </div>
}
