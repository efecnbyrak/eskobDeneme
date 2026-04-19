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
          <h1 className="text-2xl font-bold text-center mb-8" style={{ fontFamily: 'var(--font-display)' }}>
            İşletme Profilini Oluştur
          </h1>
          <OnboardingWizard />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] px-4">
      <div className="bg-white border border-[var(--color-border)] rounded-[var(--radius-xl)] shadow-[var(--shadow-md)] w-full max-w-sm p-8">
        <div className="text-center mb-8">
          <p className="font-bold text-xl text-[var(--color-primary)] mb-1" style={{ fontFamily: 'var(--font-display)' }}>
            Esnaf Vitrin
          </p>
          <p className="text-[var(--color-text-secondary)] text-sm">Ücretsiz hesap oluştur</p>
        </div>

        <form onSubmit={handleKayit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input label="Ad" required value={form.ad} onChange={(e) => setForm((p) => ({ ...p, ad: e.target.value }))} />
            <Input label="Soyad" required value={form.soyad} onChange={(e) => setForm((p) => ({ ...p, soyad: e.target.value }))} />
          </div>
          <Input label="E-posta" type="email" required placeholder="ornek@email.com" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
          <Input label="Şifre" type="password" required placeholder="En az 8 karakter" value={form.sifre} onChange={(e) => setForm((p) => ({ ...p, sifre: e.target.value }))} />

          {hata && <p className="text-sm text-red-500">{hata}</p>}

          <Button type="submit" loading={yukleniyor} className="w-full">
            Devam Et
          </Button>
        </form>

        <p className="text-center text-sm text-[var(--color-text-secondary)] mt-6">
          Zaten hesabın var mı?{' '}
          <Link href="/giris" className="text-[var(--color-primary)] font-medium">
            Giriş Yap
          </Link>
        </p>
      </div>
    </div>
  )
}
