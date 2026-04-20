'use client'

import { useState } from 'react'

export function SifreForm() {
  const [yukleniyor, setYukleniyor] = useState(false)
  const [mesaj, setMesaj] = useState<{ tip: 'ok' | 'err'; metin: string } | null>(null)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setYukleniyor(true)
    setMesaj(null)

    const form = e.currentTarget
    const formData = new FormData(form)
    const eski = formData.get('eski') as string
    const yeni = formData.get('yeni') as string
    const yeniTekrar = formData.get('yeniTekrar') as string

    if (yeni.length < 6) {
      setMesaj({ tip: 'err', metin: 'Yeni şifre en az 6 karakter olmalı.' })
      setYukleniyor(false)
      return
    }
    if (yeni !== yeniTekrar) {
      setMesaj({ tip: 'err', metin: 'Yeni şifreler eşleşmiyor.' })
      setYukleniyor(false)
      return
    }

    try {
      const res = await fetch('/api/user/sifre', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eski, yeni }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err?.error ?? 'Şifre güncellenemedi.')
      }
      setMesaj({ tip: 'ok', metin: 'Şifreniz güncellendi.' })
      form.reset()
    } catch (err) {
      setMesaj({
        tip: 'err',
        metin: err instanceof Error ? err.message : 'Bir hata oluştu.',
      })
    } finally {
      setYukleniyor(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    height: 48,
    padding: '0 16px',
    background: 'var(--color-bg-muted)',
    border: '2px solid transparent',
    borderRadius: 12,
    fontSize: 14,
    outline: 'none',
  }

  return (
    <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 420 }}>
      <div>
        <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
          Mevcut Şifre
        </label>
        <input name="eski" type="password" required style={inputStyle} />
      </div>
      <div>
        <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
          Yeni Şifre
        </label>
        <input name="yeni" type="password" required minLength={6} style={inputStyle} />
      </div>
      <div>
        <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
          Yeni Şifre (Tekrar)
        </label>
        <input name="yeniTekrar" type="password" required minLength={6} style={inputStyle} />
      </div>

      {mesaj && (
        <div
          style={{
            padding: '12px 16px',
            borderRadius: 12,
            fontSize: 14,
            fontWeight: 500,
            background: mesaj.tip === 'ok' ? '#DCFCE7' : '#FEE2E2',
            color: mesaj.tip === 'ok' ? '#166534' : '#991B1B',
            border: `1px solid ${mesaj.tip === 'ok' ? '#86EFAC' : '#FCA5A5'}`,
          }}
        >
          {mesaj.metin}
        </div>
      )}

      <button
        type="submit"
        disabled={yukleniyor}
        style={{
          alignSelf: 'flex-start',
          padding: '12px 32px',
          fontSize: 15,
          fontWeight: 700,
          background: 'var(--color-primary)',
          color: 'white',
          borderRadius: 12,
          border: 'none',
          cursor: yukleniyor ? 'wait' : 'pointer',
          opacity: yukleniyor ? 0.6 : 1,
        }}
      >
        {yukleniyor ? 'Kaydediliyor…' : 'Şifreyi Değiştir'}
      </button>
    </form>
  )
}
