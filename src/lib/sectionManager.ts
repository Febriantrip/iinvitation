import type { SectionSetting } from '../types'

export const sectionCatalog: Array<{ key: SectionSetting['key']; label: string; description: string; fixed?: boolean }> = [
  { key: 'cover', label: 'Cover / Opening', description: 'Halaman pertama sebelum tamu membuka undangan.', fixed: true },
  { key: 'opening', label: 'Opening / Prayer', description: 'Salam, doa, atau pengantar undangan.' },
  { key: 'couple', label: 'Bride & Groom', description: 'Profil kedua mempelai.' },
  { key: 'story', label: 'Love Story', description: 'Perjalanan atau cerita pasangan.' },
  { key: 'saveDate', label: 'Save The Date', description: 'Countdown dan tanggal utama.' },
  { key: 'events', label: 'Akad & Resepsi', description: 'Detail rangkaian acara dan lokasi.' },
  { key: 'dresscode', label: 'Dresscode', description: 'Palet warna atau panduan busana tamu.' },
  { key: 'access', label: 'Access Card / QR', description: 'Kartu akses atau QR check-in.' },
  { key: 'live', label: 'Live Streaming', description: 'Tautan streaming atau acara daring.' },
  { key: 'frame', label: 'Wedding Frame', description: 'Akses ke frame foto milik klien.' },
  { key: 'gallery', label: 'Gallery', description: 'Foto dan momen pasangan.' },
  { key: 'rsvp', label: 'RSVP & Wishes', description: 'Konfirmasi hadir dan ucapan tamu.' },
  { key: 'gift', label: 'Wedding Gift', description: 'Rekening, alamat kado, atau gift section.' },
  { key: 'closing', label: 'Closing', description: 'Penutup undangan.' },
]

const genericOrder: SectionSetting['key'][] = ['cover','opening','couple','saveDate','events','story','gallery','gift','rsvp','closing','dresscode','access','live','frame']
const arunaOrder: SectionSetting['key'][] = ['cover','opening','couple','story','saveDate','events','dresscode','access','live','frame','gallery','rsvp','gift','closing']
const ivannaOrder: SectionSetting['key'][] = ['cover','opening','couple','story','saveDate','events','access','live','frame','gallery','rsvp','gift','closing','dresscode']
const flawlessOrder: SectionSetting['key'][] = ['cover','opening','couple','saveDate','events','access','dresscode','live','story','gallery','frame','rsvp','gift','closing']
const attariOrder: SectionSetting['key'][] = ['cover','opening','couple','saveDate','events','access','story','gallery','rsvp','closing','dresscode','live','frame','gift']

function defaultOrderForTheme(themeId = '') {
  if (themeId === 'heritage-aruna') return arunaOrder
  if (themeId === 'premium-ivanna-09') return ivannaOrder
  if (themeId === 'premium-flawless-02') return flawlessOrder
  if (/^(heritage-|premium-|moody-)/.test(themeId)) return attariOrder
  return genericOrder
}

export function getDefaultSectionSettings(themeId?: string): SectionSetting[] {
  return defaultOrderForTheme(themeId).map((key, index) => ({ key, enabled: true, order: index, customTitle: '' }))
}

export function normalizeSectionSettings(settings: SectionSetting[] | undefined | null, themeId?: string): SectionSetting[] {
  const defaults = getDefaultSectionSettings(themeId)
  if (!Array.isArray(settings) || !settings.length) return defaults
  const byKey = new Map(settings.map(item => [item.key, item]))
  return defaults
    .map(item => {
      const saved = byKey.get(item.key)
      return saved ? {
        ...item,
        enabled: saved.enabled !== false,
        order: Number.isFinite(Number(saved.order)) ? Number(saved.order) : item.order,
        customTitle: String(saved.customTitle || ''),
      } : item
    })
    .sort((a, b) => a.order - b.order)
    .map((item, index) => ({ ...item, order: index }))
}

export function isSectionEnabled(settings: SectionSetting[] | undefined | null, key: SectionSetting['key']) {
  if (!Array.isArray(settings) || !settings.length) return true
  const found = settings.find(item => item.key === key)
  return found ? found.enabled !== false : true
}

