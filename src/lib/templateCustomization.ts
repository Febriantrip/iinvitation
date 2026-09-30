import type { CSSProperties } from 'react'
import type { TemplateSettings } from '../types'

export type TemplateEditorRole = 'coverTitle' | 'recipient' | 'date' | 'sectionTitle'

export const templateFontOptions = [
  { id: 'theme', label: 'Default desain', family: '' },
  { id: 'cormorant', label: 'Cormorant Garamond', family: '"Cormorant Garamond", Georgia, serif' },
  { id: 'playfair', label: 'Playfair Display', family: '"Playfair Display", Georgia, serif' },
  { id: 'bodoni', label: 'Bodoni Moda', family: '"Bodoni Moda", Georgia, serif' },
  { id: 'libre', label: 'Libre Baskerville', family: '"Libre Baskerville", Georgia, serif' },
  { id: 'cinzel', label: 'Cinzel', family: 'Cinzel, Georgia, serif' },
  { id: 'montserrat', label: 'Montserrat', family: 'Montserrat, Arial, sans-serif' },
  { id: 'poppins', label: 'Poppins', family: 'Poppins, Arial, sans-serif' },
  { id: 'inter', label: 'Inter', family: 'Inter, Arial, sans-serif' },
  { id: 'great-vibes', label: 'Great Vibes', family: '"Great Vibes", cursive' },
  { id: 'parisienne', label: 'Parisienne', family: 'Parisienne, cursive' },
] as const

export const defaultTemplateSettings: TemplateSettings = {
  displayFont: 'theme',
  bodyFont: 'theme',
  scriptFont: 'theme',
  titleScale: 1,
  recipientScale: 1,
  dateScale: 1,
  sectionTitleScale: 1,
  letterSpacing: 0,
  coverTitleX: 0,
  coverTitleY: 0,
  recipientX: 0,
  recipientY: 0,
  dateX: 0,
  dateY: 0,
  sectionTitleX: 0,
  sectionTitleY: 0,
  textAlign: 'theme',
}

const number = (value: unknown, fallback: number, min: number, max: number) => {
  const parsed = Number(value)
  if (!Number.isFinite(parsed)) return fallback
  return Math.max(min, Math.min(max, parsed))
}

const fontIds = new Set(templateFontOptions.map(option => option.id))
const alignments = new Set(['theme', 'left', 'center', 'right'])

export function normalizeTemplateSettings(value?: Partial<TemplateSettings> | null): TemplateSettings {
  const raw = value || {}
  return {
    displayFont: fontIds.has(raw.displayFont as never) ? String(raw.displayFont) : 'theme',
    bodyFont: fontIds.has(raw.bodyFont as never) ? String(raw.bodyFont) : 'theme',
    scriptFont: fontIds.has(raw.scriptFont as never) ? String(raw.scriptFont) : 'theme',
    titleScale: number(raw.titleScale, 1, .6, 1.7),
    recipientScale: number(raw.recipientScale, 1, .65, 1.5),
    dateScale: number(raw.dateScale, 1, .65, 1.5),
    sectionTitleScale: number(raw.sectionTitleScale, 1, .7, 1.45),
    letterSpacing: number(raw.letterSpacing, 0, -2, 8),
    coverTitleX: number(raw.coverTitleX, 0, -240, 240),
    coverTitleY: number(raw.coverTitleY, 0, -240, 240),
    recipientX: number(raw.recipientX, 0, -240, 240),
    recipientY: number(raw.recipientY, 0, -240, 240),
    dateX: number(raw.dateX, 0, -240, 240),
    dateY: number(raw.dateY, 0, -240, 240),
    sectionTitleX: number(raw.sectionTitleX, 0, -160, 160),
    sectionTitleY: number(raw.sectionTitleY, 0, -160, 160),
    textAlign: alignments.has(String(raw.textAlign)) ? raw.textAlign as TemplateSettings['textAlign'] : 'theme',
  }
}

export function templateStyleVars(settings: TemplateSettings): CSSProperties {
  const display = templateFontOptions.find(option => option.id === settings.displayFont)?.family || ''
  const body = templateFontOptions.find(option => option.id === settings.bodyFont)?.family || ''
  const script = templateFontOptions.find(option => option.id === settings.scriptFont)?.family || ''
  return {
    '--ii-display-font': display,
    '--ii-body-font': body,
    '--ii-script-font': script,
    '--ii-title-scale': settings.titleScale,
    '--ii-recipient-scale': settings.recipientScale,
    '--ii-date-scale': settings.dateScale,
    '--ii-section-title-scale': settings.sectionTitleScale,
    '--ii-letter-spacing': `${settings.letterSpacing}px`,
    '--ii-cover-title-x': `${settings.coverTitleX}px`,
    '--ii-cover-title-y': `${settings.coverTitleY}px`,
    '--ii-recipient-x': `${settings.recipientX}px`,
    '--ii-recipient-y': `${settings.recipientY}px`,
    '--ii-date-x': `${settings.dateX}px`,
    '--ii-date-y': `${settings.dateY}px`,
    '--ii-section-title-x': `${settings.sectionTitleX}px`,
    '--ii-section-title-y': `${settings.sectionTitleY}px`,
  } as CSSProperties
}

export const templateEditorRoles: Record<TemplateEditorRole, { label: string; hint: string; x: keyof TemplateSettings; y: keyof TemplateSettings; scale: keyof TemplateSettings }> = {
  coverTitle: { label: 'Nama pasangan', hint: 'Judul utama di cover / hero.', x: 'coverTitleX', y: 'coverTitleY', scale: 'titleScale' },
  recipient: { label: 'Nama tamu', hint: 'Blok Kepada Yth. / nama penerima.', x: 'recipientX', y: 'recipientY', scale: 'recipientScale' },
  date: { label: 'Tanggal', hint: 'Tanggal yang tampil di cover.', x: 'dateX', y: 'dateY', scale: 'dateScale' },
  sectionTitle: { label: 'Judul section', hint: 'Heading utama pada isi undangan.', x: 'sectionTitleX', y: 'sectionTitleY', scale: 'sectionTitleScale' },
}
