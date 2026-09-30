import { useMemo, useRef, useState } from 'react'
import { Copy, Download, FileSpreadsheet, MessageCircle, Plus, QrCode, Search, Trash2, Upload, UsersRound } from 'lucide-react'
import QRCode from 'qrcode'
import * as XLSX from 'xlsx'
import type { EventData, Guest } from '../../types'
import { createToken, invitationUrl, normalizePhone, whatsappUrl } from '../../utils/guest'
import { downloadText } from '../../utils/file'

interface Props {
  guests: Guest[]
  event: EventData
  whatsappTemplate: string
  onChange: (guests: Guest[]) => void
}

const pick = (row: Record<string, unknown>, keys: string[]) => {
  const normalized = Object.fromEntries(Object.entries(row).map(([k, v]) => [k.toLowerCase().trim().replace(/\s+/g, '_'), v]))
  for (const key of keys) {
    const value = normalized[key]
    if (value !== undefined && value !== null && String(value).trim()) return String(value).trim()
  }
  return ''
}

export function GuestManager({ guests, event, whatsappTemplate, onChange }: Props) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [group, setGroup] = useState('Keluarga')
  const [invitedPax, setInvitedPax] = useState(1)
  const [search, setSearch] = useState('')
  const [notice, setNotice] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return guests
    return guests.filter(g => [g.name, g.phone, g.group].some(v => v.toLowerCase().includes(q)))
  }, [guests, search])

  const addGuest = () => {
    if (!name.trim()) return
    const guest: Guest = {
      id: crypto.randomUUID(),
      name: name.trim(),
      phone: normalizePhone(phone),
      group: group.trim() || 'Umum',
      token: createToken(name),
      status: 'Belum dibuka',
      invitedPax,
      createdAt: new Date().toISOString(),
    }
    onChange([guest, ...guests])
    setName('')
    setPhone('')
    setInvitedPax(1)
    setNotice(`Tamu “${guest.name}” ditambahkan.`)
  }

  const importFile = async (file?: File) => {
    if (!file) return
    const buffer = await file.arrayBuffer()
    const workbook = XLSX.read(buffer, { type: 'array' })
    const sheet = workbook.Sheets[workbook.SheetNames[0]]
    const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '', raw: false })
    const existing = new Set(guests.map(g => `${g.name.toLowerCase()}|${normalizePhone(g.phone)}`))
    const next: Guest[] = []

    rows.forEach(row => {
      const guestName = pick(row, ['nama_tamu', 'nama', 'name', 'guest_name', 'tamu'])
      if (!guestName) return
      const guestPhone = normalizePhone(pick(row, ['no_wa', 'nomor_wa', 'whatsapp', 'phone', 'telepon', 'nomor', 'no_hp']))
      const guestGroup = pick(row, ['group', 'grup', 'kategori', 'kelompok']) || 'Umum'
      const importedPax = Math.max(1, Math.min(20, Number(pick(row, ['pax', 'jumlah_tamu', 'jumlah', 'qty'])) || 1))
      const signature = `${guestName.toLowerCase()}|${guestPhone}`
      if (existing.has(signature)) return
      existing.add(signature)
      next.push({
        id: crypto.randomUUID(),
        name: guestName,
        phone: guestPhone,
        group: guestGroup,
        token: createToken(guestName),
        status: 'Belum dibuka',
        invitedPax: importedPax,
        createdAt: new Date().toISOString(),
      })
    })

    if (next.length) onChange([...next, ...guests])
    setNotice(`${next.length} tamu berhasil diimport dari ${file.name}.`)
    if (fileRef.current) fileRef.current.value = ''
  }

  const exportTemplate = () => {
    downloadText('template-tamu-undangan.csv', 'nama_tamu,no_wa,group,pax\nTamu Demo 01,080000000001,Keluarga,2\nTamu Demo 02,080000000002,Teman,1\n')
  }

  const downloadQr = async (guest: Guest) => {
    const payload = `${window.location.origin}/checkin/${encodeURIComponent(event.slug)}?guest=${encodeURIComponent(guest.token)}`
    const url = await QRCode.toDataURL(payload, { width: 900, margin: 2, errorCorrectionLevel: 'M' })
    const a = document.createElement('a'); a.href = url; a.download = `qr-${event.slug}-${guest.name.replace(/[^a-z0-9]+/gi,'-').toLowerCase()}.png`; a.click()
    setNotice(`QR check-in ${guest.name} diunduh.`)
  }

  const copy = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text)
    setNotice(label)
  }

  return <section>
    <div className="page-heading">
      <div><span className="eyebrow">Guest Distribution</span><h1>Tamu Undangan</h1><p>Input manual atau import Excel/CSV, lalu sistem membuat link personal untuk setiap nama.</p></div>
      <div className="heading-actions">
        <button className="secondary-btn" onClick={exportTemplate}><FileSpreadsheet size={17}/> Template CSV</button>
        <button className="primary-btn" onClick={() => fileRef.current?.click()}><Upload size={17}/> Import Excel / CSV</button>
        <input ref={fileRef} hidden type="file" accept=".csv,.xlsx,.xls" onChange={e => importFile(e.target.files?.[0])}/>
      </div>
    </div>

    <article className="panel guest-add-card">
      <div className="guest-add-copy"><span className="icon-box"><Plus size={18}/></span><div><strong>Tambah tamu manual</strong><span>Nomor WhatsApp opsional, tapi dibutuhkan untuk tombol kirim langsung.</span></div></div>
      <div className="guest-add-form">
        <input placeholder="Nama tamu" value={name} onChange={e=>setName(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addGuest()}/>
        <input placeholder="No. WhatsApp, contoh 0812..." value={phone} onChange={e=>setPhone(e.target.value)}/>
        <input placeholder="Grup" value={group} onChange={e=>setGroup(e.target.value)}/>
        <input className="guest-pax-add" type="number" min="1" max="20" title="Pax undangan" value={invitedPax} onChange={e=>setInvitedPax(Math.max(1,Math.min(20,Number(e.target.value)||1)))}/>
        <button className="primary-btn compact" onClick={addGuest}><Plus size={16}/> Tambah</button>
      </div>
    </article>

    {notice && <div className="notice-bar">{notice}</div>}

    <article className="panel guest-table-card">
      <div className="table-toolbar">
        <div><span className="eyebrow">Guest List</span><h3>{guests.length} penerima</h3></div>
        <div className="search-box"><Search size={17}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cari nama, WA, grup..."/></div>
      </div>
      {filtered.length === 0 ? <div className="empty-state"><UsersRound size={30}/><strong>Belum ada tamu</strong><span>Tambah manual atau import Excel/CSV.</span></div> :
      <div className="table-scroll"><table className="guest-table">
        <thead><tr><th>Nama tamu</th><th>WhatsApp</th><th>Grup</th><th>Pax</th><th>Link personal</th><th className="right">Aksi</th></tr></thead>
        <tbody>{filtered.map(guest => {
          const link = invitationUrl(event, guest)
          return <tr key={guest.id}>
            <td><div className="guest-name-cell"><span>{guest.name.slice(0,1).toUpperCase()}</span><div><strong>{guest.name}</strong><small>{guest.status}</small></div></div></td>
            <td>{guest.phone || <span className="muted">Belum diisi</span>}</td>
            <td><span className="tag">{guest.group}</span></td>
            <td><strong>{guest.invitedPax || 1}</strong></td>
            <td><button className="link-copy" title={link} onClick={()=>copy(link, `Link ${guest.name} disalin.`)}><span>{link.replace(window.location.origin, '')}</span><Copy size={14}/></button></td>
            <td><div className="row-actions">
              <button title="Copy link" onClick={()=>copy(link, `Link ${guest.name} disalin.`)}><Copy size={16}/></button>
              {event.featureGuestbook && <button title="Download QR check-in" onClick={()=>downloadQr(guest)}><QrCode size={16}/></button>}
              {guest.phone ? <a title="Kirim via WhatsApp" className="wa-action" href={whatsappUrl(whatsappTemplate, event, guest)} target="_blank" rel="noreferrer"><MessageCircle size={17}/><span>WhatsApp</span></a> : <button className="wa-action disabled" disabled><MessageCircle size={17}/><span>WhatsApp</span></button>}
              <button className="danger-icon" title="Hapus tamu" onClick={()=>onChange(guests.filter(g=>g.id!==guest.id))}><Trash2 size={16}/></button>
            </div></td>
          </tr>
        })}</tbody>
      </table></div>}
    </article>
  </section>
}
