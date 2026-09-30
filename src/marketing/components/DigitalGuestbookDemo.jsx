import React, { useMemo, useState } from 'react'

const seedGuests = [
  { id: 1, code: 'DEMO-001', name: 'Tamu Demo 01', group: 'Keluarga', checkedIn: true, time: '09:14' },
  { id: 2, code: 'DEMO-002', name: 'Tamu Demo 02', group: 'Keluarga', checkedIn: true, time: '09:22' },
  { id: 3, code: 'DEMO-003', name: 'Tamu Demo 03', group: 'Keluarga', checkedIn: false, time: '' },
  { id: 4, code: 'DEMO-004', name: 'Tamu Demo 04', group: 'Sahabat', checkedIn: false, time: '' },
  { id: 5, code: 'DEMO-005', name: 'Raka Wijaya', group: 'Kantor', checkedIn: true, time: '10:03' },
  { id: 6, code: 'DEMO-006', name: 'Tamu Demo 06', group: 'Sahabat', checkedIn: false, time: '' },
]

function QrGlyph({ seed = 'DEMO-001' }) {
  const cells = useMemo(() => {
    let n = 0
    for (const ch of seed) n = (n * 31 + ch.charCodeAt(0)) >>> 0
    return Array.from({ length: 81 }, (_, i) => ((n >>> (i % 24)) ^ (i * 17) ^ (i % 7)) % 3 !== 0)
  }, [seed])
  return <div className="guestbook-qr" aria-label={`QR demo ${seed}`}>
    {cells.map((on, i) => <i key={i} className={on ? 'on' : ''} />)}
  </div>
}

export default function DigitalGuestbookDemo() {
  const [guests, setGuests] = useState(seedGuests)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const [code, setCode] = useState('DEMO-003')
  const [notice, setNotice] = useState('')

  const checked = guests.filter(g => g.checkedIn).length
  const filtered = guests.filter(g => {
    const match = `${g.name} ${g.group} ${g.code}`.toLowerCase().includes(query.toLowerCase())
    const status = filter === 'all' || (filter === 'in' ? g.checkedIn : !g.checkedIn)
    return match && status
  })

  const checkIn = id => {
    const now = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    setGuests(list => list.map(g => g.id === id ? { ...g, checkedIn: true, time: g.time || now } : g))
  }

  const checkCode = () => {
    const normalized = code.trim().toUpperCase()
    const guest = guests.find(g => g.code === normalized)
    if (!guest) { setNotice('Kode tidak ditemukan. Coba DEMO-003.'); return }
    if (guest.checkedIn) { setNotice(`${guest.name} sudah check-in pukul ${guest.time}.`); return }
    checkIn(guest.id)
    setNotice(`${guest.name} berhasil check-in.`)
  }

  const exportCsv = () => {
    const rows = [['Nama','Grup','Kode','Status','Waktu'], ...guests.map(g => [g.name,g.group,g.code,g.checkedIn?'Hadir':'Belum hadir',g.time])]
    const csv = rows.map(row => row.map(v => `"${String(v).replaceAll('"','""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'iinvitation-guestbook-demo.csv'; a.click(); URL.revokeObjectURL(url)
  }

  return <div className="guestbook-demo">
    <div className="guestbook-top">
      <div><small>IINVITATION GUESTBOOK</small><h3>Check-in Console</h3><p>Simulasi pencatatan tamu saat hari acara.</p></div>
      <button className="feature-outline-btn" onClick={exportCsv}>Export CSV</button>
    </div>

    <div className="guestbook-stats">
      <article><span>UNDANGAN</span><strong>{guests.length}</strong><small>Total tamu demo</small></article>
      <article><span>CHECK-IN</span><strong>{checked}</strong><small>Sudah hadir</small></article>
      <article><span>PENDING</span><strong>{guests.length - checked}</strong><small>Belum hadir</small></article>
      <article><span>RATE</span><strong>{Math.round(checked / guests.length * 100)}%</strong><small>Kehadiran</small></article>
    </div>

    <div className="guestbook-workspace">
      <section className="guestbook-scan-card">
        <div className="guestbook-scan-head"><small>01 / QR CHECK-IN</small><span>LIVE DEMO</span></div>
        <QrGlyph seed={code || 'DEMO-003'} />
        <label>Kode tamu</label>
        <div className="guestbook-code-row"><input value={code} onChange={e=>setCode(e.target.value)} placeholder="DEMO-003"/><button onClick={checkCode}>Check-in</button></div>
        <p className="guestbook-hint">Coba kode <b>DEMO-003</b>, <b>DEMO-004</b>, atau <b>DEMO-006</b>.</p>
        {notice && <div className="guestbook-notice">{notice}</div>}
      </section>

      <section className="guestbook-list-card">
        <div className="guestbook-list-tools">
          <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Cari nama, grup, atau kode..."/>
          <div>{[['all','Semua'],['in','Hadir'],['out','Belum']].map(([key,label])=><button key={key} className={filter===key?'active':''} onClick={()=>setFilter(key)}>{label}</button>)}</div>
        </div>
        <div className="guestbook-table">
          <div className="guestbook-row header"><span>Tamu</span><span>Grup</span><span>Status</span><span>Aksi</span></div>
          {filtered.map(g => <div className="guestbook-row" key={g.id}>
            <span><strong>{g.name}</strong><small>{g.code}</small></span>
            <span>{g.group}</span>
            <span><b className={g.checkedIn?'status-in':'status-out'}>{g.checkedIn ? `Hadir · ${g.time}` : 'Belum hadir'}</b></span>
            <span>{g.checkedIn ? <i className="guestbook-done">✓</i> : <button onClick={()=>checkIn(g.id)}>Check-in</button>}</span>
          </div>)}
        </div>
      </section>
    </div>
  </div>
}
