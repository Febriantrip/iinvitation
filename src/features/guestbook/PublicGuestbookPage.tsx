import { useEffect, useRef, useState } from 'react'
import { Camera, CheckCircle2, KeyRound, LoaderCircle, Search, UserCheck, XCircle } from 'lucide-react'
import { useParams, useSearchParams } from 'react-router-dom'
import { publicApi, type GuestbookSearchGuest } from '../../lib/api'

function extractGuestToken(value: string) {
  const raw = value.trim()
  try {
    const url = new URL(raw)
    return url.searchParams.get('guest') || raw
  } catch {
    const match = raw.match(/[?&]guest=([^&]+)/i)
    return match ? decodeURIComponent(match[1]) : raw
  }
}

export function PublicGuestbookPage() {
  const { slug = '' } = useParams()
  const [params] = useSearchParams()
  const initialToken = params.get('guest') || ''
  const [pin, setPin] = useState(() => sessionStorage.getItem(`iinvitation:guestbook:${slug}`) || '')
  const [authorized, setAuthorized] = useState(false)
  const [info, setInfo] = useState<{ clientName:string; brideName:string; groomName:string; guestCount:number; checkinCount:number; checkedInPax:number } | null>(null)
  const [query, setQuery] = useState('')
  const [guests, setGuests] = useState<GuestbookSearchGuest[]>([])
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState('')
  const [cameraOn, setCameraOn] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const scanTimer = useRef<number | null>(null)

  const authorize = async (candidate = pin) => {
    setBusy(true); setNotice('')
    try {
      const result = await publicApi.guestbookAuth(slug, candidate)
      setInfo(result); setAuthorized(true); sessionStorage.setItem(`iinvitation:guestbook:${slug}`, candidate)
      if (initialToken) await searchByToken(candidate, initialToken)
      else await runSearch('', candidate)
    } catch (error) { setAuthorized(false); setNotice(error instanceof Error ? error.message : 'PIN tidak dapat diverifikasi.') }
    finally { setBusy(false) }
  }

  const runSearch = async (value = query, usingPin = pin) => {
    setBusy(true)
    try { const result = await publicApi.guestbookSearch(slug, usingPin, value); setGuests(result.guests) }
    catch (error) { setNotice(error instanceof Error ? error.message : 'Pencarian gagal.') }
    finally { setBusy(false) }
  }

  const searchByToken = async (usingPin: string, token: string) => {
    const result = await publicApi.guestbookSearch(slug, usingPin, '', extractGuestToken(token))
    setGuests(result.guests)
    if (!result.guests.length) setNotice('QR/kode tamu tidak ditemukan.')
  }

  const checkIn = async (guest: GuestbookSearchGuest, pax: number) => {
    setBusy(true); setNotice('')
    try {
      const result = await publicApi.guestbookCheckIn(slug, pin, { guestId: guest.id, pax })
      setNotice(`✓ ${result.guestName} berhasil check-in (${result.pax} pax).`)
      const refreshed = await publicApi.guestbookAuth(slug, pin); setInfo(refreshed)
      await runSearch(query)
    } catch (error) { setNotice(error instanceof Error ? error.message : 'Check-in gagal.') }
    finally { setBusy(false) }
  }

  const stopCamera = () => {
    if (scanTimer.current) window.clearInterval(scanTimer.current)
    streamRef.current?.getTracks().forEach(track => track.stop())
    streamRef.current = null; setCameraOn(false)
  }

  const startCamera = async () => {
    setNotice('')
    const Detector = (window as any).BarcodeDetector
    if (!Detector) { setNotice('Browser ini belum mendukung QR scanner kamera. Gunakan pencarian nama atau masukkan link/kode QR secara manual.'); return }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode:'environment' }, audio:false })
      streamRef.current = stream; setCameraOn(true)
      setTimeout(() => { if (videoRef.current) { videoRef.current.srcObject = stream; videoRef.current.play().catch(()=>{}) } }, 0)
      const detector = new Detector({ formats:['qr_code'] })
      scanTimer.current = window.setInterval(async () => {
        const video = videoRef.current
        if (!video || video.readyState < 2) return
        try {
          const codes = await detector.detect(video)
          if (codes?.[0]?.rawValue) {
            stopCamera()
            await searchByToken(pin, codes[0].rawValue)
            setNotice('QR terbaca. Konfirmasi data tamu lalu tekan Check-in.')
          }
        } catch { /* next frame */ }
      }, 650)
    } catch { setNotice('Kamera tidak dapat dibuka. Pastikan izin kamera aktif dan gunakan HTTPS/localhost bila browser mensyaratkannya.') }
  }

  useEffect(() => () => stopCamera(), [])
  useEffect(() => { if (pin && !authorized) authorize(pin).catch(()=>{}) }, [])

  if (!authorized) return <main className="guestbook-public-shell"><section className="guestbook-pin-gate">
    <div className="guestbook-public-brand"><span>I</span><strong>Iinvitation</strong></div>
    <KeyRound size={28}/><span className="eyebrow">Digital Guestbook</span><h1>Mode Operator</h1><p>Masukkan PIN guestbook untuk membuka console check-in <b>{slug}</b>.</p>
    <input value={pin} onChange={e=>setPin(e.target.value.replace(/\D/g,'').slice(0,12))} placeholder="6 digit PIN" inputMode="numeric" onKeyDown={e=>e.key==='Enter'&&authorize()}/>
    <button disabled={busy || !pin} onClick={()=>authorize()}>{busy ? <LoaderCircle className="spin" size={17}/> : <KeyRound size={17}/>} Buka Guestbook</button>
    {notice && <div className="guestbook-public-notice error">{notice}</div>}
  </section></main>

  return <main className="guestbook-public-shell active">
    <header className="guestbook-public-header"><div className="guestbook-public-brand"><span>I</span><div><strong>Iinvitation</strong><small>Digital Guestbook</small></div></div><div><span>{info?.clientName}</span><strong>{info?.brideName} & {info?.groomName}</strong></div><button onClick={()=>{sessionStorage.removeItem(`iinvitation:guestbook:${slug}`);setAuthorized(false);stopCamera()}}><KeyRound size={15}/> Kunci</button></header>
    <section className="guestbook-public-content">
      <div className="guestbook-public-stats"><article><small>UNDANGAN</small><strong>{info?.guestCount ?? 0}</strong><span>Data tamu</span></article><article><small>CHECK-IN</small><strong>{info?.checkinCount ?? 0}</strong><span>Tamu hadir</span></article><article><small>PAX MASUK</small><strong>{info?.checkedInPax ?? 0}</strong><span>Total orang</span></article></div>
      <div className="guestbook-public-toolbar"><div className="guestbook-search"><Search size={18}/><input value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>e.key==='Enter'&&runSearch()} placeholder="Cari nama, grup, WhatsApp, atau kode tamu..."/><button onClick={()=>runSearch()}>Cari</button></div><button className={cameraOn?'danger-action':'camera-action'} onClick={cameraOn?stopCamera:startCamera}>{cameraOn?<XCircle size={17}/>:<Camera size={17}/>} {cameraOn?'Tutup Kamera':'Scan QR'}</button></div>
      {cameraOn && <div className="guestbook-camera"><video ref={videoRef} playsInline muted/><div className="scan-frame"/><span>Arahkan QR tamu ke dalam kotak</span></div>}
      {notice && <div className="guestbook-public-notice">{notice}</div>}
      <div className="guestbook-public-list">{busy && !guests.length ? <div className="guestbook-loading"><LoaderCircle className="spin"/><span>Memuat tamu...</span></div> : guests.map(guest => <GuestRow key={guest.id} guest={guest} busy={busy} onCheckIn={checkIn}/>)}</div>
    </section>
  </main>
}

