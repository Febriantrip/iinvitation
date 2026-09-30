export type ThemeCategory =
  | 'Elegan'
  | 'Budaya'
  | 'Formal'
  | 'Slide'
  | 'Simple'
  | 'Bunga'
  | 'Gold'
  | 'Colorful'
  | 'Muslim'
  | 'Modern'

export type TemplateLayout =
  | 'classic-flow'
  | 'editorial-split'
  | 'newspaper'
  | 'cinematic-chapters'
  | 'scrapbook'
  | 'islamic-arch'
  | 'museum'
  | 'storybook'
  | 'bento'
  | 'modern-arch'
  | 'heritage-aruna'
  | 'premium-ivanna'
  | 'premium-flawless'
  | 'heritage-utary'
  | 'heritage-sandhayu'
  | 'heritage-ameera'
  | 'premium-flara'
  | 'premium-kila'
  | 'premium-danila'
  | 'premium-beanca'
  | 'premium-ariya'
  | 'premium-alyssa'
  | 'premium-shakira'
  | 'premium-endless-love'
  | 'premium-sage'
  | 'moody-papercut'
  | 'moody-wave'
  | 'moody-sweetpink'

export interface WebsiteCatalogMeta {
  series: string
  category: string
  price: string
  oldPrice: string
  badge?: string
  previewLayout: string
  tone: string
}

export interface ThemeDefinition {
  id: string
  name: string
  category: ThemeCategory
  description: string
  className: string
  layout?: TemplateLayout
  palette: [string, string, string, string]
  badge?: string
  keywords?: string[]
  /** Jika ada, desain ini otomatis tampil di katalog website Iinvitation. */
  catalog?: WebsiteCatalogMeta
}

/**
 * Theme library is intentionally original. The categories follow common
 * invitation-library browsing patterns, while every visual system below uses
 * our own CSS, spacing, ornament, palette, and composition.
 */
