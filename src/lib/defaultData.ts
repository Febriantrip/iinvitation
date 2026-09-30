import type { AppState } from '../types'
import { defaultImageEdit } from './imageEdit'
import { defaultTemplateSettings } from './templateCustomization'

export const defaultState: AppState = {
  event: {
    id: 'demo', clientName: 'Alya & Raka', themeId: 'botanical-serenity', slug: 'alya-raka-demo', groomName: 'Raka', groomFullName: 'Raka Wijaya', brideName: 'Alya', brideFullName: 'Alya Maharani', groomParents: 'Putra dari Bapak & Ibu', brideParents: 'Putri dari Bapak & Ibu', eventDate: '2026-12-12T10:00', akadTime: '08.00 - 10.00 WIB', receptionTime: '11.00 - 14.00 WIB', venueName: 'Lokasi Acara', venueAddress: 'Silakan isi alamat lengkap acara dari menu Data Undangan.', mapUrl: 'https://maps.google.com', openingText: 'Dengan memohon rahmat dan ridho Allah SWT, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara pernikahan kami.', storyText: 'Setiap perjalanan punya awal. Dari pertemuan, percakapan, dan doa yang tumbuh pelan-pelan, kami sampai pada satu keputusan untuk melangkah bersama dalam ikatan pernikahan.', closingText: 'Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan untuk hadir dan memberikan doa restu. Atas kehadiran dan doa restunya kami ucapkan terima kasih.', heroImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=85', heroEdit: { ...defaultImageEdit }, musicUrl: '', gallery: [], featureWebsite: true, featureGuestbook: true, featureFrame: true, guestbookPin: '000000', framePreset: 'heritage', frameNames: 'Alya & Raka', frameDateLabel: '12 · 12 · 2026', frameOverlay: 22, templateSettings: { ...defaultTemplateSettings }, sectionSettings: [], projectStatus: 'draft', publicationStatus: 'draft', reviewStatus: 'not_sent', reviewToken: 'demo-review', previewToken: 'demo-preview', publishedAt: null, expiresAt: null,
  },
  guests: [],
  rsvps: [],
  checkins: [],
  invitations: [],
  reviewNotes: [],
  whatsappTemplate: `Kepada Yth.\n{guest_name}\n\nAssalamualaikum Warahmatullahi Wabarakaatuh\n\nDengan memohon rahmat dan ridho Allah SWT, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara pernikahan kami :\n\n🧕🏻 {bride_full_name}\n\ndengan\n\n🤵🏻 {groom_full_name}\n\nUntuk informasi detail mengenai acara, silakan kunjungi link di bawah ini :\n{invitation_link}\n\nMerupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan untuk hadir dan memberikan doa restu.\nAtas kehadiran dan doa restunya kami ucapkan terima kasih.\n\nWassalamualaikum Warahmatullahi Wabarakaatuh\n\nHormat kami,\n{couple_name}`,
}
