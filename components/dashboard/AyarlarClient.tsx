'use client'

import { useState } from 'react'
import { Card, CardBody } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useToast } from '@/components/ui/Toast'

type Plan = 'UCRETSIZ' | 'STARTER' | 'PRO'

interface KullaniciProps {
  id: number
  ad: string
  soyad: string
  email: string
  plan: Plan
}

interface EsnafProps {
  id: number
  isletmeAdi: string
  telefon: string
  aciklama: string
  kapakFoto: string
  logoUrl: string
}

const PLAN_ADI: Record<Plan, string> = { UCRETSIZ: 'Silver', STARTER: 'Gold', PRO: 'Premium' }
const PLAN_RENK: Record<Plan, 'default' | 'info' | 'success'> = { UCRETSIZ: 'default', STARTER: 'info', PRO: 'success' }

const PLANLAR: { key: Plan; ad: string; fiyat: string; ozellikler: string[] }[] = [
  {
    key: 'UCRETSIZ',
    ad: 'Silver',
    fiyat: '₺0/ay',
    ozellikler: ['Sınırsız hizmet & fiyat listesi', 'Online randevu sistemi', 'Müşteri yorumları & puanlama', 'WhatsApp entegrasyonu'],
  },
  {
    key: 'STARTER',
    ad: 'Gold',
    fiyat: '₺200/ay',
    ozellikler: ['Silver\'ın tüm özellikleri', 'Öne çıkan listeleme', 'Gelişmiş analitik raporlar', 'SMS bildirim paketi (100/ay)'],
  },
  {
    key: 'PRO',
    ad: 'Premium',
    fiyat: '₺500/ay',
    ozellikler: ['Gold\'un tüm özellikleri', 'Öncelikli destek', 'Sınırsız SMS bildirimleri', 'Çoklu şube yönetimi'],
  },
]

function maskeleEmail(email: string) {
  const [yerel, domain] = email.split('@')
  if (yerel.length <= 3) return `${yerel[0]}***@${domain}`
  return `${yerel.slice(0, 3)}***@${domain}`
}

