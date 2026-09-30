import { useEffect, useMemo, useRef, useState } from 'react'
import { AlignCenter, AlignLeft, AlignRight, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, ExternalLink, Monitor, Move, Redo2, RotateCcw, Smartphone, Type, Undo2, X } from 'lucide-react'
import type { EventData, TemplateSettings } from '../../types'
import { defaultTemplateSettings, normalizeTemplateSettings, templateEditorRoles, templateFontOptions, type TemplateEditorRole } from '../../lib/templateCustomization'
import { getTheme } from '../../lib/themes'

const roleOrder: TemplateEditorRole[] = ['coverTitle', 'recipient', 'date', 'sectionTitle']

type Props = {
  event: EventData
  onChange: (event: EventData) => void
  onClose: () => void
}

export function TemplateEditor({ event, onChange, onClose }: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop')
  const [role, setRole] = useState<TemplateEditorRole>('coverTitle')
  const [past, setPast] = useState<TemplateSettings[]>([])
  const [future, setFuture] = useState<TemplateSettings[]>([])
  const settings = useMemo(() => normalizeTemplateSettings(event.templateSettings), [event.templateSettings])
  const theme = getTheme(event.themeId)
  const meta = templateEditorRoles[role]
  const previewUrl = `/invite/${encodeURIComponent(event.slug)}?preview=${encodeURIComponent(event.previewToken)}&to=${encodeURIComponent('Preview Tamu')}&theme=${encodeURIComponent(event.themeId)}&editor=1`

  const emitToPreview = (next: TemplateSettings = settings, nextRole: TemplateEditorRole = role) => {
    iframeRef.current?.contentWindow?.postMessage({ type: 'iinvitation-template-editor', settings: next, role: nextRole }, window.location.origin)
  }

  const applySettings = (next: TemplateSettings) => { onChange({ ...event, templateSettings: next }); emitToPreview(next) }

  const record = (snapshot: TemplateSettings) => {
    setPast(items => [...items.slice(-39), snapshot])
    setFuture([])
  }

  const update = (patch: Partial<TemplateSettings>) => {
    const next = normalizeTemplateSettings({ ...settings, ...patch })
    if (JSON.stringify(next) === JSON.stringify(settings)) return
    record(settings)
    applySettings(next)
  }

  const undo = () => {
    const previous = past[past.length - 1]
    if (!previous) return
    setPast(items => items.slice(0, -1))
    setFuture(items => [settings, ...items].slice(0, 40))
    applySettings(previous)
  }

  const redo = () => {
    const next = future[0]
    if (!next) return
    setFuture(items => items.slice(1))
    setPast(items => [...items.slice(-39), settings])
    applySettings(next)
  }

  const updateRoleValue = (key: keyof TemplateSettings, value: number) => update({ [key]: value } as Partial<TemplateSettings>)

  const nudge = (dx: number, dy: number) => {
    const x = Number(settings[meta.x]) || 0
    const y = Number(settings[meta.y]) || 0
    update({ [meta.x]: x + dx, [meta.y]: y + dy } as Partial<TemplateSettings>)
  }

  const resetRole = () => update({
    [meta.x]: defaultTemplateSettings[meta.x],
    [meta.y]: defaultTemplateSettings[meta.y],
    [meta.scale]: defaultTemplateSettings[meta.scale],
  } as Partial<TemplateSettings>)

  const resetAll = () => update(defaultTemplateSettings)

  useEffect(() => { emitToPreview(settings, role) }, [role])
  useEffect(() => {
    const handler = (message: MessageEvent) => {
      if (message.source !== iframeRef.current?.contentWindow) return
      if (message.origin !== window.location.origin) return
      if (message.data?.type === 'iinvitation-template-editor-drag-start') {
        setPast(items => [...items.slice(-39), normalizeTemplateSettings(message.data.settings)])
        setFuture([])
        return
      }
      if (message.data?.type !== 'iinvitation-template-editor-drag') return
      onChange({ ...event, templateSettings: normalizeTemplateSettings(message.data.settings) })
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [event, onChange])

  return <div className="template-editor-modal" role="dialog" aria-modal="true" aria-label="Editor tampilan undangan">
    <header className="template-editor-topbar">
      <div><span>VISUAL TEMPLATE EDITOR</span><strong>{theme.name}</strong><small>Perubahan otomatis tersimpan untuk klien ini.</small></div>
      <div className="template-editor-top-actions">
        <div className="template-history-actions"><button disabled={!past.length} onClick={undo} title="Undo"><Undo2 size={15}/> Undo</button><button disabled={!future.length} onClick={redo} title="Redo"><Redo2 size={15}/> Redo</button></div>
        <div className="template-device-switch"><button className={device === 'desktop' ? 'active' : ''} onClick={() => setDevice('desktop')}><Monitor size={15}/> Desktop</button><button className={device === 'mobile' ? 'active' : ''} onClick={() => setDevice('mobile')}><Smartphone size={15}/> Mobile</button></div>
        <a href={previewUrl.replace('&editor=1', '')} target="_blank" rel="noreferrer"><ExternalLink size={15}/> Preview</a>
        <button className="template-editor-close" onClick={onClose} aria-label="Tutup editor"><X size={20}/></button>
      </div>
    </header>

    <div className="template-editor-layout">
      <aside className="template-editor-controls">
        <section>
          <div className="template-control-heading"><Type size={17}/><div><strong>Tipografi</strong><span>Pilih font tanpa mengubah source template.</span></div></div>
          <label>Font judul<select value={settings.displayFont} onChange={e => update({ displayFont: e.target.value })}>{templateFontOptions.map(font => <option key={font.id} value={font.id}>{font.label}</option>)}</select></label>
          <label>Font isi<select value={settings.bodyFont} onChange={e => update({ bodyFont: e.target.value })}>{templateFontOptions.map(font => <option key={font.id} value={font.id}>{font.label}</option>)}</select></label>
          <label>Font script / aksen<select value={settings.scriptFont} onChange={e => update({ scriptFont: e.target.value })}>{templateFontOptions.map(font => <option key={font.id} value={font.id}>{font.label}</option>)}</select></label>
          <label>Jarak huruf judul <b>{settings.letterSpacing.toFixed(1)} px</b><input type="range" min="-2" max="8" step=".2" value={settings.letterSpacing} onChange={e => update({ letterSpacing: Number(e.target.value) })}/></label>
          <div className="template-align-control"><span>Perataan teks</span><div><button className={settings.textAlign === 'left' ? 'active' : ''} onClick={() => update({ textAlign: settings.textAlign === 'left' ? 'theme' : 'left' })} title="Kiri"><AlignLeft size={16}/></button><button className={settings.textAlign === 'center' ? 'active' : ''} onClick={() => update({ textAlign: settings.textAlign === 'center' ? 'theme' : 'center' })} title="Tengah"><AlignCenter size={16}/></button><button className={settings.textAlign === 'right' ? 'active' : ''} onClick={() => update({ textAlign: settings.textAlign === 'right' ? 'theme' : 'right' })} title="Kanan"><AlignRight size={16}/></button></div><small>Klik pilihan aktif sekali lagi untuk kembali ke default desain.</small></div>
        </section>

        <section>
          <div className="template-control-heading"><Move size={17}/><div><strong>Posisi elemen</strong><span>Pilih elemen lalu drag langsung di preview, atau gunakan kontrol presisi.</span></div></div>
          <div className="template-role-list">{roleOrder.map(item => <button key={item} className={role === item ? 'active' : ''} onClick={() => setRole(item)}><strong>{templateEditorRoles[item].label}</strong><small>{templateEditorRoles[item].hint}</small></button>)}</div>
          <div className="template-position-card">
            <div className="template-position-title"><div><strong>{meta.label}</strong><span>Drag elemen yang diberi outline di preview.</span></div><button onClick={resetRole}><RotateCcw size={14}/> Reset</button></div>
            <div className="template-nudge-pad"><span/><button onClick={() => nudge(0,-4)}><ChevronUp/></button><span/><button onClick={() => nudge(-4,0)}><ChevronLeft/></button><div>4px</div><button onClick={() => nudge(4,0)}><ChevronRight/></button><span/><button onClick={() => nudge(0,4)}><ChevronDown/></button><span/></div>
            <label>X <b>{Number(settings[meta.x]).toFixed(0)} px</b><input type="range" min="-240" max="240" step="1" value={Number(settings[meta.x])} onChange={e => updateRoleValue(meta.x, Number(e.target.value))}/></label>
            <label>Y <b>{Number(settings[meta.y]).toFixed(0)} px</b><input type="range" min="-240" max="240" step="1" value={Number(settings[meta.y])} onChange={e => updateRoleValue(meta.y, Number(e.target.value))}/></label>
            <label>Ukuran <b>{Math.round(Number(settings[meta.scale]) * 100)}%</b><input type="range" min=".65" max="1.5" step=".01" value={Number(settings[meta.scale])} onChange={e => updateRoleValue(meta.scale, Number(e.target.value))}/></label>
          </div>
        </section>
        <button className="template-reset-all" onClick={resetAll}><RotateCcw size={15}/> Reset semua ke desain asli</button>
      </aside>

      <div className="template-editor-stage">
        <div className={`template-preview-device ${device}`}>
          <iframe ref={iframeRef} src={previewUrl} title={`Editor ${theme.name}`} onLoad={() => emitToPreview()} />
        </div>
        <div className="template-editor-tip"><Move size={14}/><span>Pilih elemen di panel kiri, lalu <strong>drag langsung</strong> tulisan yang diberi outline pada preview.</span></div>
      </div>
    </div>
  </div>
}
