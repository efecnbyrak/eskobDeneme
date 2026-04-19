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
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        background: 'var(--color-bg)',
        overflow: 'auto',
      }}
    >
      {/* Background Glow */}
      <div
        style={{
          position: 'absolute',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 500, height: 500,
          background: 'var(--color-primary)',
          filter: 'blur(150px)',
          opacity: 0.12,
          borderRadius: '50%',
          pointerEvents: 'none',
        }}
      />
      
      <div style={{ width: '100%', maxWidth: '440px', position: 'relative', zIndex: 10 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <Link
            href="/"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '12px',
              marginBottom: '32px', textDecoration: 'none',
            }}
          >
            <span
              style={{
                width: 48, height: 48, borderRadius: 12,
                background: 'var(--color-primary)', color: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: 20,
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              EV
            </span>
          </Link>
          <h1
            className="font-display"
            style={{ fontSize: '28px', fontWeight: 800, color: 'var(--color-text)', marginBottom: '12px' }}
          >
            Tekrar Hoş Geldiniz
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontWeight: 500, fontSize: '15px', lineHeight: 1.6 }}>
            Lütfen işletmenize giriş yapın
          </p>
        </div>

        {/* Card */}
        <div
          style={{
            background: 'white',
            borderRadius: '24px',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-md)',
            padding: '40px',
          }}
        >
          <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            <div>
              <Input
                label="Telefon Numarası"
                name="telefon"
                type="tel"
                required
                placeholder="05XX XXX XX XX"
                className="h-14 bg-[var(--color-bg-muted)] border-transparent focus:border-[var(--color-primary)] focus:bg-white text-lg transition-colors"
              />
            </div>
            
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text)' }}>Şifre</label>
                <Link href="#" style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-primary)' }}>
                  Şifremi Unuttum
                </Link>
              </div>
              <input
                name="sifre"
                type="password"
                required
                placeholder="••••••••"
                style={{
                  width: '100%', height: '56px', padding: '0 16px',
                  background: 'var(--color-bg-muted)',
                  border: '2px solid transparent',
                  borderRadius: '12px', fontSize: '18px',
                  outline: 'none', transition: 'all 0.2s',
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.background = 'white'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.background = 'var(--color-bg-muted)'; }}
              />
            </div>

            {hata && (
              <div style={{ padding: '12px 16px', borderRadius: '12px', background: 'var(--color-warm-dark)', color: '#991B1B', fontSize: '14px', fontWeight: 500, border: '1px solid #FCA5A5', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg style={{ width: 20, height: 20, flexShrink: 0 }} fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                {hata}
              </div>
            )}

            <button
              type="submit"
              disabled={yukleniyor}
              style={{
                width: '100%', height: '56px',
                fontSize: '16px', fontWeight: 700,
                background: 'var(--color-primary)', color: 'white',
                borderRadius: '16px', border: 'none',
                cursor: yukleniyor ? 'wait' : 'pointer',
                opacity: yukleniyor ? 0.6 : 1,
                transition: 'all 0.2s',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              {yukleniyor ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </button>
          </form>

          <div style={{ marginTop: '40px', textAlign: 'center', color: 'var(--color-text-secondary)', fontWeight: 500, fontSize: '15px', lineHeight: 1.6 }}>
            Henüz hesabınız yok mu?{' '}
            <Link href="/kayit" style={{ color: 'var(--color-primary)', fontWeight: 700 }}>
              Ücretsiz Kaydol
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
