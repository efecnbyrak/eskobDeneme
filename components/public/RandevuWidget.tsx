'use client'

import { useState } from 'react'
import { useRandevu } from '@/hooks/useRandevu'
import type { Hizmet } from '@/types'

interface RandevuWidgetProps {
  esnafId: number
  hizmetler: Hizmet[]
}

export function RandevuWidget({ esnafId, hizmetler }: RandevuWidgetProps) {
  const { randevuOlustur, yukleniyor, hata } = useRandevu()
  const [basarili, setBasarili] = useState(false)
  const [form, setForm] = useState({
    musteriAd: '',
    musteriTelefon: '',
    musteriNot: '',
    hizmetId: '',
    tarih: '',
  })

  const seciliHizmet = hizmetler.find((h) => String(h.id) === form.hizmetId)

  function set(field: string, value: string) {
    setForm((p) => ({ ...p, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const sure = seciliHizmet?.sure || 60
    const sonuc = await randevuOlustur({
      musteriAd: form.musteriAd,
      musteriTelefon: form.musteriTelefon,
      musteriNot: form.musteriNot,
      esnafId,
      sure,
      tarih: new Date(form.tarih).toISOString(),
      hizmetId: form.hizmetId ? parseInt(form.hizmetId) : null,
    })
    if (sonuc) setBasarili(true)
  }

  if (basarili) {
    return (
      <div style={{ padding: '32px 24px', textAlign: 'center' }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#F0FDF4', border: '2px solid #86EFAC', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, margin: '0 auto 16px' }}>✅</div>
        <p style={{ fontWeight: 700, fontSize: 16, color: '#16A34A', marginBottom: 6 }}>Randevunuz alındı!</p>
        <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>İşletme en kısa sürede sizinle iletişime geçecek.</p>
        <button
          onClick={() => setBasarili(false)}
          style={{ marginTop: 16, padding: '8px 20px', borderRadius: 8, border: '1.5px solid var(--color-border)', background: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer', color: 'var(--color-text)' }}
        >
          Yeni Randevu
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Başlık */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: '#F27A1A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>📅</div>
          <h3 style={{ fontWeight: 800, fontSize: 18, color: 'var(--color-text)', fontFamily: 'var(--font-display)' }}>Randevu Al</h3>
        </div>
        <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', paddingLeft: 42 }}>Ücretsiz, anında onaylı</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Hizmet seçimi */}
        {hizmetler.length > 0 && (
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--color-text-secondary)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Hizmet</label>
            <select
              value={form.hizmetId}
              onChange={(e) => set('hizmetId', e.target.value)}
              style={{ width: '100%', height: 44, padding: '0 12px', borderRadius: 10, border: '1.5px solid var(--color-border)', fontSize: 14, background: 'var(--color-bg-muted)', color: 'var(--color-text)', outline: 'none', cursor: 'pointer' }}
            >
              <option value="">Hizmet seçin (isteğe bağlı)</option>
              {hizmetler.map((h) => (
                <option key={h.id} value={String(h.id)}>
                  {h.ad}{h.fiyat ? ` — ${h.fiyat}₺` : ''}
                </option>
              ))}
            </select>
            {seciliHizmet && (
              <div style={{ marginTop: 6, padding: '8px 12px', borderRadius: 8, background: 'rgba(242,122,26,0.08)', border: '1px solid rgba(242,122,26,0.2)', fontSize: 12, color: '#C2571A', display: 'flex', gap: 12 }}>
                {seciliHizmet.sure && <span>⏱ {seciliHizmet.sure} dk</span>}
                {seciliHizmet.fiyat && <span>💰 {seciliHizmet.fiyat}₺</span>}
              </div>
            )}
          </div>
        )}

        {/* Tarih & Saat */}
        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--color-text-secondary)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tarih & Saat</label>
          <input
            type="datetime-local"
            required
            value={form.tarih}
            onChange={(e) => set('tarih', e.target.value)}
            style={{ width: '100%', height: 44, padding: '0 12px', borderRadius: 10, border: '1.5px solid var(--color-border)', fontSize: 14, background: 'var(--color-bg-muted)', color: 'var(--color-text)', outline: 'none', boxSizing: 'border-box' }}
          />
        </div>

        {/* Ad Soyad + Telefon: 2 sütun */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--color-text-secondary)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Ad Soyad</label>
            <input
              type="text"
              required
              placeholder="Adınız"
              value={form.musteriAd}
              onChange={(e) => set('musteriAd', e.target.value)}
              style={{ width: '100%', height: 44, padding: '0 12px', borderRadius: 10, border: '1.5px solid var(--color-border)', fontSize: 14, background: 'var(--color-bg-muted)', color: 'var(--color-text)', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--color-text-secondary)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Telefon</label>
            <input
              type="tel"
              required
              placeholder="05XX XXX XX XX"
              value={form.musteriTelefon}
              onChange={(e) => set('musteriTelefon', e.target.value)}
              style={{ width: '100%', height: 44, padding: '0 12px', borderRadius: 10, border: '1.5px solid var(--color-border)', fontSize: 14, background: 'var(--color-bg-muted)', color: 'var(--color-text)', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
        </div>

        {/* Not */}
        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--color-text-secondary)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Not (isteğe bağlı)</label>
          <input
            type="text"
            placeholder="Eklemek istediğiniz not..."
            value={form.musteriNot}
            onChange={(e) => set('musteriNot', e.target.value)}
            style={{ width: '100%', height: 44, padding: '0 12px', borderRadius: 10, border: '1.5px solid var(--color-border)', fontSize: 14, background: 'var(--color-bg-muted)', color: 'var(--color-text)', outline: 'none', boxSizing: 'border-box' }}
          />
        </div>

        {hata && (
          <p style={{ fontSize: 13, color: '#EF4444', padding: '10px 12px', background: '#FEF2F2', borderRadius: 8 }}>{hata}</p>
        )}

        <button
          type="submit"
          disabled={yukleniyor}
          style={{
            width: '100%', height: 50, borderRadius: 12, border: 'none',
            background: yukleniyor ? '#ccc' : 'linear-gradient(135deg, #F27A1A, #E8650A)',
            color: 'white', fontWeight: 800, fontSize: 15,
            cursor: yukleniyor ? 'not-allowed' : 'pointer',
            boxShadow: yukleniyor ? 'none' : '0 4px 16px rgba(242,122,26,0.4)',
            transition: 'all 0.2s',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
        >
          {yukleniyor ? (
            <>
              <span style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
              İşleniyor...
            </>
          ) : (
            '📅 Randevu Onayla'
          )}
        </button>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </form>
  )
}
