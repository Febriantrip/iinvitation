import { BookOpen, Heart, MapPin } from 'lucide-react'
import type { InvitationTemplateProps } from './shared'
import { Countdown, EditedImage, GuestRecipient, RsvpPanel } from './shared'

export function StorybookTemplate(props: InvitationTemplateProps) {
  const { event, guestName, opened, onOpen, formattedDate } = props
  return <div className="structural-template template-storybook">
    <section className="tpl-book-cover">
      <div className="book-spine"/>
      <div className="book-page left"><span>ONCE UPON A FOREVER</span><h1>{event.brideName}<i>&</i>{event.groomName}</h1><p>{formattedDate}</p><GuestRecipient guestName={guestName}/><button onClick={onOpen}><BookOpen size={16}/> Open Our Story</button></div>
      <div className="book-page right"><div className="book-photo"><EditedImage url={event.heroImage} edit={event.heroEdit} alt={`${event.brideName} & ${event.groomName}`}/></div><span className="book-caption">A love story in seven chapters</span></div>
    </section>

    <div data-invite-body className={`structural-body ${opened ? 'visible' : ''}`}>
      <section className="book-chapter chapter-one"><div className="chapter-number">Chapter I</div><div><h2>The invitation</h2><p className="dropcap">{event.openingText}</p></div></section>
      <section className="book-chapter chapter-two"><div className="chapter-number">Chapter II</div><div className="book-couple-pages"><article><div className="book-oval">{event.gallery[0] ? <EditedImage url={event.gallery[0].url} edit={event.gallery[0].edit} alt={event.brideFullName}/> : <EditedImage url={event.heroImage} edit={event.heroEdit} alt={event.brideFullName}/>}</div><span>The heroine</span><h3>{event.brideFullName}</h3><p>{event.brideParents}</p></article><i>&</i><article><div className="book-oval">{event.gallery[1] ? <EditedImage url={event.gallery[1].url} edit={event.gallery[1].edit} alt={event.groomFullName}/> : <EditedImage url={event.heroImage} edit={event.heroEdit} alt={event.groomFullName}/>}</div><span>The hero</span><h3>{event.groomFullName}</h3><p>{event.groomParents}</p></article></div></section>
      <section className="book-chapter chapter-three"><div className="chapter-number">Chapter III</div><div><h2>A date written in ink</h2><p>{formattedDate}</p><Countdown date={event.eventDate}/></div></section>
      <section className="book-chapter chapter-four"><div className="chapter-number">Chapter IV</div><div className="book-events"><article><span>First scene</span><h3>Akad Nikah</h3><strong>{event.akadTime}</strong><p>{formattedDate}</p></article><article><span>Second scene</span><h3>Resepsi</h3><strong>{event.receptionTime}</strong><p>{formattedDate}</p></article><aside><MapPin size={18}/><h3>{event.venueName}</h3><p>{event.venueAddress}</p><a href={event.mapUrl} target="_blank" rel="noreferrer">Open map</a></aside></div></section>
      <section className="book-chapter chapter-five"><div className="chapter-number">Chapter V</div><div><h2>The pages before today</h2><blockquote>{event.storyText}</blockquote></div></section>
      <section className="book-chapter chapter-six"><div className="chapter-number">Chapter VI</div><div><h2>Illustrated memories</h2><div className="book-gallery">{event.gallery.map((img,index)=><figure key={img.id}><EditedImage url={img.url} edit={img.edit} alt={img.caption || `Illustration ${index+1}`}/><figcaption>Plate {index+1}. {img.caption || 'A chapter we keep.'}</figcaption></figure>)}</div></div></section>
      <section className="book-chapter chapter-seven"><div className="chapter-number">Final Chapter</div><div><h2>Will you be part of this page?</h2><p>{event.closingText}</p><RsvpPanel {...props} variant="book-rsvp-form"/></div></section>
      <footer className="book-footer"><Heart size={15}/><strong>And so, their forever begins.</strong><span>{event.brideName} & {event.groomName}</span></footer>
    </div>
  </div>
}
