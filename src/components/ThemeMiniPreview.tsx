import type { EventData } from '../types'
import type { ThemeDefinition, TemplateLayout } from '../lib/themes'

function MiniNames({ event }: { event: EventData }) {
  return <strong>{event.brideName || 'Bride'} <i>&</i> {event.groomName || 'Groom'}</strong>
}

export function ThemeMiniPreview({ theme, event }: { theme: ThemeDefinition; event: EventData }) {
  const hero = event.heroImage || 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=70'
  const date = new Date(event.eventDate).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }).replaceAll('/', ' . ')
  const layout: TemplateLayout = theme.layout || 'classic-flow'

  if (layout === 'editorial-split') return <div className="mini-struct mini-editorial">
    <div className="mini-editorial-copy"><span>VOL.01</span><MiniNames event={event}/><small>{date}</small></div><div className="mini-editorial-photo" style={{backgroundImage:`url(${hero})`}}/>
  </div>
  if (layout === 'newspaper') return <div className="mini-struct mini-newspaper">
    <div className="mini-news-mast">THE VOW TIMES</div><div className="mini-news-rule"/><div className="mini-news-grid"><div><span>BREAKING NEWS</span><MiniNames event={event}/><small>{date}</small></div><div style={{backgroundImage:`url(${hero})`}}/></div>
  </div>
  if (layout === 'cinematic-chapters') return <div className="mini-struct mini-film" style={{backgroundImage:`url(${hero})`}}><div className="mini-film-bars top"/><div className="mini-film-bars bottom"/><div><span>A WEDDING FILM</span><MiniNames event={event}/><small>PREMIERES · {date}</small></div></div>
  if (layout === 'scrapbook') return <div className="mini-struct mini-scrap"><div className="mini-scrap-note"><span>save this date!</span><MiniNames event={event}/><small>{date}</small></div><div className="mini-polaroid"><div style={{backgroundImage:`url(${hero})`}}/><span>our favorite day ♡</span></div><i className="mini-tape"/></div>
  if (layout === 'islamic-arch') return <div className="mini-struct mini-islamic"><div className="mini-arch-photo" style={{backgroundImage:`url(${hero})`}}/><div className="mini-arch-copy"><span>THE WEDDING OF</span><MiniNames event={event}/><small>{date}</small></div></div>
  if (layout === 'museum') return <div className="mini-struct mini-museum"><div className="mini-museum-head">PRIVATE EXHIBITION <span>{date}</span></div><div className="mini-museum-wall"><div className="mini-museum-art"><div style={{backgroundImage:`url(${hero})`}}/></div><div><span>WORK NO.001</span><MiniNames event={event}/></div></div></div>
  if (layout === 'storybook') return <div className="mini-struct mini-book"><div className="mini-book-page"><span>ONCE UPON A FOREVER</span><MiniNames event={event}/><small>{date}</small></div><div className="mini-book-spine"/><div className="mini-book-page photo" style={{backgroundImage:`url(${hero})`}}/></div>
  if (layout === 'bento') return <div className="mini-struct mini-bento"><div className="mini-bento-title"><span>THE WEDDING</span><MiniNames event={event}/></div><div className="mini-bento-photo" style={{backgroundImage:`url(${hero})`}}/><div className="mini-bento-date">{date}</div><div className="mini-bento-dot">♡</div></div>
  if (layout === 'modern-arch') return <div className="mini-struct mini-modern-arch"><div className="mini-modern-copy"><span>THE WEDDING OF</span><MiniNames event={event}/><small>{date}</small></div><div className="mini-modern-photo" style={{backgroundImage:`url(${hero})`}}/></div>
  if (layout === 'heritage-aruna') return <div className="mini-struct mini-heritage-aruna"><div className="mini-aruna-photo" style={{backgroundImage:`url(${hero})`}}/><div className="mini-aruna-copy"><span>THE WEDDING OF</span><MiniNames event={event}/><small>{date}</small></div><div className="mini-aruna-envelope"/><div className="mini-aruna-frame"/></div>
  if (layout === 'premium-flawless') return <div className="mini-struct mini-premium-flawless"><div className="mini-flawless-photo" style={{backgroundImage:`url(${hero})`}}/><div className="mini-flawless-floral">❀</div><div className="mini-flawless-mono">{(event.brideName || 'B')[0]}<small>AND</small>{(event.groomName || 'G')[0]}</div><div className="mini-flawless-copy"><span>THE WEDDING OF</span><MiniNames event={event}/><small>{date}</small></div></div>
  if (layout === 'premium-ivanna') return <div className="mini-struct mini-premium-ivanna"><div className="mini-ivanna-left"><div className="mini-ivanna-photo" style={{backgroundImage:`url(${hero})`}}/><div className="mini-ivanna-copy"><span>THE WEDDING OF</span><MiniNames event={event}/><small>{date}</small></div></div><div className="mini-ivanna-right" style={{backgroundImage:`url(${hero})`}}><b>☰</b><span>THE WEDDING OF</span><MiniNames event={event}/><i>⛶  ♪</i></div></div>
  if (['heritage-utary','heritage-sandhayu','heritage-ameera','premium-flara','premium-kila','premium-danila','premium-beanca','premium-ariya','premium-alyssa','premium-shakira','premium-endless-love','premium-sage','moody-papercut','moody-wave','moody-sweetpink'].includes(layout)) return <div className={`mini-struct mini-collection mini-${layout}`}><div className="mini-collection-photo" style={{backgroundImage:`url(${hero})`}}/><div className="mini-collection-shape a"/><div className="mini-collection-shape b"/><div className="mini-collection-copy"><span>{theme.catalog?.series || theme.category}</span><MiniNames event={event}/><small>{date}</small></div></div>

  return <div className={`theme-mini ${theme.className}`}>
    <div className="theme-mini-photo" style={{ backgroundImage: `url(${hero})` }}/>
    <div className="theme-mini-overlay"><span>The Wedding Of</span><MiniNames event={event}/><small>{date}</small></div>
    {theme.badge && <b className="theme-mini-badge">{theme.badge}</b>}
  </div>
}
