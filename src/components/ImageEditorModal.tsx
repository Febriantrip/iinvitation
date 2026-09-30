import { PointerEvent, useRef, useState } from 'react'
import { ArrowLeftRight, ArrowUpDown, Check, Move, RotateCcw, SlidersHorizontal, Sparkles, X } from 'lucide-react'
import type { ImageEdit } from '../types'
import { clamp, defaultImageEdit, imageStyle, normalizeImageEdit } from '../lib/imageEdit'

interface Props {
  open: boolean
  url: string
  value?: Partial<ImageEdit> | null
  title?: string
  onClose: () => void
  onSave: (value: ImageEdit) => void
}

export function ImageEditorModal({ open, url, value, title = 'Edit Foto', onClose, onSave }: Props) {
  const [draft, setDraft] = useState<ImageEdit>(() => normalizeImageEdit(value))
  const drag = useRef<{ x: number; y: number; px: number; py: number } | null>(null)

  if (!open) return null

  const change = <K extends keyof ImageEdit>(key: K, next: ImageEdit[K]) => setDraft(current => ({ ...current, [key]: next }))
  const reset = () => setDraft({ ...defaultImageEdit, aspect: draft.aspect })

  const applyPreset = (preset: 'natural' | 'soft' | 'mono' | 'warm') => {
    if (preset === 'natural') setDraft(current => ({ ...current, brightness: 100, contrast: 100, saturation: 100, grayscale: 0, sepia: 0, blur: 0 }))
    if (preset === 'soft') setDraft(current => ({ ...current, brightness: 106, contrast: 92, saturation: 88, grayscale: 0, sepia: 8, blur: 0 }))
    if (preset === 'mono') setDraft(current => ({ ...current, brightness: 104, contrast: 116, saturation: 0, grayscale: 100, sepia: 0, blur: 0 }))
    if (preset === 'warm') setDraft(current => ({ ...current, brightness: 104, contrast: 105, saturation: 108, grayscale: 0, sepia: 18, blur: 0 }))
  }

  const pointerDown = (event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId)
    drag.current = { x: event.clientX, y: event.clientY, px: draft.positionX, py: draft.positionY }
  }
  const pointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return
    const rect = event.currentTarget.getBoundingClientRect()
    const dx = (event.clientX - drag.current.x) / rect.width * 100
    const dy = (event.clientY - drag.current.y) / rect.height * 100
    setDraft(current => ({ ...current, positionX: clamp(drag.current!.px - dx, 0, 100), positionY: clamp(drag.current!.py - dy, 0, 100) }))
  }
  const pointerUp = (event: PointerEvent<HTMLDivElement>) => {
    try { event.currentTarget.releasePointerCapture(event.pointerId) } catch { /* no-op */ }
    drag.current = null
  }

  return <div className="image-editor-backdrop" role="dialog" aria-modal="true" aria-label={title}>
    <div className="image-editor-modal">
      <header>
        <div><span className="eyebrow">Photo Studio</span><h3>{title}</h3><p>Drag untuk menggeser framing. Semua edit non-destruktif, jadi file asli tetap aman dan bisa di-reset kapan saja.</p></div>
        <button className="icon-btn" onClick={onClose} aria-label="Tutup"><X size={18}/></button>
      </header>

      <div className="image-editor-layout">
        <div className="image-editor-stage-wrap">
          <div className={`image-editor-stage aspect-${draft.aspect}`} onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerUp} onPointerCancel={pointerUp}>
            <img src={url} alt="Preview edit" draggable={false} style={imageStyle(draft)} />
            <span className="drag-hint"><Move size={15}/> drag untuk geser crop</span>
            <i className="crop-guide crop-guide-v1"/><i className="crop-guide crop-guide-v2"/><i className="crop-guide crop-guide-h1"/><i className="crop-guide crop-guide-h2"/>
          </div>
          <div className="aspect-picker">
            {(['cover','portrait','square','landscape'] as const).map(aspect => <button key={aspect} className={draft.aspect === aspect ? 'active' : ''} onClick={() => change('aspect', aspect)}>{aspect === 'cover' ? 'Cover' : aspect === 'portrait' ? 'Portrait' : aspect === 'square' ? 'Square' : 'Landscape'}</button>)}
          </div>
          <div className="image-transform-buttons">
            <button className={draft.flipX ? 'active' : ''} onClick={() => change('flipX', !draft.flipX)}><ArrowLeftRight size={15}/> Flip H</button>
            <button className={draft.flipY ? 'active' : ''} onClick={() => change('flipY', !draft.flipY)}><ArrowUpDown size={15}/> Flip V</button>
          </div>
        </div>

        <div className="image-editor-controls">
          <div className="control-group"><div className="control-heading"><Move size={16}/><strong>Crop & Posisi</strong></div>
            <Range label="Horizontal" value={draft.positionX} min={0} max={100} suffix="%" onChange={value => change('positionX', value)} />
            <Range label="Vertikal" value={draft.positionY} min={0} max={100} suffix="%" onChange={value => change('positionY', value)} />
            <Range label="Zoom" value={draft.zoom} min={1} max={3} step={0.01} suffix="x" onChange={value => change('zoom', value)} />
            <Range label="Rotasi" value={draft.rotate} min={-180} max={180} suffix="°" onChange={value => change('rotate', value)} />
          </div>

          <div className="control-group"><div className="control-heading"><Sparkles size={16}/><strong>Preset</strong></div>
            <div className="photo-preset-grid"><button onClick={() => applyPreset('natural')}>Natural</button><button onClick={() => applyPreset('soft')}>Soft</button><button onClick={() => applyPreset('warm')}>Warm</button><button onClick={() => applyPreset('mono')}>B&amp;W</button></div>
          </div>

          <div className="control-group"><div className="control-heading"><SlidersHorizontal size={16}/><strong>Adjust</strong></div>
            <Range label="Brightness" value={draft.brightness} min={40} max={180} suffix="%" onChange={value => change('brightness', value)} />
            <Range label="Contrast" value={draft.contrast} min={40} max={200} suffix="%" onChange={value => change('contrast', value)} />
            <Range label="Saturation" value={draft.saturation} min={0} max={240} suffix="%" onChange={value => change('saturation', value)} />
            <Range label="Grayscale" value={draft.grayscale} min={0} max={100} suffix="%" onChange={value => change('grayscale', value)} />
            <Range label="Sepia" value={draft.sepia} min={0} max={100} suffix="%" onChange={value => change('sepia', value)} />
            <Range label="Blur" value={draft.blur} min={0} max={8} step={0.1} suffix="px" onChange={value => change('blur', value)} />
          </div>
        </div>
      </div>

      <footer>
        <button className="secondary-btn" onClick={reset}><RotateCcw size={16}/> Reset</button>
        <div><button className="secondary-btn" onClick={onClose}>Batal</button><button className="primary-btn" onClick={() => onSave(draft)}><Check size={16}/> Terapkan</button></div>
      </footer>
    </div>
  </div>
}

function Range({ label, value, min, max, step = 1, suffix, onChange }: { label: string; value: number; min: number; max: number; step?: number; suffix: string; onChange: (value: number) => void }) {
  return <label className="range-row"><span>{label}<b>{Number(value.toFixed(step < 1 ? 2 : 0))}{suffix}</b></span><input type="range" min={min} max={max} step={step} value={value} onChange={event => onChange(Number(event.target.value))}/></label>
}
