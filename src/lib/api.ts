import type { AppState, EventData, GuestCheckin, InvitationSummary, ProjectStatus, PublicationStatus, ReviewNote, ReviewStatus, RSVP } from '../types'

export class ApiError extends Error {
  status: number
  constructor(message: string, status: number) { super(message); this.status = status }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers)
  if (init.body && !(init.body instanceof FormData) && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json')
  const response = await fetch(path, { ...init, headers, credentials: 'include' })
  if (!response.ok) {
    let message = `HTTP ${response.status}`
    try { message = (await response.json()).message || message } catch { /* ignore */ }
    throw new ApiError(message, response.status)
  }
  if (response.status === 204) return undefined as T
  return response.json() as Promise<T>
}

export const authApi = {
  me: () => request<{ user: { id: string; email: string } }>('/api/auth/me'),
  login: (email: string, password: string) => request<{ user: { id: string; email: string } }>('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  logout: () => request<void>('/api/auth/logout', { method: 'POST' }),
}

export const adminApi = {
  getState: (invitationId?: string) => request<AppState>(`/api/admin/state${invitationId ? `?invitationId=${encodeURIComponent(invitationId)}` : ''}`),
  saveState: (state: AppState) => request<AppState>(`/api/admin/state?invitationId=${encodeURIComponent(state.event.id)}`, {
    method: 'PUT', body: JSON.stringify({ event: state.event, guests: state.guests, whatsappTemplate: state.whatsappTemplate }),
  }),
  listInvitations: () => request<{ invitations: InvitationSummary[] }>('/api/admin/invitations'),
  createInvitation: (payload: { clientName?: string; brideName: string; groomName: string; slug?: string; themeId?: string; eventDate?: string }) => request<AppState>('/api/admin/invitations', { method: 'POST', body: JSON.stringify(payload) }),
  deleteInvitation: (id: string) => request<{ ok: boolean; nextInvitationId: string | null }>(`/api/admin/invitations/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  updateFeatures: (id: string, payload: { featureWebsite?: boolean; featureGuestbook?: boolean; featureFrame?: boolean }) => request<{ ok: boolean; featureWebsite: boolean; featureGuestbook: boolean; featureFrame: boolean }>(`/api/admin/invitations/${encodeURIComponent(id)}/features`, { method: 'PATCH', body: JSON.stringify(payload) }),
  updateWorkflow: (id: string, payload: { projectStatus?: ProjectStatus; publicationStatus?: PublicationStatus; reviewStatus?: ReviewStatus; expiresAt?: string | null }) => request<AppState>(`/api/admin/invitations/${encodeURIComponent(id)}/workflow`, { method: 'PATCH', body: JSON.stringify(payload) }),
  sendForReview: (id: string) => request<AppState>(`/api/admin/invitations/${encodeURIComponent(id)}/review/send`, { method: 'POST' }),
  addReviewNote: (id: string, payload: { message: string; sectionKey?: string; kind?: 'comment' | 'revision' | 'approval' | 'system' }) => request<ReviewNote>(`/api/admin/invitations/${encodeURIComponent(id)}/review/notes`, { method: 'POST', body: JSON.stringify(payload) }),
  uploadMedia: async (file: File) => {
    const body = new FormData(); body.append('file', file)
    return request<{ url: string; kind: 'image' | 'audio'; size: number }>('/api/admin/media', { method: 'POST', body })
  },
  deleteMedia: (url: string) => request<void>(`/api/admin/media?url=${encodeURIComponent(url)}`, { method: 'DELETE' }),
  checkIn: (invitationId: string, guestId: string, pax: number, source: 'operator' | 'manual' | 'qr' = 'operator') => request<{ ok: boolean; id: string; guestId: string; pax: number }>(`/api/admin/guestbook/${encodeURIComponent(invitationId)}/check-in`, { method: 'POST', body: JSON.stringify({ guestId, pax, source }) }),
  undoCheckIn: (invitationId: string, guestId: string) => request<void>(`/api/admin/guestbook/${encodeURIComponent(invitationId)}/check-in/${encodeURIComponent(guestId)}`, { method: 'DELETE' }),
  subscribe: (onChange: (event: MessageEvent) => void) => {
    const source = new EventSource('/api/admin/events', { withCredentials: true })
    source.addEventListener('guest_opened', onChange as EventListener)
    source.addEventListener('rsvp_changed', onChange as EventListener)
    source.addEventListener('checkin_changed', onChange as EventListener)
    source.addEventListener('review_changed', onChange as EventListener)
    return () => source.close()
  },
}

export interface PublicInvitationPayload {
  event: EventData
  guest: { id: string; name: string; token: string; status: string; invitedPax?: number } | null
  guestName: string
}

export interface PublicFramePayload {
  clientName: string
  brideName: string
  groomName: string
  eventDate: string
  heroImage: string
  framePreset: 'heritage' | 'botanical' | 'editorial'
  frameNames: string
  frameDateLabel: string
  frameOverlay: number
}

export interface GuestbookSearchGuest {
  id: string
  name: string
  phone: string
  group: string
  token: string
  invitedPax: number
  checkedIn: boolean
  checkedPax: number
  checkedInAt: string | null
}

export interface ClientReviewPayload {
  clientName: string
  event: EventData
  reviewStatus: ReviewStatus
  projectStatus: ProjectStatus
  previewUrl: string
  notes: ReviewNote[]
}

export const publicApi = {
  getInvitation: (slug: string, search: string) => request<PublicInvitationPayload>(`/api/public/invitations/${encodeURIComponent(slug)}${search}`),
  markOpened: (slug: string, guestToken: string) => request<{ ok: boolean }>(`/api/public/invitations/${encodeURIComponent(slug)}/open`, { method: 'POST', body: JSON.stringify({ guestToken }) }),
  submitRsvp: (slug: string, payload: { guestToken: string; guestName: string; attendance: 'Hadir' | 'Tidak hadir'; pax: number; message: string }) => request<RSVP>(`/api/public/invitations/${encodeURIComponent(slug)}/rsvp`, { method: 'POST', body: JSON.stringify(payload) }),
  getFrame: (slug: string) => request<PublicFramePayload>(`/api/public/frame/${encodeURIComponent(slug)}`),
  guestbookAuth: (slug: string, pin: string) => request<{ ok: boolean; clientName: string; brideName: string; groomName: string; guestCount: number; checkinCount: number; checkedInPax: number }>(`/api/public/guestbook/${encodeURIComponent(slug)}/auth`, { method: 'POST', body: JSON.stringify({ pin }) }),
  guestbookSearch: (slug: string, pin: string, query: string, guestToken = '') => request<{ guests: GuestbookSearchGuest[] }>(`/api/public/guestbook/${encodeURIComponent(slug)}/search`, { method: 'POST', body: JSON.stringify({ pin, query, guestToken }) }),
  guestbookCheckIn: (slug: string, pin: string, payload: { guestId?: string; guestToken?: string; pax: number }) => request<{ ok: boolean; id: string; guestName: string; pax: number; checkedInAt: string }>(`/api/public/guestbook/${encodeURIComponent(slug)}/check-in`, { method: 'POST', body: JSON.stringify({ pin, ...payload }) }),
  getClientReview: (token: string) => request<ClientReviewPayload>(`/api/public/review/${encodeURIComponent(token)}`),
  submitClientReview: (token: string, payload: { action: 'approve' | 'revision'; message?: string; sectionKey?: string }) => request<{ ok: boolean; reviewStatus: ReviewStatus }>(`/api/public/review/${encodeURIComponent(token)}/decision`, { method: 'POST', body: JSON.stringify(payload) }),
}
