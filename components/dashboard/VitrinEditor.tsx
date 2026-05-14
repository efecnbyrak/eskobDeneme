'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useToast } from '@/components/ui/Toast'
import type { Esnaf } from '@/types'

interface VitrinEditorProps {
  esnaf: Esnaf
}

export function VitrinEditor({ esnaf }: VitrinEditorProps) {
  const { toast } = useToast()
  const [yukleniyor, setYukleniyor] = useState(false)
  const [form, setForm] = useState({
    whatsapp: esnaf.whatsapp || '',
    instagram: esnaf.instagram || '',
    website: esnaf.website || '',
    fotograflar: esnaf.fotograflar || [],
  })
  const [yeniFoto, setYeniFoto] = useState('')
  const [fotoModalAcik, setFotoModalAcik] = useState(false)

  async function handleKaydet() {
    setYukleniyor(true)
    try {
      const res = await fetch(`/api/esnaf/${esnaf.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) toast('Vitrin güncellendi!', 'success')
      else toast('Bir hata oluştu.', 'error')
    } finally {
      setYukleniyor(false)
    }
  }

  function fotoEkle() {
    const url = yeniFoto.trim()
    if (!url) return
    setForm((p) => ({ ...p, fotograflar: [...p.fotograflar, url] }))
    setYeniFoto('')
    setFotoModalAcik(false)
  }

  function fotoCikar(idx: number) {
    setForm((p) => ({ ...p, fotograflar: p.fotograflar.filter((_, i) => i !== idx) }))
  }

  return (
    <div className="space-y-8">
      {/* Sosyal Medya Bağlantıları */}
      <div>
        <h3 className="font-semibold text-sm mb-4" style={{ color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Sosyal Medya Bağlantıları
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Instagram URL"
            value={form.instagram}
            placeholder="https://instagram.com/kullaniciadiniz"
            onChange={(e) => setForm((p) => ({ ...p, instagram: e.target.value }))}
          />
          <Input
            label="WhatsApp URL"
            value={form.whatsapp}
            placeholder="https://wa.me/905XXXXXXXXX"
            onChange={(e) => setForm((p) => ({ ...p, whatsapp: e.target.value }))}
          />
          <Input
            label="Website URL"
            value={form.website}
            placeholder="https://siteniz.com"
            onChange={(e) => setForm((p) => ({ ...p, website: e.target.value }))}
          />
        </div>
      </div>

      {/* Vitrin Görselleri */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-sm" style={{ color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Vitrin Görselleri
          </h3>
          <Button size="sm" onClick={() => setFotoModalAcik(true)}>
            + Görsel Ekle
          </Button>
        </div>

        {form.fotograflar.length === 0 ? (
          <div
            className="border-2 border-dashed border-[var(--color-border)] rounded-[var(--radius-lg)] p-12 text-center"
            style={{ background: 'var(--color-bg-muted)' }}
          >
            <div style={{ fontSize: 40, marginBottom: 12 }}>🖼️</div>
            <p className="text-sm font-medium mb-1">Henüz görsel eklenmedi</p>
            <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
              Vitrinize fotoğraf veya video bağlantısı ekleyerek müşterilerin dikkatini çekin.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {form.fotograflar.map((url, idx) => (
              <div key={idx} className="relative group rounded-[var(--radius-md)] overflow-hidden border border-[var(--color-border)]" style={{ aspectRatio: '1' }}>
                <img
                  src={url}
                  alt={`Görsel ${idx + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"%3E%3Crect width="100" height="100" fill="%23f3f4f6"/%3E%3Ctext x="50" y="55" text-anchor="middle" fill="%239ca3af" font-size="12"%3EGörsel Yok%3C/text%3E%3C/svg%3E'
                  }}
                />
                <button
                  onClick={() => fotoCikar(idx)}
                  className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Görseli kaldır"
                >
                  ×
                </button>
              </div>
            ))}
            <button
              onClick={() => setFotoModalAcik(true)}
              className="rounded-[var(--radius-md)] border-2 border-dashed border-[var(--color-border)] flex flex-col items-center justify-center gap-2 text-[var(--color-text-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
              style={{ aspectRatio: '1' }}
            >
              <span style={{ fontSize: 24 }}>+</span>
              <span className="text-xs">Ekle</span>
            </button>
          </div>
        )}
      </div>

      {/* Kaydet */}
      <Button onClick={handleKaydet} loading={yukleniyor}>
        Değişiklikleri Kaydet
      </Button>

      {/* Görsel Ekleme Modalı */}
      {fotoModalAcik && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={() => setFotoModalAcik(false)}
        >
          <div
            style={{ background: 'white', borderRadius: 20, padding: '32px 28px', maxWidth: 440, width: '90%', boxShadow: '0 24px 64px rgba(0,0,0,0.18)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, color: 'var(--color-text)' }}>Görsel URL Ekle</h3>
            <div className="flex flex-col gap-3">
              <Input
                label="Görsel veya Video URL"
                value={yeniFoto}
                placeholder="https://example.com/gorsel.jpg"
                onChange={(e) => setYeniFoto(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fotoEkle()}
                autoFocus
              />
              <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                Fotoğraf veya video bağlantısını yapıştırın. (JPG, PNG, MP4 desteklenir)
              </p>
              <div className="flex gap-3 mt-2">
                <Button onClick={fotoEkle} className="flex-1">Ekle</Button>
                <Button variant="secondary" onClick={() => { setFotoModalAcik(false); setYeniFoto('') }} className="flex-1">İptal</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
