import { Copy, ExternalLink, MessageCircle, RotateCcw } from 'lucide-react'
import type { EventData, Guest } from '../../types'
import { defaultState } from '../../lib/defaultData'
import { fillWhatsappTemplate, whatsappUrl } from '../../utils/guest'

export function WhatsappEditor({ template, event, guests, onChange }: { template: string; event: EventData; guests: Guest[]; onChange: (value: string) => void }) {
  const exampleGuest = guests[0] ?? { id:'preview', name:'Bapak/Ibu/Saudara/i', phone:'6280000000001', group:'Preview', token:'preview', status:'Belum dibuka' as const, createdAt:'' }
  const preview = fillWhatsappTemplate(template, event, exampleGuest)
  const copy = () => navigator.clipboard.writeText(preview)

  return <section>
    <div className="page-heading"><div><span className="eyebrow">Distribution Copy</span><h1>Pesan WhatsApp</h1><p>Template ini dipakai otomatis untuk semua tombol WhatsApp di daftar tamu.</p></div></div>
    <div className="whatsapp-layout">
      <article className="panel whatsapp-editor-card">
        <div className="panel-title"><div><span className="eyebrow">Template</span><h3>Kalimat undangan</h3></div><button className="ghost-btn compact" onClick={()=>onChange(defaultState.whatsappTemplate)}><RotateCcw size={15}/> Reset contoh</button></div>
        <textarea className="message-editor" value={template} onChange={e=>onChange(e.target.value)} />
        <div className="variable-list">
          <span>Variabel:</span>
          <code>{'{guest_name}'}</code><code>{'{bride_full_name}'}</code><code>{'{groom_full_name}'}</code><code>{'{couple_name}'}</code><code>{'{invitation_link}'}</code>
        </div>
        <p className="tiny-note">Tips: pertahankan <code>{'{guest_name}'}</code> dan <code>{'{invitation_link}'}</code> agar tiap penerima mendapat pesan dan URL personal.</p>
      </article>
      <article className="panel phone-preview-card">
        <div className="panel-title"><div><span className="eyebrow">Preview</span><h3>WhatsApp message</h3></div><MessageCircle size={20}/></div>
        <div className="phone-shell"><div className="phone-top">WhatsApp Preview</div><div className="chat-bg"><div className="chat-bubble">{preview}</div></div></div>
        <div className="preview-actions">
          <button className="secondary-btn" onClick={copy}><Copy size={16}/> Copy</button>
          {exampleGuest.phone && <a className="primary-btn" href={whatsappUrl(template, event, exampleGuest)} target="_blank" rel="noreferrer"><ExternalLink size={16}/> Test WhatsApp</a>}
        </div>
      </article>
    </div>
  </section>
}
