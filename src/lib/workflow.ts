import type { ProjectStatus, PublicationStatus, ReviewStatus } from '../types'

export const projectStatusOptions: { id: ProjectStatus; label: string; hint: string }[] = [
  { id: 'draft', label: 'Draft', hint: 'Project baru dibuat dan belum lengkap.' },
  { id: 'awaiting_data', label: 'Menunggu Data', hint: 'Menunggu materi atau detail dari klien.' },
  { id: 'design', label: 'Desain', hint: 'Sedang mengerjakan tampilan undangan.' },
  { id: 'client_review', label: 'Review Klien', hint: 'Preview sudah dikirim ke klien.' },
  { id: 'revision', label: 'Revisi', hint: 'Ada perubahan yang diminta klien.' },
  { id: 'approved', label: 'Approved', hint: 'Klien sudah menyetujui hasil.' },
  { id: 'published', label: 'Published', hint: 'Undangan sedang aktif untuk publik.' },
  { id: 'completed', label: 'Selesai', hint: 'Project sudah selesai/diarsipkan.' },
]

export const projectStatusLabel = (value: ProjectStatus) => projectStatusOptions.find(item => item.id === value)?.label || value
export const publicationStatusLabel: Record<PublicationStatus, string> = { draft: 'Belum Publish', published: 'Published', expired: 'Expired' }
export const reviewStatusLabel: Record<ReviewStatus, string> = { not_sent: 'Belum dikirim', pending: 'Menunggu review', revision_requested: 'Revisi diminta', approved: 'Disetujui' }

export const reviewSections = [
  { id: 'general', label: 'Umum' },
  { id: 'cover', label: 'Cover / Opening' },
  { id: 'couple', label: 'Mempelai' },
  { id: 'event', label: 'Acara & Lokasi' },
  { id: 'story', label: 'Love Story' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'rsvp', label: 'RSVP' },
  { id: 'gift', label: 'Wedding Gift' },
  { id: 'closing', label: 'Closing' },
]

export const reviewSectionLabel = (id: string) => reviewSections.find(item => item.id === id)?.label || id || 'Umum'
