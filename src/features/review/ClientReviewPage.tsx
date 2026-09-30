import { FormEvent, useEffect, useMemo, useState } from 'react'
import { CheckCircle2, ExternalLink, LoaderCircle, MessageSquareText, RefreshCcw, Send, XCircle } from 'lucide-react'
import { useParams } from 'react-router-dom'
import { publicApi, type ClientReviewPayload } from '../../lib/api'
import { reviewSectionLabel, reviewSections, reviewStatusLabel } from '../../lib/workflow'

export function ClientReviewPage() {
  const { token = '' } = useParams()
  const [data, setData] = useState<ClientReviewPayload | null>(null)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [sectionKey, setSectionKey] = useState('general')
  const [done, setDone] = useState<'approve' | 'revision' | ''>('')

  const load = async () => {
    setLoading(true); setError('')
    try { setData(await publicApi.getClientReview(token)) }
    catch (err) { setError(err instanceof Error ? err.message : 'Link review tidak dapat dibuka.') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [token])
  const coupleName = useMemo(() => data ? `${data.event.brideName} & ${data.event.groomName}` : '', [data])

  const submit = async (action: 'approve' | 'revision', event?: FormEvent) => {
    event?.preventDefault()
    if (action === 'revision' && !message.trim()) { setError('Tuliskan revisi yang ingin diminta.'); return }
    setBusy(true); setError('')
    try {
      await publicApi.submitClientReview(token, { action, message: message.trim(), sectionKey })
      setDone(action); setMessage('')
      await load()
    } catch (err) { setError(err instanceof Error ? err.message : 'Review gagal dikirim.') }
    finally { setBusy(false) }
  }

  if (loading) return <main className="client-review-state"><LoaderCircle className="spin"/><h1>Memuat preview...</h1></main>
  if (!data) return <main className="client-review-state error"><XCircle/><h1>Review tidak tersedia</h1><p>{error}</p></main>

  return <main className="client-review-page">
    <header className="client-review-header">
      <a href="/" className="client-review-brand"><img src="/brand/iinvitation-logo.png?v=rose-20260919" alt="Iinvitation"/></a>
      <div className="client-review-title"><span>CLIENT REVIEW</span><strong>{coupleName}</strong><small>Preview & approval undangan</small></div>
      <a className="client-review-open" href={data.previewUrl} target="_blank" rel="noreferrer"><ExternalLink size={15}/> Buka Fullscreen</a>
    </header>

    <div className="client-review-shell">
      <section className="client-review-preview"><iframe src={data.previewUrl} title={`Preview ${coupleName}`}/></section>
      <aside className="client-review-panel">
        <div className="review-panel-status"><span>Status review</span><strong className={`review-status ${data.reviewStatus}`}>{reviewStatusLabel[data.reviewStatus]}</strong></div>
        <div className="review-panel-intro"><span>REVIEW UNDANGAN</span><h1>Sudah sesuai?</h1><p>Lihat seluruh undangan di panel preview. Jika ada perubahan, tuliskan revisi sejelas mungkin agar admin dapat langsung mengerjakannya.</p></div>
        {done && <div className={`client-review-success ${done}`}><CheckCircle2/><div><strong>{done === 'approve' ? 'Approval terkirim' : 'Revisi terkirim'}</strong><span>{done === 'approve' ? 'Admin menerima konfirmasi bahwa desain sudah disetujui.' : 'Admin menerima catatan revisi Anda.'}</span></div></div>}
        {error && <div className="client-review-error">{error}</div>}
        <button className="client-approve-btn" disabled={busy || data.reviewStatus === 'approved'} onClick={() => submit('approve')}><CheckCircle2 size={17}/>{data.reviewStatus === 'approved' ? 'Sudah Disetujui' : 'Setujui Undangan'}</button>
        <form className="client-revision-form" onSubmit={event => submit('revision', event)}>
          <div className="client-review-divider"><span>atau minta revisi</span></div>
          <label>Bagian yang direvisi<select value={sectionKey} onChange={event => setSectionKey(event.target.value)}>{reviewSections.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label>
          <label>Catatan revisi<textarea value={message} onChange={event => setMessage(event.target.value)} placeholder="Contoh: Tolong pindahkan nama tamu sedikit ke bawah dan ubah warna teks cover menjadi ivory."/></label>
          <button className="client-revision-btn" disabled={busy || !message.trim()}><Send size={16}/>{busy ? 'Mengirim...' : 'Kirim Revisi'}</button>
        </form>
        <section className="client-review-history">
          <div className="client-review-history-title"><MessageSquareText size={16}/><strong>Riwayat Review</strong><button onClick={load} title="Refresh"><RefreshCcw size={14}/></button></div>
          {data.notes.length === 0 ? <p className="client-review-empty">Belum ada catatan.</p> : <div>{[...data.notes].reverse().map(item => <article key={item.id} className={`client-review-note ${item.author}`}><header><strong>{item.author === 'client' ? 'Anda' : 'Iinvitation'}</strong><span>{reviewSectionLabel(item.sectionKey)}</span></header><p>{item.message}</p><small>{new Date(item.createdAt).toLocaleString('id-ID')}</small></article>)}</div>}
        </section>
      </aside>
    </div>
  </main>
}
