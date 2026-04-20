'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { Input } from '@/components/ui/Input'
import { KATEGORILER, SEHIRLER } from '@/lib/constants'

type Tip = 'USER' | 'BUSINESS'

function KayitForm() {
  const [tip, setTip] = useState<Tip>('USER')
  const [yukleniyor, setYukleniyor] = useState(false)
  const [hata, setHata] = useState('')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setYukleniyor(true)
    setHata('')

    const formData = new FormData(e.currentTarget)
    const base = {
      tip,
      ad: (formData.get('ad') as string)?.trim(),
      soyad: (formData.get('soyad') as string)?.trim(),
      email: (formData.get('email') as string)?.trim().toLowerCase(),
      sifre: formData.get('sifre') as string,
      telefon: (formData.get('telefon') as string)?.replace(/\s+/g, '') || undefined,
    }

    const payload =
      tip === 'BUSINESS'
        ? {
            ...base,
            isletmeAdi: (formData.get('isletmeAdi') as string)?.trim(),
            kategoriSlug: formData.get('kategoriSlug') as string,
            sehir: formData.get('sehir') as string,
            ilce: (formData.get('ilce') as string)?.trim(),
          }
        : base

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.error || 'Kayıt sırasında bir hata oluştu.')
      }

      const signInRes = await signIn('credentials', {
        email: base.email,
        sifre: base.sifre,
        redirect: false,
      })

      if (!signInRes || signInRes.error) {
        window.location.href = '/giris?kayit=basarili'
        return
      }

      window.location.href = tip === 'BUSINESS' ? '/panel' : '/user'
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Bir hata oluştu.')
    } finally {
      setYukleniyor(false)
    }
  }

  const tabStyle = (active: boolean): React.CSSProperties => ({
    flex: 1,
    padding: '14px 16px',
    borderRadius: 12,
    border: 'none',
    fontWeight: 700,
    fontSize: 14,
    cursor: 'pointer',
    background: active ? 'var(--color-primary)' : 'transparent',
    color: active ? 'white' : 'var(--color-text-secondary)',
    transition: 'all 0.2s',
  })

  const selectStyle: React.CSSProperties = {
    width: '100%',
    height: 48,
    padding: '0 16px',
    background: 'var(--color-bg-muted)',
    border: '2px solid transparent',
    borderRadius: 12,
    fontSize: 14,
    outline: 'none',
    cursor: 'pointer',
  }

  return (
    <>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <Link
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 24,
            textDecoration: 'none',
          }}
        >
          <span
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: 'var(--color-primary)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: 20,
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            EV
          </span>
        </Link>
        <h1
          className="font-display"
          style={{ fontSize: 28, fontWeight: 800, marginBottom: 12 }}
        >
          Ücretsiz Kayıt
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 15, lineHeight: 1.6 }}>
          Hesap türünü seçin ve dakikalar içinde başlayın.
        </p>
      </div>

      <div
        style={{
          background: 'white',
          borderRadius: 24,
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-md)',
          padding: 32,
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: 8,
            background: 'var(--color-bg-muted)',
            padding: 6,
            borderRadius: 16,
            marginBottom: 28,
          }}
        >
          <button type="button" onClick={() => setTip('USER')} style={tabStyle(tip === 'USER')}>
            Müşteri
          </button>
          <button
            type="button"
            onClick={() => setTip('BUSINESS')}
            style={tabStyle(tip === 'BUSINESS')}
          >
            İşletme
          </button>
        </div>

        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Input label="Ad" name="ad" required placeholder="Adınız" />
            <Input label="Soyad" name="soyad" required placeholder="Soyadınız" />
          </div>

          <Input
            label="E-posta"
            name="email"
            type="email"
            required
            placeholder="ornek@eposta.com"
            autoComplete="email"
          />

          <Input
            label="Telefon (opsiyonel)"
            name="telefon"
            type="tel"
            placeholder="05XX XXX XX XX"
          />

          {tip === 'BUSINESS' && (
            <>
              <Input
                label="İşletme Adı"
                name="isletmeAdi"
                required
                placeholder="Örn: Özkan Kuaför"
              />

              <div>
                <label
                  style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 8 }}
                >
                  Kategori
                </label>
                <select name="kategoriSlug" required style={selectStyle} defaultValue="">
                  <option value="" disabled>
                    Seçiniz
                  </option>
                  {KATEGORILER.map((k) => (
                    <option key={k.slug} value={k.slug}>
                      {k.ikon} {k.ad}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label
                    style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 8 }}
                  >
                    Şehir
                  </label>
                  <select name="sehir" required style={selectStyle} defaultValue="">
                    <option value="" disabled>
                      Şehir
                    </option>
                    {SEHIRLER.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <Input label="İlçe" name="ilce" required placeholder="Örn: Kadıköy" />
              </div>
            </>
          )}

          <div>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
              Şifre
            </label>
            <input
              name="sifre"
              type="password"
              required
              minLength={6}
              placeholder="En az 6 karakter"
              autoComplete="new-password"
              style={{
                width: '100%',
                height: 48,
                padding: '0 16px',
                background: 'var(--color-bg-muted)',
                border: '2px solid transparent',
                borderRadius: 12,
                fontSize: 14,
                outline: 'none',
              }}
            />
          </div>

          {hata && (
            <div
              style={{
                padding: '12px 16px',
                borderRadius: 12,
                background: '#FEE2E2',
                color: '#991B1B',
                fontSize: 14,
                fontWeight: 500,
                border: '1px solid #FCA5A5',
              }}
            >
              {hata}
            </div>
          )}

          <button
            type="submit"
            disabled={yukleniyor}
            style={{
              width: '100%',
              height: 52,
              marginTop: 4,
              fontSize: 16,
              fontWeight: 700,
              background: 'var(--color-primary)',
              color: 'white',
              borderRadius: 14,
              border: 'none',
              cursor: yukleniyor ? 'wait' : 'pointer',
              opacity: yukleniyor ? 0.6 : 1,
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            {yukleniyor ? 'Kayıt yapılıyor…' : 'Ücretsiz Kayıt Ol'}
          </button>

          <p
            style={{
              fontSize: 12,
              textAlign: 'center',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.5,
            }}
          >
            Kayıt olarak Kullanım Şartları ve Gizlilik Politikası&apos;nı kabul etmiş olursunuz.
          </p>
        </form>

        <div
          style={{
            marginTop: 24,
            textAlign: 'center',
            color: 'var(--color-text-secondary)',
            fontSize: 15,
          }}
        >
          Zaten hesabınız var mı?{' '}
          <Link href="/giris" style={{ color: 'var(--color-primary)', fontWeight: 700 }}>
            Giriş Yap
          </Link>
        </div>
      </div>
    </>
  )
}

export default function KayitSayfasi() {
  return (
    <Suspense fallback={null}>
      <KayitForm />
    </Suspense>
  )
}