function GuestRow({ guest, busy, onCheckIn }: { guest: GuestbookSearchGuest; busy: boolean; onCheckIn: (guest:GuestbookSearchGuest,pax:number)=>void }) {
  const [pax, setPax] = useState(guest.checkedPax || guest.invitedPax || 1)
  return <article className={`guestbook-public-row ${guest.checkedIn?'checked':''}`}><div className="guestbook-public-avatar">{guest.name.charAt(0).toUpperCase()}</div><div className="guestbook-public-name"><strong>{guest.name}</strong><span>{guest.group} · Maks {guest.invitedPax} pax</span></div><div className="guestbook-public-status">{guest.checkedIn ? <><CheckCircle2 size={18}/><span>Sudah check-in<small>{guest.checkedInAt ? new Date(guest.checkedInAt).toLocaleString('id-ID') : ''}</small></span></> : <span>Belum hadir</span>}</div><div className="guestbook-public-action">{guest.checkedIn ? <strong>{guest.checkedPax} pax</strong> : <><input type="number" min="1" max={guest.invitedPax} value={pax} onChange={e=>setPax(Math.max(1,Math.min(guest.invitedPax,Number(e.target.value)||1)))}/><button disabled={busy} onClick={()=>onCheckIn(guest,pax)}><UserCheck size={16}/> Check-in</button></>}</div></article>
}
