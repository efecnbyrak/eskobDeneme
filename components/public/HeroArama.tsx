'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface AramaSonucu {
  id: number
  slug: string
  isletmeAdi: string
  sehir: string
  ilce: string
  kategori: { ad: string; ikon: string }
}

export function HeroArama() {
  const router = useRouter()
  const [deger, setDeger] = useState('')
  const [aktif, setAktif] = useState(false)
  const [sonuclar, setSonuclar] = useState<AramaSonucu[]>([])
  const [yukleniyor, setYukleniyor] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const ara = useCallback(async (kelime: string) => {
    if (!kelime.trim() || kelime.length < 2) {
      setSonuclar([])
      return
    }
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
    function kapat(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setAktif(false)
      }
    }
    function esc(e: KeyboardEvent) {
      if (e.key === 'Escape') setAktif(false)
    }
    document.addEventListener('mousedown', kapat)
    document.addEventListener('keydown', esc)
    return () => {
      document.removeEventListener('mousedown', kapat)
      document.removeEventListener('keydown', esc)
    }
  }, [])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (deger.trim()) {
      setAktif(false)
      router.push(`/ara?arama=${encodeURIComponent(deger.trim())}`)
    } else {
      router.push('/ara')
    }
  }

  const gosterDropdown = aktif && deger.length >= 2

  return (
    <>
      {/* Blur overlay — arkadaki her şeyi buğular */}
      {aktif && (
        <div
          onClick={() => setAktif(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 40,
            background: 'rgba(0,0,0,0.35)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
          }}
        />
      )}

      <div ref={wrapperRef} style={{ position: 'relative', zIndex: 41, width: '100%', maxWidth: 640, margin: '0 auto' }}>
        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: 'flex', alignItems: 'center',
              background: 'white',
              overflow: 'visible',
              boxShadow: aktif ? '0 8px 48px rgba(0,0,0,0.22)' : 'var(--shadow-md)',
              border: `2px solid ${aktif ? 'var(--color-primary)' : 'var(--color-border)'}`,
              transition: 'all 0.25s',
              transform: aktif ? 'scale(1.02)' : 'scale(1)',
              borderRadius: gosterDropdown ? '20px 20px 0 0' : 20,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', paddingLeft: 20, color: aktif ? 'var(--color-primary)' : 'var(--color-text-secondary)', transition: 'color 0.2s' }}>
              <svg style={{ width: 20, height: 20 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              ref={inputRef}
              value={deger}
              onChange={(e) => setDeger(e.target.value)}
              onFocus={() => setAktif(true)}
              placeholder="İşletme, esnaf veya şehir ara..."
              style={{
                flex: 1, padding: '16px 12px', fontSize: 16, fontWeight: 500,
                background: 'transparent', outline: 'none', border: 'none',
                color: 'var(--color-text)', minHeight: 56,
              }}
            />
            {deger && (
              <button
                type="button"
                onClick={() => { setDeger(''); setSonuclar([]); inputRef.current?.focus() }}
                style={{ padding: '0 8px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)', fontSize: 18, lineHeight: 1 }}
              >
                ×
              </button>
            )}
            <button
              type="submit"
              style={{
                background: 'var(--color-primary)', color: 'white',
                fontWeight: 700, fontSize: 14, padding: '0 24px',
                height: 44, borderRadius: 14, border: 'none',
                cursor: 'pointer', margin: 6, flexShrink: 0,
                transition: 'background 0.2s',
              }}
            >
              Ara
            </button>
          </div>
        </form>

        {/* Canlı sonuçlar dropdown */}
        {gosterDropdown && (
          <div
            style={{
              position: 'absolute', top: '100%', left: 0, right: 0,
              background: 'white',
              border: '2px solid var(--color-primary)',
              borderTop: '1px solid var(--color-border)',
              borderRadius: '0 0 20px 20px',
              boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
              overflow: 'hidden', zIndex: 42,
            }}
          >
            {yukleniyor && (
              <div style={{ padding: '16px 20px', fontSize: 13, color: 'var(--color-text-secondary)' }}>
                Aranıyor...
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
                onClick={() => setAktif(false)}
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
                onClick={handleSubmit as unknown as React.MouseEventHandler}
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
      </div>
    </>
  )
}
