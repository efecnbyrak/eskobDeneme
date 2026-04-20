'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/Input'

type Props = {
  kullanici: {
    id: string
    email: string
    ad: string
    soyad: string
    telefon: string | null
    avatarUrl: string | null
  }
}

export function ProfilForm({ kullanici }: Props) {
  const router = useRouter()
  const [yukleniyor, setYukleniyor] = useState(false)
  const [mesaj, setMesaj] = useState<{ tip: 'ok' | 'err'; metin: string } | null>(null)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setYukleniyor(true)
    setMesaj(null)

    const formData = new FormData(e.currentTarget)
    const data = {
      ad: (formData.get('ad') as string).trim(),
      soyad: (formData.get('soyad') as string).trim(),
      telefon: (formData.get('telefon') as string).replace(/\s+/g, '') || null,
    }

    try {
      const res = await fetch('/api/user/profil', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err?.error ?? 'Güncelleme başarısız.')
      }
      setMesaj({ tip: 'ok', metin: 'Profil güncellendi.' })
      router.refresh()
    } catch (err) {
      setMesaj({
        tip: 'err',
        metin: err instanceof Error ? err.message : 'Bir hata oluştu.',
      })
    } finally {
      setYukleniyor(false)
    }
  }

  return (
    <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Input label="Ad" name="ad" defaultValue={kullanici.ad} required />
        <Input label="Soyad" name="soyad" defaultValue={kullanici.soyad} required />
      </div>
      <Input
        label="E-posta"
        name="email"
        type="email"
        defaultValue={kullanici.email}
        disabled
      />
      <Input
        label="Telefon"
        name="telefon"
        type="tel"
        defaultValue={kullanici.telefon ?? ''}
        placeholder="05XX XXX XX XX"
      />

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
        {yukleniyor ? 'Kaydediliyor…' : 'Kaydet'}
      </button>
    </form>
  )
}
