import { ArrowDown, ArrowUp, Eye, EyeOff, GripVertical, RotateCcw, Sparkles } from 'lucide-react'
import { getDefaultSectionSettings, normalizeSectionSettings, sectionCatalog } from '../../lib/sectionManager'
import type { EventData, SectionSetting } from '../../types'

interface Props {
  event: EventData
  onChange: (event: EventData) => void
  onPreview: () => void
}

function reorder(items: SectionSetting[], from: number, to: number) {
  const copy = items.map(item => ({ ...item }))
  const [moved] = copy.splice(from, 1)
  copy.splice(to, 0, moved)
  return copy.map((item, index) => ({ ...item, order: index }))
}

export function SectionManager({ event, onChange, onPreview }: Props) {
  const sections = normalizeSectionSettings(event.sectionSettings, event.themeId)
  const enabledCount = sections.filter(item => item.enabled).length
  const hiddenCount = sections.length - enabledCount

  const commit = (next: SectionSetting[]) => onChange({ ...event, sectionSettings: next.map((item, index) => ({ ...item, order: index })) })

  const patch = (key: SectionSetting['key'], update: Partial<SectionSetting>) => {
    commit(sections.map(item => item.key === key ? { ...item, ...update } : item))
  }

  const move = (index: number, delta: number) => {
    if (sections[index]?.key === 'cover') return
    const target = Math.max(1, Math.min(sections.length - 1, index + delta))
    if (target === index) return
    commit(reorder(sections, index, target))
  }

  const onDrop = (dragKey: string, targetKey: string) => {
    if (!dragKey || dragKey === 'cover' || dragKey === targetKey || targetKey === 'cover') return
    const from = sections.findIndex(item => item.key === dragKey)
    const to = sections.findIndex(item => item.key === targetKey)
    if (from < 0 || to < 0) return
    commit(reorder(sections, from, to))
  }

  const reset = () => onChange({ ...event, sectionSettings: [] })

  return <section>
    <div className="section-heading-row">
      <div>
        <span className="eyebrow">PAGE COMPOSER</span>
        <h1>Susunan Halaman</h1>
        <p>Atur urutan, tampil/sembunyikan section, dan ubah judul section tanpa menyentuh source template.</p>
      </div>
      <button className="primary-btn" onClick={onPreview} type="button"><Eye size={16}/> Preview</button>
    </div>

    <div className="section-manager-shell">
      <div className="panel section-manager-card">
        <div className="section-manager-toolbar">
          <div><strong>Section Undangan</strong><span>Drag untuk mengubah urutan. Cover selalu berada di paling atas.</span></div>
          <div className="section-manager-actions">
            <button className="secondary-btn" type="button" onClick={reset}><RotateCcw size={15}/> Reset ke Default Desain</button>
          </div>
        </div>

        <div className="section-list">
          {sections.map((item, index) => {
            const meta = sectionCatalog.find(section => section.key === item.key)!
            const fixed = Boolean(meta.fixed)
            return <article
              className="section-row"
              key={item.key}
              draggable={!fixed}
              onDragStart={event => { if (!fixed) event.dataTransfer.setData('text/plain', item.key) }}
              onDragOver={event => { if (!fixed) event.preventDefault() }}
              onDrop={event => { event.preventDefault(); onDrop(event.dataTransfer.getData('text/plain'), item.key) }}
            >
              <button className={`section-drag ${fixed ? 'locked' : ''}`} type="button" title={fixed ? 'Cover dikunci di atas' : 'Drag section'}><GripVertical size={16}/></button>
              <span className="section-index">{String(index + 1).padStart(2, '0')}</span>
              <div className="section-copy"><strong>{meta.label}</strong><small>{meta.description}</small></div>
              <input
                className="section-title-input"
                value={item.customTitle || ''}
                onChange={e => patch(item.key, { customTitle: e.target.value })}
                placeholder={item.key === 'cover' ? 'Judul cover mengikuti template' : 'Judul custom (opsional)'}
                disabled={item.key === 'cover'}
              />
              <div className="section-mobile-move">
                <button type="button" onClick={() => move(index, -1)} disabled={fixed || index <= 1}><ArrowUp size={13}/></button>
                <button type="button" onClick={() => move(index, 1)} disabled={fixed || index === sections.length - 1}><ArrowDown size={13}/></button>
              </div>
              <label className="section-switch" title={item.enabled ? 'Section tampil' : 'Section disembunyikan'}>
                <input type="checkbox" checked={item.enabled} onChange={e => patch(item.key, { enabled: e.target.checked })}/>
                <i/>{item.enabled ? <Eye size={14}/> : <EyeOff size={14}/>}<span>{item.enabled ? 'Tampil' : 'Hidden'}</span>
              </label>
            </article>
          })}
        </div>
      </div>

      <aside className="panel section-manager-preview-card">
        <div className="section-manager-summary">
          <div className="section-summary-card"><span>Desain aktif</span><strong>{event.themeId}</strong></div>
          <div className="section-summary-card"><span>Section tampil</span><strong>{enabledCount}</strong></div>
          <div className="section-summary-card"><span>Disembunyikan</span><strong>{hiddenCount}</strong></div>
          <div className="section-summary-card">
            <span>Urutan aktif</span>
            <div className="section-summary-list">{sections.map(item => <div key={item.key} className={item.enabled ? '' : 'off'}><i/>{sectionCatalog.find(section => section.key === item.key)?.label}</div>)}</div>
          </div>
          <div className="section-manager-hint"><Sparkles size={14}/> <strong>Per klien.</strong> Setting ini hanya berlaku untuk undangan <b>{event.clientName}</b>. Ganti desain tidak menghapus konfigurasi. Jika sebuah desain tidak memiliki section tertentu, setting tersebut disimpan tetapi diabaikan oleh renderer.</div>
        </div>
      </aside>
    </div>
  </section>
}
