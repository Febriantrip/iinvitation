import { ExternalLink, Save } from 'lucide-react'
import type { EventData } from '../../types'

type StringEventKey = Exclude<keyof EventData, 'gallery' | 'heroEdit'>

export function EventEditor({ event, onChange, onPreview }: { event: EventData; onChange: (e: EventData) => void; onPreview: () => void }) {
  const field = (key: StringEventKey, value: string) => onChange({ ...event, [key]: value })
  return <section>
    <div className="page-heading"><div><span className="eyebrow">Editor</span><h1>Data Undangan</h1><p>Konten di sini langsung menjadi sumber halaman undangan publik.</p></div><button className="primary-btn" onClick={onPreview}><ExternalLink size={17}/> Preview</button></div>
    <div className="form-card panel">
      <div className="form-section-title"><div><span>01</span><div><h3>Mempelai</h3><p>Nama yang tampil pada cover dan isi undangan.</p></div></div></div>
      <div className="form-grid two">
        <label className="span-2">Nama klien / project<input value={event.clientName} onChange={e=>field('clientName',e.target.value)}/></label>
        <label>Nama panggilan pria<input value={event.groomName} onChange={e=>field('groomName',e.target.value)}/></label>
        <label>Nama panggilan wanita<input value={event.brideName} onChange={e=>field('brideName',e.target.value)}/></label>
        <label>Nama lengkap pria<input value={event.groomFullName} onChange={e=>field('groomFullName',e.target.value)}/></label>
        <label>Nama lengkap wanita<input value={event.brideFullName} onChange={e=>field('brideFullName',e.target.value)}/></label>
        <label>Orang tua pria<input value={event.groomParents} onChange={e=>field('groomParents',e.target.value)}/></label>
        <label>Orang tua wanita<input value={event.brideParents} onChange={e=>field('brideParents',e.target.value)}/></label>
      </div>
      <div className="divider"/>
      <div className="form-section-title"><div><span>02</span><div><h3>Acara</h3><p>Jadwal dan lokasi yang akan dilihat tamu.</p></div></div></div>
      <div className="form-grid two">
        <label>Tanggal & waktu utama<input type="datetime-local" value={event.eventDate} onChange={e=>field('eventDate',e.target.value)}/></label>
        <div className="auto-url-field"><span>Alamat undangan</span><strong>Dibuat otomatis oleh sistem</strong><small>Gunakan tombol Preview atau Copy Link dari menu Klien & Undangan.</small></div>
        <label>Waktu akad<input value={event.akadTime} onChange={e=>field('akadTime',e.target.value)}/></label>
        <label>Waktu resepsi<input value={event.receptionTime} onChange={e=>field('receptionTime',e.target.value)}/></label>
        <label>Nama venue<input value={event.venueName} onChange={e=>field('venueName',e.target.value)}/></label>
        <label>Link Google Maps<input value={event.mapUrl} onChange={e=>field('mapUrl',e.target.value)}/></label>
        <label className="span-2">Alamat venue<textarea rows={2} value={event.venueAddress} onChange={e=>field('venueAddress',e.target.value)}/></label>
      </div>
      <div className="divider"/>
      <div className="form-section-title"><div><span>03</span><div><h3>Narasi</h3><p>Teks dapat diganti kapan saja tanpa menyentuh kode.</p></div></div></div>
      <div className="form-grid">
        <label>Pembuka<textarea rows={4} value={event.openingText} onChange={e=>field('openingText',e.target.value)}/></label>
        <label>Cerita singkat<textarea rows={4} value={event.storyText} onChange={e=>field('storyText',e.target.value)}/></label>
        <label>Penutup<textarea rows={4} value={event.closingText} onChange={e=>field('closingText',e.target.value)}/></label>
      </div>
      <div className="save-note"><Save size={16}/> Perubahan otomatis tersimpan ke server.</div>
    </div>
  </section>
}
