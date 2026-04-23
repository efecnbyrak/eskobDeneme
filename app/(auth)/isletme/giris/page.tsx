'use client'

import { signIn } from 'next-auth/react'
import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Input } from '@/components/ui/Input'
import { LockCheckbox } from '@/components/ui/LockCheckbox'

function IsletmeGirisForm() {
  const searchParams = useSearchParams()
  const kayitBasarili = searchParams.get('kayit') === 'basarili'

  const [yukleniyor, setYukleniyor] = useState(false)
  const [hata, setHata] = useState('')
  const [beniHatirla, setBeniHatirla] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setYukleniyor(true)
    setHata('')

    const formData = new FormData(e.currentTarget)
    const email = (formData.get('email') as string).trim().toLowerCase()
    const sifre = formData.get('sifre') as string

    try {
      const res = await signIn('credentials', {
        email,
        sifre,
        rememberMe: beniHatirla ? 'true' : 'false',
        redirect: false,
      })

      if (!res || res.error) {
        setHata('E-posta veya şifre hatalı.')
        return
      }

      const meRes = await fetch('/api/auth/me', { cache: 'no-store' })
      let hedef = '/panel'
      if (meRes.ok) {
        const me = await meRes.json()
        if (me.rol === 'SUPER_ADMIN' || me.rol === 'ADMIN') hedef = '/phyberk/admin'
        else if (me.rol === 'BUSINESS') hedef = '/panel'
        else hedef = '/musteri/genel'
      }
      window.location.href = hedef
    } catch {
      setHata('Bir hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setYukleniyor(false)
    }
  }

  return (
    <>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <Link href="/isletme" style={{ display: 'inline-flex', alignItems: 'center', gap: 12, marginBottom: 28, textDecoration: 'none' }}>
          <span style={{ width: 48, height: 48, borderRadius: 12, background: '#1A2744', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 20, boxShadow: '0 4px 16px rgba(26,39,68,0.3)' }}>
            EV
          </span>
          <span style={{ fontSize: 16, fontWeight: 700, color: '#1A2744' }}>İşletme Girişi</span>
        </Link>
        <h1 className="font-display" style={{ fontSize: 28, fontWeight: 800, color: 'var(--color-text)', marginBottom: 12 }}>
          İşletme Hesabınıza Giriş
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 15, lineHeight: 1.6 }}>
          Panele erişmek için e-posta ve şifrenizi girin.
        </p>
      </div>

      <div style={{ background: 'white', borderRadius: 24, border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-md)', padding: 40 }}>
        {kayitBasarili && (
          <div style={{ padding: '12px 16px', borderRadius: 12, background: '#DCFCE7', color: '#166534', fontSize: 14, fontWeight: 500, border: '1px solid #86EFAC', marginBottom: 24 }}>
            Kayıt başarılı. Şimdi giriş yapabilirsiniz.
          </div>
        )}

        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Input label="E-posta" name="email" type="email" required placeholder="isletme@eposta.com" autoComplete="email" />
          <div>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Şifre</label>
            <input
              name="sifre"
              type="password"
              required
              minLength={6}
              placeholder="••••••••"
              autoComplete="current-password"
              style={{ width: '100%', height: 48, padding: '0 16px', background: 'var(--color-bg-muted)', border: '2px solid transparent', borderRadius: 12, fontSize: 15, outline: 'none', transition: 'all 0.2s' }}
            />
          </div>

          <LockCheckbox checked={beniHatirla} onChange={setBeniHatirla} />

          {hata && (
            <div style={{ padding: '12px 16px', borderRadius: 12, background: '#FEE2E2', color: '#991B1B', fontSize: 14, fontWeight: 500, border: '1px solid #FCA5A5' }}>
              {hata}
            </div>
          )}

          <button
            type="submit"
            disabled={yukleniyor}
            style={{ width: '100%', height: 52, marginTop: 8, fontSize: 16, fontWeight: 700, background: '#1A2744', color: 'white', borderRadius: 14, border: 'none', cursor: yukleniyor ? 'wait' : 'pointer', opacity: yukleniyor ? 0.6 : 1, transition: 'all 0.2s', boxShadow: '0 4px 20px rgba(26,39,68,0.3)' }}
          >
            {yukleniyor ? 'Giriş yapılıyor…' : 'Giriş Yap'}
          </button>
        </form>

        <div style={{ marginTop: 28, textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: 15 }}>
          Hesabınız yok mu?{' '}
          <Link href="/isletme/kayit" style={{ color: '#1A2744', fontWeight: 700 }}>Ücretsiz Başla</Link>
        </div>

        <div style={{ marginTop: 16, textAlign: 'center' }}>
          <Link href="/isletme" style={{ fontSize: 14, color: 'var(--color-text-secondary)', textDecoration: 'none' }}>
            ← İşletme sayfasına dön
          </Link>
        </div>
      </div>
    </>
  )
}

export default function IsletmeGirisSayfasi() {
  return (
    <Suspense fallback={null}>
      <IsletmeGirisForm />
    </Suspense>
  )
}