export const sectionSelectors: Record<SectionSetting['key'], string> = {
  cover: [
    '.invite-cover', '.aruna-opening', '.ivanna-cover', '.fl-cover', '.tpl-editorial-cover', '.tpl-film-cover', '.tpl-arch-cover', '.tpl-modern-cover', '.tpl-museum-cover', '.tpl-news-cover', '.tpl-scrap-cover', '.tpl-book-cover', '.tpl-bento-cover',
    '.ameera-cover', '.sandhayu-cover', '.utary-cover', '.flara-cover', '.kila-cover', '.danila-cover', '.beanca-cover', '.ariya-cover', '.alyssa-cover', '.shakira-cover', '.endless-cover', '.sage-cover', '.paper-cover', '.sweet-cover',
  ].join(','),
  opening: [
    '.intro-section', '.aruna-envelope-scene', '.aruna-prayer', '#iv-home', '#fl-prayer', '.tpl-editorial-intro', '.tpl-film-chapter.dark', '.arch-section.blessing', '.modern-section.intro', '.museum-section.statement', '.bento-section.intro', '.scrap-page.intro', '.book-chapter.chapter-one',
    '.ameera-hero', '.sandhayu-hero', '.utary-hero', '.flara-hero', '.kila-prayer', '.danila-credits', '.beanca-hero', '.ariya-hero', '.alyssa-prayer', '.shakira-hero', '.endless-hero', '.sage-hero', '.paper-intro', '.sweet-hero', '.wave-prayer',
  ].join(','),
  couple: [
    '.couple-section', '.aruna-couple', '#iv-couple', '#fl-couple', '.tpl-editorial-couple', '.tpl-film-chapter.photo-chapter', '.arch-section.couple', '.modern-section.couple', '.museum-section.portraits', '.tpl-news-couple', '.scrap-page.couple', '.book-chapter.chapter-two', '.bento-section.couple',
    '.ameera-couple', '.sandhayu-couple', '.utary-couple', '.flara-couple', '.kila-couple', '.danila-cast', '.beanca-couple', '.ariya-couple', '.alyssa-couple', '.shakira-couple', '.endless-couple', '.sage-couple', '.paper-couple', '.sweet-couple', '.wave-couple',
  ].join(','),
  story: [
    '.story-section', '.aruna-journey', '#iv-story', '#fl-story', '.tpl-editorial-story', '.tpl-film-chapter.story', '.arch-section.story', '.modern-section.story', '.museum-section.story', '.tpl-news-story', '.scrap-page.story', '.book-chapter.chapter-four', '.bento-section.story',
    '.ameera-story', '.sandhayu-story', '.utary-story', '.flara-story', '.kila-story', '.danila-story', '.ariya-story', '.shakira-story', '.endless-story', '.sage-story', '.paper-story', '.sweet-story', '.wave-story',
  ].join(','),
  saveDate: [
    '.countdown-section', '.aruna-save-date', '#iv-date', '.fl-countdown', '.tpl-editorial-date', '.tpl-film-chapter.schedule', '.arch-section.countdown-wrap', '.modern-section.date', '.museum-section.time', '.tpl-news-date', '.book-chapter.chapter-three', '.bento-section.date',
    '.ameera-count', '.sandhayu-count', '.utary-count', '.flara-count', '.kila-count', '.danila-date', '.beanca-date', '.ariya-date', '.alyssa-date', '.shakira-date', '.endless-count', '.sage-count', '.paper-count', '.sweet-count', '.wave-date',
  ].join(','),
  events: [
    '.event-section', '.aruna-events', '#iv-event', '#fl-event', '.tpl-editorial-events', '.arch-section.events', '.modern-section.events', '.museum-section.programme', '.tpl-news-events', '.scrap-page.events', '.book-chapter.chapter-five', '.bento-section.schedule',
    '.ameera-events', '.sandhayu-events', '.utary-events', '.flara-events', '.kila-events', '.danila-events', '.beanca-events', '.ariya-events', '.alyssa-events', '.shakira-events', '.endless-events', '.sage-events', '.paper-events', '.sweet-events', '.wave-events',
  ].join(','),
  dresscode: '.aruna-dresscode,.ivanna-extra-dresscode,.dresscode-section,[data-section="dresscode"]',
  access: '.aruna-access,#iv-access,.fl-registration,.ameera-access,.utary-access,.kila-access,.beanca-access,.alyssa-access,.access-section,[data-section="access"]',
  live: '.aruna-live,.fl-stream,.ivanna-live,.live-stream-section,[data-section="live"]',
  frame: '.aruna-frame-section,.fl-frame,.ivanna-frame,.wedding-frame-section,[data-section="frame"]',
  gallery: [
    '.gallery-section', '.aruna-portrait', '#iv-gallery', '#fl-gallery', '.tpl-editorial-gallery', '.tpl-film-chapter.montage', '.arch-section.gallery', '.modern-section.gallery', '.museum-section.archive', '.tpl-news-gallery', '.scrap-page.gallery', '.book-chapter.chapter-six', '.bento-section.gallery',
    '.ameera-gallery', '.sandhayu-gallery', '.utary-gallery', '.flara-gallery', '.kila-gallery', '.danila-gallery', '.beanca-gallery', '.ariya-gallery', '.alyssa-gallery', '.shakira-gallery', '.endless-gallery', '.sage-gallery', '.paper-gallery', '.sweet-gallery', '.wave-gallery',
  ].join(','),
  rsvp: [
    '.rsvp-section', '.aruna-rsvp', '#iv-rsvp', '#fl-rsvp', '.tpl-editorial-rsvp', '.tpl-film-chapter.finale', '.arch-section.rsvp', '.modern-section.rsvp', '.museum-section.response', '.tpl-news-rsvp', '.scrap-page.rsvp', '.book-chapter.chapter-seven', '.bento-section.rsvp',
    '.ameera-rsvp', '.sandhayu-rsvp', '.utary-rsvp', '.flara-rsvp', '.kila-rsvp', '.danila-rsvp', '.beanca-rsvp', '.ariya-rsvp', '.alyssa-rsvp', '.shakira-rsvp', '.endless-rsvp', '.sage-rsvp', '.paper-rsvp', '.sweet-rsvp', '.wave-rsvp',
  ].join(','),
  gift: '.gift-section,.aruna-gift,#iv-gift,#fl-gift,.wedding-gift-section,[data-section="gift"]',
  closing: [
    '.closing-section', '.aruna-closing', '#iv-close', '.fl-closing', '.ameera-close', '.sandhayu-close', '.utary-close', '.flara-close', '.danila-close', '.beanca-close', '.ariya-close', '.alyssa-close', '.shakira-close', '.endless-close', '.sage-close', '.paper-close', '.sweet-close', '.wave-close',
  ].join(','),
}

