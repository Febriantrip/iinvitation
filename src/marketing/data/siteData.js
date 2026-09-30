import { themes } from '../../lib/themes'

export const business = {
  name: 'Iinvitation',
  eyebrow: 'DIGITAL WEDDING INVITATION',
  headline: 'Undangan digital yang terasa personal, bukan sekadar link.',
  intro: 'Pilih desain, personalisasi detail acara, kelola tamu, lalu sebarkan undangan dalam satu alur yang rapi.',
  whatsapp: '6280000000001',
  instagram: '@iinvitation',
  city: 'Indonesia',
}

export const catalog = themes
  .filter(theme => Boolean(theme.catalog))
  .map(theme => ({
    id: theme.id,
    themeId: theme.id,
    name: theme.name,
    series: theme.catalog.series,
    category: theme.catalog.category,
    price: theme.catalog.price,
    old: theme.catalog.oldPrice,
    badge: theme.catalog.badge || '',
    layout: theme.catalog.previewLayout,
    tone: theme.catalog.tone,
    description: theme.description,
  }))


export const packages = [
  {
    name: 'Essential', price: 'Rp 149.000', note: 'Untuk undangan ringkas dan elegan.',
    features: ['Personalized guest name','Unlimited daftar tamu','Detail acara & Maps','Countdown','Galeri foto','RSVP & ucapan','Background music']
  },
  {
    name: 'Signature', price: 'Rp 229.000', note: 'Paket paling seimbang untuk kebanyakan pasangan.', featured: true,
    features: ['Semua fitur Essential','Love story','Wedding gift','Live streaming section','QR guest access','Dashboard tamu & RSVP','20 foto galeri']
  },
  {
    name: 'Heritage', price: 'Rp 349.000', note: 'Untuk desain kompleks dan pengalaman premium.',
    features: ['Semua fitur Signature','Layout premium heritage','Advanced navigation','Special ornamental sections','Priority revision','Extra gallery composition','Custom section arrangement']
  }
]

export const addons = [
  ['Express 24 Jam','Pengerjaan prioritas setelah data lengkap.'],
  ['Custom Font & Color','Sesuaikan karakter visual dengan tema pernikahan.'],
  ['Split Invitation','Pisahkan versi undangan dengan kebutuhan berbeda.'],
  ['Guest Session','Kelompokkan jam atau sesi kehadiran tamu.'],
  ['Extra Gallery','Tambah kapasitas dan komposisi galeri.'],
  ['Dual Language','Versi Bahasa Indonesia dan Inggris.'],
]

export const faqs = [
  ['Bagaimana cara order?', 'Pilih desain dari katalog, klik Order, lalu kirim detail kebutuhan lewat WhatsApp. Admin akan mengarahkan proses pengisian data hingga preview.'],
  ['Berapa lama proses pengerjaan?', 'Estimasi standar dapat disesuaikan dengan paket dan kelengkapan materi. Waktu mulai dihitung setelah data, foto, dan detail acara sudah lengkap.'],
  ['Apakah desain bisa disesuaikan?', 'Bisa. Warna, font, urutan beberapa section, musik, foto, dan detail tertentu dapat disesuaikan sesuai paket.'],
  ['Bisa memakai nama tamu berbeda di setiap link?', 'Bisa. Sistem mendukung daftar tamu personal dan link share individual sehingga nama penerima tampil langsung pada cover undangan.'],
  ['Apakah tersedia RSVP dan ucapan?', 'Ya. Paket yang mendukung RSVP akan mencatat konfirmasi kehadiran dan ucapan tamu ke dashboard.'],
  ['Apakah bisa pakai musik sendiri?', 'Bisa. Kamu dapat menentukan backsound sesuai mood acara selama file atau sumber musik tersedia.'],
]

export const placeholderReviews = [
  { name:'Contoh Klien 01', text:'Ganti bagian ini dengan testimoni asli dari klien Iinvitation.' },
  { name:'Contoh Klien 02', text:'Area testimoni sudah disiapkan dan dapat diisi dari data bisnis kamu.' },
  { name:'Contoh Klien 03', text:'Gunakan review nyata agar landing page terasa lebih kredibel.' },
]
