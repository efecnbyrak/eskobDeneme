'use client'

import { useState } from 'react'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export default function GirisSayfasi() {
  const router = useRouter()
  const [yukleniyor, setYukleniyor] = useState(false)
  const [hata, setHata] = useState('')
  const [form, setForm] = useState({ email: '', sifre: '' })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setYukleniyor(true)
    setHata('')
    const sonuc = await signIn('credentials', {
      email: form.email,
      sifre: form.sifre,
      redirect: false,
    })
    setYukleniyor(false)
    if (sonuc?.error) {
      setHata('E-posta veya şifre hatalı.')
    } else {
      router.push('/panel')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] px-4">
      <div className="bg-white border border-[var(--color-border)] rounded-[var(--radius-xl)] shadow-[var(--shadow-md)] w-full max-w-sm p-8">
        <div className="text-center mb-8">
          <p className="font-bold text-xl text-[var(--color-primary)] mb-1" style={{ fontFamily: 'var(--font-display)' }}>
            Esnaf Vitrin
          </p>
          <p className="text-[var(--color-text-secondary)] text-sm">Hesabına giriş yap</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
            placeholder="••••••••"
            value={form.sifre}
            onChange={(e) => setForm((p) => ({ ...p, sifre: e.target.value }))}
          />

          {hata && <p className="text-sm text-red-500">{hata}</p>}

          <Button type="submit" loading={yukleniyor} className="w-full">
            Giriş Yap
          </Button>
        </form>

        <p className="text-center text-sm text-[var(--color-text-secondary)] mt-6">
          Hesabın yok mu?{' '}
          <Link href="/kayit" className="text-[var(--color-primary)] font-medium">
            Ücretsiz Kaydol
          </Link>
        </p>
      </div>
    </div>
  )
}
