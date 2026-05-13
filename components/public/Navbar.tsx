'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { createPortal } from 'react-dom'
import { Button } from '@/components/ui/Button'

type Me = {
  authenticated: boolean
  name?: string | null
  ad?: string | null
  soyad?: string | null
  avatarUrl?: string | null
  rol?: 'SUPER_ADMIN' | 'ADMIN' | 'BUSINESS' | 'USER'
  kullaniciAdi?: string | null
}

function basTurlari(ad?: string | null, soyad?: string | null) {
  return (ad?.[0] ?? '').toUpperCase() + (soyad?.[0] ?? '').toUpperCase() || '?'
}

function CikisModal({ onOnayla, onIptal }: { onOnayla: () => void; onIptal: () => void }) {
  return (
    <div
      onClick={onIptal}
      style={{
        position: 'fixed', inset: 0, zIndex: 99999,
        background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'white', borderRadius: 20, padding: '36px 32px',
          maxWidth: 360, width: '90%', textAlign: 'center',
          boxShadow: '0 24px 64px rgba(0,0,0,0.18)',
        }}
      >
        <div style={{ fontSize: 40, marginBottom: 16 }}>👋</div>
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10, color: 'var(--color-text)' }}>
          Çıkış yapmak istiyor musunuz?
        </h3>
        <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', marginBottom: 28, lineHeight: 1.6 }}>
          Hesabınızdan çıkış yaptığınızda tekrar giriş yapmanız gerekecek.
        </p>
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={onIptal}
            style={{
              flex: 1, height: 44, borderRadius: 12, border: '1.5px solid var(--color-border)',
              background: 'white', fontWeight: 600, fontSize: 14, cursor: 'pointer',
              color: 'var(--color-text)',
            }}
          >
            İptal
          </button>
          <button
            onClick={onOnayla}
            style={{
              flex: 1, height: 44, borderRadius: 12, border: 'none',
              background: '#EF4444', color: 'white', fontWeight: 700, fontSize: 14, cursor: 'pointer',
            }}
          >
            Evet, Çıkış Yap
          </button>
        </div>
      </div>
    </div>
  )
}

function UserDropdown({ me }: { me: Me }) {
  const [acik, setAcik] = useState(false)
  const [cikisModal, setCikisModal] = useState(false)
  const [mounted, setMounted] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    function kapat(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setAcik(false)
    }
    document.addEventListener('mousedown', kapat)
    return () => document.removeEventListener('mousedown', kapat)
  }, [])

  const isAdmin = me.rol === 'SUPER_ADMIN' || me.rol === 'ADMIN'
  const isBusiness = me.rol === 'BUSINESS'

  const menuLinks = isAdmin
    ? [{ href: '/phyberk/admin', label: '🛡️  Yönetim Paneli' }]
    : isBusiness
    ? [{ href: '/isletme/panel', label: '🏪  İşletme Panelim' }]
    : [
        { href: '/genel', label: '🏠  Genel Bakış' },
        { href: '/favorilerim', label: '❤️  Favorilerim' },
        { href: '/randevularim', label: '📅  Randevularım' },
        { href: '/yorumlarim', label: '⭐  Yorumlarım' },
        { href: '/ayarlar', label: '⚙️  Ayarlar' },
      ]

  return (
    <>
      {mounted && cikisModal && createPortal(
        <CikisModal
          onOnayla={() => signOut({ callbackUrl: '/giris' })}
          onIptal={() => setCikisModal(false)}
        />,
        document.body
      )}
      <div ref={ref} style={{ position: 'relative' }}>
        <button
          onClick={() => setAcik((p) => !p)}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: acik ? 'var(--color-bg-muted)' : 'transparent',
            border: '1.5px solid var(--color-border)',
            borderRadius: 12, padding: '6px 12px 6px 6px',
            cursor: 'pointer', transition: 'all 0.2s',
          }}
        >
          <div
            style={{
              width: 30, height: 30, borderRadius: '50%',
              background: 'var(--color-primary)', color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: 12, flexShrink: 0,
            }}
          >
            {me.avatarUrl
              ? <img src={me.avatarUrl} alt="" style={{ width: 30, height: 30, borderRadius: '50%', objectFit: 'cover' }} />
              : basTurlari(me.ad, me.soyad)}
          </div>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)', maxWidth: 90, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {me.ad}
          </span>
          <svg
            style={{ width: 13, height: 13, color: 'var(--color-text-secondary)', transition: 'transform 0.2s', transform: acik ? 'rotate(180deg)' : 'none', flexShrink: 0 }}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {acik && (
          <div
            className="animate-fade-in"
            style={{
              position: 'absolute', top: 'calc(100% + 8px)', right: 0,
              width: 220, background: 'white',
              border: '1px solid var(--color-border)',
              borderRadius: 16, boxShadow: 'var(--shadow-lg)',
              padding: '8px 0', zIndex: 100,
            }}
          >
            <div style={{ padding: '12px 16px 10px', borderBottom: '1px solid var(--color-border)', marginBottom: 6 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text)' }}>
                {me.ad} {me.soyad}
              </p>
              <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 2 }}>
                {me.rol === 'USER' ? 'Kullanıcı' : me.rol === 'BUSINESS' ? 'İşletme' : 'Yönetici'}
              </p>
            </div>

            {menuLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setAcik(false)}
                style={{
                  display: 'block', padding: '11px 16px', fontSize: 14,
                  color: 'var(--color-text)', textDecoration: 'none',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-bg-muted)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                {l.label}
              </Link>
            ))}

            <div style={{ margin: '6px 12px 6px', borderTop: '1px solid var(--color-border)' }} />
            <button
              onClick={() => { setAcik(false); setCikisModal(true) }}
              style={{
                display: 'block', width: '100%', textAlign: 'left',
                padding: '11px 16px', fontSize: 14, fontWeight: 600,
                color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer',
                borderRadius: '0 0 16px 16px', transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#FEF2F2')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              🚪  Hesaptan Çıkış Yap
            </button>
          </div>
        )}
      </div>
    </>
  )
}

