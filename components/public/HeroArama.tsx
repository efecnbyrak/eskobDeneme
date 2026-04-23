'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Loader } from '@/components/ui/Loader'

interface AramaSonucu {
  id: number
  slug: string
  isletmeAdi: string
  sehir: string
  ilce: string
  kategori: { ad: string; ikon: string }
}

export function HeroArama({ araYolu = '/ara' }: { araYolu?: string }) {
  const router = useRouter()
  const [deger, setDeger] = useState('')
  const [aktif, setAktif] = useState(false)
  const [sonuclar, setSonuclar] = useState<AramaSonucu[]>([])
  const [yukleniyor, setYukleniyor] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const fixedInputRef = useRef<HTMLInputElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const ara = useCallback(async (kelime: string) => {
    if (!kelime.trim() || kelime.length < 2) { setSonuclar([]); return }
    setYukleniyor(true)
    try {
      const res = await fetch(`/api/esnaf?arama=${encodeURIComponent(kelime)}&limit=5`, { cache: 'no-store' })
      if (res.ok) {
        const data = await res.json()
        setSonuclar((data.esnaflar ?? []).slice(0, 5))
      }
    } catch {
      setSonuclar([])
    } finally {
      setYukleniyor(false)
    }
  }, [])

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => ara(deger), 280)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [deger, ara])

  useEffect(() => {
    function esc(e: KeyboardEvent) {
      if (e.key === 'Escape') { setAktif(false); setSonuclar([]) }
    }
    document.addEventListener('keydown', esc)
    return () => document.removeEventListener('keydown', esc)
  }, [])

  // When activated, focus the fixed input
  useEffect(() => {
    if (aktif) {
      setTimeout(() => fixedInputRef.current?.focus(), 50)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [aktif])

  function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault()
    setAktif(false)
    setSonuclar([])
    if (deger.trim()) {
      router.push(`${araYolu}?arama=${encodeURIComponent(deger.trim())}`)
    } else {
      router.push(araYolu)
    }
  }

  const gosterDropdown = aktif && deger.length >= 2

  return (
    <>
      {/* ── Overlay (backdrop) ── */}
      {aktif && (
        <div
          onClick={() => { setAktif(false); setSonuclar([]) }}
          style={{
            position: 'fixed', inset: 0, zIndex: 9000,
            background: 'rgba(0,0,0,0.55)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            animation: 'fadeInOverlay 0.2s ease',
          }}
        />
      )}

      {/* ── Fixed search panel (shown when active) ── */}
      {aktif && (
        <div
          style={{
            position: 'fixed', top: 80, left: '50%', transform: 'translateX(-50%)',
            width: '90vw', maxWidth: 680,
            zIndex: 9001,
            animation: 'slideDownSearch 0.2s ease',
          }}
        >
          <form onSubmit={handleSubmit}>
            <div
              style={{
                display: 'flex', alignItems: 'center',
                background: 'white',
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                border: '2px solid var(--color-primary)',
                borderRadius: gosterDropdown ? '20px 20px 0 0' : 20,
                transition: 'border-radius 0.15s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', paddingLeft: 20, color: 'var(--color-primary)' }}>
                <svg style={{ width: 22, height: 22 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                ref={fixedInputRef}
                value={deger}
                onChange={(e) => setDeger(e.target.value)}
                placeholder="İşletme, esnaf veya şehir ara..."
                style={{
                  flex: 1, padding: '18px 12px', fontSize: 17, fontWeight: 500,
                  background: 'transparent', outline: 'none', border: 'none',
                  color: 'var(--color-text)', minHeight: 60,
                }}
              />
              {deger && (
                <button
                  type="button"
                  onClick={() => { setDeger(''); setSonuclar([]); fixedInputRef.current?.focus() }}
                  style={{ padding: '0 10px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)', fontSize: 20 }}
                >
                  ×
                </button>
              )}
              <button
                type="submit"
                style={{
                  background: 'var(--color-primary)', color: 'white',
                  fontWeight: 700, fontSize: 15, padding: '0 28px',
                  height: 46, borderRadius: 14, border: 'none',
                  cursor: 'pointer', margin: 7, flexShrink: 0,
                }}
              >
                Ara
              </button>
            </div>
          </form>

          {/* Dropdown */}
          {gosterDropdown && (
            <div
              style={{
                background: 'white',
                border: '2px solid var(--color-primary)',
                borderTop: '1px solid var(--color-border)',
                borderRadius: '0 0 20px 20px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
                overflow: 'hidden',
              }}
            >
              {yukleniyor && (
                <div style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Loader />
                </div>
              )}
              {!yukleniyor && sonuclar.length === 0 && (
                <div style={{ padding: '16px 20px', fontSize: 13, color: 'var(--color-text-secondary)' }}>
                  Sonuç bulunamadı. Enter ile ara sayfasına git.
                </div>
              )}
              {!yukleniyor && sonuclar.map((s) => (
                <Link
                  key={s.id}
                  href={`/${s.sehir.toLowerCase()}/${s.slug}`}
                  onClick={() => { setAktif(false); setSonuclar([]) }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    padding: '13px 20px', textDecoration: 'none',
                    borderBottom: '1px solid var(--color-border)',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-bg-muted)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <span style={{ fontSize: 22 }}>{s.kategori.ikon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {s.isletmeAdi}
                    </p>
                    <p style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
                      {s.kategori.ad} · {s.ilce}, {s.sehir}
                    </p>
                  </div>
                  <svg style={{ width: 16, height: 16, color: 'var(--color-text-secondary)', flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
              {!yukleniyor && sonuclar.length > 0 && (
                <button
                  onClick={() => handleSubmit()}
                  style={{
                    display: 'block', width: '100%', padding: '13px 20px',
                    textAlign: 'center', fontSize: 13, fontWeight: 600,
                    color: 'var(--color-primary)', background: 'none', border: 'none', cursor: 'pointer',
                  }}
                >
                  Tüm sonuçları gör →
                </button>
              )}
            </div>
          )}

          <p style={{ textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 12, fontWeight: 500 }}>
            ESC ile kapat
          </p>
        </div>
      )}

      {/* ── Static bar in hero (always visible, opens fixed panel on click) ── */}
      <div ref={wrapperRef} style={{ position: 'relative', zIndex: 41, width: '100%', maxWidth: 640, margin: '0 auto' }}>
        <div
          onClick={() => setAktif(true)}
          style={{
            display: 'flex', alignItems: 'center',
            background: 'white',
            boxShadow: 'var(--shadow-md)',
            border: '2px solid var(--color-border)',
            borderRadius: 20,
            cursor: 'text',
            transition: 'all 0.2s',
            opacity: aktif ? 0 : 1,
            pointerEvents: aktif ? 'none' : 'auto',
          }}
          onMouseEnter={(e) => { if (!aktif) (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--color-primary)' }}
          onMouseLeave={(e) => { if (!aktif) (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--color-border)' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', paddingLeft: 20, color: 'var(--color-text-secondary)' }}>
            <svg style={{ width: 20, height: 20 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            ref={inputRef}
            readOnly
            placeholder="İşletme, esnaf veya şehir ara..."
            onClick={() => setAktif(true)}
            style={{
              flex: 1, padding: '16px 12px', fontSize: 16, fontWeight: 500,
              background: 'transparent', outline: 'none', border: 'none',
              color: 'var(--color-text-secondary)', minHeight: 56, cursor: 'text',
            }}
          />
          <button
            type="button"
            onClick={() => setAktif(true)}
            style={{
              background: 'var(--color-primary)', color: 'white',
              fontWeight: 700, fontSize: 14, padding: '0 24px',
              height: 44, borderRadius: 14, border: 'none',
              cursor: 'pointer', margin: 6, flexShrink: 0,
            }}
          >
            Ara
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeInOverlay {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideDownSearch {
          from { opacity: 0; transform: translateX(-50%) translateY(-16px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </>
  )
}