export const themes: ThemeDefinition[] = [
  {
    id: 'botanical-serenity',
    name: 'Botanical Serenity',
    category: 'Bunga',
    description: 'Ivory, sage, bentuk organik, dan suasana garden wedding yang lembut.',
    className: 'theme-botanical',
    palette: ['#f8f5ee', '#315748', '#d6c7a6', '#9eb3a7'],
    badge: 'Popular',
    catalog: { series: 'Garden', category: 'Floral', price: 'Rp 179.000', oldPrice: 'Rp 259.000', previewLayout: 'botanical', tone: 'green' },
    keywords: ['garden', 'sage', 'floral', 'natural'],
  },
  {
    id: 'midnight-gold',
    name: 'Midnight Gold',
    category: 'Gold',
    description: 'Hitam malam, aksen champagne gold, frame geometris, terasa formal dan mewah.',
    className: 'theme-midnight',
    palette: ['#111312', '#d7b46a', '#f2ead9', '#4b4030'],
    catalog: { series: 'Nocturne', category: 'Elegant', price: 'Rp 199.000', oldPrice: 'Rp 299.000', previewLayout: 'gold', tone: 'black' },
    keywords: ['dark', 'luxury', 'black', 'gold'],
  },
  {
    id: 'java-heritage',
    name: 'Java Heritage',
    category: 'Budaya',
    description: 'Terracotta, cokelat kayu, ornament geometris bernuansa Nusantara tanpa menyalin motif tertentu.',
    className: 'theme-java',
    palette: ['#efe2cf', '#6f3525', '#b66c45', '#2f3a2f'],
    keywords: ['nusantara', 'tradisional', 'terracotta', 'heritage'],
  },
  {
    id: 'editorial-blush',
    name: 'Editorial Blush',
    category: 'Modern',
    description: 'Layout editorial, tipografi besar, blush dan espresso untuk pasangan yang ingin tampilan fashion-forward.',
    className: 'theme-editorial',
    palette: ['#f5e8e4', '#382d2b', '#ba8e86', '#fffaf7'],
    badge: 'Editorial',
    keywords: ['fashion', 'modern', 'blush', 'magazine'],
  },
  {
    id: 'coastal-air',
    name: 'Coastal Air',
    category: 'Simple',
    description: 'Putih, biru abu, garis tipis, sangat ringan dan bersih untuk acara indoor maupun outdoor.',
    className: 'theme-coastal',
    palette: ['#f6f9fb', '#36596f', '#aac1cf', '#ffffff'],
    keywords: ['minimal', 'blue', 'clean', 'coastal'],
  },
  {
    id: 'classic-ivory',
    name: 'Classic Ivory',
    category: 'Elegan',
    description: 'Klasik formal dengan ivory hangat, serif lembut, frame simetris, dan detail champagne.',
    className: 'theme-classic',
    palette: ['#fbf7ef', '#4c443a', '#c5a66b', '#e9dfce'],
    keywords: ['classic', 'ivory', 'formal', 'timeless'],
  },
  {
    id: 'silver-atelier',
    name: 'Silver Atelier',
    category: 'Formal',
    description: 'Abu perak, putih dingin, garis arsitektural, dan komposisi formal bergaya ballroom.',
    className: 'theme-silver',
    palette: ['#f3f4f5', '#30363b', '#aeb6bd', '#ffffff'],
    badge: 'New',
    keywords: ['silver', 'formal', 'ballroom', 'grey'],
  },
  {
    id: 'azure-bloom',
    name: 'Azure Bloom',
    category: 'Bunga',
    description: 'Biru dusty dan putih porselen dengan nuansa watercolor floral yang segar.',
    className: 'theme-azure',
    palette: ['#f8fbfd', '#315a73', '#91afc1', '#dbe8ee'],
    keywords: ['blue flowers', 'floral', 'dusty blue', 'watercolor'],
  },
  {
    id: 'emerald-royale',
    name: 'Emerald Royale',
    category: 'Elegan',
    description: 'Emerald gelap, ivory, dan aksen brass untuk nuansa evening reception yang regal.',
    className: 'theme-emerald',
    palette: ['#123d35', '#d9bf7a', '#f5f0e3', '#76948b'],
    badge: 'Luxury',
    keywords: ['emerald', 'royal', 'luxury', 'green'],
  },
  {
    id: 'rosewood-romance',
    name: 'Rosewood Romance',
    category: 'Bunga',
    description: 'Dusty rose, wine, dan paper cream dengan detail romantis yang hangat.',
    className: 'theme-rosewood',
    palette: ['#f8efed', '#693e43', '#c59a98', '#fff9f5'],
    keywords: ['rose', 'romantic', 'warm', 'flower'],
  },
  {
    id: 'terracotta-arch',
    name: 'Terracotta Arch',
    category: 'Modern',
    description: 'Bentuk arch, terracotta dan sand, cocok untuk konsep intimate, rustic, dan modern tropical.',
    className: 'theme-terracotta',
    palette: ['#f3e6d6', '#9c543f', '#d39a74', '#fffaf3'],
    keywords: ['arch', 'rustic', 'terracotta', 'intimate'],
  },
  {
    id: 'pearl-mosque',
    name: 'Pearl Mosque',
    category: 'Muslim',
    description: 'Pearl, sage gelap, dan pola lengkung abstrak dengan suasana khidmat dan bersih.',
    className: 'theme-pearl',
    palette: ['#f8f6ef', '#24463d', '#c5ad7a', '#dce5df'],
    badge: 'Muslim',
    keywords: ['muslim', 'islamic', 'pearl', 'sage'],
  },
  {
    id: 'monochrome-muse',
    name: 'Monochrome Muse',
    category: 'Formal',
    description: 'Hitam putih editorial, tipografi serif tegas, dan galeri dengan ritme museum-like.',
    className: 'theme-monochrome',
    palette: ['#f7f7f5', '#141414', '#888888', '#ffffff'],
    keywords: ['black white', 'monochrome', 'formal', 'editorial'],
  },
  {
    id: 'sunset-confetti',
    name: 'Sunset Confetti',
    category: 'Colorful',
    description: 'Coral, apricot, lilac, dan gradient sunset untuk pesta yang lebih playful dan cerah.',
    className: 'theme-sunset',
    palette: ['#fff2e9', '#e76f51', '#f4a261', '#b8a1d9'],
    badge: 'Colorful',
    keywords: ['colorful', 'sunset', 'coral', 'playful'],
  },
  {
    id: 'cinematic-vow',
    name: 'Cinematic Vow',
    category: 'Slide',
    description: 'Section tinggi layar, foto sinematik, transisi blok, dan pengalaman scroll seperti chapter film.',
    className: 'theme-cinematic',
    palette: ['#16191c', '#c9b39b', '#eee8df', '#59636b'],
    badge: 'Slide',
    keywords: ['slide', 'cinematic', 'movie', 'fullscreen'],
  },
  {
    id: 'champagne-arch',
    name: 'Champagne Arch',
    category: 'Gold',
    description: 'Champagne beige, garis arch tipis, gold lembut, dan tipografi klasik yang airy.',
    className: 'theme-champagne',
    palette: ['#fbf3e8', '#6d5a45', '#d4b276', '#fffaf3'],
    keywords: ['champagne', 'arch', 'gold', 'elegant'],
  },
  {
    id: 'nusantara-nocturne',
    name: 'Nusantara Nocturne',
    category: 'Budaya',
    description: 'Indigo gelap, copper, dan ornament geometris abstrak untuk nuansa budaya yang lebih malam dan modern.',
    className: 'theme-nocturne',
    palette: ['#172430', '#ba7c52', '#efe3d2', '#496277'],
    badge: 'Heritage',
    keywords: ['nusantara', 'indigo', 'copper', 'heritage'],
  },

  {
    id: 'atelier-split',
    name: 'Atelier Split',
    category: 'Modern',
    description: 'Editorial split-screen: panel tipografi dan foto berdampingan, section bergaya majalah, bukan flow klasik.',
    className: 'theme-atelier-split',
    layout: 'editorial-split',
    palette: ['#f1eee8', '#1d1d1b', '#a74f3b', '#d9d1c4'],
    badge: 'New Layout',
    catalog: { series: 'Editorial', category: 'Modern', price: 'Rp 199.000', oldPrice: 'Rp 299.000', badge: 'NEW', previewLayout: 'split', tone: 'ivory' },
    keywords: ['editorial', 'split screen', 'magazine', 'fashion'],
  },
  {
    id: 'vow-times',
    name: 'The Vow Times',
    category: 'Formal',
    description: 'Konsep koran premium dengan masthead, headline, kolom berita, photo desk, dan guest-book.',
    className: 'theme-vow-times',
    layout: 'newspaper',
    palette: ['#f4efe4', '#171614', '#9b1d20', '#d3c7b1'],
    badge: 'New Layout',
    catalog: { series: 'Editorial', category: 'Editorial', price: 'Rp 199.000', oldPrice: 'Rp 299.000', previewLayout: 'news', tone: 'paper' },
    keywords: ['newspaper', 'chronicle', 'classic print', 'headline'],
  },
  {
    id: 'afterglow-film',
    name: 'Afterglow',
    category: 'Slide',
    description: 'Undangan seperti film: cover letterbox, chapter layar penuh, cast profile, schedule scene, dan montage.',
    className: 'theme-afterglow-film',
    layout: 'cinematic-chapters',
    palette: ['#0c0d0f', '#f3eee6', '#d16f55', '#6f7881'],
    badge: 'Cinematic',
    catalog: { series: 'Cinematic', category: 'Moody', price: 'Rp 229.000', oldPrice: 'Rp 329.000', badge: 'BEST SELLER', previewLayout: 'film', tone: 'night' },
    keywords: ['film', 'cinema', 'fullscreen', 'chapters'],
  },
  {
    id: 'paper-hearts',
    name: 'Paper Hearts',
    category: 'Colorful',
    description: 'Scrapbook interaktif dengan polaroid miring, tape, notes, stamp, dan kolase foto yang playful.',
    className: 'theme-paper-hearts',
    layout: 'scrapbook',
    palette: ['#f7f0df', '#2f4a40', '#e8a6a1', '#f0c85e'],
    badge: 'Playful',
    catalog: { series: 'Playful', category: 'Playful', price: 'Rp 179.000', oldPrice: 'Rp 259.000', previewLayout: 'scrap', tone: 'pink' },
    keywords: ['scrapbook', 'polaroid', 'paper', 'collage'],
  },
  {
    id: 'nur-arch',
    name: 'Nur Arch',
    category: 'Muslim',
    description: 'Komposisi simetris dengan portal lengkung, pola geometris, couple arch, dan section acara bernuansa khidmat.',
    className: 'theme-nur-arch',
    layout: 'islamic-arch',
    palette: ['#f6f1e5', '#183c35', '#c5a66b', '#dde7df'],
    badge: 'New Layout',
    catalog: { series: 'Signature', category: 'Muslim', price: 'Rp 229.000', oldPrice: 'Rp 329.000', badge: 'POPULAR', previewLayout: 'arch', tone: 'sage' },
    keywords: ['muslim', 'arch', 'geometric', 'islamic'],
  },
  {
    id: 'white-gallery',
    name: 'White Gallery',
    category: 'Simple',
    description: 'Pengalaman seperti galeri seni: ruang putih, artwork frame, nomor katalog, room-by-room navigation feel.',
    className: 'theme-white-gallery',
    layout: 'museum',
    palette: ['#f8f8f5', '#171717', '#c5c1b7', '#ffffff'],
    badge: 'Gallery',
    catalog: { series: 'Minimal', category: 'Minimal', price: 'Rp 199.000', oldPrice: 'Rp 279.000', previewLayout: 'gallery', tone: 'white' },
    keywords: ['museum', 'gallery', 'minimal', 'art'],
  },
  {
    id: 'ever-after-book',
    name: 'Ever After',
    category: 'Elegan',
    description: 'Layout seperti buku cerita dua halaman dengan chapter bernomor, plate galeri, dan narasi panjang.',
    className: 'theme-ever-after-book',
    layout: 'storybook',
    palette: ['#efe5d4', '#5f382d', '#9b7a54', '#faf6ed'],
    badge: 'Storybook',
    catalog: { series: 'Storybook', category: 'Classic', price: 'Rp 229.000', oldPrice: 'Rp 329.000', previewLayout: 'book', tone: 'cream' },
    keywords: ['book', 'storybook', 'chapter', 'romantic'],
  },
  {
    id: 'modular-love',
    name: 'Modular Love',
    category: 'Modern',
    description: 'Bento-grid modern: hero, tanggal, tamu, couple, acara, cerita, dan RSVP tersusun dalam tile modular.',
    className: 'theme-modular-love',
    layout: 'bento',
    palette: ['#f2f0ea', '#20241f', '#c65d42', '#99ad9c'],
    badge: 'Bento',
    catalog: { series: 'Bento', category: 'Modern', price: 'Rp 179.000', oldPrice: 'Rp 259.000', previewLayout: 'bento', tone: 'mint' },
    keywords: ['bento', 'grid', 'modular', 'modern'],
  },
  {
    id: 'sculpted-arch',
    name: 'Sculpted Arch',
    category: 'Elegan',
    description: 'Layout asymmetrical dengan foto arch besar, typography block, gallery offset, dan event cards geometris.',
    className: 'theme-sculpted-arch',
    layout: 'modern-arch',
    palette: ['#e8e0d2', '#28342f', '#b9684e', '#fffaf2'],
    badge: 'New Layout',
    catalog: { series: 'Luxury', category: 'Elegant', price: 'Rp 249.000', oldPrice: 'Rp 349.000', badge: 'PREMIUM', previewLayout: 'sculpt', tone: 'stone' },
    keywords: ['arch', 'asymmetrical', 'modern elegant', 'editorial'],
  },



  {
    id: 'heritage-utary',
    name: 'Utary Heritage',
    category: 'Budaya',
    description: 'Heritage editorial bernuansa arsip keluarga: border klasik, seal, foto framed, dan komposisi formal yang benar-benar berbeda dari Aruna.',
    className: 'theme-heritage-utary',
    layout: 'heritage-utary',
    palette: ['#2f211b', '#d6ae6e', '#eee0c8', '#7b4a36'],
    badge: 'Heritage',
    catalog: { series: 'Heritage', category: 'Heritage', price: 'Rp 299.000', oldPrice: 'Rp 398.000', badge: 'NEW', previewLayout: 'utary', tone: 'brown' },
    keywords: ['utary', 'heritage', 'classic', 'seal', 'archive'],
  },
  {
    id: 'heritage-sandhayu',
    name: 'Sandhayu Heritage',
    category: 'Budaya',
    description: 'Heritage terracotta dengan gerbang lengkung, sun motif, terrace lines, dan ritme layout vertikal yang hangat.',
    className: 'theme-heritage-sandhayu',
    layout: 'heritage-sandhayu',
    palette: ['#6a3e31', '#e6c391', '#ead5b8', '#ad6d4f'],
    badge: 'Heritage',
    catalog: { series: 'Heritage', category: 'Heritage', price: 'Rp 299.000', oldPrice: 'Rp 398.000', badge: 'NEW', previewLayout: 'sandhayu', tone: 'terracotta' },
    keywords: ['sandhayu', 'heritage', 'terracotta', 'sun', 'arch'],
  },
  {
    id: 'heritage-ameera',
    name: 'Ameera Heritage',
    category: 'Muslim',
    description: 'Heritage islami dengan lattice geometris, portal tinggi, framing simetris dan nuansa emerald-ivory.',
    className: 'theme-heritage-ameera',
    layout: 'heritage-ameera',
    palette: ['#17372f', '#d9bd87', '#f3ead9', '#78968a'],
    badge: 'Heritage',
    catalog: { series: 'Heritage', category: 'Muslim', price: 'Rp 249.000', oldPrice: 'Rp 349.000', badge: 'NEW', previewLayout: 'ameera', tone: 'emerald' },
    keywords: ['ameera', 'heritage', 'muslim', 'lattice', 'emerald'],
  },
  {
    id: 'premium-flara-10',
    name: 'Flara 10',
    category: 'Bunga',
    description: 'Floral editorial dengan arch photo, overlapping circular portrait, section bloom, dan gallery organik.',
    className: 'theme-premium-flara',
    layout: 'premium-flara',
    palette: ['#f5eee8', '#593d43', '#d8b1b5', '#cf9da4'],
    badge: 'Premium',
    catalog: { series: 'Premium', category: 'Floral', price: 'Rp 199.000', oldPrice: 'Rp 298.000', badge: 'NEW', previewLayout: 'flara', tone: 'rose' },
    keywords: ['flara', 'floral', 'rose', 'premium', 'arch'],
  },
  {
    id: 'premium-kila-11',
    name: 'Kila 11',
    category: 'Modern',
    description: 'Editorial date-grid: rail tanggal vertikal, grid poster, monochrome portraits, chapter story dan ticket-like event cards.',
    className: 'theme-premium-kila',
    layout: 'premium-kila',
    palette: ['#171817', '#eeeae2', '#cfb9a0', '#ffffff'],
    badge: 'Premium',
    catalog: { series: 'Premium', category: 'Editorial', price: 'Rp 199.000', oldPrice: 'Rp 298.000', badge: 'NEW', previewLayout: 'kila', tone: 'mono' },
    keywords: ['kila', 'grid', 'date', 'editorial', 'monochrome'],
  },
  {
    id: 'premium-danila-06',
    name: 'Danila 06',
    category: 'Slide',
    description: 'Wedding film noir dengan film-strip frame, cast cards, contact sheet, scene labels dan cinematic black-and-white.',
    className: 'theme-premium-danila',
    layout: 'premium-danila',
    palette: ['#111111', '#f1ede5', '#777777', '#ece8df'],
    badge: 'Cinematic',
    catalog: { series: 'Premium', category: 'Cinematic', price: 'Rp 199.000', oldPrice: 'Rp 298.000', badge: 'CINEMATIC', previewLayout: 'danila', tone: 'black' },
    keywords: ['danila', 'film', 'cinematic', 'black white', 'contact sheet'],
  },
  {
    id: 'premium-beanca-08',
    name: 'Beanca 08',
    category: 'Formal',
    description: 'Swiss-editorial split grid dengan numbered rail, panel foto besar, whitespace tegas dan event matrix.',
    className: 'theme-premium-beanca',
    layout: 'premium-beanca',
    palette: ['#f4f1eb', '#222724', '#b8b5ac', '#ffffff'],
    badge: 'Premium',
    catalog: { series: 'Premium', category: 'Editorial', price: 'Rp 199.000', oldPrice: 'Rp 298.000', badge: 'NEW', previewLayout: 'beanca', tone: 'paper' },
    keywords: ['beanca', 'swiss', 'grid', 'editorial', 'formal'],
  },
  {
    id: 'premium-ariya-07',
    name: 'Ariya 07',
    category: 'Elegan',
    description: 'Architectural arch luxury dengan radial line, portrait portal, sacred-promise section, dan framing elegan.',
    className: 'theme-premium-ariya',
    layout: 'premium-ariya',
    palette: ['#efe5d6', '#3d493d', '#d9c4a8', '#ffffff'],
    badge: 'Premium',
    catalog: { series: 'Premium', category: 'Elegant', price: 'Rp 199.000', oldPrice: 'Rp 298.000', badge: 'NEW', previewLayout: 'ariya', tone: 'sand' },
    keywords: ['ariya', 'arch', 'luxury', 'architectural', 'elegant'],
  },
  {
    id: 'premium-alyssa-04',
    name: 'Alyssa 04',
    category: 'Formal',
    description: 'Minimal editorial dengan numbered side rail, alternating split portrait, monochrome photography dan fine rules.',
    className: 'theme-premium-alyssa',
    layout: 'premium-alyssa',
    palette: ['#f5f2eb', '#1e2924', '#bcb7ad', '#ffffff'],
    badge: 'Premium',
    catalog: { series: 'Premium', category: 'Minimal', price: 'Rp 179.000', oldPrice: 'Rp 279.000', badge: 'NEW', previewLayout: 'alyssa', tone: 'white' },
    keywords: ['alyssa', 'minimal', 'numbered', 'split', 'monochrome'],
  },
  {
    id: 'premium-shakira',
    name: 'Shakira',
    category: 'Modern',
    description: 'Bold magazine poster dengan oversized sans type, gold sidebar, marquee strip dan staggered gallery.',
    className: 'theme-premium-shakira',
    layout: 'premium-shakira',
    palette: ['#111111', '#d6b26d', '#ece6dc', '#ffffff'],
    badge: 'Premium',
    catalog: { series: 'Premium', category: 'Editorial', price: 'Rp 179.000', oldPrice: 'Rp 279.000', badge: 'BOLD', previewLayout: 'shakira', tone: 'gold' },
    keywords: ['shakira', 'bold type', 'poster', 'gold', 'magazine'],
  },
  {
    id: 'premium-endless-love',
    name: 'Endless Love',
    category: 'Elegan',
    description: 'Romantic infinity composition dengan elliptical photo, looping lines, ribbon text dan rounded gallery.',
    className: 'theme-premium-endless',
    layout: 'premium-endless-love',
    palette: ['#6f4149', '#f3e7e5', '#d3a6aa', '#ffffff'],
    badge: 'Premium',
    catalog: { series: 'Premium', category: 'Romantic', price: 'Rp 179.000', oldPrice: 'Rp 279.000', badge: 'ROMANTIC', previewLayout: 'endless', tone: 'pink' },
    keywords: ['endless love', 'infinity', 'romantic', 'elliptical', 'ribbon'],
  },
  {
    id: 'premium-sage',
    name: 'Sage',
    category: 'Bunga',
    description: 'Botanical sage architecture dengan framed arch, leaf line-art, offset cards dan organic rounded sections.',
    className: 'theme-premium-sage',
    layout: 'premium-sage',
    palette: ['#e7ecdf', '#2f4a3e', '#7d997e', '#f5f3e9'],
    badge: 'Premium',
    catalog: { series: 'Premium', category: 'Botanical', price: 'Rp 179.000', oldPrice: 'Rp 279.000', badge: 'BOTANICAL', previewLayout: 'sage-premium', tone: 'sage' },
    keywords: ['sage', 'botanical', 'leaf', 'green', 'organic'],
  },
  {
    id: 'moody-papercut',
    name: 'Papercut Moody',
    category: 'Colorful',
    description: 'Layered paper-cut composition dengan irregular cut shapes, polaroid cards, sticker, torn sections dan collage motion.',
    className: 'theme-moody-papercut',
    layout: 'moody-papercut',
    palette: ['#f1e5ce', '#253f35', '#e78f83', '#efc85b'],
    badge: 'Moody',
    catalog: { series: 'Moody', category: 'Playful', price: 'Rp 129.000', oldPrice: 'Rp 229.000', badge: 'MOODY', previewLayout: 'papercut', tone: 'paper' },
    keywords: ['papercut', 'paper', 'collage', 'moody', 'playful'],
  },
  {
    id: 'moody-wave',
    name: 'Wave Moody',
    category: 'Modern',
    description: 'Organic liquid-wave design dengan overlapping blobs, oval portrait, sweeping color fields dan flowing gallery.',
    className: 'theme-moody-wave',
    layout: 'moody-wave',
    palette: ['#233228', '#cc7d5c', '#e8e5d5', '#6e8874'],
    badge: 'Moody',
    catalog: { series: 'Moody', category: 'Organic', price: 'Rp 129.000', oldPrice: 'Rp 229.000', badge: 'MOODY', previewLayout: 'wave-motion', tone: 'green' },
    keywords: ['wave', 'organic', 'liquid', 'moody', 'flow'],
  },
  {
    id: 'moody-sweetpink',
    name: 'Sweetpink Moody',
    category: 'Colorful',
    description: 'Playful pink ticket design dengan checker pattern, oversized love type, bubble quote, rounded photo cards dan sticker-like UI.',
    className: 'theme-moody-sweetpink',
    layout: 'moody-sweetpink',
    palette: ['#f4a9b8', '#6a3c49', '#fff0ef', '#f9e36a'],
    badge: 'Moody',
    catalog: { series: 'Moody', category: 'Playful', price: 'Rp 129.000', oldPrice: 'Rp 229.000', badge: 'MOODY', previewLayout: 'sweetpink', tone: 'pink' },
    keywords: ['sweetpink', 'pink', 'ticket', 'checker', 'playful'],
  },

  {
    id: 'premium-flawless-02',
    name: 'Flawless 02',
    category: 'Elegan',
    description: 'Premium minimalist invitation bernuansa pearl-grey dan monochrome dengan floral line-art, cover fotografi lembut, reveal motion yang halus, QR access, countdown, gallery editorial, RSVP, gift, fullscreen dan music control.',
    className: 'theme-premium-flawless',
    layout: 'premium-flawless',
    palette: ['#f5f5f2', '#2b2f2b', '#a6aaa5', '#dfe2de'],
    badge: 'Premium 02',
    catalog: { series: 'Premium', category: 'Elegant', price: 'Rp 299.000', oldPrice: 'Rp 399.000', badge: 'FLAWLESS', previewLayout: 'flawless', tone: 'white' },
    keywords: ['flawless', 'premium 02', 'pearl', 'white', 'monochrome', 'floral line art', 'minimalist', 'soft fade'],
  },
  {
    id: 'premium-ivanna-09',
    name: 'Ivanna 09',
    category: 'Elegan',
    description: 'Immersive premium invitation: opening cover sinematik, desktop split-screen dengan poster tetap di kiri dan story deck swipe di kanan, photo carousel, fullscreen, music control, QR access, gallery swipe, RSVP, gift, dan transisi halus.',
    className: 'theme-premium-ivanna',
    layout: 'premium-ivanna',
    palette: ['#0a0a09', '#70675e', '#f4f0e7', '#171715'],
    badge: 'Premium 09',
    catalog: { series: 'Premium', category: 'Elegant', price: 'Rp 299.000', oldPrice: 'Rp 399.000', badge: 'IMMERSIVE', previewLayout: 'ivanna', tone: 'black' },
    keywords: ['ivanna', 'premium 09', 'attari style', 'fade', 'elegant', 'editorial', 'qr check-in', 'wedding frame'],
  },
  {
    id: 'heritage-aruna',
    name: 'Aruna',
    category: 'Budaya',
    description: 'Heritage invitation dengan cover foto dramatis, envelope & wax seal, frame klasik, timeline, access card, dresscode, gallery, RSVP, dan gift dalam satu flow editorial.',
    className: 'theme-heritage-aruna',
    layout: 'heritage-aruna',
    palette: ['#f8f3e7', '#65624f', '#9d8a69', '#7f2630'],
    badge: 'Heritage Premium',
    catalog: { series: 'Heritage', category: 'Heritage', price: 'Rp 299.000', oldPrice: 'Rp 399.000', badge: 'NEW', previewLayout: 'heritage', tone: 'sand' },
    keywords: ['heritage', 'aruna', 'attari', 'vintage', 'wax seal', 'envelope', 'classic', 'indonesian'],
  },
]

export const defaultThemeId = 'botanical-serenity'

export const themeCategories: ThemeCategory[] = [
  'Elegan',
  'Bunga',
  'Gold',
  'Formal',
  'Simple',
  'Modern',
  'Budaya',
  'Muslim',
  'Colorful',
  'Slide',
]

export function getTheme(themeId?: string) {
  return themes.find(theme => theme.id === themeId) || themes[0]
}
