import { CalendarDays, Heart } from 'lucide-react'
import type { InvitationTemplateProps } from './shared'
import { Countdown, EditedImage, EventInfo, GuestRecipient, RsvpPanel } from './shared'

export function NewspaperTemplate(props: InvitationTemplateProps) {
  const { event, guestName, opened, onOpen, formattedDate } = props
  return <div className="structural-template template-newspaper">
    <section className="tpl-news-cover">
      <div className="tpl-news-topline"><span>THE WEDDING CHRONICLE</span><span>EST. FOREVER</span></div>
      <div className="tpl-news-masthead">The Vow Times</div>
      <div className="tpl-news-meta"><span>{formattedDate}</span><span>Special Wedding Edition</span><span>One Love · One Future</span></div>
      <div className="tpl-news-lead">
        <div className="tpl-news-headline"><span>BREAKING: TWO HEARTS SAY YES</span><h1>{event.brideName} & {event.groomName}</h1><p>{event.openingText}</p></div>
        <figure><EditedImage url={event.heroImage} edit={event.heroEdit} alt={`${event.brideName} & ${event.groomName}`}/><figcaption>Exclusive portrait of the happy couple.</figcaption></figure>
      </div>
      <div className="tpl-news-invite"><GuestRecipient guestName={guestName} compact/><button onClick={onOpen}><Heart size={15}/> Read The Invitation</button></div>
    </section>

    <div data-invite-body className={`structural-body ${opened ? 'visible' : ''}`}>
      <section className="tpl-news-section tpl-news-couple">
        <header><span>PEOPLE</span><h2>Meet the two names behind today’s headline</h2></header>
        <div className="tpl-news-columns">
          <article><span>THE BRIDE</span><h3>{event.brideFullName}</h3><p>{event.brideParents}</p></article>
          <div className="tpl-news-monogram">&</div>
          <article><span>THE GROOM</span><h3>{event.groomFullName}</h3><p>{event.groomParents}</p></article>
        </div>
      </section>

      <section className="tpl-news-section tpl-news-date">
        <div><span>COUNTDOWN</span><h2>The date everyone is talking about</h2><p>{formattedDate}</p></div><Countdown date={event.eventDate}/>
      </section>

      <section className="tpl-news-section tpl-news-events">
        <header><span>AGENDA</span><h2>Today’s programme</h2></header>
        <div><EventInfo event={event} formattedDate={formattedDate} title="Akad Nikah" time={event.akadTime}/><EventInfo event={event} formattedDate={formattedDate} title="Resepsi" time={event.receptionTime} icon="calendar"/></div>
      </section>

      <section className="tpl-news-section tpl-news-story"><span>FEATURE</span><h2>How it all began</h2><p>{event.storyText}</p><aside><CalendarDays size={18}/><strong>{formattedDate}</strong><span>{event.venueName}</span></aside></section>

      <section className="tpl-news-section tpl-news-gallery"><header><span>PHOTO DESK</span><h2>Pictures worth a thousand vows</h2></header><div>{event.gallery.map((img,index) => <figure key={img.id}><EditedImage url={img.url} edit={img.edit} alt={img.caption || `Photo ${index+1}`}/><figcaption>PHOTO {String(index+1).padStart(2,'0')} · {img.caption || 'Wedding archive'}</figcaption></figure>)}</div></section>

      <section className="tpl-news-section tpl-news-rsvp"><header><span>READER RESPONSE</span><h2>Will you be there?</h2><p>{event.closingText}</p></header><RsvpPanel {...props} variant="news-rsvp-form"/></section>
      <footer className="tpl-news-footer"><strong>THE VOW TIMES</strong><span>{event.brideName} & {event.groomName} · {formattedDate}</span></footer>
    </div>
  </div>
}
