'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/Button'
import { ThemeSwitch } from '@/components/ui/ThemeSwitch'
import { KATEGORILER } from '@/lib/constants'

type Me = {
  authenticated: boolean
  name?: string | null
  ad?: string | null
  soyad?: string | null
  avatarUrl?: string | null
  rol?: 'SUPER_ADMIN' | 'ADMIN' | 'BUSINESS' | 'USER'
}

function basTurlari(ad?: string | null, soyad?: string | null) {
  return (ad?.[0] ?? '').toUpperCase() + (soyad?.[0] ?? '').toUpperCase() || '?'
}

function CikisModal({ onOnayla, onIptal }: { onOnayla: () => void; onIptal: () => void }) {
  return (
    <div
      onClick={onIptal}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
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
  const ref = useRef<HTMLDivElement>(null)

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
    ? [{ href: '/panel', label: '🏪  İşletme Panelim' }]
    : [
        { href: '/musteri/genel/favorilerim', label: '❤️  Favorilerim' },
        { href: '/musteri/genel/randevularim', label: '📅  Geçmiş Randevularım' },
        { href: '/musteri/genel/yorumlarim', label: '⭐  Yorumlarım' },
        { href: '/musteri/genel/ayarlar', label: '⚙️  Ayarlar' },
      ]

  return (
    <>
      {cikisModal && (
        <CikisModal
          onOnayla={() => signOut({ callbackUrl: '/' })}
          onIptal={() => setCikisModal(false)}
        />
      )}
      <div ref={ref} style={{ position: 'relative' }}>
        <button
          onClick={() => setAcik((p) => !p)}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: acik ? 'var(--color-bg-muted)' : 'transparent',
            border: '1.5px solid var(--color-border)',
            borderRadius: 12, padding: '6px 14px 6px 6px',
            cursor: 'pointer', transition: 'all 0.2s',
          }}
        >
          <div
            style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'var(--color-primary)', color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: 13, flexShrink: 0,
            }}
          >
            {me.avatarUrl
              ? <img src={me.avatarUrl} alt="" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} />
              : basTurlari(me.ad, me.soyad)}
          </div>
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text)', maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {me.ad}
          </span>
          <svg
            style={{ width: 14, height: 14, color: 'var(--color-text-secondary)', transition: 'transform 0.2s', transform: acik ? 'rotate(180deg)' : 'none', flexShrink: 0 }}
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

