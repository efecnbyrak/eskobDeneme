'use client'

import { signIn } from 'next-auth/react'
import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Input } from '@/components/ui/Input'
import { LockCheckbox } from '@/components/ui/LockCheckbox'

const OZELLIKLER = [
  { ikon: '🔍', baslik: 'Yakınındaki İşletmeler', aciklama: 'Berber, kafe, kuaför ve daha fazlasını tek platformdan keşfet.' },
  { ikon: '📅', baslik: 'Anında Randevu Al', aciklama: 'Beğendiğin işletmeden saniyeler içinde randevu oluştur.' },
  { ikon: '⭐', baslik: 'Güvenilir Yorumlar', aciklama: 'Gerçek kullanıcıların deneyimlerine göre karar ver.' },
  { ikon: '❤️', baslik: 'Favorilerini Kaydet', aciklama: 'Sevdiğin yerleri listene ekle, kolayca geri dön.' },
]

function GirisForm() {
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
      let hedef = '/hesabim'
      if (meRes.ok) {
        const me = await meRes.json()
        if (me.rol === 'SUPER_ADMIN' || me.rol === 'ADMIN') hedef = '/phyberk/admin'
        else if (me.rol === 'BUSINESS') hedef = '/isletme/panel'
        else hedef = me.kullaniciAdi ? `/${me.kullaniciAdi}/genel` : '/hesabim'
        if (me.ad) sessionStorage.setItem('hosgeldin', me.ad)
        else sessionStorage.setItem('hosgeldin', '1')
      }
      window.location.href = hedef
    } catch {
      setHata('Bir hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setYukleniyor(false)
    }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', overflowY: 'auto', fontFamily: 'var(--font-body, sans-serif)', background: 'white' }}>

      {/* SOL — Tanıtım Paneli */}
      <div
        style={{
          flex: '0 0 52%',
          background: 'linear-gradient(145deg, #F7620A 0%, #F7931E 55%, #FFAA40 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '60px 64px',
          position: 'relative',
          overflow: 'hidden',
        }}
        className="hidden lg:flex"
      >
        {/* Dekoratif daireler */}
        <div style={{ position: 'absolute', top: -120, right: -80, width: 380, height: 380, borderRadius: '50%', background: 'rgba(255,255,255,0.07)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -100, left: -60, width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', pointerEvents: 'none' }} />

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 64 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14,
            background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: 18, color: '#F7620A',
            boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
          }}>
            EV
          </div>
          <span style={{ fontSize: 22, fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>
            Müşteri Vitrin
          </span>
        </div>

        {/* Başlık */}
        <h1 style={{
          fontSize: 'clamp(28px, 3.2vw, 44px)',
          fontWeight: 800,
          color: 'white',
          lineHeight: 1.2,
          letterSpacing: '-0.02em',
          marginBottom: 20,
        }}>
          Yakınındaki İşletmeleri<br />Keşfet ve Randevu Al
        </h1>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.85)', lineHeight: 1.7, marginBottom: 48, maxWidth: 420 }}>
          Türkiye'nin en büyük dijital esnaf platformuna hoş geldiniz. Binlerce işletme, gerçek yorumlar ve anlık randevu.
        </p>

        {/* Özellikler */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {OZELLIKLER.map((o) => (
            <div key={o.baslik} style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                background: 'rgba(255,255,255,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20,
              }}>
                {o.ikon}
              </div>
              <div>
                <p style={{ fontSize: 15, fontWeight: 700, color: 'white', marginBottom: 3 }}>{o.baslik}</p>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.78)', lineHeight: 1.5 }}>{o.aciklama}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Alt bilgi */}
        <p style={{ marginTop: 56, fontSize: 13, color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>
          © {new Date().getFullYear()} Müşteri Vitrin · Tüm hakları saklıdır
        </p>
      </div>

      {/* SAĞ — Giriş Formu */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '48px 32px',
        background: '#F5F6F8',
        minHeight: '100vh',
      }}>
        <div style={{ width: '100%', maxWidth: 420 }}>

          {/* Mobil logo */}
          <div className="lg:hidden" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 40, justifyContent: 'center' }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12, background: '#F7620A',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontSize: 17, color: 'white',
            }}>
              EV
            </div>
            <span style={{ fontSize: 20, fontWeight: 800, color: '#F7620A' }}>Müşteri Vitrin</span>
          </div>

          <div style={{ marginBottom: 36 }}>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: '#111', marginBottom: 8, letterSpacing: '-0.02em' }}>
              Tekrar Hoş Geldiniz 👋
            </h2>
            <p style={{ fontSize: 15, color: '#666', lineHeight: 1.6 }}>
              Hesabınıza e-posta ile giriş yapın.
            </p>
          </div>

          <div style={{
            background: 'white',
            borderRadius: 20,
            border: '1px solid #E8E8E8',
            boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
            padding: '36px 32px',
          }}>
            {kayitBasarili && (
              <div style={{
                padding: '12px 16px', borderRadius: 12,
                background: '#DCFCE7', color: '#166534',
                fontSize: 14, fontWeight: 500,
                border: '1px solid #86EFAC', marginBottom: 24,
              }}>
                ✅ Kayıt başarılı. Şimdi giriş yapabilirsiniz.
              </div>
            )}

            <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <Input
                label="E-posta"
                name="email"
                type="email"
                required
                placeholder="ornek@eposta.com"
                autoComplete="email"
              />
              <div>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 8, color: '#333' }}>
                  Şifre
                </label>
                <input
                  name="sifre"
                  type="password"
                  required
                  minLength={6}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  style={{
                    width: '100%', height: 48, padding: '0 16px',
                    background: '#F5F6F8', border: '2px solid transparent',
                    borderRadius: 12, fontSize: 15, outline: 'none',
                    transition: 'all 0.2s', boxSizing: 'border-box',
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = '#F7620A'; e.currentTarget.style.background = 'white' }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.background = '#F5F6F8' }}
                />
              </div>

              <LockCheckbox checked={beniHatirla} onChange={setBeniHatirla} />

              {hata && (
                <div style={{
                  padding: '12px 16px', borderRadius: 12,
                  background: '#FEE2E2', color: '#991B1B',
                  fontSize: 14, fontWeight: 500,
                  border: '1px solid #FCA5A5',
                }}>
                  {hata}
                </div>
              )}

              <button
                type="submit"
                disabled={yukleniyor}
                style={{
                  width: '100%', height: 52, marginTop: 4,
                  fontSize: 16, fontWeight: 700,
                  background: yukleniyor ? '#F7931E' : '#F7620A',
                  color: 'white', borderRadius: 14, border: 'none',
                  cursor: yukleniyor ? 'wait' : 'pointer',
                  opacity: yukleniyor ? 0.7 : 1,
                  transition: 'all 0.2s',
                  boxShadow: '0 4px 16px rgba(247,98,10,0.35)',
                }}
                onMouseEnter={(e) => { if (!yukleniyor) e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(247,98,10,0.45)' }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(247,98,10,0.35)' }}
              >
                {yukleniyor ? 'Giriş yapılıyor…' : 'Giriş Yap →'}
              </button>
            </form>
          </div>

          <div style={{ marginTop: 28, textAlign: 'center', fontSize: 15, color: '#666' }}>
            Henüz hesabınız yok mu?{' '}
            <Link href="/musteri/kayit" style={{ color: '#F7620A', fontWeight: 700, textDecoration: 'none' }}>
              Ücretsiz Kaydol
            </Link>
          </div>

          <div style={{ marginTop: 16, textAlign: 'center' }}>
            <Link
              href="/isletme/giris"
              style={{ fontSize: 13, color: '#888', textDecoration: 'none', fontWeight: 500 }}
            >
              İşletme hesabıyla mı giriş yapmak istiyorsunuz? →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function GirisSayfasi() {
  return (
    <Suspense fallback={null}>
      <GirisForm />
    </Suspense>
  )
}
