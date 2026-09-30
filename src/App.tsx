import { useEffect, useRef, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { ExternalLink, Home, LoaderCircle, LogOut, Menu, X } from 'lucide-react'
import MarketingApp from './marketing/MarketingApp'
import { Sidebar, type AdminTab } from './components/Sidebar'
import { Dashboard } from './features/admin/Dashboard'
import { EventEditor } from './features/admin/EventEditor'
import { GuestManager } from './features/admin/GuestManager'
import { MediaManager } from './features/admin/MediaManager'
import { WhatsappEditor } from './features/admin/WhatsappEditor'
import { DesignStudio } from './features/admin/DesignStudio'
import { InvitationManager } from './features/admin/InvitationManager'
import { WorkflowCenter } from './features/admin/WorkflowCenter'
import { SectionManager } from './features/admin/SectionManager'
import { ClientFeatures } from './features/admin/ClientFeatures'
import { GuestbookAdmin } from './features/admin/GuestbookAdmin'
import { FrameSettings } from './features/admin/FrameSettings'
import { LoginPage } from './features/auth/LoginPage'
import { InvitationPage } from './features/invitation/InvitationPage'
import { PublicGuestbookPage } from './features/guestbook/PublicGuestbookPage'
import { PublicFramePage } from './features/frame/PublicFramePage'
import { ClientReviewPage } from './features/review/ClientReviewPage'
import { adminApi, ApiError, authApi } from './lib/api'
import type { AppState } from './types'

interface AdminAppProps {
  state: AppState
  setState: (state: AppState) => void
  saving: boolean
  onLogout: () => void
  onSwitchInvitation: (id: string) => Promise<void>
  onRefreshCurrent: () => Promise<void>
  onPersistCurrent: () => Promise<void>
  onReplaceState: (state: AppState) => void
  onCreateInvitation: (payload: { brideName: string; groomName: string; themeId: string; eventDate: string }) => Promise<void>
  onDeleteInvitation: (id: string) => Promise<void>
}

function AdminApp({ state, setState, saving, onLogout, onSwitchInvitation, onRefreshCurrent, onPersistCurrent, onReplaceState, onCreateInvitation, onDeleteInvitation }: AdminAppProps) {
  const [active, setActive] = useState<AdminTab>('dashboard')
  const [mobileNav, setMobileNav] = useState(false)
  const [switching, setSwitching] = useState(false)
  const preview = () => window.open(`/invite/${encodeURIComponent(state.event.slug)}?preview=${encodeURIComponent(state.event.previewToken)}&to=${encodeURIComponent('Bapak/Ibu/Saudara/i')}`, '_blank', 'noopener,noreferrer')
  const changeTab = (tab: AdminTab) => { setActive(tab); setMobileNav(false) }

  const activateAndOpen = async (kind: 'guestbook' | 'frame') => {
    const url = kind === 'guestbook' ? `/checkin/${state.event.slug}` : `/frame/${state.event.slug}`
    const alreadyEnabled = kind === 'guestbook' ? state.event.featureGuestbook : state.event.featureFrame
    if (alreadyEnabled) { window.open(url, '_blank', 'noopener,noreferrer'); return }

    const popup = window.open('about:blank', '_blank')
    try {
      const payload = kind === 'guestbook' ? { featureGuestbook: true } : { featureFrame: true }
      await adminApi.updateFeatures(state.event.id, payload)
      const event = kind === 'guestbook' ? { ...state.event, featureGuestbook: true } : { ...state.event, featureFrame: true }
      setState({ ...state, event })
      if (popup) { popup.opener = null; popup.location.replace(url) }
      else window.open(url, '_blank', 'noopener,noreferrer')
    } catch (error) {
      popup?.close()
      window.alert(error instanceof Error ? error.message : 'Fitur tidak dapat diaktifkan.')
      throw error
    }
  }

  const switchInvitation = async (id: string) => {
    if (!id || id === state.event.id) return
    setSwitching(true)
    try { await onSwitchInvitation(id); setActive('dashboard') } finally { setSwitching(false) }
  }

  return <div className="admin-shell">
    <div className={`sidebar-wrap ${mobileNav ? 'show' : ''}`}><Sidebar active={active} onChange={changeTab} /><button className="sidebar-close" onClick={() => setMobileNav(false)}><X size={20} /></button></div>
    {mobileNav && <button className="sidebar-backdrop" onClick={() => setMobileNav(false)} aria-label="Tutup menu" />}
    <main className="admin-main">
      <header className="admin-topbar">
        <button className="mobile-menu" onClick={() => setMobileNav(true)} aria-label="Buka menu"><Menu size={20} /></button>
        <div className="topbar-identity">
          <div className="client-switch-row"><strong>{state.event.clientName}</strong><select aria-label="Pilih klien" value={state.event.id} disabled={switching || saving} onChange={e => switchInvitation(e.target.value)}>{state.invitations.map(item => <option value={item.id} key={item.id}>{item.clientName} · {item.brideName} & {item.groomName}</option>)}</select></div>
          <span>{switching ? 'Mengganti workspace...' : saving ? 'Menyimpan perubahan...' : 'Iinvitation · MySQL tersinkron'}</span>
        </div>
        <div className="topbar-actions">
          {(saving || switching) && <LoaderCircle size={16} className="spin topbar-saving" aria-label="Memproses" />}
          <a className="topbar-preview" href="/" target="_blank" rel="noreferrer"><Home size={16}/><span>Website</span></a>
          <button className="topbar-preview" onClick={preview} type="button" disabled={!state.event.featureWebsite}><ExternalLink size={16} /><span>Preview</span></button>
          <button className="topbar-logout" onClick={onLogout} type="button" title="Keluar" aria-label="Keluar"><LogOut size={16} /></button>
        </div>
      </header>
      <div className="admin-content">
        {active === 'dashboard' && <Dashboard state={state} onPreview={preview} onOpenGuests={() => setActive('guests')} onOpenWorkflow={() => setActive('workflow')} />}
        {active === 'projects' && <InvitationManager invitations={state.invitations} activeId={state.event.id} onSelect={switchInvitation} onCreate={onCreateInvitation} onDelete={onDeleteInvitation} />}
        {active === 'workflow' && <WorkflowCenter state={state} onReplaceState={onReplaceState} onPersistCurrent={onPersistCurrent} onRefreshCurrent={onRefreshCurrent} />}
        {active === 'features' && <ClientFeatures event={state.event} onChange={event => setState({ ...state, event })} onOpenGuestbook={() => activateAndOpen('guestbook')} onOpenFrame={() => activateAndOpen('frame')} />}
        {active === 'designs' && <DesignStudio event={state.event} onChange={event => setState({ ...state, event })} />}
        {active === 'sections' && <SectionManager event={state.event} onChange={event => setState({ ...state, event })} onPreview={preview} />}
        {active === 'event' && <EventEditor event={state.event} onPreview={preview} onChange={event => setState({ ...state, event })} />}
        {active === 'guests' && <GuestManager guests={state.guests} event={state.event} whatsappTemplate={state.whatsappTemplate} onChange={guests => setState({ ...state, guests })} />}
        {active === 'guestbook' && <GuestbookAdmin state={state} onRefresh={onRefreshCurrent} onOpenOperator={() => activateAndOpen('guestbook')} />}
        {active === 'frame' && <FrameSettings event={state.event} onChange={event => setState({ ...state, event })} onOpenPublic={() => activateAndOpen('frame')} />}
        {active === 'media' && <MediaManager event={state.event} onChange={event => setState({ ...state, event })} />}
        {active === 'whatsapp' && <WhatsappEditor template={state.whatsappTemplate} event={state.event} guests={state.guests} onChange={whatsappTemplate => setState({ ...state, whatsappTemplate })} />}
      </div>
    </main>
  </div>
}

function AdminRoot() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null)
  const [state, rawSetState] = useState<AppState | null>(null)
  const [saving, setSaving] = useState(false)
  const [fatal, setFatal] = useState('')
  const editVersion = useRef(0)
  const savedVersion = useRef(0)
  const skipSave = useRef(false)
  const pendingRefresh = useRef(false)
  const stateRef = useRef<AppState | null>(null)
  stateRef.current = state

  const normalizeState = (fresh: AppState): AppState => ({
    ...fresh,
    guests: Array.isArray(fresh.guests) ? fresh.guests : [],
    rsvps: Array.isArray(fresh.rsvps) ? fresh.rsvps : [],
    checkins: Array.isArray(fresh.checkins) ? fresh.checkins : [],
    invitations: Array.isArray(fresh.invitations) ? fresh.invitations : [],
    reviewNotes: Array.isArray(fresh.reviewNotes) ? fresh.reviewNotes : [],
    whatsappTemplate: fresh.whatsappTemplate || '',
    event: {
      ...fresh.event,
      projectStatus: fresh.event.projectStatus || 'published',
      publicationStatus: fresh.event.publicationStatus || 'published',
      reviewStatus: fresh.event.reviewStatus || 'not_sent',
      reviewToken: fresh.event.reviewToken || '',
      previewToken: fresh.event.previewToken || '',
      sectionSettings: Array.isArray(fresh.event.sectionSettings) ? fresh.event.sectionSettings : [],
    },
  })

  const hydrate = async (invitationId?: string) => {
    const response = await adminApi.getState(invitationId)
    const fresh = normalizeState(response)
    skipSave.current = true
    editVersion.current = 0
    savedVersion.current = 0
    rawSetState(fresh)
    return fresh
  }

  useEffect(() => {
    authApi.me().then(async () => { setAuthenticated(true); await hydrate() }).catch(error => {
      if (error instanceof ApiError && error.status === 401) setAuthenticated(false)
      else { setFatal(error instanceof Error ? error.message : 'API tidak dapat dihubungi.'); setAuthenticated(false) }
    })
  }, [])

  const updateState = (next: AppState) => { editVersion.current += 1; rawSetState(next) }
  const replaceServerState = (next: AppState) => { skipSave.current = true; editVersion.current = 0; savedVersion.current = 0; rawSetState(normalizeState(next)) }

  useEffect(() => {
    if (!state || !authenticated) return
    if (skipSave.current) { skipSave.current = false; return }
    const snapshot = state
    const version = editVersion.current
    const timer = setTimeout(async () => {
      setSaving(true)
      try {
        const saved = await adminApi.saveState(snapshot)
        if (editVersion.current === version) {
          savedVersion.current = version
          skipSave.current = true
          rawSetState(current => current ? { ...current, invitations: saved.invitations, checkins: saved.checkins } : saved)
          if (pendingRefresh.current) { pendingRefresh.current = false; await hydrate(snapshot.event.id) }
        }
      } catch (error) { setFatal(error instanceof Error ? error.message : 'Perubahan gagal disimpan.') }
      finally { setSaving(false) }
    }, 650)
    return () => clearTimeout(timer)
  }, [state, authenticated])

  useEffect(() => {
    if (!authenticated || !state) return
    return adminApi.subscribe(event => {
      try {
        const payload = JSON.parse(event.data || '{}')
        if (payload.invitationId && payload.invitationId !== stateRef.current?.event.id) return
      } catch { /* refresh current for legacy event */ }
      if (editVersion.current !== savedVersion.current || saving) pendingRefresh.current = true
      else hydrate(stateRef.current?.event.id).catch(() => {})
    })
  }, [authenticated, Boolean(state), saving])

  const persistCurrent = async () => {
    const current = stateRef.current
    if (!current || editVersion.current === savedVersion.current) return
    setSaving(true)
    try { await adminApi.saveState(current); savedVersion.current = editVersion.current } finally { setSaving(false) }
  }

  const switchInvitation = async (id: string) => { await persistCurrent(); await hydrate(id); setFatal('') }
  const refreshCurrent = async () => { await persistCurrent(); await hydrate(stateRef.current?.event.id); setFatal('') }

  const createInvitation = async (payload: { brideName: string; groomName: string; themeId: string; eventDate: string }) => {
    await persistCurrent()
    const created = await adminApi.createInvitation(payload)
    replaceServerState(created)
  }

  const deleteInvitation = async (id: string) => {
    const result = await adminApi.deleteInvitation(id)
    if (id === stateRef.current?.event.id) await hydrate(result.nextInvitationId || undefined)
    else await hydrate(stateRef.current?.event.id)
  }

  const login = async (email: string, password: string) => { await authApi.login(email, password); setAuthenticated(true); setFatal(''); await hydrate() }
  const logout = async () => { await authApi.logout().catch(() => {}); rawSetState(null); setAuthenticated(false) }

  if (authenticated === null) return <main className="public-state"><LoaderCircle className="spin" size={28}/><h1>Menghubungkan dashboard...</h1></main>
  if (!authenticated) return <><LoginPage onLogin={login}/>{fatal && <div className="api-warning">{fatal}</div>}</>
  if (!state) return <main className="public-state"><LoaderCircle className="spin" size={28}/><h1>Memuat data undangan...</h1></main>
  return <><AdminApp state={state} setState={updateState} saving={saving} onLogout={logout} onSwitchInvitation={switchInvitation} onRefreshCurrent={refreshCurrent} onPersistCurrent={persistCurrent} onReplaceState={replaceServerState} onCreateInvitation={createInvitation} onDeleteInvitation={deleteInvitation}/>{fatal && <div className="api-warning">{fatal}<button onClick={()=>setFatal('')}>×</button></div>}</>
}

export default function App() {
  return <Routes>
    <Route path="/" element={<MarketingApp />} />
    <Route path="/admin" element={<AdminRoot />} />
    <Route path="/backoffice" element={<Navigate to="/admin" replace />} />
    <Route path="/invite/:slug" element={<InvitationPage />} />
    <Route path="/checkin/:slug" element={<PublicGuestbookPage />} />
    <Route path="/frame/:slug" element={<PublicFramePage />} />
    <Route path="/review/:token" element={<ClientReviewPage />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
}