export function Navbar() {
  const [menuAcik, setMenuAcik] = useState(false)
  const [kategoriAcik, setKategoriAcik] = useState(false)
  const [me, setMe] = useState<Me | null>(null)
  const pathname = usePathname()

  const isIsletme = pathname === '/isletme' || pathname?.startsWith('/isletme/')
  const isMusteri = pathname === '/musteri' || pathname?.startsWith('/musteri/')

  useEffect(() => {
    let iptal = false
    fetch('/api/auth/me', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : { authenticated: false }))
      .then((d) => { if (!iptal) setMe(d) })
      .catch(() => { if (!iptal) setMe({ authenticated: false }) })
    return () => { iptal = true }
  }, [])

  const girisliMi = !!me?.authenticated

  const girisHref = isIsletme ? '/isletme/giris' : isMusteri ? '/musteri/giris' : '/giris'
  const kayitHref = isIsletme ? '/isletme/kayit' : isMusteri ? '/musteri/kayit' : '/kayit'

  const accentBg = isIsletme ? '#1A2744' : isMusteri ? '#F27A1A' : 'var(--color-primary)'

  const isletmeNavLinks = [
    { href: '/isletme', label: 'Anasayfa' },
    { href: '/isletme#ozellikler', label: 'Özellikler' },
    { href: '/isletme#nasil-calisir', label: 'Nasıl Çalışır?' },
    { href: '/iletisim', label: 'İletişim' },
  ]

  const musteriNavLinks = [
    { href: '/musteri', label: 'Anasayfa' },
    { href: '/musteri/ara', label: 'İşletmeleri Keşfet' },
  ]

  const defaultNavLinks = [
    { href: '/', label: 'Anasayfa' },
  ]

  const navLinks = isIsletme ? isletmeNavLinks : isMusteri ? musteriNavLinks : defaultNavLinks
  const showKategoriler = isMusteri || (!isIsletme && !isMusteri)

  return (
    <nav
      style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: isIsletme ? 'rgba(255,255,255,0.60)' : 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: isIsletme ? '1px solid rgba(255,255,255,0.25)' : '1px solid var(--color-border)',
      }}
    >
      <div className="container-main">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 72 }}>
          {/* Logo */}
          <Link
            href="/"
            style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 700, fontSize: 18, color: 'var(--color-primary)', textDecoration: 'none', flexShrink: 0 }}
            className="font-display"
          >
            <span style={{ width: 40, height: 40, borderRadius: 12, background: accentBg, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, boxShadow: 'var(--shadow-sm)' }}>
              EV
            </span>
            <span className="hidden sm:inline">Esnaf Vitrin</span>
            {isIsletme && (
              <span style={{ fontSize: 11, fontWeight: 700, color: '#1A2744', background: 'rgba(26,39,68,0.1)', padding: '2px 8px', borderRadius: 6, marginLeft: 4 }}>
                İşletme
              </span>
            )}
            {isMusteri && (
              <span style={{ fontSize: 11, fontWeight: 700, color: '#F27A1A', background: 'rgba(242,122,26,0.1)', padding: '2px 8px', borderRadius: 6, marginLeft: 4 }}>
                Müşteri
              </span>
            )}
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex" style={{ alignItems: 'center', gap: 4, marginLeft: 32 }}>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-text)', padding: '10px 14px', borderRadius: 10, textDecoration: 'none' }}
              >
                {link.label}
              </Link>
            ))}

            {showKategoriler && (
              <div style={{ position: 'relative' }}>
                <button
                  style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-text)', padding: '10px 14px', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer' }}
                  onMouseEnter={() => setKategoriAcik(true)}
                  onMouseLeave={() => setKategoriAcik(false)}
                >
                  Kategoriler
                  <svg style={{ width: 14, height: 14, transition: 'transform 0.2s', transform: kategoriAcik ? 'rotate(180deg)' : 'none' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {kategoriAcik && (
                  <div
                    className="animate-fade-in"
                    style={{ position: 'absolute', top: '100%', left: 0, marginTop: 4, width: 240, background: 'white', border: '1px solid var(--color-border)', borderRadius: 16, boxShadow: 'var(--shadow-lg)', padding: '8px 0', zIndex: 100 }}
                    onMouseEnter={() => setKategoriAcik(true)}
                    onMouseLeave={() => setKategoriAcik(false)}
                  >
                    {KATEGORILER.map((k) => (
                      <Link
                        key={k.slug}
                        href={isMusteri ? `/musteri/kategori/${k.slug}` : `/kategori/${k.slug}`}
                        style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 18px', fontSize: 14, color: 'var(--color-text)', textDecoration: 'none' }}
                      >
                        <span style={{ fontSize: 18 }}>{k.ikon}</span>
                        {k.ad}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div style={{ flex: 1 }} />

          {/* Desktop Auth */}
          <div className="hidden lg:flex" style={{ alignItems: 'center', gap: 12 }}>
            <ThemeSwitch />
            {me === null ? (
              <div style={{ width: 120, height: 36, borderRadius: 12, background: 'var(--color-bg-muted)', animation: 'pulse 1.5s infinite' }} />
            ) : girisliMi ? (
              <UserDropdown me={me} />
            ) : (isIsletme || isMusteri) ? (
              <>
                <Link
                  href={girisHref}
                  style={{ fontSize: 14, fontWeight: 600, color: accentBg, padding: '10px 16px', textDecoration: 'none', borderRadius: 10, border: `1.5px solid ${accentBg}` }}
                >
                  Giriş Yap
                </Link>
                <Link href={kayitHref}>
                  <button style={{ height: 40, padding: '0 20px', fontSize: 14, fontWeight: 700, background: accentBg, color: 'white', borderRadius: 10, border: 'none', cursor: 'pointer', boxShadow: '0 2px 12px rgba(0,0,0,0.15)' }}>
                    Ücretsiz Başla
                  </button>
                </Link>
              </>
            ) : null}
          </div>

          {/* Mobile burger */}
          <button
            className="lg:hidden"
            style={{ padding: 10, marginRight: -8, borderRadius: 12, background: 'none', border: 'none', cursor: 'pointer' }}
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
          <div className="container-main" style={{ padding: '20px 20px 28px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {navLinks.map((link) => (
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
                  <div style={{ padding: '14px 14px 6px', fontSize: 11, fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>
                    Kategoriler
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
                    {KATEGORILER.slice(0, 8).map((k) => (
                      <Link
                        key={k.slug}
                        href={isMusteri ? `/musteri/kategori/${k.slug}` : `/kategori/${k.slug}`}
                        style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', fontSize: 14, borderRadius: 12, textDecoration: 'none', color: 'var(--color-text)' }}
                        onClick={() => setMenuAcik(false)}
                      >
                        <span>{k.ikon}</span> {k.ad}
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
                      <Link href="/panel" onClick={() => setMenuAcik(false)}>
                        <Button variant="secondary" size="sm" className="w-full">🏪 İşletme Panelim</Button>
                      </Link>
                    )}
                    {me?.rol === 'USER' && (
                      <>
                        <Link href="/musteri/genel/favorilerim" onClick={() => setMenuAcik(false)} style={{ padding: '13px 14px', fontSize: 15, borderRadius: 12, textDecoration: 'none', color: 'var(--color-text)' }}>❤️  Favorilerim</Link>
                        <Link href="/musteri/genel/randevularim" onClick={() => setMenuAcik(false)} style={{ padding: '13px 14px', fontSize: 15, borderRadius: 12, textDecoration: 'none', color: 'var(--color-text)' }}>📅  Randevularım</Link>
                        <Link href="/musteri/genel/ayarlar" onClick={() => setMenuAcik(false)} style={{ padding: '13px 14px', fontSize: 15, borderRadius: 12, textDecoration: 'none', color: 'var(--color-text)' }}>⚙️  Ayarlar</Link>
                      </>
                    )}
                    <button
                      onClick={() => { setMenuAcik(false); signOut({ callbackUrl: '/' }) }}
                      style={{ padding: '13px 14px', fontSize: 15, fontWeight: 600, color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', borderRadius: 12 }}
                    >
                      🚪  Hesaptan Çıkış Yap
                    </button>
                  </>
                ) : (isIsletme || isMusteri) ? (
                  <>
                    <Link href={girisHref} onClick={() => setMenuAcik(false)}>
                      <Button variant="secondary" size="sm" className="w-full">Giriş Yap</Button>
                    </Link>
                    <Link href={kayitHref} onClick={() => setMenuAcik(false)}>
                      <button style={{ width: '100%', height: 44, fontSize: 14, fontWeight: 700, background: accentBg, color: 'white', borderRadius: 12, border: 'none', cursor: 'pointer' }}>
                        Ücretsiz Başla
                      </button>
                    </Link>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
