import { Heart, MapPin, Sparkles } from 'lucide-react'
import type { InvitationTemplateProps } from './shared'
import { Countdown, EditedImage, GuestRecipient, RsvpPanel } from './shared'

export function ScrapbookTemplate(props: InvitationTemplateProps) {
  const { event, guestName, opened, onOpen, formattedDate } = props
  const gallery = event.gallery
  return <div className="structural-template template-scrapbook">
    <section className="tpl-scrap-cover">
      <div className="scrap-doodle one">♡</div><div className="scrap-doodle two">✦</div><div className="scrap-tape tape-a"/><div className="scrap-tape tape-b"/>
      <figure className="scrap-polaroid hero"><EditedImage url={event.heroImage} edit={event.heroEdit} alt={`${event.brideName} & ${event.groomName}`}/><figcaption>our favorite day ♡</figcaption></figure>
      <div className="scrap-cover-note"><span>save this date!</span><h1>{event.brideName}<i>&</i>{event.groomName}</h1><p>{formattedDate}</p><GuestRecipient guestName={guestName}/><button onClick={onOpen}><Heart size={15} fill="currentColor"/> buka album kami</button></div>
    </section>

    <div data-invite-body className={`structural-body ${opened ? 'visible' : ''}`}>
      <section className="scrap-page intro"><div className="scrap-paper"><span className="scrap-label">note #01</span><h2>Hi, favorite people!</h2><p>{event.openingText}</p><div className="scrap-stamp">{formattedDate}</div></div><Countdown date={event.eventDate}/></section>
      <section className="scrap-page couple"><article className="scrap-person bride"><figure className="scrap-polaroid">{gallery[0] ? <EditedImage url={gallery[0].url} edit={gallery[0].edit} alt={event.brideFullName}/> : <EditedImage url={event.heroImage} edit={event.heroEdit} alt={event.brideFullName}/>}<figcaption>she said yes ✨</figcaption></figure><div><span>the bride</span><h3>{event.brideFullName}</h3><p>{event.brideParents}</p></div></article><div className="scrap-heart">♥</div><article className="scrap-person groom"><figure className="scrap-polaroid">{gallery[1] ? <EditedImage url={gallery[1].url} edit={gallery[1].edit} alt={event.groomFullName}/> : <EditedImage url={event.heroImage} edit={event.heroEdit} alt={event.groomFullName}/>}<figcaption>he said absolutely!</figcaption></figure><div><span>the groom</span><h3>{event.groomFullName}</h3><p>{event.groomParents}</p></div></article></section>
      <section className="scrap-page events"><div className="scrap-event-card yellow"><span>01</span><h3>Akad Nikah</h3><strong>{formattedDate}</strong><p>{event.akadTime}</p></div><div className="scrap-event-card pink"><span>02</span><h3>Resepsi</h3><strong>{formattedDate}</strong><p>{event.receptionTime}</p></div><div className="scrap-map-card"><MapPin size={22}/><h3>{event.venueName}</h3><p>{event.venueAddress}</p><a href={event.mapUrl} target="_blank" rel="noreferrer">lihat maps ↗</a></div></section>
      <section className="scrap-page story"><span className="scrap-label">tiny timeline</span><h2>How we got here</h2><div className="scrap-story-line"><i/><p>{event.storyText}</p><Sparkles size={20}/></div></section>
      <section className="scrap-page gallery"><header><span className="scrap-label">photo dump</span><h2>Core memories</h2></header><div className="scrap-collage">{gallery.map((img,index) => <figure className={`scrap-polaroid tilt-${index%6}`} key={img.id}><EditedImage url={img.url} edit={img.edit} alt={img.caption || `Memory ${index+1}`}/><figcaption>{img.caption || `memory #${index+1}`}</figcaption></figure>)}</div></section>
      <section className="scrap-page rsvp"><div className="scrap-rsvp-note"><span className="scrap-label">one last note</span><h2>Are you coming?</h2><p>{event.closingText}</p></div><RsvpPanel {...props} variant="scrap-rsvp-form"/></section>
      <footer className="scrap-footer">made with too many photos & a lot of love · {event.brideName} + {event.groomName}</footer>
    </div>
  </div>
}
