import { CalendarDays, ClipboardCheck, Images, LayoutDashboard, LayoutTemplate, ListTree, MessageCircle, Settings2, UsersRound, BriefcaseBusiness, Blocks, QrCode, Frame } from 'lucide-react'

export type AdminTab = 'dashboard' | 'projects' | 'workflow' | 'features' | 'designs' | 'sections' | 'event' | 'guests' | 'guestbook' | 'frame' | 'media' | 'whatsapp'

const items: { key: AdminTab; label: string; icon: typeof LayoutDashboard }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'projects', label: 'Klien & Undangan', icon: BriefcaseBusiness },
  { key: 'workflow', label: 'Workflow & Publish', icon: ClipboardCheck },
  { key: 'features', label: 'Fitur Klien', icon: Blocks },
  { key: 'designs', label: 'Pilihan Desain', icon: LayoutTemplate },
  { key: 'sections', label: 'Susunan Halaman', icon: ListTree },
  { key: 'event', label: 'Data Undangan', icon: CalendarDays },
  { key: 'guests', label: 'Tamu Undangan', icon: UsersRound },
  { key: 'guestbook', label: 'Digital Guestbook', icon: QrCode },
  { key: 'frame', label: 'Wedding Frame', icon: Frame },
  { key: 'media', label: 'Foto & Musik', icon: Images },
  { key: 'whatsapp', label: 'Pesan WhatsApp', icon: MessageCircle },
]

export function Sidebar({ active, onChange }: { active: AdminTab; onChange: (tab: AdminTab) => void }) {
  return <aside className="sidebar">
    <a className="brand admin-brand-image-link" href="/" title="Website Iinvitation"><img className="admin-brand-logo" src="/brand/iinvitation-logo-light.png?v=rose-20260919" alt="Iinvitation" /></a>
    <nav className="side-nav">{items.map(({ key, label, icon: Icon }) => <button key={key} className={active === key ? 'active' : ''} onClick={() => onChange(key)}><Icon size={18}/><span>{label}</span></button>)}</nav>
    <div className="side-note"><Settings2 size={18}/><div><strong>Iinvitation Unified</strong><span>MySQL · multi klien · guestbook · frame</span></div></div>
  </aside>
}