export function AyarlarClient({ kullanici, esnaf }: { kullanici: KullaniciProps; esnaf: EsnafProps | null }) {
  const { toast } = useToast()

  // Hesap Bilgileri state
  const [hesapDuzenle, setHesapDuzenle] = useState(false)
  const [hesapForm, setHesapForm] = useState({ ad: kullanici.ad, soyad: kullanici.soyad })
  const [hesapYukleniyor, setHesapYukleniyor] = useState(false)

  // İşletmem state
  const [isletmeDuzenle, setIsletmeDuzenle] = useState(false)
  const [isletmeForm, setIsletmeForm] = useState({
    isletmeAdi: esnaf?.isletmeAdi ?? '',
    telefon: esnaf?.telefon ?? '',
    aciklama: esnaf?.aciklama ?? '',
    kapakFoto: esnaf?.kapakFoto ?? '',
    logoUrl: esnaf?.logoUrl ?? '',
  })
  const [isletmeYukleniyor, setIsletmeYukleniyor] = useState(false)

  async function hesapKaydet() {
    setHesapYukleniyor(true)
    try {
      const res = await fetch('/api/kullanici/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(hesapForm),
      })
      if (res.ok) {
        toast('Hesap bilgileri güncellendi!', 'success')
        setHesapDuzenle(false)
      } else {
        const d = await res.json()
        toast(d.error || 'Bir hata oluştu.', 'error')
      }
    } finally {
      setHesapYukleniyor(false)
    }
  }

  async function isletmeKaydet() {
    if (!esnaf) return
    setIsletmeYukleniyor(true)
    try {
      const res = await fetch(`/api/esnaf/${esnaf.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isletmeForm),
      })
      if (res.ok) {
        toast('İşletme bilgileri güncellendi!', 'success')
        setIsletmeDuzenle(false)
      } else {
        toast('Bir hata oluştu.', 'error')
      }
    } finally {
      setIsletmeYukleniyor(false)
    }
  }

  return (
    <div className="space-y-6 max-w-lg">
      {/* Hesap Bilgileri */}
      <Card>
        <div className="px-6 py-4 border-b border-[var(--color-border)] flex items-center justify-between">
          <h3 className="font-semibold" style={{ fontFamily: 'var(--font-display)' }}>Hesap Bilgileri</h3>
          {!hesapDuzenle && (
            <Button variant="ghost" size="sm" onClick={() => setHesapDuzenle(true)}>Değiştir</Button>
          )}
        </div>
        <CardBody>
          {hesapDuzenle ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Ad"
                  value={hesapForm.ad}
                  onChange={(e) => setHesapForm((p) => ({ ...p, ad: e.target.value }))}
                />
                <Input
                  label="Soyad"
                  value={hesapForm.soyad}
                  onChange={(e) => setHesapForm((p) => ({ ...p, soyad: e.target.value }))}
                />
              </div>
              <div className="flex items-center justify-between text-sm py-1">
                <span className="text-[var(--color-text-secondary)]">E-posta</span>
                <span className="font-medium text-[var(--color-text-secondary)]">{maskeleEmail(kullanici.email)}</span>
              </div>
              <div className="flex gap-3 pt-1">
                <Button onClick={hesapKaydet} loading={hesapYukleniyor} className="flex-1">Kaydet</Button>
                <Button variant="secondary" onClick={() => { setHesapDuzenle(false); setHesapForm({ ad: kullanici.ad, soyad: kullanici.soyad }) }} className="flex-1">İptal</Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--color-text-secondary)]">Ad Soyad</span>
                <span className="font-medium">{kullanici.ad} {kullanici.soyad}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-text-secondary)]">E-posta</span>
                <span className="font-medium">{maskeleEmail(kullanici.email)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-text-secondary)]">Plan</span>
                <Badge variant={PLAN_RENK[kullanici.plan]}>{PLAN_ADI[kullanici.plan]}</Badge>
              </div>
            </div>
          )}
        </CardBody>
      </Card>

      {/* İşletmem */}
      {esnaf && (
        <Card>
          <div className="px-6 py-4 border-b border-[var(--color-border)] flex items-center justify-between">
            <h3 className="font-semibold" style={{ fontFamily: 'var(--font-display)' }}>İşletmem</h3>
            {!isletmeDuzenle && (
              <Button variant="ghost" size="sm" onClick={() => setIsletmeDuzenle(true)}>Değiştir</Button>
            )}
          </div>
          <CardBody>
            {isletmeDuzenle ? (
              <div className="space-y-4">
                <Input
                  label="İşletme Adı"
                  value={isletmeForm.isletmeAdi}
                  onChange={(e) => setIsletmeForm((p) => ({ ...p, isletmeAdi: e.target.value }))}
                />
                <Input
                  label="Telefon"
                  value={isletmeForm.telefon}
                  onChange={(e) => setIsletmeForm((p) => ({ ...p, telefon: e.target.value }))}
                />
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium">Açıklama</label>
                  <textarea
                    className="w-full px-4 py-2.5 text-sm border border-[var(--color-border)] rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)] resize-none"
                    rows={3}
                    maxLength={500}
                    value={isletmeForm.aciklama}
                    onChange={(e) => setIsletmeForm((p) => ({ ...p, aciklama: e.target.value }))}
                  />
                </div>
                <Input
                  label="Kapak Fotoğrafı URL"
                  value={isletmeForm.kapakFoto}
                  placeholder="https://example.com/kapak.jpg"
                  onChange={(e) => setIsletmeForm((p) => ({ ...p, kapakFoto: e.target.value }))}
                />
                <Input
                  label="Logo URL"
                  value={isletmeForm.logoUrl}
                  placeholder="https://example.com/logo.png"
                  onChange={(e) => setIsletmeForm((p) => ({ ...p, logoUrl: e.target.value }))}
                />
                <div className="flex gap-3 pt-1">
                  <Button onClick={isletmeKaydet} loading={isletmeYukleniyor} className="flex-1">Kaydet</Button>
                  <Button variant="secondary" onClick={() => { setIsletmeDuzenle(false); setIsletmeForm({ isletmeAdi: esnaf.isletmeAdi, telefon: esnaf.telefon, aciklama: esnaf.aciklama, kapakFoto: esnaf.kapakFoto, logoUrl: esnaf.logoUrl }) }} className="flex-1">İptal</Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-[var(--color-text-secondary)]">İşletme Adı</span>
                  <span className="font-medium">{isletmeForm.isletmeAdi || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--color-text-secondary)]">Telefon</span>
                  <span className="font-medium">{isletmeForm.telefon || '—'}</span>
                </div>
                {isletmeForm.aciklama && (
                  <div className="flex flex-col gap-1">
                    <span className="text-[var(--color-text-secondary)]">Açıklama</span>
                    <span className="font-medium text-xs leading-relaxed">{isletmeForm.aciklama}</span>
                  </div>
                )}
              </div>
            )}
          </CardBody>
        </Card>
      )}

      {/* Plan Yükselt */}
      <Card>
        <div className="px-6 py-4 border-b border-[var(--color-border)]">
          <h3 className="font-semibold" style={{ fontFamily: 'var(--font-display)' }}>Plan Yükselt</h3>
        </div>
        <CardBody>
          <div className="grid grid-cols-1 gap-3">
            {PLANLAR.map((p) => {
              const aktif = kullanici.plan === p.key
              return (
                <div
                  key={p.key}
                  className="border rounded-[var(--radius-lg)] p-4 transition-all"
                  style={{
                    borderColor: aktif ? 'var(--color-primary)' : 'var(--color-border)',
                    background: aktif ? 'rgba(26,39,68,0.04)' : 'transparent',
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                        style={{ borderColor: aktif ? 'var(--color-primary)' : 'var(--color-border)', background: aktif ? 'var(--color-primary)' : 'transparent' }}
                      >
                        {aktif && (
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                      <span className="font-bold text-[var(--color-primary)]">{p.ad}</span>
                      {aktif && <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: 'var(--color-primary)', color: 'white' }}>Aktif Plan</span>}
                    </div>
                    <span className="text-lg font-bold">{p.fiyat}</span>
                  </div>
                  <ul className="space-y-1">
                    {p.ozellikler.map((o) => (
                      <li key={o} className="text-xs text-[var(--color-text-secondary)] flex items-center gap-1.5">
                        <span className="text-green-600">✓</span> {o}
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
          <p className="text-xs text-[var(--color-text-secondary)] mt-4 text-center">
            Ödeme sistemi yakında aktif olacak.
          </p>
        </CardBody>
      </Card>
    </div>
  )
}