const headingSelector = ':scope > h2,:scope > .aruna-title,:scope .ivanna-slide-title h2,:scope .fl-section-title h2,:scope > header h2,:scope > div > h2'

function applyCustomTitle(node: HTMLElement, title: string) {
  const heading = node.querySelector<HTMLElement>(headingSelector)
  if (!heading) return
  if (!heading.dataset.iinvOriginalTitle) heading.dataset.iinvOriginalTitle = heading.textContent || ''
  if (title.trim()) heading.textContent = title.trim()
  else if (heading.dataset.iinvOriginalTitle) heading.textContent = heading.dataset.iinvOriginalTitle
}

function uniqueElements(root: HTMLElement, selector: string) {
  const seen = new Set<Element>()
  return Array.from(root.querySelectorAll<HTMLElement>(selector)).filter(node => {
    if (seen.has(node)) return false
    seen.add(node)
    return true
  })
}

export function applySectionLayout(root: HTMLElement, settings: SectionSetting[]) {
  if (!settings.length) return
  const normalized = normalizeSectionSettings(settings)
  const nodes = new Map<SectionSetting['key'], HTMLElement[]>()

  for (const setting of normalized) {
    const found = uniqueElements(root, sectionSelectors[setting.key])
    nodes.set(setting.key, found)
    for (const node of found) {
      node.dataset.iinvSection = setting.key
      node.classList.toggle('iinv-section-hidden', !setting.enabled)
      if (setting.key !== 'cover') applyCustomTitle(node, setting.customTitle || '')
    }
  }

  const groups = new Map<HTMLElement, Array<{ node: HTMLElement; order: number }>>()
  for (const setting of normalized) {
    if (setting.key === 'cover') continue
    for (const node of nodes.get(setting.key) || []) {
      const parent = node.parentElement
      if (!parent) continue
      const list = groups.get(parent) || []
      list.push({ node, order: setting.order })
      groups.set(parent, list)
    }
  }

  for (const [parent, items] of groups) {
    if (items.length < 2) continue
    const deduped = Array.from(new Map(items.map(item => [item.node, item])).values())
    const original = Array.from(parent.children)
    const firstIndex = Math.min(...deduped.map(item => original.indexOf(item.node)))
    if (firstIndex < 0) continue
    const reference = original[firstIndex]
    const marker = document.createComment('iinvitation-section-order')
    parent.insertBefore(marker, reference)
    let cursor: ChildNode = marker
    deduped.sort((a, b) => a.order - b.order).forEach(({ node }) => {
      cursor.after(node)
      cursor = node
    })
    marker.remove()
  }
}
