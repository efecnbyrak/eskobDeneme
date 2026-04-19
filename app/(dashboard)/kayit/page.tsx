'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { KATEGORILER } from '@/lib/constants'

export default function KayitSayfasi() {
  const router = useRouter()
  const [yukleniyor, setYukleniyor] = useState(false)
  const [hata, setHata] = useState('')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setYukleniyor(true)
    setHata('')

    const formData = new FormData(e.currentTarget)
    const data = {
      isletmeAdi: formData.get('isletmeAdi'),
      telefon: (formData.get('telefon') as string).replace(/\s+/g, ''),
      sifre: formData.get('sifre'),
      kategoriId: formData.get('kategoriId'),
      sehir: formData.get('sehir'),
      ilce: formData.get('ilce'),
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Kayıt olurken bir hata oluştu')
      }

      router.push('/giris?kayit=basarili')
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Bir hata oluştu')
    } finally {
      setYukleniyor(false)
    }
  }

  const selectStyle: React.CSSProperties = {
    width: '100%', height: '48px', padding: '0 16px',
    background: 'var(--color-bg-muted)',
    border: '2px solid transparent',
    borderRadius: '12px', fontSize: '14px',
    outline: 'none', transition: 'all 0.2s',
    cursor: 'pointer',
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px', background: 'var(--color-bg)', overflow: 'auto',
      }}
    >
      {/* Background Glow */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600, height: 600,
        background: 'var(--color-primary)', filter: 'blur(150px)',
        opacity: 0.1, borderRadius: '50%', pointerEvents: 'none',
      }} />
      
      <div style={{ width: '100%', maxWidth: '500px', position: 'relative', zIndex: 10 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', marginBottom: '28px', textDecoration: 'none' }}>
            <span style={{
              width: 48, height: 48, borderRadius: 12,
              background: 'var(--color-primary)', color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: 20, boxShadow: 'var(--shadow-sm)',
            }}>EV</span>
          </Link>
          <h1 className="font-display" style={{ fontSize: '28px', fontWeight: 800, color: 'var(--color-text)', marginBottom: '12px' }}>
            Dijital Vitrinini Kur
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontWeight: 500, fontSize: '15px', lineHeight: 1.6 }}>
            Hemen ücretsiz kayıt olun, müşterilerinizi artırın.
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: 'white', borderRadius: '24px',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-md)', padding: '40px',
        }}>
          <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* İşletme Adı */}
            <div>
              <Input
                label="İşletme Adı"
                name="isletmeAdi"
                required
                placeholder="Örn: Özkan Kuaför"
                className="h-12 border-transparent focus:border-[var(--color-primary)] bg-[var(--color-bg-muted)] focus:bg-white"
              />
            </div>
            
            {/* Kategori + Telefon */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: 'var(--color-text)', marginBottom: '8px' }}>Kategori</label>
                <select
                  name="kategoriId"
                  required
                  style={selectStyle}
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.background = 'white'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.background = 'var(--color-bg-muted)'; }}
                >
                  <option value="">Seçiniz</option>
                  {KATEGORILER.map((k) => (
                    <option key={k.slug} value={k.slug}>
                      {k.ikon} {k.ad}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Input
                  label="Telefon"
                  name="telefon"
                  type="tel"
                  required
                  placeholder="05XX XXX XX"
                  className="h-12 border-transparent focus:border-[var(--color-primary)] bg-[var(--color-bg-muted)] focus:bg-white"
                />
              </div>
            </div>

            {/* Şehir + İlçe */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <Input
                  label="Şehir"
                  name="sehir"
                  required
                  placeholder="İstanbul"
                  className="h-12 border-transparent focus:border-[var(--color-primary)] bg-[var(--color-bg-muted)] focus:bg-white"
                />
              </div>
              <div>
                <Input
                  label="İlçe"
                  name="ilce"
                  required
                  placeholder="Kadıköy"
                  className="h-12 border-transparent focus:border-[var(--color-primary)] bg-[var(--color-bg-muted)] focus:bg-white"
                />
              </div>
            </div>

            {/* Şifre */}
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: 'var(--color-text)', marginBottom: '8px' }}>Şifre</label>
              <input
                name="sifre"
                type="password"
                required
                placeholder="En az 6 karakter"
                minLength={6}
                style={{
                  width: '100%', height: '48px', padding: '0 16px',
                  background: 'var(--color-bg-muted)',
                  border: '2px solid transparent',
                  borderRadius: '12px', fontSize: '14px',
                  outline: 'none', transition: 'all 0.2s',
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.background = 'white'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.background = 'var(--color-bg-muted)'; }}
              />
            </div>

            {/* Error */}
            {hata && (
              <div style={{ padding: '12px 16px', borderRadius: '12px', background: 'var(--color-warm-dark)', color: '#991B1B', fontSize: '14px', fontWeight: 500, border: '1px solid #FCA5A5', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg style={{ width: 20, height: 20, flexShrink: 0 }} fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                {hata}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={yukleniyor}
              style={{
                width: '100%', height: '56px', marginTop: '8px',
                fontSize: '16px', fontWeight: 700,
                background: 'var(--color-primary)', color: 'white',
                borderRadius: '16px', border: 'none',
                cursor: yukleniyor ? 'wait' : 'pointer',
                opacity: yukleniyor ? 0.6 : 1,
                transition: 'all 0.2s',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              {yukleniyor ? 'Kayıt yapılıyor...' : 'Ücretsiz Kayıt Ol'}
            </button>
            <p style={{ fontSize: '12px', textAlign: 'center', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
              Kayıt olarak Kullanım Şartları ve Gizlilik Politikası&apos;nı kabul etmiş olursunuz.
            </p>
          </form>

          <div style={{ marginTop: '32px', textAlign: 'center', color: 'var(--color-text-secondary)', fontWeight: 500, fontSize: '15px' }}>
            Zaten hesabınız var mı?{' '}
            <Link href="/giris" style={{ color: 'var(--color-primary)', fontWeight: 700 }}>
              Giriş Yap
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
