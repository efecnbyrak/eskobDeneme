'use client'

import { useState, useRef } from 'react'
import { Card, CardBody } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useToast } from '@/components/ui/Toast'
import { useTema } from '@/components/dashboard/ThemeProvider'

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
  bekleyenIsletmeAdi: string | null
  telefon: string
  aciklama: string
  kapakFoto: string
  logoUrl: string
}

function FotoYukle({ label, deger, onDegis }: { label: string; deger: string; onDegis: (url: string) => void }) {
  const { toast } = useToast()
  const [yukleniyor, setYukleniyor] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleDosya(e: React.ChangeEvent<HTMLInputElement>) {
    const dosya = e.target.files?.[0]
    if (!dosya) return
    setYukleniyor(true)
    try {
      const fd = new FormData()
      fd.append('file', dosya)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      if (res.ok) {
        const data = await res.json()
        onDegis(data.url)
        toast(`${label} yüklendi!`, 'success')
      } else {
        const err = await res.json().catch(() => ({}))
        toast(err?.error || 'Yükleme başarısız.', 'error')
      }
    } finally {
      setYukleniyor(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium">{label}</label>
      <div className="flex items-center gap-3">
        {deger && (
          <img src={deger} alt={label} className="w-12 h-12 rounded-lg object-cover border border-[var(--color-border)] shrink-0" />
        )}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={yukleniyor}
          className="px-4 py-2 text-sm border border-[var(--color-border)] rounded-[var(--radius-md)] hover:bg-[var(--color-bg-muted)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {yukleniyor ? 'Yükleniyor...' : 'Dosya Seç'}
        </button>
        {deger && (
          <span className="text-xs text-[var(--color-text-secondary)] truncate max-w-[120px]" title={deger}>Fotoğraf eklendi</span>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleDosya}
        />
      </div>
    </div>
  )
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

// Telefon formatı: 11 rakamı "XXXX XXX XX XX" formatına çevirir
function telefonFormatla(rakamlar: string): string {
  const r = rakamlar.replace(/\D/g, '').slice(0, 11)
  if (r.length <= 4) return r
  if (r.length <= 7) return `${r.slice(0, 4)} ${r.slice(4)}`
  if (r.length <= 9) return `${r.slice(0, 4)} ${r.slice(4, 7)} ${r.slice(7)}`
  return `${r.slice(0, 4)} ${r.slice(4, 7)} ${r.slice(7, 9)} ${r.slice(9)}`
}

const TEMALAR: { key: 'varsayilan' | 'gece' | 'zumrut' | 'gul'; ad: string; renk: string; ikinci: string }[] = [
  { key: 'varsayilan', ad: 'Varsayılan', renk: '#4f46e5', ikinci: '#e0e7ff' },
  { key: 'gece', ad: 'Gece', renk: '#7c3aed', ikinci: '#ede9fe' },
  { key: 'zumrut', ad: 'Zümrüt', renk: '#059669', ikinci: '#d1fae5' },
  { key: 'gul', ad: 'Gül', renk: '#e11d48', ikinci: '#ffe4e6' },
]

export function AyarlarClient({ kullanici, esnaf }: { kullanici: KullaniciProps; esnaf: EsnafProps | null }) {
  const { toast } = useToast()
  const { tema, temaDegistir } = useTema()

  // Hesap Bilgileri state
  const [hesapDuzenle, setHesapDuzenle] = useState(false)
  const [hesapForm, setHesapForm] = useState({ ad: kullanici.ad, soyad: kullanici.soyad })
  const [hesapYukleniyor, setHesapYukleniyor] = useState(false)

  // İşletmem state
  const [isletmeDuzenle, setIsletmeDuzenle] = useState(false)
  const [isletmeForm, setIsletmeForm] = useState({
    isletmeAdi: esnaf?.isletmeAdi ?? '',
    telefon: telefonFormatla(esnaf?.telefon ?? ''),
    aciklama: esnaf?.aciklama ?? '',
    kapakFoto: esnaf?.kapakFoto ?? '',
    logoUrl: esnaf?.logoUrl ?? '',
  })
  const [isletmeYukleniyor, setIsletmeYukleniyor] = useState(false)
  const [bekleyenIsletmeAdi, setBekleyenIsletmeAdi] = useState(esnaf?.bekleyenIsletmeAdi ?? null)

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
      // Telefonu kayıt öncesi boşluksuz gönder
      const telefonHam = isletmeForm.telefon.replace(/\s/g, '')
      const res = await fetch(`/api/esnaf/${esnaf.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...isletmeForm, telefon: telefonHam }),
      })
      if (res.ok) {
        const data = await res.json()
        if (data?.data?.bekleyenIsletmeAdi) {
          setBekleyenIsletmeAdi(data.data.bekleyenIsletmeAdi)
          toast('İşletme adı değişikliği onay için gönderildi.', 'success')
        } else {
          toast('İşletme bilgileri güncellendi!', 'success')
        }
        setIsletmeDuzenle(false)
      } else {
        toast('Bir hata oluştu.', 'error')
      }
    } finally {
      setIsletmeYukleniyor(false)
    }
  }

  function handleTelefonDegisim(e: React.ChangeEvent<HTMLInputElement>) {
    const formatted = telefonFormatla(e.target.value)
    setIsletmeForm((p) => ({ ...p, telefon: formatted }))
  }

  return (
    <div className="space-y-6 max-w-lg">
      {/* Hesap Bilgileri */}
      <Card>
        <div className="px-6 py-4 border-b border-[var(--color-border)] flex items-center justify-between">
          <h3 className="font-semibold" style={{ fontFamily: 'var(--font-display)' }}>Hesap Bilgileri</h3>
          {!hesapDuzenle && (
            <Button variant="secondary" size="sm" onClick={() => setHesapDuzenle(true)}>Değiştir</Button>
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
              {/* E-posta — altyapı hazır, UI şimdilik disabled */}
              <div className="flex items-center justify-between text-sm py-1">
                <span className="text-[var(--color-text-secondary)]">E-posta</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-[var(--color-text-secondary)]">{maskeleEmail(kullanici.email)}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200">🔒 Yakında</span>
                </div>
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
                {/* Madde 1 fix: hesapForm state'inden göster, prop'tan değil */}
                <span className="font-medium">{hesapForm.ad} {hesapForm.soyad}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-text-secondary)]">E-posta</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{maskeleEmail(kullanici.email)}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200">🔒 Yakında</span>
                </div>
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
              <Button variant="secondary" size="sm" onClick={() => setIsletmeDuzenle(true)}>Değiştir</Button>
            )}
          </div>
          <CardBody>
            {isletmeDuzenle ? (
              <div className="space-y-4">
                <div>
                  <Input
                    label="İşletme Adı"
                    value={isletmeForm.isletmeAdi}
                    onChange={(e) => setIsletmeForm((p) => ({ ...p, isletmeAdi: e.target.value }))}
                  />
                  <p className="text-xs text-amber-600 mt-1">⚠️ İşletme adı değişikliği Süper Admin onayı gerektirir.</p>
                </div>
                <div>
                  <Input
                    label="Telefon"
                    value={isletmeForm.telefon}
                    placeholder="0533 045 00 92"
                    maxLength={14}
                    onChange={handleTelefonDegisim}
                    inputMode="numeric"
                  />
                  <p className="text-xs text-slate-400 mt-1">En fazla 11 haneli numara giriniz.</p>
                </div>
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
                <FotoYukle
                  label="Kapak Fotoğrafı"
                  deger={isletmeForm.kapakFoto}
                  onDegis={(url) => setIsletmeForm((p) => ({ ...p, kapakFoto: url }))}
                />
                <FotoYukle
                  label="Logo"
                  deger={isletmeForm.logoUrl}
                  onDegis={(url) => setIsletmeForm((p) => ({ ...p, logoUrl: url }))}
                />
                <div className="flex gap-3 pt-1">
                  <Button onClick={isletmeKaydet} loading={isletmeYukleniyor} className="flex-1">Kaydet</Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setIsletmeDuzenle(false)
                      setIsletmeForm({
                        isletmeAdi: esnaf.isletmeAdi,
                        telefon: telefonFormatla(esnaf.telefon),
                        aciklama: esnaf.aciklama,
                        kapakFoto: esnaf.kapakFoto,
                        logoUrl: esnaf.logoUrl,
                      })
                    }}
                    className="flex-1"
                  >
                    İptal
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-[var(--color-text-secondary)]">İşletme Adı</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{isletmeForm.isletmeAdi || '—'}</span>
                    {bekleyenIsletmeAdi && bekleyenIsletmeAdi !== isletmeForm.isletmeAdi && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
                        Onay bekleniyor: {bekleyenIsletmeAdi}
                      </span>
                    )}
                  </div>
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

      {/* Görünüm / Renk Teması */}
      <Card>
        <div className="px-6 py-4 border-b border-[var(--color-border)]">
          <h3 className="font-semibold" style={{ fontFamily: 'var(--font-display)' }}>Görünüm</h3>
          <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">Panel renk temanızı kişiselleştirin</p>
        </div>
        <CardBody>
          <div className="grid grid-cols-2 gap-3">
            {TEMALAR.map((t) => {
              const aktif = tema === t.key
              return (
                <button
                  key={t.key}
                  onClick={() => temaDegistir(t.key)}
                  className="flex items-center gap-3 p-3 rounded-[var(--radius-md)] border-2 transition-all text-left"
                  style={{
                    borderColor: aktif ? t.renk : 'var(--color-border)',
                    background: aktif ? t.ikinci : 'transparent',
                  }}
                >
                  <div className="flex gap-1 shrink-0">
                    <div className="w-4 h-4 rounded-full" style={{ background: t.renk }} />
                    <div className="w-4 h-4 rounded-full" style={{ background: t.ikinci }} />
                  </div>
                  <span className="text-sm font-medium" style={{ color: aktif ? t.renk : 'var(--color-text)' }}>
                    {t.ad}
                  </span>
                  {aktif && (
                    <svg className="w-4 h-4 ml-auto shrink-0" viewBox="0 0 16 16" fill="none" style={{ color: t.renk }}>
                      <path d="M3 8l3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
              )
            })}
          </div>
        </CardBody>
      </Card>

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
                  <ul className="space-y-1 mb-3">
                    {p.ozellikler.map((o) => (
                      <li key={o} className="text-xs text-[var(--color-text-secondary)] flex items-center gap-1.5">
                        <span className="text-green-600">✓</span> {o}
                      </li>
                    ))}
                  </ul>
                  {!aktif && p.key !== 'UCRETSIZ' && (
                    <a
                      href={`/isletme/panel/odeme?plan=${p.key}`}
                      className="block w-full text-center text-xs font-semibold py-2 px-3 rounded-[var(--radius-md)] transition-all"
                      style={{ background: 'var(--color-primary)', color: '#fff' }}
                    >
                      Şimdi Yükselt →
                    </a>
                  )}
                </div>
              )
            })}
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
