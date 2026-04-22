'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { Input } from '@/components/ui/Input'
import { KATEGORILER, SEHIRLER } from '@/lib/constants'

type Tip = 'USER' | 'BUSINESS'

const KUFUR_LISTESI = [
  'fuck', 'shit', 'bitch', 'asshole', 'dick', 'pussy', 'cock', 'cunt',
  'nigger', 'nigga', 'faggot', 'retard', 'whore', 'slut',
  'orospu', 'amk', 'amına', 'sik', 'göt', 'oç', 'piç', 'yarrak',
  'orospu', 'kahpe', 'bok', 'bok', 'ibne', 'sürtük', 'kaltak',
  'admin', 'root', 'system', 'support', 'moderator',
]

function kufurVarMi(deger: string): boolean {
  const temiz = deger.toLowerCase()
  return KUFUR_LISTESI.some((k) => temiz.includes(k))
}

function kullaniciAdiGecerliMi(deger: string): string | null {
  if (deger.length < 3) return 'En az 3 karakter olmalı'
  if (deger.length > 30) return 'En fazla 30 karakter olabilir'
  if (/[^a-zA-Z0-9_]/.test(deger)) return 'Sadece İngilizce harf, rakam ve alt çizgi (_) kullanılabilir'
  if (/^[0-9_]+$/.test(deger)) return 'En az bir harf içermeli'
  if (kufurVarMi(deger)) return 'Bu kullanıcı adı kullanılamaz'
  return null
}

function sifreGucuHesapla(sifre: string) {
  let puan = 0
  if (sifre.length >= 6) puan++
  if (sifre.length >= 10) puan++
  if (/[A-Z]/.test(sifre)) puan++
  if (/[^A-Za-z0-9]/.test(sifre)) puan++
  if (/[0-9]/.test(sifre)) puan++
  return puan
}

function SifreGucu({ sifre }: { sifre: string }) {
  if (!sifre) return null
  const puan = sifreGucuHesapla(sifre)
  const renkler = ['#EF4444', '#F97316', '#EAB308', '#22C55E', '#16A34A']
  const etiketler = ['Çok Zayıf', 'Zayıf', 'Orta', 'Güçlü', 'Çok Güçlü']
  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              flex: 1, height: 4, borderRadius: 4,
              background: i < puan ? renkler[puan - 1] : 'var(--color-border)',
              transition: 'all 0.3s',
            }}
          />
        ))}
      </div>
      <p style={{ fontSize: 11, color: renkler[puan - 1] ?? 'var(--color-text-secondary)', fontWeight: 600 }}>
        {puan > 0 ? etiketler[puan - 1] : ''}
      </p>
    </div>
  )
}

