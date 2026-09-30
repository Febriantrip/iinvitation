import { useMemo, useState } from 'react'
import { Check, CheckCircle2, ClipboardCheck, Clock3, Copy, ExternalLink, Globe2, Link2, MessageSquareText, Rocket, RotateCcw, Send, ShieldCheck } from 'lucide-react'
import type { AppState, ProjectStatus, PublicationStatus } from '../../types'
import { adminApi } from '../../lib/api'
import { projectStatusLabel, projectStatusOptions, publicationStatusLabel, reviewSectionLabel, reviewSections, reviewStatusLabel } from '../../lib/workflow'

interface Props {
  state: AppState
  onReplaceState: (state: AppState) => void
  onPersistCurrent: () => Promise<void>
  onRefreshCurrent: () => Promise<void>
}

export function WorkflowCenter({ state, onReplaceState, onPersistCurrent, onRefreshCurrent }: Props) {
  const [busy, setBusy] = useState('')
  const [note, setNote] = useState('')
  const [sectionKey, setSectionKey] = useState('general')
  const [error, setError] = useState('')
  const event = state.event
  const reviewNotes = Array.isArray(state.reviewNotes) ? state.reviewNotes : []
  const projectStatus = event.projectStatus || 'published'
  const publicationStatus = event.publicationStatus || 'published'
  const reviewStatus = event.reviewStatus || 'not_sent'
  const reviewToken = event.reviewToken || ''
  const previewToken = event.previewToken || ''
  const reviewUrl = `${window.location.origin}/review/${reviewToken}`
  const publicUrl = `${window.location.origin}/invite/${event.slug}`
  const previewUrl = `${publicUrl}?preview=${encodeURIComponent(previewToken)}&to=${encodeURIComponent('Preview Klien')}`

  const readiness = useMemo(() => [
    { label: 'Nama pasangan', ok: Boolean(event.brideName && event.groomName) },
    { label: 'Tanggal acara', ok: Boolean(event.eventDate) },
    { label: 'Lokasi acara', ok: Boolean(event.venueName && event.venueAddress) },
    { label: 'Foto cover', ok: Boolean(event.heroImage) },
    { label: 'Desain dipilih', ok: Boolean(event.themeId) },
    { label: 'Daftar tamu', ok: state.guests.length > 0 },
  ], [event, state.guests.length])
  const readyCount = readiness.filter(item => item.ok).length

  const run = async (key: string, action: () => Promise<void>) => {
    setBusy(key); setError('')
    try { await action() } catch (err) { setError(err instanceof Error ? err.message : 'Aksi gagal diproses.') }
    finally { setBusy('') }
  }

  const updateWorkflow = (payload: { projectStatus?: ProjectStatus; publicationStatus?: PublicationStatus; reviewStatus?: AppState['event']['reviewStatus']; expiresAt?: string | null }) => run('workflow', async () => {
    await onPersistCurrent()
    const fresh = await adminApi.updateWorkflow(event.id, payload)
    onReplaceState(fresh)
  })

  const sendReview = () => run('review', async () => {
    await onPersistCurrent()
    const fresh = await adminApi.sendForReview(event.id)
    onReplaceState(fresh)
    await navigator.clipboard.writeText(reviewUrl).catch(() => {})
  })

  const addNote = () => run('note', async () => {
    if (!note.trim()) return
    await onPersistCurrent()
    await adminApi.addReviewNote(event.id, { message: note.trim(), sectionKey, kind: 'comment' })
    setNote('')
    await onRefreshCurrent()
  })

  return <section className="workflow-page">
    <div className="page-heading">
      <div><span className="eyebrow">Production Control</span><h1>Workflow & Publish</h1><p>Kelola status pengerjaan, review klien, approval, dan publikasi tanpa keluar dari workspace.</p></div>
      <div className="workflow-heading-actions"><button className="secondary-btn" onClick={() => window.open(previewUrl, '_blank')}><ExternalLink size={15}/> Preview Aman</button><button className="primary-btn" onClick={() => navigator.clipboard.writeText(reviewUrl)}><Link2 size={15}/> Copy Link Review</button></div>
    </div>

    {error && <div className="notice-bar error">{error}</div>}

    <div className="workflow-overview-grid">
      <article className="panel workflow-status-card">
        <div className="workflow-card-head"><div className="workflow-icon"><ClipboardCheck size={20}/></div><div><span className="eyebrow">PROJECT STATUS</span><h3>{projectStatusLabel(projectStatus)}</h3></div></div>
        <div className="workflow-pipeline">{projectStatusOptions.map((item, index) => <button key={item.id} className={`${projectStatus === item.id ? 'active' : ''}`} disabled={busy === 'workflow'} onClick={() => updateWorkflow({ projectStatus: item.id })}><i>{index + 1}</i><span><strong>{item.label}</strong><small>{item.hint}</small></span></button>)}</div>
      </article>

      <article className="panel workflow-publish-card">
        <div className="workflow-card-head"><div className="workflow-icon"><Globe2 size={20}/></div><div><span className="eyebrow">PUBLICATION</span><h3>{publicationStatusLabel[publicationStatus]}</h3></div></div>
        <p>Draft hanya dapat dibuka melalui link preview/review. Published dapat diakses tamu dari link undangan biasa.</p>
        <div className={`publication-state ${publicationStatus}`}><span>{publicationStatus === 'published' ? <CheckCircle2/> : publicationStatus === 'expired' ? <Clock3/> : <ShieldCheck/>}</span><div><strong>{publicationStatusLabel[publicationStatus]}</strong><small>{publicationStatus === 'published' ? `Aktif${event.publishedAt ? ` sejak ${new Date(event.publishedAt).toLocaleString('id-ID')}` : ''}` : publicationStatus === 'expired' ? 'Link publik dinonaktifkan.' : 'Aman untuk proses desain dan review.'}</small></div></div>
        <label className="publication-expiry"><span>Expired otomatis (opsional)</span><input type="datetime-local" value={event.expiresAt ? new Date(event.expiresAt).toISOString().slice(0,16) : ''} onChange={e => updateWorkflow({ expiresAt: e.target.value || null })}/></label>
        <div className="publication-actions">
          <button className="secondary-btn" disabled={busy === 'workflow'} onClick={() => updateWorkflow({ publicationStatus: 'draft', projectStatus: projectStatus === 'published' ? 'approved' : projectStatus })}><RotateCcw size={15}/> Unpublish</button>
          <button className="secondary-btn danger-soft" disabled={busy === 'workflow'} onClick={() => updateWorkflow({ publicationStatus: 'expired' })}><Clock3 size={15}/> Expire</button>
          <button className="primary-btn" disabled={busy === 'workflow' || !event.featureWebsite} onClick={() => updateWorkflow({ publicationStatus: 'published', projectStatus: 'published' })}><Rocket size={15}/> Publish Website</button>
        </div>
        <div className="workflow-link-row"><code>{publicUrl}</code><button onClick={() => navigator.clipboard.writeText(publicUrl)}><Copy size={14}/></button></div>
      </article>

      <article className="panel workflow-readiness-card">
        <div className="workflow-card-head"><div className="workflow-icon"><CheckCircle2 size={20}/></div><div><span className="eyebrow">READINESS</span><h3>{readyCount}/{readiness.length} siap</h3></div></div>
        <div className="readiness-meter"><i style={{ width: `${Math.round(readyCount/readiness.length*100)}%` }}/></div>
        <div className="readiness-list">{readiness.map(item => <div key={item.label} className={item.ok ? 'done' : ''}>{item.ok ? <Check size={14}/> : <span/>}<strong>{item.label}</strong></div>)}</div>
      </article>
    </div>

    <div className="workflow-review-grid">
      <article className="panel client-review-card">
        <div className="panel-title"><div><span className="eyebrow">CLIENT REVIEW</span><h3>Approval & Revisi</h3></div><span className={`review-status ${reviewStatus}`}>{reviewStatusLabel[reviewStatus]}</span></div>
        <p>Kirim satu link khusus kepada klien. Klien dapat melihat preview penuh lalu memilih <strong>Setujui</strong> atau <strong>Minta Revisi</strong>.</p>
        <div className="review-link-box"><Link2 size={17}/><code>{reviewUrl}</code><button onClick={() => navigator.clipboard.writeText(reviewUrl)}><Copy size={15}/></button><button onClick={() => window.open(reviewUrl, '_blank')}><ExternalLink size={15}/></button></div>
        <div className="review-actions"><button className="primary-btn" disabled={busy === 'review'} onClick={sendReview}><Send size={15}/>{busy === 'review' ? 'Mengirim...' : reviewStatus === 'pending' ? 'Kirim Ulang Link Review' : 'Kirim ke Review Klien'}</button>{reviewStatus === 'approved' && <span className="approved-badge"><CheckCircle2 size={15}/> Klien sudah approve</span>}</div>

        <div className="admin-note-compose">
          <label>Catatan internal / untuk klien<select value={sectionKey} onChange={e => setSectionKey(e.target.value)}>{reviewSections.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label>
          <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Contoh: Cover sudah diperbarui sesuai revisi warna dan posisi nama."/>
          <button className="secondary-btn" disabled={!note.trim() || busy === 'note'} onClick={addNote}><MessageSquareText size={15}/> Tambah Catatan</button>
        </div>
      </article>

      <article className="panel review-timeline-card">
        <div className="panel-title"><div><span className="eyebrow">HISTORY</span><h3>Riwayat Review</h3></div><span className="pill">{reviewNotes.length} catatan</span></div>
        {reviewNotes.length === 0 ? <div className="empty-state"><MessageSquareText size={25}/><strong>Belum ada review</strong><span>Kirim link review ke klien untuk memulai approval.</span></div> : <div className="review-timeline">{[...reviewNotes].reverse().map(item => <div className={`review-note ${item.author} ${item.kind}`} key={item.id}><i>{item.author === 'client' ? 'C' : 'A'}</i><div><header><strong>{item.author === 'client' ? 'Klien' : 'Admin'}</strong><span>{reviewSectionLabel(item.sectionKey)} · {new Date(item.createdAt).toLocaleString('id-ID')}</span></header><p>{item.message}</p></div></div>)}</div>}
      </article>
    </div>
  </section>
}
