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
  instagram: string
  facebook: string
  tiktok: string
  youtube: string
  bildirimAyarlari: Record<string, boolean> | null
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

const BILDIRIMLER = [
  { key: 'yeniRandevu', label: 'Yeni Randevu', aciklama: 'Yeni randevu alındığında e-posta gönder' },
  { key: 'randevuIptali', label: 'Randevu İptali', aciklama: 'Randevu iptal edildiğinde e-posta gönder' },
  { key: 'yeniYorum', label: 'Yeni Yorum', aciklama: 'Yeni müşteri yorumu geldiğinde e-posta gönder' },
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

  // Şifre Değiştir state
  const [sifreDuzenle, setSifreDuzenle] = useState(false)
  const [sifreForm, setSifreForm] = useState({ mevcutSifre: '', yeniSifre: '', tekrarSifre: '' })
  const [sifreYukleniyor, setSifreYukleniyor] = useState(false)

  // Bildirim Ayarları state
  const [bildirimForm, setBildirimForm] = useState<Record<string, boolean>>(
    esnaf?.bildirimAyarlari ?? { yeniRandevu: true, randevuIptali: true, yeniYorum: false }
  )
  const [bildirimYukleniyor, setBildirimYukleniyor] = useState(false)

  // Sosyal Medya state
  const [sosyalDuzenle, setSosyalDuzenle] = useState(false)
  const [sosyalForm, setSosyalForm] = useState({
    instagram: esnaf?.instagram ?? '',
    facebook: esnaf?.facebook ?? '',
    tiktok: esnaf?.tiktok ?? '',
    youtube: esnaf?.youtube ?? '',
  })
  const [sosyalYukleniyor, setSosyalYukleniyor] = useState(false)

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

  async function sifreKaydet() {
    if (sifreForm.yeniSifre !== sifreForm.tekrarSifre) {
      toast('Yeni şifreler eşleşmiyor.', 'error')
      return
    }
    if (sifreForm.yeniSifre.length < 6) {
      toast('Yeni şifre en az 6 karakter olmalıdır.', 'error')
      return
    }
    setSifreYukleniyor(true)
    try {
      const res = await fetch('/api/kullanici/sifre', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mevcutSifre: sifreForm.mevcutSifre, yeniSifre: sifreForm.yeniSifre }),
      })
      if (res.ok) {
        toast('Şifre başarıyla güncellendi!', 'success')
        setSifreForm({ mevcutSifre: '', yeniSifre: '', tekrarSifre: '' })
        setSifreDuzenle(false)
      } else {
        const d = await res.json()
        toast(d.error || 'Bir hata oluştu.', 'error')
      }
    } finally {
      setSifreYukleniyor(false)
    }
  }

  async function bildirimKaydet(yeniDegerler: Record<string, boolean>) {
    if (!esnaf) return
    setBildirimYukleniyor(true)
    try {
      const res = await fetch(`/api/esnaf/${esnaf.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bildirimAyarlari: yeniDegerler }),
      })
      if (res.ok) {
        toast('Bildirim ayarları kaydedildi.', 'success')
      } else {
        toast('Bir hata oluştu.', 'error')
      }
    } finally {
      setBildirimYukleniyor(false)
    }
  }

  async function sosyalKaydet() {
    if (!esnaf) return
    setSosyalYukleniyor(true)
    try {
      const res = await fetch(`/api/esnaf/${esnaf.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sosyalForm),
      })
      if (res.ok) {
        toast('Sosyal medya bağlantıları kaydedildi!', 'success')
        setSosyalDuzenle(false)
      } else {
        toast('Bir hata oluştu.', 'error')
      }
    } finally {
      setSosyalYukleniyor(false)
    }
  }

  return (
    <div className="space-y-6 w-full">

      {/* ── Üst Grid: Sol + Sağ sütun ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

        {/* Sol Sütun */}
        <div className="space-y-6">

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

          {/* Şifre Değiştir */}
          <Card>
            <div className="px-6 py-4 border-b border-[var(--color-border)] flex items-center justify-between">
              <div>
                <h3 className="font-semibold" style={{ fontFamily: 'var(--font-display)' }}>Şifre Değiştir</h3>
                <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">Hesap güvenliğiniz için şifrenizi düzenli değiştirin</p>
              </div>
              {!sifreDuzenle && (
                <Button variant="secondary" size="sm" onClick={() => setSifreDuzenle(true)}>Değiştir</Button>
              )}
            </div>
            <CardBody>
              {sifreDuzenle ? (
                <div className="space-y-3">
                  <Input
                    label="Mevcut Şifre"
                    type="password"
                    value={sifreForm.mevcutSifre}
                    onChange={(e) => setSifreForm((p) => ({ ...p, mevcutSifre: e.target.value }))}
                    placeholder="••••••••"
                  />
                  <Input
                    label="Yeni Şifre"
                    type="password"
                    value={sifreForm.yeniSifre}
                    onChange={(e) => setSifreForm((p) => ({ ...p, yeniSifre: e.target.value }))}
                    placeholder="En az 6 karakter"
                  />
                  <Input
                    label="Yeni Şifre Tekrar"
                    type="password"
                    value={sifreForm.tekrarSifre}
                    onChange={(e) => setSifreForm((p) => ({ ...p, tekrarSifre: e.target.value }))}
                    placeholder="••••••••"
                  />
                  <div className="flex gap-3 pt-1">
                    <Button onClick={sifreKaydet} loading={sifreYukleniyor} className="flex-1">Kaydet</Button>
                    <Button variant="secondary" onClick={() => { setSifreDuzenle(false); setSifreForm({ mevcutSifre: '', yeniSifre: '', tekrarSifre: '' }) }} className="flex-1">İptal</Button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-[var(--color-text-secondary)]">Şifrenizi değiştirmek için yukarıdaki butona tıklayın.</p>
              )}
            </CardBody>
          </Card>

        </div>{/* /Sol Sütun */}

        {/* Sağ Sütun */}
        <div className="space-y-6">

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

          {/* Bildirim Ayarları */}
          {esnaf && (
            <Card>
              <div className="px-6 py-4 border-b border-[var(--color-border)]">
                <h3 className="font-semibold" style={{ fontFamily: 'var(--font-display)' }}>Bildirim Ayarları</h3>
                <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">Hangi durumlarda e-posta bildirimi almak istediğinizi seçin</p>
              </div>
              <CardBody>
                <div className="space-y-3">
                  {BILDIRIMLER.map((b) => (
                    <div key={b.key} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{b.label}</p>
                        <p className="text-xs text-[var(--color-text-secondary)]">{b.aciklama}</p>
                      </div>
                      <button
                        disabled={bildirimYukleniyor}
                        onClick={async () => {
                          const yeni = { ...bildirimForm, [b.key]: !bildirimForm[b.key] }
                          setBildirimForm(yeni)
                          await bildirimKaydet(yeni)
                        }}
                        className="relative w-11 h-6 rounded-full transition-colors focus:outline-none disabled:opacity-50"
                        style={{ background: bildirimForm[b.key] ? 'var(--color-primary)' : '#e2e8f0' }}
                      >
                        <span
                          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${bildirimForm[b.key] ? 'translate-x-5' : 'translate-x-0'}`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          )}

          {/* Sosyal Medya Bağlantıları */}
          {esnaf && (
            <Card>
              <div className="px-6 py-4 border-b border-[var(--color-border)] flex items-center justify-between">
                <div>
                  <h3 className="font-semibold" style={{ fontFamily: 'var(--font-display)' }}>Sosyal Medya Bağlantıları</h3>
                  <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">Vitrininizdeki sosyal medya linkleri</p>
                </div>
                {!sosyalDuzenle && (
                  <Button variant="secondary" size="sm" onClick={() => setSosyalDuzenle(true)}>Düzenle</Button>
                )}
              </div>
              <CardBody>
                {sosyalDuzenle ? (
                  <div className="space-y-3">
                    {[
                      { key: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/kullanici' },
                      { key: 'facebook', label: 'Facebook', placeholder: 'https://facebook.com/sayfa' },
                      { key: 'tiktok', label: 'TikTok', placeholder: 'https://tiktok.com/@kullanici' },
                      { key: 'youtube', label: 'YouTube', placeholder: 'https://youtube.com/@kanal' },
                    ].map((s) => (
                      <Input
                        key={s.key}
                        label={s.label}
                        value={sosyalForm[s.key as keyof typeof sosyalForm]}
                        placeholder={s.placeholder}
                        onChange={(e) => setSosyalForm((p) => ({ ...p, [s.key]: e.target.value }))}
                      />
                    ))}
                    <div className="flex gap-3 pt-1">
                      <Button onClick={sosyalKaydet} loading={sosyalYukleniyor} className="flex-1">Kaydet</Button>
                      <Button variant="secondary" onClick={() => setSosyalDuzenle(false)} className="flex-1">İptal</Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 text-sm">
                    {[
                      { key: 'instagram', label: 'Instagram' },
                      { key: 'facebook', label: 'Facebook' },
                      { key: 'tiktok', label: 'TikTok' },
                      { key: 'youtube', label: 'YouTube' },
                    ].map((s) => (
                      <div key={s.key} className="flex justify-between items-center">
                        <span className="text-[var(--color-text-secondary)]">{s.label}</span>
                        <span className="font-medium text-xs truncate max-w-[200px]">
                          {sosyalForm[s.key as keyof typeof sosyalForm] || <span className="text-slate-400">—</span>}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardBody>
            </Card>
          )}

        </div>{/* /Sağ Sütun */}
      </div>{/* /Üst Grid */}

      {/* ── Plan Yükselt — tam genişlik, modern pricing ── */}
      <div className="bg-white rounded-2xl border border-[var(--color-border)] overflow-hidden">
        <div className="px-6 py-5 border-b border-[var(--color-border)]">
          <h3 className="font-bold text-lg" style={{ fontFamily: 'var(--font-display)' }}>Plan Yükselt</h3>
          <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">İşletmeniz için en uygun planı seçin ve büyümeye başlayın</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {PLANLAR.map((p) => {
              const aktif = kullanici.plan === p.key
              const populer = p.key === 'STARTER'
              const premium = p.key === 'PRO'
              return (
                <div
                  key={p.key}
                  className="relative flex flex-col rounded-2xl border-2 p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
                  style={{
                    borderColor: aktif || populer ? 'var(--color-primary)' : 'var(--color-border)',
                    background: premium ? 'linear-gradient(135deg, var(--color-bg-muted) 0%, var(--color-accent) 100%)' : aktif ? 'var(--color-bg-muted)' : 'white',
                  }}
                >
                  {populer && (
                    <div className="absolute -top-3.5 inset-x-0 flex justify-center">
                      <span
                        className="text-[11px] font-bold px-3 py-1 rounded-full text-white tracking-wide"
                        style={{ background: 'var(--color-primary)' }}
                      >
                        EN POPÜLER
                      </span>
                    </div>
                  )}
                  {aktif && !populer && (
                    <div className="absolute -top-3.5 inset-x-0 flex justify-center">
                      <span className="text-[11px] font-bold px-3 py-1 rounded-full text-white tracking-wide bg-emerald-500">
                        AKTİF PLANIN
                      </span>
                    </div>
                  )}

                  {/* İkon + Plan adı */}
                  <div className="flex items-center gap-3 mb-4 mt-1">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: aktif || populer ? 'var(--color-primary)' : 'var(--color-bg-muted)' }}
                    >
                      {p.key === 'UCRETSIZ' && (
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke={aktif ? 'white' : 'var(--color-primary)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
                        </svg>
                      )}
                      {p.key === 'STARTER' && (
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      )}
                      {p.key === 'PRO' && (
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke={populer || aktif ? 'white' : 'var(--color-primary)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z" /><path d="M5 20h14" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-base" style={{ color: 'var(--color-text)' }}>{p.ad}</p>
                      <p className="text-xs text-[var(--color-text-secondary)]">
                        {p.key === 'UCRETSIZ' ? 'Başlangıç için ideal' : p.key === 'STARTER' ? 'Büyüyen işletmeler için' : 'Profesyonel işletmeler için'}
                      </p>
                    </div>
                  </div>

                  {/* Fiyat */}
                  <div className="mb-5 flex items-end gap-1">
                    <span className="text-4xl font-black leading-none" style={{ color: 'var(--color-primary)' }}>
                      {p.fiyat.split('/')[0]}
                    </span>
                    <span className="text-sm text-[var(--color-text-secondary)] mb-1">/ay</span>
                  </div>

                  {/* Özellikler */}
                  <ul className="space-y-2.5 flex-1 mb-6">
                    {p.ozellikler.map((o) => (
                      <li key={o} className="flex items-start gap-2 text-sm text-[var(--color-text)]">
                        <svg className="w-4 h-4 shrink-0 mt-0.5 text-emerald-500" viewBox="0 0 16 16" fill="none">
                          <circle cx="8" cy="8" r="7" fill="#d1fae5" />
                          <path d="M5 8l2 2 4-4" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        {o}
                      </li>
                    ))}
                  </ul>

                  {/* Buton */}
                  {aktif ? (
                    <div className="w-full text-center py-2.5 rounded-xl text-sm font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200">
                      Aktif Plan ✓
                    </div>
                  ) : p.key === 'UCRETSIZ' ? (
                    <div
                      className="w-full text-center py-2.5 rounded-xl text-sm font-semibold border"
                      style={{ color: 'var(--color-text-secondary)', borderColor: 'var(--color-border)', background: 'var(--color-bg-muted)' }}
                    >
                      Ücretsiz
                    </div>
                  ) : (
                    <a
                      href={`/isletme/panel/odeme?plan=${p.key}`}
                      className="block w-full text-center py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 hover:shadow-md"
                      style={{ background: populer ? 'var(--color-primary)' : 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 100%)' }}
                    >
                      Şimdi Yükselt →
                    </a>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Destek Notu */}
      <Card>
        <CardBody>
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
              <svg className="w-4.5 h-4.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">Hesap Kapatma</p>
              <p className="text-sm text-slate-500 mt-0.5">Hesabınızı kapatmak için destek hattımız üzerinden bizimle iletişime geçin.</p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
