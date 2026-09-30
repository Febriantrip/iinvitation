import { ClipboardCheck, Eye, Frame, MessageCircleReply, QrCode, UsersRound } from 'lucide-react'
import type { AppState } from '../../types'
import { StatCard } from '../../components/StatCard'
import { projectStatusLabel, publicationStatusLabel } from '../../lib/workflow'

export function Dashboard({ state, onPreview, onOpenGuests, onOpenWorkflow }: { state: AppState; onPreview: () => void; onOpenGuests: () => void; onOpenWorkflow: () => void }) {
  const opened = state.guests.filter(g => g.status !== 'Belum dibuka').length
  const attending = state.rsvps.filter(r => r.attendance === 'Hadir').length
  const enabled = [state.event.featureWebsite,state.event.featureGuestbook,state.event.featureFrame].filter(Boolean).length
  return <section>
    <div className="page-heading">
      <div><span className="eyebrow">Overview</span><h1>Iinvitation Client Manager</h1><p>Kelola website undangan, tamu, RSVP, Digital Guestbook, Wedding Frame, media, dan distribusi WhatsApp dari satu workspace klien.</p></div>
      <button className="primary-btn" onClick={onPreview} disabled={!state.event.featureWebsite}><Eye size={17}/> Preview Undangan</button>
    </div>
    <div className="stats-grid">
      <StatCard label="Total Tamu" value={state.guests.length} helper="Satu sumber untuk WA, RSVP & QR" icon={UsersRound}/>
      <StatCard label="Undangan Dibuka" value={opened} helper={`${state.guests.length ? Math.round(opened/state.guests.length*100) : 0}% dari daftar tamu`} icon={Eye}/>
      <StatCard label="RSVP Hadir" value={attending} helper={`${state.rsvps.length} respons masuk`} icon={MessageCircleReply}/>
      <StatCard label="Check-in" value={state.checkins.length} helper={`${enabled}/3 layanan klien aktif`} icon={QrCode}/>
    </div>

    <div className="dashboard-grid">
      <article className="panel hero-admin-card">
        <span className="eyebrow">Klien Aktif</span>
        <h2>{state.event.brideName} <em>&</em> {state.event.groomName}</h2>
        <p>{new Date(state.event.eventDate).toLocaleDateString('id-ID', {weekday:'long', day:'numeric', month:'long', year:'numeric'})}</p>
        <div className="dashboard-workflow-status"><span className={`project-status-chip ${state.event.projectStatus}`}>{projectStatusLabel(state.event.projectStatus)}</span><span className={`publication-chip ${state.event.publicationStatus}`}>{publicationStatusLabel[state.event.publicationStatus]}</span></div>
        <div className="dashboard-service-pills">
          <span className={state.event.featureWebsite?'on':''}><Eye size={13}/> Website</span>
          <span className={state.event.featureGuestbook?'on':''}><QrCode size={13}/> Guestbook</span>
          <span className={state.event.featureFrame?'on':''}><Frame size={13}/> Frame</span>
        </div>
        <div className="hero-admin-actions">
          <button className="secondary-btn" onClick={onPreview} disabled={!state.event.featureWebsite}>Lihat halaman publik</button>
          <button className="ghost-btn" onClick={onOpenGuests}>Kelola tamu</button>
          <button className="ghost-btn" onClick={onOpenWorkflow}><ClipboardCheck size={14}/> Workflow</button>
        </div>
      </article>
      <article className="panel activity-panel">
        <div className="panel-title"><div><span className="eyebrow">Aktivitas</span><h3>Respons terbaru</h3></div><span className="pill">Realtime server</span></div>
        {state.rsvps.length === 0 ? <div className="empty-state"><MessageCircleReply size={28}/><strong>Belum ada RSVP</strong><span>Respons tamu akan muncul di sini.</span></div> :
          <div className="activity-list">{state.rsvps.slice(-5).reverse().map(r => <div key={r.id}><div className={`avatar ${r.attendance === 'Hadir' ? 'ok' : ''}`}>{r.guestName.slice(0,1)}</div><div><strong>{r.guestName}</strong><span>{r.attendance} · {r.pax} orang</span></div><small>{new Date(r.createdAt).toLocaleDateString('id-ID')}</small></div>)}</div>}
      </article>
    </div>
  </section>
}