function KayitForm() {
  const [tip, setTip] = useState<Tip>('USER')
  const [yukleniyor, setYukleniyor] = useState(false)
  const [hata, setHata] = useState('')
  const [sifre, setSifre] = useState('')
  const [kullaniciAdiHata, setKullaniciAdiHata] = useState('')

  function kullaniciAdiDegisti(e: React.ChangeEvent<HTMLInputElement>) {
    const deger = e.target.value
    const err = kullaniciAdiGecerliMi(deger)
    setKullaniciAdiHata(err ?? '')
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setYukleniyor(true)
    setHata('')

    const formData = new FormData(e.currentTarget)
    const ad = (formData.get('ad') as string)?.trim()
    const soyad = (formData.get('soyad') as string)?.trim()
    const email = (formData.get('email') as string)?.trim().toLowerCase()
    const kullaniciAdi = (formData.get('kullaniciAdi') as string)?.trim()
    const sifreVal = formData.get('sifre') as string
    const sifreOnay = formData.get('sifreOnay') as string
    const telefon = (formData.get('telefon') as string)?.replace(/\s+/g, '') || undefined

    // Client-side validasyon
    if (!/^[\p{L}\s'-]+$/u.test(ad)) {
      setHata('Ad sadece harf içermeli.')
      setYukleniyor(false)
      return
    }
    if (!/^[\p{L}\s'-]+$/u.test(soyad)) {
      setHata('Soyad sadece harf içermeli.')
      setYukleniyor(false)
      return
    }
    if (!email.endsWith('@gmail.com') && !email.endsWith('@hotmail.com')) {
      setHata('Sadece @gmail.com veya @hotmail.com e-posta kabul edilir.')
      setYukleniyor(false)
      return
    }
    if (kullaniciAdi) {
      const kErr = kullaniciAdiGecerliMi(kullaniciAdi)
      if (kErr) {
        setHata(kErr)
        setYukleniyor(false)
        return
      }
    }
    if (sifreVal.length < 6 || !/[A-Z]/.test(sifreVal) || !/[^A-Za-z0-9]/.test(sifreVal)) {
      setHata('Şifre en az 6 karakter, 1 büyük harf ve 1 sembol içermeli.')
      setYukleniyor(false)
      return
    }
    if (sifreVal !== sifreOnay) {
      setHata('Şifreler eşleşmiyor.')
      setYukleniyor(false)
      return
    }

    const base = { tip, ad, soyad, email, sifre: sifreVal, telefon }
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

      window.location.href = tip === 'BUSINESS' ? '/panel' : '/'
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Bir hata oluştu.')
    } finally {
      setYukleniyor(false)
    }
  }

  const tabStyle = (active: boolean): React.CSSProperties => ({
    flex: 1, padding: '13px 16px', borderRadius: 12, border: 'none',
    fontWeight: 700, fontSize: 14, cursor: 'pointer',
    background: active ? 'var(--color-primary)' : 'transparent',
    color: active ? 'white' : 'var(--color-text-secondary)',
    transition: 'all 0.2s',
  })

  const selectStyle: React.CSSProperties = {
    width: '100%', height: 48, padding: '0 16px',
    background: 'var(--color-bg-muted)', border: '2px solid transparent',
    borderRadius: 12, fontSize: 14, outline: 'none', cursor: 'pointer',
  }

  return (
    <>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 12, marginBottom: 24, textDecoration: 'none' }}>
          <span style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--color-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 20, boxShadow: 'var(--shadow-sm)' }}>
            EV
          </span>
        </Link>
        <h1 className="font-display" style={{ fontSize: 28, fontWeight: 800, marginBottom: 12 }}>
          Ücretsiz Kayıt
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 15, lineHeight: 1.6 }}>
          Hesap türünü seçin ve dakikalar içinde başlayın.
        </p>
      </div>

      <div style={{ background: 'white', borderRadius: 24, border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-md)', padding: 32 }}>
        <div style={{ display: 'flex', gap: 8, background: 'var(--color-bg-muted)', padding: 6, borderRadius: 16, marginBottom: 28 }}>
          <button type="button" onClick={() => setTip('USER')} style={tabStyle(tip === 'USER')}>Müşteri</button>
          <button type="button" onClick={() => setTip('BUSINESS')} style={tabStyle(tip === 'BUSINESS')}>İşletme</button>
        </div>

        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <Input label="Ad" name="ad" required placeholder="Adınız" />
            <Input label="Soyad" name="soyad" required placeholder="Soyadınız" />
          </div>

          <Input label="E-posta" name="email" type="email" required placeholder="ornek@gmail.com" autoComplete="email" />
          <p style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginTop: -10 }}>
            Sadece @gmail.com veya @hotmail.com kabul edilir.
          </p>

          <div>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 6 }}>
              Kullanıcı Adı
            </label>
            <input
              name="kullaniciAdi"
              type="text"
              placeholder="ornek_kullanici123"
              autoComplete="username"
              onChange={kullaniciAdiDegisti}
              style={{ width: '100%', height: 48, padding: '0 16px', background: 'var(--color-bg-muted)', border: `2px solid ${kullaniciAdiHata ? '#EF4444' : 'transparent'}`, borderRadius: 12, fontSize: 14, outline: 'none' }}
            />
            {kullaniciAdiHata
              ? <p style={{ fontSize: 11, color: '#EF4444', marginTop: 4 }}>{kullaniciAdiHata}</p>
              : <p style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginTop: 4 }}>İngilizce harf, rakam ve _ kullanılabilir. Türkçe karakter yok.</p>
            }
          </div>

          <Input label="Telefon" name="telefon" type="tel" required placeholder="+90 5XX XXX XX XX" />
          <p style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginTop: -10 }}>
            Türkiye numarası (+90 ile başlamalı).
          </p>

          {tip === 'BUSINESS' && (
            <>
              <Input label="İşletme Adı" name="isletmeAdi" required placeholder="Örn: Özkan Kuaför" />
              <div>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 6 }}>Kategori</label>
                <select name="kategoriSlug" required style={selectStyle} defaultValue="">
                  <option value="" disabled>Seçiniz</option>
                  {KATEGORILER.map((k) => (
                    <option key={k.slug} value={k.slug}>{k.ikon} {k.ad}</option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 6 }}>Şehir</label>
                  <select name="sehir" required style={selectStyle} defaultValue="">
                    <option value="" disabled>Şehir</option>
                    {SEHIRLER.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <Input label="İlçe" name="ilce" required placeholder="Örn: Kadıköy" />
              </div>
            </>
          )}

          <div>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 6 }}>
              Şifre
            </label>
            <input
              name="sifre"
              type="password"
              required
              value={sifre}
              onChange={(e) => setSifre(e.target.value)}
              placeholder="En az 6 karakter"
              autoComplete="new-password"
              style={{ width: '100%', height: 48, padding: '0 16px', background: 'var(--color-bg-muted)', border: '2px solid transparent', borderRadius: 12, fontSize: 14, outline: 'none' }}
            />
            <SifreGucu sifre={sifre} />
            <p style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginTop: 4 }}>
              En az 6 karakter, 1 büyük harf ve 1 sembol zorunlu (!@#$%& vb.)
            </p>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 6 }}>
              Şifre Onayla
            </label>
            <input
              name="sifreOnay"
              type="password"
              required
              placeholder="Şifrenizi tekrar girin"
              autoComplete="new-password"
              style={{ width: '100%', height: 48, padding: '0 16px', background: 'var(--color-bg-muted)', border: '2px solid transparent', borderRadius: 12, fontSize: 14, outline: 'none' }}
            />
          </div>

          {hata && (
            <div style={{ padding: '12px 16px', borderRadius: 12, background: '#FEE2E2', color: '#991B1B', fontSize: 14, fontWeight: 500, border: '1px solid #FCA5A5' }}>
              {hata}
            </div>
          )}

          <p style={{ fontSize: 12, textAlign: 'center', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
            Kayıt olarak{' '}
            <Link href="/hizmet-sozlesmesi" target="_blank" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Kullanım Şartları</Link>
            {' '}ve{' '}
            <Link href="/kvkk" target="_blank" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>KVKK Metni</Link>
            &apos;ni kabul etmiş olursunuz.
          </p>

          <button
            type="submit"
            disabled={yukleniyor || !!kullaniciAdiHata}
            style={{
              width: '100%', height: 52, fontSize: 16, fontWeight: 700,
              background: 'var(--color-primary)', color: 'white',
              borderRadius: 14, border: 'none',
              cursor: (yukleniyor || !!kullaniciAdiHata) ? 'not-allowed' : 'pointer',
              opacity: (yukleniyor || !!kullaniciAdiHata) ? 0.6 : 1,
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            {yukleniyor ? 'Kayıt yapılıyor…' : 'Ücretsiz Kayıt Ol'}
          </button>
        </form>

        <div style={{ marginTop: 24, textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: 15 }}>
          Zaten hesabınız var mı?{' '}
          <Link href="/giris" style={{ color: 'var(--color-primary)', fontWeight: 700 }}>Giriş Yap</Link>
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
