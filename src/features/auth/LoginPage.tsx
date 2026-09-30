import { FormEvent, useState } from 'react'
import { LockKeyhole, LogIn, Mail } from 'lucide-react'

export function LoginPage({ onLogin }: { onLogin: (email: string, password: string) => Promise<void> }) {
  const [email, setEmail] = useState('admin@example.com')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try { await onLogin(email, password) }
    catch (err) { setError(err instanceof Error ? err.message : 'Login gagal.') }
    finally { setLoading(false) }
  }

  return <main className="login-page">
    <section className="login-card">
      <div className="login-brand login-brand-image-wrap"><img className="login-brand-logo" src="/brand/iinvitation-logo.png?v=rose-20260919" alt="Iinvitation" /></div>
      <div className="login-copy"><span className="eyebrow">Admin Access</span><h1>Masuk ke dashboard</h1><p>Kelola undangan, tamu, media, WhatsApp, dan RSVP dari satu panel.</p></div>
      <form onSubmit={submit} className="login-form">
        <label>Email<div className="login-input"><Mail size={17}/><input type="email" required value={email} onChange={e=>setEmail(e.target.value)} /></div></label>
        <label>Password<div className="login-input"><LockKeyhole size={17}/><input type="password" required value={password} onChange={e=>setPassword(e.target.value)} placeholder="Masukkan password admin" /></div></label>
        {error && <div className="login-error">{error}</div>}
        <button className="primary-btn login-submit" disabled={loading}><LogIn size={17}/>{loading ? 'Memeriksa...' : 'Masuk Dashboard'}</button>
      </form>
      <small className="login-footnote">Gunakan kredensial dari konfigurasi server. Ganti password default sebelum deployment publik.</small>
    </section>
  </main>
}
