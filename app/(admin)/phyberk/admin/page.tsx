'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function AdminGirisPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [sifre, setSifre] = useState('')
  const [yukleniyor, setYukleniyor] = useState(false)
  const [hata, setHata] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setHata('')
    setYukleniyor(true)

    const sonuc = await signIn('credentials', {
      email: email.trim().toLowerCase(),
      password: sifre,
      redirect: false,
    })

    setYukleniyor(false)

    if (!sonuc?.ok) {
      setHata('E-posta veya şifre hatalı.')
      return
    }

    router.replace('/phyberk/admin/dashboard')
  }

  return (
    <div className="min-h-screen bg-[#0F1623] flex items-center justify-center p-4">
      {/* Arka plan deseni */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(99,102,241,0.18) 0%, transparent 70%)',
        }}
      />

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600 mb-4 shadow-lg shadow-indigo-500/30">
            <span className="text-white font-bold text-2xl font-display">A</span>
          </div>
          <h1 className="text-2xl font-bold text-white font-display tracking-tight">
            Admin Paneli
          </h1>
          <p className="text-sm text-white/40 mt-1">Sadece yetkili erişim</p>
        </div>

        {/* Kart */}
        <div
          className="rounded-2xl border border-white/10 p-8"
          style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(12px)' }}
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                E-posta Adresi
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="admin@ornek.com"
                className="w-full rounded-xl border border-white/10 bg-white/5 text-white placeholder-white/25 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Şifre</label>
              <input
                type="password"
                value={sifre}
                onChange={(e) => setSifre(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full rounded-xl border border-white/10 bg-white/5 text-white placeholder-white/25 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition"
              />
            </div>

            {hata && (
              <div className="flex items-center gap-2.5 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3">
                <span className="text-red-400 text-xs font-medium">{hata}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={yukleniyor}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40"
            >
              {yukleniyor ? 'Giriş yapılıyor…' : 'Giriş Yap'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-white/20 mt-8">
          © {new Date().getFullYear()} Admin Kontrol Paneli
        </p>
      </div>
    </div>
  )
}
