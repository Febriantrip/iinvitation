import { useMemo, useState } from 'react'
import { Download, ExternalLink, LoaderCircle, QrCode, RotateCcw, Search, UserCheck, UsersRound } from 'lucide-react'
import type { AppState, Guest } from '../../types'
import { adminApi } from '../../lib/api'
import { downloadText } from '../../utils/file'

interface Props {
  state: AppState
  onRefresh: () => Promise<void>
  onOpenOperator: () => Promise<void>
}

export function GuestbookAdmin({ state, onRefresh, onOpenOperator }: Props) {
  const [query, setQuery] = useState('')
  const [busy, setBusy] = useState('')
  const [opening, setOpening] = useState(false)
  const [paxMap, setPaxMap] = useState<Record<string, number>>({})
  const checkinByGuest = useMemo(() => new Map(state.checkins.map(c => [c.guestId, c])), [state.checkins])
  const filtered = state.guests.filter(g => `${g.name} ${g.phone} ${g.group}`.toLowerCase().includes(query.toLowerCase()))
  const totalPax = state.checkins.reduce((sum, c) => sum + c.pax, 0)

  const checkIn = async (guest: Guest) => {
    setBusy(guest.id)
    try { await adminApi.checkIn(state.event.id, guest.id, paxMap[guest.id] || guest.invitedPax || 1, 'operator'); await onRefresh() } finally { setBusy('') }
  }
  const undo = async (guest: Guest) => {
    if (!confirm(`Batalkan check-in ${guest.name}?`)) return
    setBusy(guest.id)
    try { await adminApi.undoCheckIn(state.event.id, guest.id); await onRefresh() } finally { setBusy('') }
  }
  const openOperator = async () => {
    if (opening) return
    setOpening(true)
    try { await onOpenOperator() } finally { setOpening(false) }
  }
  const exportCsv = () => {
    const rows = [['Nama','Grup','Pax Undangan','Pax Hadir','Waktu Check-in'], ...state.guests.map(g => {
      const c = checkinByGuest.get(g.id)
      return [g.name,g.group,g.invitedPax,c?.pax || '',c ? new Date(c.checkedInAt).toLocaleString('id-ID') : '']
    })]
    downloadText(`guestbook-${state.event.slug}.csv`, rows.map(row => row.map(v => `"${String(v).replaceAll('"','""')}"`).join(',')).join('\n'))
  }

  return <section>
    <div className="page-heading"><div><span className="eyebrow">Realtime Attendance</span><h1>Digital Guestbook</h1><p>Check-in real untuk {state.event.clientName}. Data di bawah menggunakan daftar tamu yang sama dengan link undangan dan WhatsApp.</p></div><div className="heading-actions"><button className="secondary-btn" onClick={exportCsv}><Download size={16}/> Export CSV</button><button className="primary-btn" disabled={opening} onClick={openOperator}>{opening ? <LoaderCircle className="spin" size={16}/> : <ExternalLink size={16}/>} {state.event.featureGuestbook ? 'Mode Operator' : 'Aktifkan & Buka Operator'}</button></div></div>
    {!state.event.featureGuestbook && <div className="notice-bar">Digital Guestbook belum aktif. Klik <b>Aktifkan & Buka Operator</b> dan sistem akan mengaktifkannya otomatis untuk klien ini.</div>}
    <div className="stats-grid guestbook-admin-stats">
      <article className="stat-card"><span className="stat-icon"><UsersRound size={19}/></span><div><span>Total Tamu</span><strong>{state.guests.length}</strong><small>Record undangan</small></div></article>
      <article className="stat-card"><span className="stat-icon"><UserCheck size={19}/></span><div><span>Check-in</span><strong>{state.checkins.length}</strong><small>Tamu terverifikasi</small></div></article>
      <article className="stat-card"><span className="stat-icon"><UsersRound size={19}/></span><div><span>Pax Hadir</span><strong>{totalPax}</strong><small>Total orang masuk</small></div></article>
      <article className="stat-card"><span className="stat-icon"><QrCode size={19}/></span><div><span>PIN Operator</span><strong className="pin-stat">{state.event.guestbookPin}</strong><small>/checkin/{state.event.slug}</small></div></article>
    </div>
    <article className="panel guest-table-card">
      <div className="table-toolbar"><div><span className="eyebrow">Attendance List</span><h3>{state.checkins.length} / {state.guests.length} sudah check-in</h3></div><div className="search-box"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Cari tamu..."/></div></div>
      <div className="table-scroll"><table className="guest-table guestbook-admin-table"><thead><tr><th>Tamu</th><th>Grup</th><th>Pax</th><th>Status</th><th className="right">Aksi</th></tr></thead><tbody>
        {filtered.map(guest => { const checkin = checkinByGuest.get(guest.id); return <tr key={guest.id}><td><div className="guest-name-cell"><span>{guest.name.charAt(0)}</span><div><strong>{guest.name}</strong><small>{guest.phone || 'Tanpa WhatsApp'}</small></div></div></td><td><span className="tag">{guest.group}</span></td><td><input className="pax-input" type="number" min="1" max={guest.invitedPax || 1} value={paxMap[guest.id] || checkin?.pax || guest.invitedPax || 1} disabled={Boolean(checkin)} onChange={e=>setPaxMap({...paxMap,[guest.id]:Number(e.target.value)})}/><small className="pax-limit">/ {guest.invitedPax}</small></td><td>{checkin ? <span className="status-chip checked">Hadir · {new Date(checkin.checkedInAt).toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit'})}</span> : <span className="status-chip pending">Belum hadir</span>}</td><td><div className="row-actions">{checkin ? <button className="secondary-btn compact" disabled={busy===guest.id} onClick={()=>undo(guest)}><RotateCcw size={14}/> Batalkan</button> : <button className="primary-btn compact" disabled={busy===guest.id} onClick={()=>checkIn(guest)}><UserCheck size={14}/> Check-in</button>}</div></td></tr> })}
      </tbody></table></div>
    </article>
  </section>
}
