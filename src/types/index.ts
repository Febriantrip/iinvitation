export type GuestStatus = 'Belum dibuka' | 'Sudah dibuka' | 'Hadir' | 'Tidak hadir'
export type ProjectStatus = 'draft' | 'awaiting_data' | 'design' | 'client_review' | 'revision' | 'approved' | 'published' | 'completed'
export type PublicationStatus = 'draft' | 'published' | 'expired'
export type ReviewStatus = 'not_sent' | 'pending' | 'revision_requested' | 'approved'

export interface Guest {
  id: string
  name: string
  phone: string
  group: string
  token: string
  status: GuestStatus
  invitedPax: number
  createdAt: string
}

export interface ImageEdit {
  positionX: number
  positionY: number
  zoom: number
  rotate: number
  brightness: number
  contrast: number
  saturation: number
  grayscale: number
  sepia: number
  blur: number
  flipX: boolean
  flipY: boolean
  aspect: 'cover' | 'portrait' | 'square' | 'landscape'
}

export interface GalleryItem {
  id: string
  url: string
  caption: string
  edit: ImageEdit
}

export type FramePreset = 'heritage' | 'botanical' | 'editorial'


export type SectionKey = 'cover' | 'opening' | 'couple' | 'story' | 'saveDate' | 'events' | 'dresscode' | 'access' | 'live' | 'frame' | 'gallery' | 'rsvp' | 'gift' | 'closing'

export interface SectionSetting {
  key: SectionKey
  enabled: boolean
  order: number
  customTitle: string
}


export interface TemplateSettings {
  displayFont: string
  bodyFont: string
  scriptFont: string
  titleScale: number
  recipientScale: number
  dateScale: number
  sectionTitleScale: number
  letterSpacing: number
  coverTitleX: number
  coverTitleY: number
  recipientX: number
  recipientY: number
  dateX: number
  dateY: number
  sectionTitleX: number
  sectionTitleY: number
  textAlign: 'theme' | 'left' | 'center' | 'right'
}

export interface EventData {
  id: string
  clientName: string
  themeId: string
  slug: string
  groomName: string
  groomFullName: string
  brideName: string
  brideFullName: string
  groomParents: string
  brideParents: string
  eventDate: string
  akadTime: string
  receptionTime: string
  venueName: string
  venueAddress: string
  mapUrl: string
  openingText: string
  storyText: string
  closingText: string
  heroImage: string
  heroEdit: ImageEdit
  musicUrl: string
  gallery: GalleryItem[]
  featureWebsite: boolean
  featureGuestbook: boolean
  featureFrame: boolean
  guestbookPin: string
  framePreset: FramePreset
  frameNames: string
  frameDateLabel: string
  frameOverlay: number
  templateSettings: TemplateSettings
  sectionSettings: SectionSetting[]
  projectStatus: ProjectStatus
  publicationStatus: PublicationStatus
  reviewStatus: ReviewStatus
  reviewToken: string
  previewToken: string
  publishedAt: string | null
  expiresAt: string | null
}

export interface RSVP {
  id: string
  guestId?: string
  guestName: string
  attendance: 'Hadir' | 'Tidak hadir'
  pax: number
  message: string
  createdAt: string
}

export interface GuestCheckin {
  id: string
  guestId: string
  guestName: string
  guestGroup: string
  invitedPax: number
  pax: number
  checkedInAt: string
  source: 'operator' | 'qr' | 'manual'
}

export interface InvitationSummary {
  id: string
  clientName: string
  slug: string
  brideName: string
  groomName: string
  themeId: string
  eventDate: string
  heroImage: string
  guestCount: number
  rsvpCount: number
  checkinCount: number
  featureWebsite: boolean
  featureGuestbook: boolean
  featureFrame: boolean
  projectStatus: ProjectStatus
  publicationStatus: PublicationStatus
  reviewStatus: ReviewStatus
  reviewToken: string
  previewToken: string
  updatedAt: string
}


export interface ReviewNote {
  id: string
  author: 'admin' | 'client'
  kind: 'comment' | 'revision' | 'approval' | 'system'
  sectionKey: string
  message: string
  createdAt: string
}

export interface AppState {
  event: EventData
  guests: Guest[]
  rsvps: RSVP[]
  checkins: GuestCheckin[]
  whatsappTemplate: string
  invitations: InvitationSummary[]
  reviewNotes: ReviewNote[]
}
