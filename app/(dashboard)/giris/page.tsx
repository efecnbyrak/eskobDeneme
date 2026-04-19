'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

export default function GirisSayfasi() {
  const router = useRouter()
  const [yukleniyor, setYukleniyor] = useState(false)
  const [hata, setHata] = useState('')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setYukleniyor(true)
    setHata('')

    const formData = new FormData(e.currentTarget)
    const telefon = formData.get('telefon') as string
    const sifre = formData.get('sifre') as string

    try {
      const res = await signIn('credentials', {
        telefon: telefon.replace(/\s+/g, ''),
        sifre,
        redirect: false,
      })

      if (res?.error) {
        setHata('Telefon numarası veya şifre hatalı')
      } else {
        router.push('/panel')
        router.refresh()
      }
    } catch {
      setHata('Bir hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setYukleniyor(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[var(--color-bg)]">
      {/* Background Epic Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--color-primary)] blur-[150px] opacity-20 pointer-events-none rounded-full" />
      
      <div className="w-full max-w-[440px] relative z-10">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
            <span className="w-12 h-12 rounded-xl bg-[var(--color-primary)] text-white flex items-center justify-center font-bold text-xl shadow-[0_0_20px_rgba(242,122,26,0.3)] group-hover:scale-105 transition-transform">EV</span>
          </Link>
          <h1 className="text-3xl font-extrabold font-display mb-2 text-[var(--color-text)]">Tekrar Hoş Geldiniz</h1>
          <p className="text-[var(--color-text-secondary)] font-medium">Lütfen işletmenize giriş yapın</p>
        </div>

        <div className="card-elite p-8 sm:p-10 !rounded-[2rem] bg-white/90 backdrop-blur-xl border border-white">
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-1">
              <Input
                label="Telefon Numarası"
                name="telefon"
                type="tel"
                required
                placeholder="05XX XXX XX XX"
                className="h-14 bg-[var(--color-bg-muted)] border-transparent focus:border-[var(--color-primary)] focus:bg-white text-lg transition-colors"
              />
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-[var(--color-text)]">Şifre</label>
                <Link href="#" className="text-sm font-semibold text-[var(--color-primary)] hover:underline">
                  Şifremi Unuttum
                </Link>
              </div>
              <input
                name="sifre"
                type="password"
                required
                placeholder="••••••••"
                className="w-full h-14 px-4 bg-[var(--color-bg-muted)] border-2 border-transparent focus:border-[var(--color-primary)] focus:bg-white rounded-[var(--radius-md)] text-lg transition-colors outline-none"
              />
            </div>

            {hata && (
              <div className="p-3 rounded-lg bg-[var(--color-warm-dark)] text-[#991B1B] text-sm font-medium border border-[#FCA5A5] flex items-center gap-2">
                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                {hata}
              </div>
            )}

            <Button
              type="submit"
              loading={yukleniyor}
              className="w-full h-14 text-lg font-bold bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] shadow-[0_4px_14px_0_rgba(242,122,26,0.39)] hover:shadow-[0_6px_20px_rgba(242,122,26,0.23)] transition-all hover:-translate-y-0.5 rounded-2xl"
            >
              Giriş Yap
            </Button>
          </form>

          <div className="mt-8 text-center text-[var(--color-text-secondary)] font-medium">
            Henüz hesabınız yok mu?{' '}
            <Link href="/kayit" className="text-[var(--color-primary)] hover:underline font-bold">
              Ücretsiz Kaydol
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
