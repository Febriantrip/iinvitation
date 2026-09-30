import type { CSSProperties } from 'react'
import type { ImageEdit } from '../types'

export const defaultImageEdit: ImageEdit = {
  positionX: 50,
  positionY: 50,
  zoom: 1,
  rotate: 0,
  brightness: 100,
  contrast: 100,
  saturation: 100,
  grayscale: 0,
  sepia: 0,
  blur: 0,
  flipX: false,
  flipY: false,
  aspect: 'cover',
}

export function normalizeImageEdit(value?: Partial<ImageEdit> | null): ImageEdit {
  return {
    positionX: clamp(Number(value?.positionX ?? 50), 0, 100),
    positionY: clamp(Number(value?.positionY ?? 50), 0, 100),
    zoom: clamp(Number(value?.zoom ?? 1), 1, 3),
    rotate: clamp(Number(value?.rotate ?? 0), -180, 180),
    brightness: clamp(Number(value?.brightness ?? 100), 40, 180),
    contrast: clamp(Number(value?.contrast ?? 100), 40, 200),
    saturation: clamp(Number(value?.saturation ?? 100), 0, 240),
    grayscale: clamp(Number(value?.grayscale ?? 0), 0, 100),
    sepia: clamp(Number(value?.sepia ?? 0), 0, 100),
    blur: clamp(Number(value?.blur ?? 0), 0, 8),
    flipX: Boolean(value?.flipX),
    flipY: Boolean(value?.flipY),
    aspect: value?.aspect === 'portrait' || value?.aspect === 'square' || value?.aspect === 'landscape' ? value.aspect : 'cover',
  }
}

export function imageStyle(edit?: Partial<ImageEdit> | null): CSSProperties {
  const safe = normalizeImageEdit(edit)
  const scaleX = safe.flipX ? -1 : 1
  const scaleY = safe.flipY ? -1 : 1
  return {
    objectPosition: `${safe.positionX}% ${safe.positionY}%`,
    transform: `scale(${safe.zoom}) scaleX(${scaleX}) scaleY(${scaleY}) rotate(${safe.rotate}deg)`,
    filter: `brightness(${safe.brightness}%) contrast(${safe.contrast}%) saturate(${safe.saturation}%) grayscale(${safe.grayscale}%) sepia(${safe.sepia}%) blur(${safe.blur}px)`,
  }
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}
