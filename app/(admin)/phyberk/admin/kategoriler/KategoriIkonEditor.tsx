'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'

interface Props {
  id: number
  ad: string
  slug: string
  ikon: string
  ikonUrl?: string | null
  renk: string
  esnafSayisi: number
}

export function KategoriIkonEditor({ id, ad, slug, ikon, ikonUrl: initialIkonUrl, renk, esnafSayisi }: Props) {
  const [ikonUrl, setIkonUrl] = useState<string | null>(initialIkonUrl ?? null)
  const [yukleniyor, setYukleniyor] = useState(false)
  const [hata, setHata] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleDosya(e: React.ChangeEvent<HTMLInputElement>) {
    const dosya = e.target.files?.[0]
    if (!dosya) return

    const izinliTipler = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml']
    if (!izinliTipler.includes(dosya.type)) {
      setHata('Sadece PNG, JPG, WebP veya SVG yüklenebilir.')
      return
    }
    if (dosya.size > 2 * 1024 * 1024) {
      setHata('Dosya boyutu 2 MB\'ı geçemez.')
      return
    }

    setHata(null)
    setYukleniyor(true)

    try {
      // Presigned URL veya direct upload — şimdilik base64 önizleme ile PATCH
      const reader = new FileReader()
      reader.onload = async (ev) => {
        const dataUrl = ev.target?.result as string

        // Upload API — /api/upload varsa oraya gönder
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ dataUrl, fileName: dosya.name, contentType: dosya.type }),
        })

        let uploadedUrl: string = dataUrl

        if (uploadRes.ok) {
          const uploadData = await uploadRes.json()
          uploadedUrl = uploadData.url ?? dataUrl
        }

        // Kategori güncelle
        const res = await fetch(`/api/v1/categories/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ikonUrl: uploadedUrl }),
        })

        if (res.ok) {
          setIkonUrl(uploadedUrl)
        } else {
          setHata('Güncelleme başarısız.')
        }
        setYukleniyor(false)
      }
      reader.readAsDataURL(dosya)
    } catch {
      setHata('Bir hata oluştu.')
      setYukleniyor(false)
    }
  }

  async function handleSil() {
    setYukleniyor(true)
    setHata(null)
    const res = await fetch(`/api/v1/categories/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ikonUrl: null }),
    })
    if (res.ok) {
      setIkonUrl(null)
    } else {
      setHata('Silme başarısız.')
    }
    setYukleniyor(false)
  }

  return (
    <div
      style={{
        background: 'white',
        border: '1px solid var(--color-border)',
        borderRadius: 16,
        padding: 20,
        boxShadow: 'var(--shadow-card)',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
      }}
    >
      {/* İkon önizleme */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div
          style={{
            width: 56, height: 56, borderRadius: 14,
            background: `${renk}22`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 26, overflow: 'hidden', flexShrink: 0,
            border: '2px solid transparent',
            transition: 'border-color 0.2s',
          }}
        >
          {ikonUrl ? (
            <Image src={ikonUrl} alt={ad} width={40} height={40} style={{ objectFit: 'contain', width: 40, height: 40 }} />
          ) : (
            ikon
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ad}</h3>
          <p style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>/{slug}</p>
          <span style={{ marginTop: 6, display: 'inline-block', padding: '3px 10px', fontSize: 11, fontWeight: 700, background: 'var(--color-primary-light)', color: 'var(--color-primary)', borderRadius: 9999 }}>
            {esnafSayisi} işletme
          </span>
        </div>
      </div>

      {/* Durum */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: ikonUrl ? '#22C55E' : '#F59E0B', flexShrink: 0 }} />
        <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
          {ikonUrl ? 'Özel ikon yüklü' : 'Emoji ikon kullanılıyor (varsayılan)'}
        </span>
      </div>

      {/* Hata */}
      {hata && (
        <p style={{ fontSize: 12, color: '#EF4444', background: '#FEF2F2', padding: '8px 12px', borderRadius: 8 }}>{hata}</p>
      )}

      {/* Butonlar */}
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
          style={{ display: 'none' }}
          onChange={handleDosya}
        />
        <button
          onClick={() => inputRef.current?.click()}
          disabled={yukleniyor}
          style={{
            flex: 1, height: 38, fontSize: 13, fontWeight: 700,
            background: 'var(--color-primary)', color: 'white',
            border: 'none', borderRadius: 10, cursor: yukleniyor ? 'not-allowed' : 'pointer',
            opacity: yukleniyor ? 0.6 : 1, transition: 'opacity 0.2s',
          }}
        >
          {yukleniyor ? 'Yükleniyor...' : ikonUrl ? '🔄 Değiştir' : '📤 İkon Yükle'}
        </button>
        {ikonUrl && (
          <button
            onClick={handleSil}
            disabled={yukleniyor}
            style={{
              height: 38, padding: '0 14px', fontSize: 13, fontWeight: 600,
              background: '#FEF2F2', color: '#EF4444',
              border: '1px solid #FECACA', borderRadius: 10,
              cursor: yukleniyor ? 'not-allowed' : 'pointer',
              opacity: yukleniyor ? 0.6 : 1,
            }}
          >
            Sil
          </button>
        )}
      </div>
    </div>
  )
}
