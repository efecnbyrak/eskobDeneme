'use client'

import { useState } from 'react'
import { useToast } from '@/components/ui/Toast'
import { Input } from '@/components/ui/Input'

interface Props {
  initialData: {
    ad: string
    soyad: string
    email: string
    telefon: string | null
  }
}

const cardStyle: React.CSSProperties = {
  background: 'white',
  border: '1px solid #EBEBEB',
  borderRadius: 16,
  padding: 'clamp(20px, 4vw, 32px)',
  marginBottom: 20,
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 13,
  fontWeight: 600,
  color: '#555',
  marginBottom: 6,
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  height: 44,
  padding: '0 14px',
  background: '#F5F6F8',
  border: '2px solid transparent',
  borderRadius: 10,
  fontSize: 14,
  outline: 'none',
  transition: 'all 0.2s',
  boxSizing: 'border-box',
}

const btnStyle = (loading: boolean): React.CSSProperties => ({
  height: 44,
  padding: '0 24px',
  borderRadius: 10,
  border: 'none',
  background: loading ? '#F7931E' : '#F7620A',
  color: 'white',
  fontWeight: 700,
  fontSize: 14,
  cursor: loading ? 'wait' : 'pointer',
  opacity: loading ? 0.7 : 1,
  transition: 'all 0.2s',
})

export function AyarlarForm({ initialData }: Props) {
  const { toast } = useToast()

  const [profil, setProfil] = useState({
    ad: initialData.ad,
    soyad: initialData.soyad,
    email: initialData.email,
    telefon: initialData.telefon ?? '',
  })
  const [profilYukleniyor, setProfilYukleniyor] = useState(false)

  const [sifre, setSifre] = useState({ eski: '', yeni: '', yeniTekrar: '' })
  const [sifreYukleniyor, setSifreYukleniyor] = useState(false)

  async function profilKaydet(e: React.FormEvent) {
    e.preventDefault()
    setProfilYukleniyor(true)
    try {
      const res = await fetch('/api/user/profil', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ad: profil.ad.trim(),
          soyad: profil.soyad.trim(),
          email: profil.email.trim().toLowerCase(),
          telefon: profil.telefon.trim() || null,
        }),
      })
      const d = await res.json()
      if (!res.ok) throw new Error(d.message || 'Bir hata oluştu.')
      toast('Profil bilgileri güncellendi ✓', 'success')
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Bir hata oluştu.', 'error')
    } finally {
      setProfilYukleniyor(false)
    }
  }

  async function sifreDegistir(e: React.FormEvent) {
    e.preventDefault()
    if (sifre.yeni !== sifre.yeniTekrar) {
      toast('Yeni şifreler eşleşmiyor.', 'error')
      return
    }
    setSifreYukleniyor(true)
    try {
      const res = await fetch('/api/user/sifre', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eski: sifre.eski, yeni: sifre.yeni }),
      })
      const d = await res.json()
      if (!res.ok) throw new Error(d.message || 'Bir hata oluştu.')
      toast('Şifre başarıyla değiştirildi ✓', 'success')
      setSifre({ eski: '', yeni: '', yeniTekrar: '' })
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Bir hata oluştu.', 'error')
    } finally {
      setSifreYukleniyor(false)
    }
  }

  return (
    <div>
      {/* Profil Bilgileri */}
      <div style={cardStyle}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: '#111', marginBottom: 20 }}>
          Profil Bilgileri
        </h2>
        <form onSubmit={profilKaydet}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 16 }}>
            <div>
              <label style={labelStyle}>Ad</label>
              <input
                style={inputStyle}
                value={profil.ad}
                onChange={(e) => setProfil((p) => ({ ...p, ad: e.target.value }))}
                required
                minLength={2}
                onFocus={(e) => { e.currentTarget.style.borderColor = '#F7620A'; e.currentTarget.style.background = 'white' }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.background = '#F5F6F8' }}
              />
            </div>
            <div>
              <label style={labelStyle}>Soyad</label>
              <input
                style={inputStyle}
                value={profil.soyad}
                onChange={(e) => setProfil((p) => ({ ...p, soyad: e.target.value }))}
                required
                minLength={2}
                onFocus={(e) => { e.currentTarget.style.borderColor = '#F7620A'; e.currentTarget.style.background = 'white' }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.background = '#F5F6F8' }}
              />
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <Input
              label="E-posta"
              type="email"
              value={profil.email}
              onChange={(e) => setProfil((p) => ({ ...p, email: e.target.value }))}
              required
            />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Telefon (opsiyonel)</label>
            <input
              style={inputStyle}
              type="tel"
              value={profil.telefon}
              onChange={(e) => setProfil((p) => ({ ...p, telefon: e.target.value }))}
              placeholder="05XX XXX XX XX"
              onFocus={(e) => { e.currentTarget.style.borderColor = '#F7620A'; e.currentTarget.style.background = 'white' }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.background = '#F5F6F8' }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" disabled={profilYukleniyor} style={btnStyle(profilYukleniyor)}>
              {profilYukleniyor ? 'Kaydediliyor…' : 'Kaydet'}
            </button>
          </div>
        </form>
      </div>

      {/* Şifre Değiştir */}
      <div style={cardStyle}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: '#111', marginBottom: 4 }}>
          Şifre Değiştir
        </h2>
        <p style={{ fontSize: 13, color: '#888', marginBottom: 20 }}>
          Yeni şifreniz: en az 8 karakter, büyük/küçük harf, rakam ve sembol içermeli.
        </p>
        <form onSubmit={sifreDegistir}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 20 }}>
            <div>
              <label style={labelStyle}>Mevcut Şifre</label>
              <input
                style={inputStyle}
                type="password"
                value={sifre.eski}
                onChange={(e) => setSifre((s) => ({ ...s, eski: e.target.value }))}
                required
                placeholder="••••••••"
                onFocus={(e) => { e.currentTarget.style.borderColor = '#F7620A'; e.currentTarget.style.background = 'white' }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.background = '#F5F6F8' }}
              />
            </div>
            <div>
              <label style={labelStyle}>Yeni Şifre</label>
              <input
                style={inputStyle}
                type="password"
                value={sifre.yeni}
                onChange={(e) => setSifre((s) => ({ ...s, yeni: e.target.value }))}
                required
                minLength={8}
                placeholder="••••••••"
                onFocus={(e) => { e.currentTarget.style.borderColor = '#F7620A'; e.currentTarget.style.background = 'white' }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.background = '#F5F6F8' }}
              />
            </div>
            <div>
              <label style={labelStyle}>Yeni Şifre (Tekrar)</label>
              <input
                style={inputStyle}
                type="password"
                value={sifre.yeniTekrar}
                onChange={(e) => setSifre((s) => ({ ...s, yeniTekrar: e.target.value }))}
                required
                minLength={8}
                placeholder="••••••••"
                onFocus={(e) => { e.currentTarget.style.borderColor = '#F7620A'; e.currentTarget.style.background = 'white' }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.background = '#F5F6F8' }}
              />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" disabled={sifreYukleniyor} style={btnStyle(sifreYukleniyor)}>
              {sifreYukleniyor ? 'Değiştiriliyor…' : 'Şifreyi Değiştir'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
