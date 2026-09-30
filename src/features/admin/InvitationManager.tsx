import { FormEvent, useState } from 'react'
import { CalendarDays, Check, Copy, ExternalLink, Plus, Trash2, UsersRound, X } from 'lucide-react'
import type { InvitationSummary } from '../../types'
import { getTheme, themes } from '../../lib/themes'
import { projectStatusLabel, publicationStatusLabel } from '../../lib/workflow'

interface CreateInvitationPayload {
  brideName: string
  groomName: string
  themeId: string
  eventDate: string
}

interface Props {
  invitations: InvitationSummary[]
  activeId: string
  onSelect: (id: string) => void
  onCreate: (payload: CreateInvitationPayload) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

const emptyForm = () => ({ brideName:'', groomName:'', themeId:'botanical-serenity', eventDate:'2026-12-12T10:00' })

export function InvitationManager({ invitations, activeId, onSelect, onCreate, onDelete }: Props) {
  const [showCreate, setShowCreate] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState(emptyForm)

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      await onCreate(form)
      setShowCreate(false)
      setForm(emptyForm())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal membuat undangan.')
    } finally {
      setBusy(false)
    }
  }

  const remove = async (item: InvitationSummary) => {
    if (!confirm(`Hapus project undangan “${item.clientName}”? Data tamu dan RSVP project ini ikut terhapus.`)) return
    setBusy(true)
    setError('')
    try { await onDelete(item.id) }
    catch (err) { setError(err instanceof Error ? err.message : 'Gagal menghapus project.') }
    finally { setBusy(false) }
  }

  return <section>
    <div className="page-heading">
      <div>
        <span className="eyebrow">Client Workspace</span>
        <h1>Klien & Undangan</h1>
        <p>Pilih klien lalu kelola. Alamat publik dibuat otomatis oleh sistem, jadi admin tidak perlu mengisi atau mengingat slug.</p>
      </div>
      <button className="primary-btn" onClick={() => setShowCreate(true)}><Plus size={16}/> Undangan Baru</button>
    </div>

    {error && <div className="notice-bar error">{error}</div>}

    <div className="project-grid">
      {invitations.map(item => {
        const theme = getTheme(item.themeId)
        const active = item.id === activeId
        return <article className={`project-card panel ${active ? 'active' : ''}`} key={item.id}>
          <div className="project-cover" style={{ backgroundImage: item.heroImage ? `url(${item.heroImage})` : undefined }}>
            <span>{theme.name}</span>
            {active && <b><Check size={13}/> Sedang Diedit</b>}
          </div>
          <div className="project-body">
            <span className="eyebrow">{item.clientName}</span>
            <h3>{item.brideName} <i>&</i> {item.groomName}</h3>
            <div className="project-meta">
              <span><CalendarDays size={14}/>{new Date(item.eventDate).toLocaleDateString('id-ID')}</span>
              <span><UsersRound size={14}/>{item.guestCount} tamu</span>
            </div>
            <div className="project-workflow-chips"><span className={`project-status-chip ${item.projectStatus}`}>{projectStatusLabel(item.projectStatus)}</span><span className={`publication-chip ${item.publicationStatus}`}>{publicationStatusLabel[item.publicationStatus]}</span></div>
            <small className="project-url-hint">Link publik dibuat otomatis</small>
            <div className="project-actions">
              <button className={active ? 'ghost-btn' : 'primary-btn'} disabled={active || busy} onClick={() => onSelect(item.id)}>{active ? 'Aktif' : 'Kelola'}</button>
              <button className="secondary-btn" title="Preview undangan" onClick={() => window.open(`/invite/${encodeURIComponent(item.slug)}?preview=${encodeURIComponent(item.previewToken)}&to=Preview`, '_blank')}><ExternalLink size={15}/></button>
              <button className="secondary-btn" title="Copy link undangan" onClick={() => navigator.clipboard.writeText(`${window.location.origin}/invite/${item.slug}`)}><Copy size={15}/></button>
              <button className="project-delete" title="Hapus project" disabled={busy} onClick={() => remove(item)}><Trash2 size={15}/></button>
            </div>
          </div>
        </article>
      })}
    </div>

    {showCreate && <div className="simple-modal-backdrop">
      <form className="simple-modal" onSubmit={submit}>
        <header>
          <div><span className="eyebrow">New Client</span><h3>Buat Undangan Baru</h3><p>Cukup isi data inti. Nama project dan URL dibuat otomatis.</p></div>
          <button type="button" className="icon-btn" onClick={() => setShowCreate(false)}><X size={18}/></button>
        </header>
        <div className="form-grid two">
          <label>Nama panggilan wanita<input required autoFocus value={form.brideName} placeholder="Contoh: Alya" onChange={e => setForm({...form,brideName:e.target.value})}/></label>
          <label>Nama panggilan pria<input required value={form.groomName} placeholder="Contoh: Raka" onChange={e => setForm({...form,groomName:e.target.value})}/></label>
          <label>Tanggal acara<input type="datetime-local" value={form.eventDate} onChange={e => setForm({...form,eventDate:e.target.value})}/></label>
          <label>Desain awal<select value={form.themeId} onChange={e => setForm({...form,themeId:e.target.value})}>{themes.map(theme => <option value={theme.id} key={theme.id}>{theme.name} · {theme.category}</option>)}</select></label>
        </div>
        <div className="auto-generated-note"><Check size={15}/><span>Project akan dibuat sebagai <strong>{form.brideName || 'Mempelai Wanita'} & {form.groomName || 'Mempelai Pria'}</strong>. Link undangan dibuat otomatis dan tetap bisa dicopy dari kartu klien.</span></div>
        {error && <div className="login-error">{error}</div>}
        <footer><button type="button" className="secondary-btn" onClick={() => setShowCreate(false)}>Batal</button><button className="primary-btn" disabled={busy}>{busy ? 'Membuat...' : 'Buat & Kelola'}</button></footer>
      </form>
    </div>}
  </section>
}
