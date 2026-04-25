'use client'

import { useState } from 'react'

interface YorumFormuProps {
  esnafId: number
  authenticated: boolean
  kullaniciAd?: string | null
  onYorumEklendi?: () => void
}

export function YorumFormu({ esnafId, authenticated, kullaniciAd, onYorumEklendi }: YorumFormuProps) {
  const [puan, setPuan] = useState(0)
  const [hoverPuan, setHoverPuan] = useState(0)
  const [yorum, setYorum] = useState('')
  const [yukleniyor, setYukleniyor] = useState(false)
  const [basarili, setBasarili] = useState(false)
  const [hata, setHata] = useState('')

  if (!authenticated) {
    return (
      <div style={{ padding: '20px 24px', background: 'var(--color-bg-muted)', borderRadius: 14, textAlign: 'center', border: '1.5px dashed var(--color-border)' }}>
        <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', marginBottom: 12 }}>
          Yorum yapmak için giriş yapmanız gerekiyor.
        </p>
        <a href="/musteri/giris" style={{ display: 'inline-block', padding: '10px 24px', background: '#F27A1A', color: 'white', borderRadius: 10, fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>
          Giriş Yap
        </a>
      </div>
    )
  }

  if (basarili) {
    return (
      <div style={{ padding: '20px 24px', background: '#F0FDF4', borderRadius: 14, textAlign: 'center', border: '1.5px solid #86EFAC' }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>✅</div>
        <p style={{ fontWeight: 700, color: '#16A34A', marginBottom: 4 }}>Yorumunuz gönderildi!</p>
        <p style={{ fontSize: 13, color: '#4B5563' }}>Onaylandıktan sonra yayınlanacak.</p>
      </div>
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (puan === 0) { setHata('Lütfen bir puan seçin.'); return }
    if (yorum.trim().length < 10) { setHata('Yorum en az 10 karakter olmalı.'); return }

    setYukleniyor(true)
    setHata('')
    try {
      const res = await fetch('/api/yorum', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Client': 'web' },
        body: JSON.stringify({ esnafId, puan, yorum: yorum.trim(), musteriAd: kullaniciAd || 'Anonim' }),
      })
      const cevap = await res.json().catch(() => null)
      if (!res.ok) {
        throw new Error(
          (cevap && typeof cevap.error === 'string' ? cevap.error : null) ??
            'Yorum gönderilemedi'
        )
      }
      setBasarili(true)
      onYorumEklendi?.()
    } catch (e) {
      setHata(e instanceof Error ? e.message : 'Yorum gönderilemedi. Tekrar deneyin.')
    } finally {
      setYukleniyor(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ background: 'white', border: '1.5px solid var(--color-border)', borderRadius: 16, padding: 24 }}>
      <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 20 }}>Yorum Yaz</h3>

      {/* Yıldız Seçimi */}
      <div style={{ marginBottom: 20 }}>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 10, color: 'var(--color-text-secondary)' }}>Puanınız</label>
        <div style={{ display: 'flex', gap: 6 }}>
          {[1, 2, 3, 4, 5].map((y) => (
            <button
              key={y}
              type="button"
              onClick={() => setPuan(y)}
              onMouseEnter={() => setHoverPuan(y)}
              onMouseLeave={() => setHoverPuan(0)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, fontSize: 28, lineHeight: 1, transition: 'transform 0.1s', transform: (hoverPuan || puan) >= y ? 'scale(1.15)' : 'scale(1)' }}
            >
              <span style={{ color: (hoverPuan || puan) >= y ? '#F59E0B' : '#D1D5DB' }}>★</span>
            </button>
          ))}
          {puan > 0 && (
            <span style={{ marginLeft: 8, fontSize: 13, color: 'var(--color-text-secondary)', alignSelf: 'center' }}>
              {['', 'Çok Kötü', 'Kötü', 'Orta', 'İyi', 'Mükemmel'][puan]}
            </span>
          )}
        </div>
      </div>

      {/* Yorum Metni */}
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'var(--color-text-secondary)' }}>Yorumunuz</label>
        <textarea
          value={yorum}
          onChange={(e) => setYorum(e.target.value)}
          placeholder="Deneyiminizi paylaşın... (en az 10 karakter)"
          rows={3}
          style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid var(--color-border)', fontSize: 14, resize: 'vertical', outline: 'none', fontFamily: 'inherit', lineHeight: 1.6, background: 'var(--color-bg-muted)', boxSizing: 'border-box' }}
        />
        <div style={{ fontSize: 11, color: yorum.length < 10 ? '#9CA3AF' : '#10B981', textAlign: 'right', marginTop: 4 }}>
          {yorum.length} / 500
        </div>
      </div>

      {hata && <p style={{ fontSize: 13, color: '#EF4444', marginBottom: 12 }}>{hata}</p>}

      <button
        type="submit"
        disabled={yukleniyor}
        style={{ width: '100%', height: 44, background: '#F27A1A', color: 'white', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: yukleniyor ? 'not-allowed' : 'pointer', opacity: yukleniyor ? 0.7 : 1, transition: 'opacity 0.2s' }}
      >
        {yukleniyor ? 'Gönderiliyor...' : 'Yorum Gönder'}
      </button>
    </form>
  )
}
