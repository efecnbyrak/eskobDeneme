'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { OnboardingWizard } from '@/components/dashboard/OnboardingWizard'

export default function KayitSayfasi() {
  const router = useRouter()
  const [adim, setAdim] = useState<'kayit' | 'onboarding'>('kayit')
  const [yukleniyor, setYukleniyor] = useState(false)
  const [hata, setHata] = useState('')
  const [form, setForm] = useState({ ad: '', soyad: '', email: '', sifre: '' })

  async function handleKayit(e: React.FormEvent) {
    e.preventDefault()
    setYukleniyor(true)
    setHata('')
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const data = await res.json()
        setHata(data.error || 'Kayıt başarısız.')
        return
      }
      setAdim('onboarding')
    } finally {
      setYukleniyor(false)
    }
  }

  if (adim === 'onboarding') {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] py-12 px-4">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-[var(--color-primary)] text-white flex items-center justify-center font-bold font-display text-sm">EV</span>
              <span className="font-bold text-lg text-[var(--color-primary)] font-display">Esnaf Vitrin</span>
            </Link>
            <h1 className="text-2xl font-bold mt-6 font-display">İşletme Profilini Oluştur</h1>
            <p className="text-sm text-[var(--color-text-secondary)] mt-1">Birkaç adımda vitrinini hazırla</p>
          </div>
          <OnboardingWizard />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex">
      {/* Sol panel - Branding */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(145deg, var(--color-primary) 0%, #2d4a54 100%)' }}
      >
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }}
        />
        <div className="relative">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-white/20 text-white flex items-center justify-center font-bold font-display">EV</span>
            <span className="font-bold text-xl text-white font-display">Esnaf Vitrin</span>
          </Link>
        </div>
        <div className="relative space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-white font-display leading-snug">
              Dijital vitrinini<br />bugün kur, müşteri kazan
            </h2>
            <p className="text-white/70 mt-3 text-base leading-relaxed">
              5 dakikada işletmeni kuruyorsun. Ücretsiz, risksiz, şartsız.
            </p>
          </div>
          <div className="space-y-4">
            {[
              { ikon: '🚀', metin: '5 dakikada hazır vitrin' },
              { ikon: '📅', metin: 'Online randevu alma sistemi' },
              { ikon: '⭐', metin: 'Yorum ve değerlendirme yönetimi' },
              { ikon: '📊', metin: 'Gerçek zamanlı istatistikler' },
            ].map((m) => (
              <div key={m.metin} className="flex items-center gap-3 text-white/80">
                <span className="text-lg shrink-0">{m.ikon}</span>
                <span className="text-sm">{m.metin}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="relative text-white/40 text-xs">
          © {new Date().getFullYear()} Esnaf Vitrin
        </div>
      </div>

      {/* Sağ panel - Form */}
      <div className="flex-1 flex items-center justify-center bg-[var(--color-bg)] px-4 py-12">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-[var(--color-primary)] text-white flex items-center justify-center font-bold font-display text-sm">EV</span>
              <span className="font-bold text-lg text-[var(--color-primary)] font-display">Esnaf Vitrin</span>
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-[var(--color-text)] font-display">Hesap Oluştur</h1>
            <p className="text-[var(--color-text-secondary)] text-sm mt-1">Ücretsiz başla, kredi kartı gerekmez</p>
          </div>

          <form onSubmit={handleKayit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Ad"
                required
                placeholder="Ahmet"
                value={form.ad}
                onChange={(e) => setForm((p) => ({ ...p, ad: e.target.value }))}
              />
              <Input
                label="Soyad"
                required
                placeholder="Yılmaz"
                value={form.soyad}
                onChange={(e) => setForm((p) => ({ ...p, soyad: e.target.value }))}
              />
            </div>
            <Input
              label="E-posta"
              type="email"
              required
              placeholder="ornek@email.com"
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            />
            <Input
              label="Şifre"
              type="password"
              required
              placeholder="En az 8 karakter"
              hint="En az 8 karakter kullanın"
              value={form.sifre}
              onChange={(e) => setForm((p) => ({ ...p, sifre: e.target.value }))}
            />

            {hata && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-[var(--radius-md)] text-sm text-red-600">
                <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {hata}
              </div>
            )}

            <Button type="submit" loading={yukleniyor} className="w-full" size="lg">
              Devam Et →
            </Button>
          </form>

          <p className="text-center text-xs text-[var(--color-text-secondary)] mt-4">
            Kaydolarak{' '}
            <Link href="/gizlilik" className="underline hover:text-[var(--color-primary)]">Gizlilik Politikası</Link>
            &apos;nı kabul etmiş olursunuz.
          </p>

          <p className="text-center text-sm text-[var(--color-text-secondary)] mt-5">
            Zaten hesabın var mı?{' '}
            <Link href="/giris" className="text-[var(--color-primary)] font-semibold hover:underline">
              Giriş Yap
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
