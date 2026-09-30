import type { EventData, Guest } from '../types'

export const slugify = (value: string) =>
  value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

export const createToken = (name: string) => `${slugify(name) || 'guest'}-${crypto.randomUUID().slice(0, 8)}`

export const normalizePhone = (phone: string) => {
  const digits = phone.replace(/\D/g, '')
  if (!digits) return ''
  if (digits.startsWith('0')) return `62${digits.slice(1)}`
  if (digits.startsWith('62')) return digits
  return digits
}

export const invitationUrl = (event: EventData, guest: Guest) => {
  const origin = window.location.origin
  return `${origin}/invite/${encodeURIComponent(event.slug)}?to=${encodeURIComponent(guest.name)}&guest=${encodeURIComponent(guest.token)}`
}

export const fillWhatsappTemplate = (template: string, event: EventData, guest: Guest) => {
  const variables: Record<string, string> = {
    guest_name: guest.name,
    bride_full_name: event.brideFullName,
    groom_full_name: event.groomFullName,
    bride_name: event.brideName,
    groom_name: event.groomName,
    couple_name: `${event.brideName} & ${event.groomName}`,
    invitation_link: invitationUrl(event, guest),
  }

  return Object.entries(variables).reduce((text, [key, value]) => {
    return text
      .replaceAll(`{${key}}`, value)
      .replaceAll(`{{${key}}}`, value)
  }, template)
}

export const whatsappUrl = (template: string, event: EventData, guest: Guest) => {
  const phone = normalizePhone(guest.phone)
  const text = encodeURIComponent(fillWhatsappTemplate(template, event, guest))
  return `https://wa.me/${phone}?text=${text}`
}