function NavArama({ dbKategoriler }: { dbKategoriler: any[] }) {
  const router = useRouter()
  const [deger, setDeger] = useState('')
  const [odakli, setOdakli] = useState(false)
  const [katSonuclar, setKatSonuclar] = useState<any[]>([])
  const [isletmeSonuclar, setIsletmeSonuclar] = useState<any[]>([])
  const [yukleniyor, setYukleniyor] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Dışarı tıklanınca kapat
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOdakli(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // ESC ile kapat
  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') { setOdakli(false); inputRef.current?.blur() }
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [])

  // Akıllı arama — önce kategoriler, sonra işletmeler
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    if (!deger.trim() || deger.length < 2) {
      setKatSonuclar([])
      setIsletmeSonuclar([])
      return
    }
    timerRef.current = setTimeout(async () => {
      setYukleniyor(true)
      try {
        const q = deger.toLowerCase()
        const matchedKats = dbKategoriler
          .filter((k) => k.ad.toLowerCase().includes(q) || k.slug.toLowerCase().includes(q))
          .slice(0, 3)
        setKatSonuclar(matchedKats)

        const res = await fetch(`/api/esnaf?arama=${encodeURIComponent(deger)}&limit=5`, { cache: 'no-store' })
        if (res.ok) {
          const data = await res.json()
          setIsletmeSonuclar((data.esnaflar ?? []).slice(0, 5))
        }
      } catch { /* noop */ }
      setYukleniyor(false)
    }, 280)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [deger, dbKategoriler])

  const gosterDropdown = odakli && deger.length >= 2
  const hasResults = katSonuclar.length > 0 || isletmeSonuclar.length > 0

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setOdakli(false)
    const q = deger.trim()
    router.push(q ? `/ara?arama=${encodeURIComponent(q)}` : '/ara')
  }

  function goToSearch() {
    setOdakli(false)
    const q = deger.trim()
    router.push(q ? `/ara?arama=${encodeURIComponent(q)}` : '/ara')
  }

  return (
    <div ref={wrapperRef} style={{ position: 'relative', width: '100%' }}>
      <form onSubmit={handleSubmit}>
        <div
          style={{
            display: 'flex', alignItems: 'center',
            background: 'white',
            border: `2px solid ${odakli ? 'var(--color-primary)' : 'var(--color-border)'}`,
            borderRadius: gosterDropdown ? '14px 14px 0 0' : 14,
            transition: 'border-color 0.2s, border-radius 0.15s, box-shadow 0.2s',
            boxShadow: odakli ? '0 0 0 3px rgba(242,122,26,0.12)' : '0 1px 4px rgba(0,0,0,0.06)',
            overflow: 'hidden',
          }}
        >
          <div style={{ paddingLeft: 14, color: odakli ? 'var(--color-primary)' : 'var(--color-text-secondary)', transition: 'color 0.2s', flexShrink: 0 }}>
            <svg style={{ width: 17, height: 17, display: 'block' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            ref={inputRef}
            value={deger}
            onChange={(e) => setDeger(e.target.value)}
            onFocus={() => setOdakli(true)}
            placeholder="Kategori veya işletme ara..."
            style={{
              flex: 1, padding: '10px 10px', fontSize: 14, fontWeight: 500,
              background: 'transparent', outline: 'none', border: 'none',
              color: 'var(--color-text)',
            }}
          />
          {deger && (
            <button
              type="button"
              onClick={() => { setDeger(''); setKatSonuclar([]); setIsletmeSonuclar([]); inputRef.current?.focus() }}
              style={{ padding: '0 8px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)', fontSize: 18, lineHeight: 1, flexShrink: 0 }}
            >
              ×
            </button>
          )}
          <button
            type="submit"
            style={{
              background: 'var(--color-primary)', color: 'white',
              fontWeight: 700, fontSize: 13, padding: '0 18px',
              height: 38, border: 'none', cursor: 'pointer',
              margin: 4, borderRadius: 10, flexShrink: 0,
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = '0.88')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = '1')}
          >
            Ara
          </button>
        </div>
      </form>

      {/* Akıllı dropdown */}
      {gosterDropdown && (
        <div
          style={{
            position: 'absolute', top: '100%', left: 0, right: 0,
            background: 'white',
            border: '2px solid var(--color-primary)',
            borderTop: '1px solid var(--color-border)',
            borderRadius: '0 0 14px 14px',
            boxShadow: '0 16px 48px rgba(0,0,0,0.14)',
            zIndex: 9999,
            maxHeight: 400,
            overflowY: 'auto',
          }}
        >
          {yukleniyor && (
            <div style={{ padding: '14px 16px', fontSize: 13, color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ display: 'inline-block', width: 14, height: 14, borderRadius: '50%', border: '2px solid var(--color-primary)', borderTopColor: 'transparent', animation: 'spin 0.7s linear infinite' }} />
              Aranıyor...
            </div>
          )}

          {/* Kategori sonuçları */}
          {!yukleniyor && katSonuclar.length > 0 && (
            <>
              <div style={{ padding: '8px 14px 4px', fontSize: 11, fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase' as const, letterSpacing: '0.07em' }}>
                Kategoriler
              </div>
              {katSonuclar.map((k) => (
                <Link
                  key={k.slug}
                  href={`/kategori/${k.slug}`}
                  onClick={() => { setOdakli(false); setDeger('') }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '10px 14px', textDecoration: 'none',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = 'var(--color-bg-muted)')}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
                >
                  <span style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--color-bg-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
                    {k.ikonUrl ? <img src={k.ikonUrl} alt={k.ad} style={{ width: 16, height: 16, objectFit: 'contain' }} /> : k.ikon}
                  </span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text)', flex: 1 }}>{k.ad}</span>
                  <span style={{ fontSize: 11, color: 'var(--color-text-secondary)', background: 'var(--color-bg-muted)', padding: '2px 8px', borderRadius: 6, flexShrink: 0 }}>Kategori</span>
                </Link>
              ))}
            </>
          )}

          {/* İşletme sonuçları */}
          {!yukleniyor && isletmeSonuclar.length > 0 && (
            <>
              <div style={{ padding: '8px 14px 4px', fontSize: 11, fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase' as const, letterSpacing: '0.07em', borderTop: katSonuclar.length > 0 ? '1px solid var(--color-border)' : 'none' }}>
                İşletmeler
              </div>
              {isletmeSonuclar.map((s: any) => (
                <Link
                  key={s.id}
                  href={`/${s.sehir?.toLowerCase()}/${s.slug}`}
                  onClick={() => { setOdakli(false); setDeger('') }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '10px 14px', textDecoration: 'none',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = 'var(--color-bg-muted)')}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
                >
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--color-bg-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                    {s.kategori?.ikon || '🏪'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.isletmeAdi}</p>
                    <p style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{s.kategori?.ad} · {s.ilce}, {s.sehir}</p>
                  </div>
                  <svg style={{ width: 14, height: 14, color: 'var(--color-text-secondary)', flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </>
          )}

          {/* Sonuç yok */}
          {!yukleniyor && !hasResults && (
            <div style={{ padding: '14px 16px', fontSize: 13, color: 'var(--color-text-secondary)', textAlign: 'center' }}>
              &ldquo;{deger}&rdquo; için sonuç bulunamadı
            </div>
          )}

          {/* Tümünü gör */}
          <button
            type="button"
            onClick={goToSearch}
            style={{
              display: 'block', width: '100%', padding: '12px 14px',
              textAlign: 'center', fontSize: 13, fontWeight: 600,
              color: 'var(--color-primary)', background: 'none', border: 'none',
              cursor: 'pointer', borderTop: '1px solid var(--color-border)',
              transition: 'background 0.15s',
              borderRadius: '0 0 14px 14px',
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = 'var(--color-bg-muted)')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = 'none')}
          >
            &ldquo;{deger}&rdquo; için tüm sonuçları gör →
          </button>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}

export function Navbar() {
  const [menuAcik, setMenuAcik] = useState(false)
  const [dbKategoriler, setDbKategoriler] = useState<any[]>([])
  const [visible, setVisible] = useState(true)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const { data: session, status } = useSession()

  const isIsletme = pathname === '/isletme' || pathname?.startsWith('/isletme/')

  // Session'dan me türet — loading sırasında unauthenticated gibi davran (butonlar hemen görünsün)
  const me: Me = status === 'authenticated' && session?.user
    ? {
        authenticated: true,
        ad: session.user.ad,
        soyad: session.user.soyad,
        rol: session.user.rol,
        kullaniciAdi: session.user.kullaniciAdi,
        avatarUrl: session.user.image ?? undefined,
      }
    : { authenticated: false }

  useEffect(() => {
    let iptal = false
    fetch('/api/v1/categories')
      .then((r) => r.json())
      .then((d) => { if (!iptal && d.success) setDbKategoriler(d.data) })
      .catch(console.error)

    return () => { iptal = true }
  }, [])

  useEffect(() => {
    setScrolled(window.scrollY > 20)
    let prevY = window.scrollY
    function handleScroll() {
      const currentY = window.scrollY
      setScrolled(currentY > 20)
      if (currentY < prevY || currentY < 10) {
        setVisible(true)
      } else if (currentY > prevY && currentY > 60) {
        setVisible(false)
      }
      prevY = currentY
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const girisliMi = !!me?.authenticated

  const girisHref = isIsletme ? '/isletme/giris' : '/giris'
  const kayitHref = isIsletme ? '/isletme/kayit' : '/musteri/kayit'

  const accentBg = isIsletme ? '#1A2744' : 'var(--color-primary)'

  const showKategoriler = !isIsletme

  const isletmeNavLinks = [
    { href: '/isletme/ozellikler', label: 'Özellikler' },
    { href: '/isletme/nasil-calisir', label: 'Nasıl Çalışır?' },
    { href: '/isletme/iletisim', label: 'İletişim' },
  ]

  const navbarHeight = showKategoriler && !scrolled ? 116 : 72

  if (pathname === '/isletme') return null

  return (
    <>
      <div style={{ height: navbarHeight, flexShrink: 0, transition: 'height 0.3s' }} />
      <nav
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
          background: scrolled ? 'rgba(255,255,255,0.98)' : 'rgba(255,255,255,0.96)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: scrolled ? '1px solid var(--color-border)' : (isIsletme ? '1px solid rgba(255,255,255,0.25)' : (showKategoriler ? 'none' : '1px solid var(--color-border)')),
          boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.07)' : 'none',
          transform: visible ? 'translateY(0)' : 'translateY(-100%)',
          transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1), background 0.3s ease, box-shadow 0.3s ease',
        }}
      >
        <div className="container-main">
          <div style={{ display: 'flex', alignItems: 'center', height: 72, position: 'relative' }}>

            {/* SEARCH BAR — tam sayfa ortasında, absolute */}
            {!isIsletme && (
              <div
                className="hidden lg:block"
                style={{
                  position: 'absolute',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '42%',
                  maxWidth: 560,
                  zIndex: 10,
                }}
              >
                <NavArama dbKategoriler={dbKategoriler} />
              </div>
            )}

            {/* LOGO */}
            <Link
              href={isIsletme ? '/isletme' : '/'}
              style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 700, fontSize: 18, color: 'var(--color-primary)', textDecoration: 'none', flexShrink: 0 }}
              className="font-display"
            >
              <span style={{ width: 38, height: 38, borderRadius: 10, background: accentBg, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, boxShadow: 'var(--shadow-sm)' }}>
                EV
              </span>
              <span className="hidden sm:inline" style={{ fontSize: 16 }}>Müşteri Vitrin</span>
              {isIsletme && (
                <span style={{ fontSize: 11, fontWeight: 700, color: '#1A2744', background: 'rgba(26,39,68,0.1)', padding: '2px 8px', borderRadius: 6, marginLeft: 4 }}>
                  İşletme
                </span>
              )}
            </Link>

            {/* İşletme sayfaları için nav linkleri */}
            {isIsletme && (
              <div className="hidden lg:flex" style={{ alignItems: 'center', gap: 4, marginLeft: 32 }}>
                {isletmeNavLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-text)', padding: '10px 14px', borderRadius: 10, textDecoration: 'none' }}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}

            {isIsletme && <div style={{ flex: 1 }} />}

            {/* Flex spacer — search bar tam ortada konumlanmak için */}
            {!isIsletme && <div style={{ flex: 1 }} />}

            {/* SAĞ ALAN */}
            <div className="hidden lg:flex" style={{ alignItems: 'center', gap: 12, flexShrink: 0 }}>
              {girisliMi ? (
                <>
                  <UserDropdown me={me} />
                  {me.rol === 'USER' && (
                    <>
                      <Link
                        href="/favorilerim"
                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, color: 'var(--color-text-secondary)', textDecoration: 'none', transition: 'color 0.2s', padding: '4px 8px', borderRadius: 10 }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-primary)')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
                      >
                        <svg style={{ width: 20, height: 20 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span style={{ fontSize: 11, fontWeight: 600 }}>Favorilerim</span>
                      </Link>
                      <Link
                        href="/randevularim"
                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, color: 'var(--color-text-secondary)', textDecoration: 'none', transition: 'color 0.2s', padding: '4px 8px', borderRadius: 10 }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-primary)')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
                      >
                        <svg style={{ width: 20, height: 20 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span style={{ fontSize: 11, fontWeight: 600 }}>Randevularım</span>
                      </Link>
                    </>
                  )}
                </>
              ) : (
                <>
                  <Link
                    href={girisHref}
                    style={{
                      fontSize: 14, fontWeight: 600, color: 'white',
                      padding: '10px 18px', textDecoration: 'none', borderRadius: 10,
                      background: accentBg, transition: 'opacity 0.2s',
                    }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = '0.85')}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = '1')}
                  >
                    Giriş Yap
                  </Link>
                  <Link href={kayitHref}>
                    <button style={{ height: 40, padding: '0 18px', fontSize: 14, fontWeight: 700, background: 'transparent', color: accentBg, borderRadius: 10, border: `1.5px solid ${accentBg}`, cursor: 'pointer' }}>
                      Ücretsiz Başla
                    </button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile burger */}
            <button
              className="lg:hidden"
              style={{ padding: 10, marginLeft: 'auto', borderRadius: 12, background: 'none', border: 'none', cursor: 'pointer' }}
              onClick={() => setMenuAcik((p) => !p)}
              aria-label="Menü"
            >
              {menuAcik ? (
                <svg style={{ width: 24, height: 24 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg style={{ width: 24, height: 24 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuAcik && (
          <div className="lg:hidden animate-fade-in" style={{ borderTop: '1px solid var(--color-border)', background: 'white' }}>
            <div className="container-main" style={{ padding: '16px 20px 24px' }}>
              {/* Mobile search */}
              {!isIsletme && (
                <div style={{ marginBottom: 16 }}>
                  <NavArama dbKategoriler={dbKategoriler} />
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {isIsletme && isletmeNavLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    style={{ padding: '13px 14px', fontSize: 15, fontWeight: 600, borderRadius: 12, textDecoration: 'none', color: 'var(--color-text)' }}
                    onClick={() => setMenuAcik(false)}
                  >
                    {link.label}
                  </Link>
                ))}

                {showKategoriler && (
                  <>
                    <div style={{ padding: '10px 14px 6px', fontSize: 11, fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>
                      Kategoriler
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
                      {dbKategoriler.slice(0, 8).map((k) => (
                        <Link
                          key={k.slug}
                          href={`/kategori/${k.slug}`}
                          style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', fontSize: 14, borderRadius: 12, textDecoration: 'none', color: 'var(--color-text)' }}
                          onClick={() => setMenuAcik(false)}
                        >
                          {k.ikonUrl
                            ? <img src={k.ikonUrl} alt={k.ad} style={{ width: 22, height: 22, objectFit: 'contain' }} />
                            : <span>{k.ikon}</span>
                          }
                          {k.ad}
                        </Link>
                      ))}
                    </div>
                  </>
                )}

                <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {girisliMi ? (
                    <>
                      {(me?.rol === 'SUPER_ADMIN' || me?.rol === 'ADMIN') && (
                        <Link href="/phyberk/admin" onClick={() => setMenuAcik(false)}>
                          <Button variant="secondary" size="sm" className="w-full">🛡️ Yönetim Paneli</Button>
                        </Link>
                      )}
                      {me?.rol === 'BUSINESS' && (
                        <Link href="/isletme/panel" onClick={() => setMenuAcik(false)}>
                          <Button variant="secondary" size="sm" className="w-full">🏪 İşletme Panelim</Button>
                        </Link>
                      )}
                      {me?.rol === 'USER' && (
                        <>
                          <Link href="/genel" onClick={() => setMenuAcik(false)} style={{ padding: '13px 14px', fontSize: 15, borderRadius: 12, textDecoration: 'none', color: 'var(--color-text)' }}>🏠  Genel Bakış</Link>
                          <Link href="/favorilerim" onClick={() => setMenuAcik(false)} style={{ padding: '13px 14px', fontSize: 15, borderRadius: 12, textDecoration: 'none', color: 'var(--color-text)' }}>❤️  Favorilerim</Link>
                          <Link href="/randevularim" onClick={() => setMenuAcik(false)} style={{ padding: '13px 14px', fontSize: 15, borderRadius: 12, textDecoration: 'none', color: 'var(--color-text)' }}>📅  Randevularım</Link>
                          <Link href="/ayarlar" onClick={() => setMenuAcik(false)} style={{ padding: '13px 14px', fontSize: 15, borderRadius: 12, textDecoration: 'none', color: 'var(--color-text)' }}>⚙️  Ayarlar</Link>
                        </>
                      )}
                      <button
                        onClick={() => { setMenuAcik(false); signOut({ callbackUrl: '/giris' }) }}
                        style={{ padding: '13px 14px', fontSize: 15, fontWeight: 600, color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', borderRadius: 12 }}
                      >
                        🚪  Hesaptan Çıkış Yap
                      </button>
                    </>
                  ) : (
                    <>
                      <Link href={girisHref} onClick={() => setMenuAcik(false)}>
                        <button style={{ width: '100%', height: 44, fontSize: 14, fontWeight: 700, background: accentBg, color: 'white', borderRadius: 12, border: 'none', cursor: 'pointer' }}>
                          Giriş Yap
                        </button>
                      </Link>
                      <Link href={kayitHref} onClick={() => setMenuAcik(false)}>
                        <button style={{ width: '100%', height: 44, fontSize: 14, fontWeight: 600, background: 'transparent', color: accentBg, borderRadius: 12, border: `1.5px solid ${accentBg}`, cursor: 'pointer' }}>
                          Ücretsiz Başla
                        </button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Kategori Bar — divider YOK, header'a bağlı */}
        {showKategoriler && !scrolled && (
          <div className="hidden lg:flex" style={{ background: 'white' }}>
            <div className="container-main">
              <div style={{ display: 'flex', alignItems: 'center', gap: 28, height: 44, overflowX: 'auto', scrollbarWidth: 'none', padding: '0 4px' }}>
                {dbKategoriler.map((k) => (
                  <Link
                    key={k.slug}
                    href={`/kategori/${k.slug}`}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      fontSize: 14, fontWeight: 800, color: '#444',
                      textDecoration: 'none', whiteSpace: 'nowrap',
                      transition: 'color 0.2s',
                      padding: '10px 0', borderBottom: '2px solid transparent',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = 'var(--color-primary)'
                      e.currentTarget.style.borderBottomColor = 'var(--color-primary)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#555'
                      e.currentTarget.style.borderBottomColor = 'transparent'
                    }}
                  >
                    {k.ikonUrl
                      ? <img src={k.ikonUrl} alt={k.ad} style={{ width: 16, height: 16, objectFit: 'contain' }} />
                      : <span style={{ fontSize: 15 }}>{k.ikon}</span>
                    }
                    {k.ad}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  )
}
