'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { Input } from '@/components/ui/Input'
import { Loader } from '@/components/ui/Loader'
import { TURLER, ALT_KATEGORILER, SEHIRLER } from '@/lib/constants'

type Tip = 'USER' | 'BUSINESS'

const KUFUR_LISTESI = [
  'fuck', 'shit', 'bitch', 'asshole', 'dick', 'pussy', 'cock', 'cunt',
  'nigger', 'nigga', 'faggot', 'retard', 'whore', 'slut',
  'orospu', 'amk', 'amına', 'sik', 'göt', 'oç', 'piç', 'yarrak',
  'kahpe', 'bok', 'ibne', 'sürtük', 'kaltak',
  'admin', 'root', 'system', 'support', 'moderator',
]

const SESLI = /[aeıioöuüAEIİOÖUÜ]/
const KABUL_EDILEN_DOMAINLER = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com', 'icloud.com', 'yandex.com']

function kufurVarMi(deger: string): boolean {
  const temiz = deger.toLowerCase()
  return KUFUR_LISTESI.some((k) => temiz.includes(k))
}

function adGecerliMi(deger: string): string | null {
  if (deger.trim().length < 2) return 'En az 2 karakter olmalı'
  if (!/^[\p{L}\s'-]+$/u.test(deger)) return 'Sadece harf kullanılabilir'
  if (!SESLI.test(deger)) return 'Lütfen gerçek adınızı girin'
  return null
}

function emailGecerliMi(email: string): string | null {
  if (!email.includes('@')) return 'Geçerli bir e-posta girin'
  if (!KABUL_EDILEN_DOMAINLER.some((d) => email.toLowerCase().endsWith('@' + d))) {
    return 'Sadece bilinen e-posta sağlayıcıları kabul edilir (gmail, hotmail, outlook, yahoo...)'
  }
  return null
}

function kullaniciAdiGecerliMi(deger: string): string | null {
  if (deger.length < 3) return 'En az 3 karakter olmalı'
  if (deger.length > 30) return 'En fazla 30 karakter olabilir'
  if (/[^a-zA-Z0-9_]/.test(deger)) return 'Sadece İngilizce harf, rakam ve alt çizgi (_) kullanılabilir'
  if (/^[0-9_]+$/.test(deger)) return 'En az bir harf içermeli'
  if (kufurVarMi(deger)) return 'Bu kullanıcı adı kullanılamaz'
  return null
}

function telefonFormatla(deger: string): string {
  const s = deger.replace(/\D/g, '').slice(0, 11)
  if (s.length <= 4) return s
  if (s.length <= 7) return s.slice(0, 4) + ' ' + s.slice(4)
  if (s.length <= 9) return s.slice(0, 4) + ' ' + s.slice(4, 7) + ' ' + s.slice(7)
  return s.slice(0, 4) + ' ' + s.slice(4, 7) + ' ' + s.slice(7, 9) + ' ' + s.slice(9)
}

function telefonGecerliMi(tel: string): string | null {
  const s = tel.replace(/\s/g, '')
  if (s.length === 0) return null
  if (s.length !== 11) return 'Telefon 11 rakam olmalı (örn: 0533 045 00 92)'
  if (!/^0[5-9]\d{9}$/.test(s)) return 'Geçerli bir Türk telefon numarası girin'
  return null
}

function sifreGucuHesapla(sifre: string) {
  let puan = 0
  if (sifre.length >= 6) puan++
  if (sifre.length >= 10) puan++
  if (/[A-Z]/.test(sifre)) puan++
  if (/[^A-Za-z0-9]/.test(sifre)) puan++
  if (/[0-9]/.test(sifre)) puan++
  return puan
}

function SifreGucu({ sifre }: { sifre: string }) {
  if (!sifre) return null
  const puan = sifreGucuHesapla(sifre)
  const renkler = ['#EF4444', '#F97316', '#EAB308', '#22C55E', '#16A34A']
  const etiketler = ['Çok Zayıf', 'Zayıf', 'Orta', 'Güçlü', 'Çok Güçlü']
  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              flex: 1, height: 4, borderRadius: 4,
              background: i < puan ? renkler[puan - 1] : 'var(--color-border)',
              transition: 'all 0.3s',
            }}
          />
        ))}
      </div>
      <p style={{ fontSize: 11, color: renkler[puan - 1] ?? 'var(--color-text-secondary)', fontWeight: 600 }}>
        {puan > 0 ? etiketler[puan - 1] : ''}
      </p>
    </div>
  )
}

/* ─── Step indicator ─────────────────────────────────── */
function StepBar({ adim, toplam, etiketler }: { adim: number; toplam: number; etiketler: string[] }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
        {etiketler.map((etiket, i) => {
          const aktif = i + 1 === adim
          const tamamlandi = i + 1 < adim
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', flex: i < toplam - 1 ? 1 : 'unset' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: 13,
                  background: tamamlandi ? 'var(--color-primary)' : aktif ? 'var(--color-primary)' : 'var(--color-bg-muted)',
                  color: (tamamlandi || aktif) ? 'white' : 'var(--color-text-secondary)',
                  border: aktif ? '2px solid var(--color-primary)' : '2px solid transparent',
                  transition: 'all 0.3s',
                  flexShrink: 0,
                }}>
                  {tamamlandi ? '✓' : i + 1}
                </div>
                <span style={{ fontSize: 10, fontWeight: 600, color: aktif ? 'var(--color-primary)' : 'var(--color-text-secondary)', whiteSpace: 'nowrap' }}>
                  {etiket}
                </span>
              </div>
              {i < toplam - 1 && (
                <div style={{ flex: 1, height: 2, background: tamamlandi ? 'var(--color-primary)' : 'var(--color-border)', margin: '0 8px', marginBottom: 20, transition: 'background 0.3s' }} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

const adimAnimasyonu: React.CSSProperties = {
  animation: 'adimGiris 0.32s cubic-bezier(0.4,0,0.2,1)',
}

/* ─── Main Form ─────────────────────────────────────── */
function KayitForm({ initialTip }: { initialTip?: Tip }) {
  const [tip, setTip] = useState<Tip | null>(initialTip ?? null)
  const [adim, setAdim] = useState(initialTip ? 2 : 1)
  const [yukleniyor, setYukleniyor] = useState(false)
  const [hata, setHata] = useState('')
  const [sifre, setSifre] = useState('')
  const [kullaniciAdiHata, setKullaniciAdiHata] = useState('')

  const [seciliTur, setSeciliTur] = useState('')
  const [seciliAltKategori, setSeciliAltKategori] = useState('')
  const [ad, setAd] = useState('')
  const [soyad, setSoyad] = useState('')
  const [email, setEmail] = useState('')
  const [kullaniciAdi, setKullaniciAdi] = useState('')
  const [telefon, setTelefon] = useState('')
  const [telefonHata, setTelefonHata] = useState('')
  const [isletmeAdi, setIsletmeAdi] = useState('')
  const [sehir, setSehir] = useState('')
  const [ilce, setIlce] = useState('')
  const [sifreOnay, setSifreOnay] = useState('')
  // USER personal info extras
  const [kullaniciSehir, setKullaniciSehir] = useState('')
  const [kullaniciIlce, setKullaniciIlce] = useState('')
  const [seciliIlgilar, setSeciliIlgilar] = useState<string[]>([])

  const selectStyle: React.CSSProperties = {
    width: '100%', height: 48, padding: '0 16px',
    background: 'var(--color-bg-muted)', border: '2px solid transparent',
    borderRadius: 12, fontSize: 14, outline: 'none', cursor: 'pointer',
    color: 'var(--color-text)',
  }

  const inputKabiStyle: React.CSSProperties = {
    width: '100%', height: 48, padding: '0 16px', background: 'var(--color-bg-muted)',
    border: '2px solid transparent', borderRadius: 12, fontSize: 14, outline: 'none',
    color: 'var(--color-text)',
  }

  const userEtiketler = initialTip ? ['Kişisel Bilgiler', 'Şifre'] : ['Hesap Türü', 'Kişisel Bilgiler', 'Şifre']
  const businessEtiketler = initialTip ? ['İşletme Türü', 'İşletme Bilgileri', 'Kişisel Bilgiler', 'Şifre'] : ['Hesap Türü', 'İşletme Türü', 'İşletme Bilgileri', 'Kişisel Bilgiler', 'Şifre']
  const etiketler = tip === 'BUSINESS' ? businessEtiketler : userEtiketler
  const toplamAdim = tip === 'BUSINESS' ? (initialTip ? 4 : 5) : (initialTip ? 2 : 3)
  const stepBarAdim = initialTip ? adim - 1 : adim

  function toggleIlgi(slug: string) {
    setSeciliIlgilar((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    )
  }

  function ileri() {
    setHata('')

    if (adim === 1) {
      if (!tip) { setHata('Hesap türünüzü seçin.'); return }
    }

    if (tip === 'BUSINESS' && adim === 2) {
      if (!seciliTur) { setHata('İşletme türünü seçin.'); return }
      if (!seciliAltKategori) { setHata('Alt kategoriyi seçin.'); return }
    }

    if (tip === 'BUSINESS' && adim === 3) {
      if (!isletmeAdi.trim()) { setHata('İşletme adını girin.'); return }
      if (!sehir) { setHata('Şehir seçin.'); return }
      if (!ilce.trim()) { setHata('İlçe girin.'); return }
    }

    const kisiselAdim = tip === 'BUSINESS' ? 4 : 2
    if (adim === kisiselAdim) {
      const adHata = adGecerliMi(ad)
      if (adHata) { setHata('Ad: ' + adHata); return }
      const soyadHata = adGecerliMi(soyad)
      if (soyadHata) { setHata('Soyad: ' + soyadHata); return }
      const epostHata = emailGecerliMi(email)
      if (epostHata) { setHata(epostHata); return }
      if (kullaniciAdi) {
        const err = kullaniciAdiGecerliMi(kullaniciAdi)
        if (err) { setHata(err); return }
      }
      const telHata = telefonGecerliMi(telefon)
      if (telHata) { setHata(telHata); return }

      if (tip === 'USER') {
        if (!kullaniciSehir) { setHata('Şehir seçin.'); return }
        if (!kullaniciIlce.trim()) { setHata('İlçe girin.'); return }
        if (seciliIlgilar.length === 0) { setHata('En az 1 tür seçin.'); return }
      }
    }

    setAdim((p) => p + 1)
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (sifre.length < 6 || !/[A-Z]/.test(sifre) || !/[^A-Za-z0-9]/.test(sifre)) {
      setHata('Şifre en az 6 karakter, 1 büyük harf ve 1 sembol içermeli.')
      return
    }
    if (sifre !== sifreOnay) { setHata('Şifreler eşleşmiyor.'); return }

    setYukleniyor(true)
    setHata('')

    const base = {
      tip, ad: ad.trim(), soyad: soyad.trim(),
      email: email.trim().toLowerCase(), sifre,
      telefon: telefon || undefined,
    }

    const payload = tip === 'BUSINESS'
      ? { ...base, isletmeAdi: isletmeAdi.trim(), kategoriSlug: seciliAltKategori, sehir, ilce: ilce.trim() }
      : { ...base, sehir: kullaniciSehir, ilce: kullaniciIlce.trim(), ilgiAlanlari: seciliIlgilar }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.error || 'Kayıt sırasında bir hata oluştu.')
      }
      const signInRes = await signIn('credentials', { email: base.email, sifre: base.sifre, redirect: false })
      if (!signInRes || signInRes.error) { window.location.href = '/giris?kayit=basarili'; return }
      window.location.href = tip === 'BUSINESS' ? '/isletme' : '/musteri'
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Bir hata oluştu.')
    } finally {
      setYukleniyor(false)
    }
  }

  const altKategoriler = seciliTur ? (ALT_KATEGORILER[seciliTur] ?? []) : []

  return (
    <>
      <style>{`
        @keyframes adimGiris {
          from { opacity: 0; transform: translateX(24px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>

      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 12, marginBottom: 24, textDecoration: 'none' }}>
          <span style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--color-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 20, boxShadow: 'var(--shadow-sm)' }}>
            EV
          </span>
        </Link>
        <h1 className="font-display" style={{ fontSize: 28, fontWeight: 800, marginBottom: 12 }}>
          Ücretsiz Kayıt
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 15, lineHeight: 1.6 }}>
          Hesap türünü seçin ve dakikalar içinde başlayın.
        </p>
      </div>

      <div style={{ background: 'white', borderRadius: 24, border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-md)', padding: 32 }}>
        {tip && (
          <StepBar adim={stepBarAdim} toplam={toplamAdim} etiketler={etiketler} />
        )}

        {/* ── Step 1: Hesap Türü ── */}
        {adim === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, ...adimAnimasyonu }}>
            <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-text)', marginBottom: 4 }}>Nasıl kullanacaksınız?</p>
            {[
              { value: 'USER' as Tip, baslik: 'Müşteri Olarak Devam Et', aciklama: 'İşletme keşfet, randevu al, yorum yap.', ikon: '👤' },
              { value: 'BUSINESS' as Tip, baslik: 'İşletme Olarak Devam Et', aciklama: 'Dijital vitrin kur, randevu yönet, müşteri kazan.', ikon: '🏪' },
            ].map((secenek) => (
              <button
                key={secenek.value}
                type="button"
                onClick={() => setTip(secenek.value)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 16, padding: '18px 20px',
                  borderRadius: 16, border: `2px solid ${tip === secenek.value ? 'var(--color-primary)' : 'var(--color-border)'}`,
                  background: tip === secenek.value ? 'var(--color-primary-light)' : 'white',
                  cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s',
                }}
              >
                <span style={{ fontSize: 32, flexShrink: 0 }}>{secenek.ikon}</span>
                <div>
                  <p style={{ fontWeight: 700, fontSize: 15, color: 'var(--color-text)', marginBottom: 2 }}>{secenek.baslik}</p>
                  <p style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>{secenek.aciklama}</p>
                </div>
              </button>
            ))}

            {hata && <div style={{ padding: '12px 16px', borderRadius: 12, background: '#FEE2E2', color: '#991B1B', fontSize: 14 }}>{hata}</div>}

            <button
              type="button"
              onClick={ileri}
              disabled={!tip}
              style={{ width: '100%', height: 52, fontSize: 16, fontWeight: 700, background: 'var(--color-primary)', color: 'white', borderRadius: 14, border: 'none', cursor: tip ? 'pointer' : 'not-allowed', opacity: tip ? 1 : 0.5, marginTop: 8 }}
            >
              Devam Et →
            </button>
          </div>
        )}

        {/* ── Step 2 (BUSINESS): İşletme Türü ── */}
        {tip === 'BUSINESS' && adim === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, ...adimAnimasyonu }}>
            <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-text)', marginBottom: 4 }}>İşletme türünüzü seçin</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {TURLER.map((tur) => (
                <button
                  key={tur.slug}
                  type="button"
                  onClick={() => { setSeciliTur(tur.slug); setSeciliAltKategori('') }}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '16px 12px',
                    borderRadius: 14, border: `2px solid ${seciliTur === tur.slug ? 'var(--color-primary)' : 'var(--color-border)'}`,
                    background: seciliTur === tur.slug ? 'var(--color-primary-light)' : 'white',
                    cursor: 'pointer', transition: 'all 0.2s',
                  }}
                >
                  <span style={{ fontSize: 28 }}>{tur.ikon}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text)', textAlign: 'center', lineHeight: 1.3 }}>{tur.ad}</span>
                </button>
              ))}
            </div>

            {seciliTur && altKategoriler.length > 0 && (
              <div>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Alt Kategori</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 8 }}>
                  {altKategoriler.map((ak) => (
                    <button
                      key={ak.slug}
                      type="button"
                      onClick={() => setSeciliAltKategori(ak.slug)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px',
                        borderRadius: 10, border: `2px solid ${seciliAltKategori === ak.slug ? 'var(--color-primary)' : 'var(--color-border)'}`,
                        background: seciliAltKategori === ak.slug ? 'var(--color-primary-light)' : 'white',
                        cursor: 'pointer', transition: 'all 0.2s', fontSize: 13, fontWeight: 600,
                      }}
                    >
                      <span style={{ fontSize: 18 }}>{ak.ikon}</span>
                      <span style={{ color: 'var(--color-text)' }}>{ak.ad}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {hata && <div style={{ padding: '12px 16px', borderRadius: 12, background: '#FEE2E2', color: '#991B1B', fontSize: 14 }}>{hata}</div>}

            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              {!initialTip && (
                <button type="button" onClick={() => setAdim(1)} style={{ flex: 1, height: 48, fontSize: 14, fontWeight: 600, background: 'var(--color-bg-muted)', color: 'var(--color-text)', borderRadius: 12, border: 'none', cursor: 'pointer' }}>← Geri</button>
              )}
              <button type="button" onClick={ileri} style={{ flex: 2, height: 48, fontSize: 15, fontWeight: 700, background: 'var(--color-primary)', color: 'white', borderRadius: 12, border: 'none', cursor: 'pointer' }}>Devam Et →</button>
            </div>
          </div>
        )}

        {/* ── Step 3 (BUSINESS): İşletme Bilgileri ── */}
        {tip === 'BUSINESS' && adim === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, ...adimAnimasyonu }}>
            <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-text)', marginBottom: 4 }}>İşletme bilgileriniz</p>

            <div>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 6 }}>İşletme Adı</label>
              <input value={isletmeAdi} onChange={(e) => setIsletmeAdi(e.target.value)} placeholder="Örn: Özkan Kuaför" required style={inputKabiStyle} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 6 }}>İl</label>
                <select value={sehir} onChange={(e) => setSehir(e.target.value)} required style={selectStyle}>
                  <option value="">İl seçin</option>
                  {SEHIRLER.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 6 }}>İlçe</label>
                <input value={ilce} onChange={(e) => setIlce(e.target.value)} placeholder="Örn: Kadıköy" required style={inputKabiStyle} />
              </div>
            </div>

            {hata && <div style={{ padding: '12px 16px', borderRadius: 12, background: '#FEE2E2', color: '#991B1B', fontSize: 14 }}>{hata}</div>}

            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <button type="button" onClick={() => setAdim(2)} style={{ flex: 1, height: 48, fontSize: 14, fontWeight: 600, background: 'var(--color-bg-muted)', color: 'var(--color-text)', borderRadius: 12, border: 'none', cursor: 'pointer' }}>← Geri</button>
              <button type="button" onClick={ileri} style={{ flex: 2, height: 48, fontSize: 15, fontWeight: 700, background: 'var(--color-primary)', color: 'white', borderRadius: 12, border: 'none', cursor: 'pointer' }}>Devam Et →</button>
            </div>
          </div>
        )}

        {/* ── Kişisel Bilgiler adımı: USER=2, BUSINESS=4 ── */}
        {((tip === 'USER' && adim === 2) || (tip === 'BUSINESS' && adim === 4)) && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, ...adimAnimasyonu }}>
            <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-text)', marginBottom: 4 }}>Kişisel bilgileriniz</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 6 }}>Ad</label>
                <input value={ad} onChange={(e) => setAd(e.target.value)} placeholder="Adınız" required style={inputKabiStyle} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 6 }}>Soyad</label>
                <input value={soyad} onChange={(e) => setSoyad(e.target.value)} placeholder="Soyadınız" required style={inputKabiStyle} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 6 }}>E-posta</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="ornek@gmail.com" required style={inputKabiStyle} />
              <p style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginTop: 4 }}>
                Kabul edilen: @gmail.com, @hotmail.com, @outlook.com, @yahoo.com...
              </p>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 6 }}>Kullanıcı Adı</label>
              <input
                value={kullaniciAdi}
                onChange={(e) => { setKullaniciAdi(e.target.value); setKullaniciAdiHata(kullaniciAdiGecerliMi(e.target.value) ?? '') }}
                placeholder="ornek_kullanici123"
                style={{ ...inputKabiStyle, border: `2px solid ${kullaniciAdiHata ? '#EF4444' : 'transparent'}` }}
              />
              {kullaniciAdiHata
                ? <p style={{ fontSize: 11, color: '#EF4444', marginTop: 4 }}>{kullaniciAdiHata}</p>
                : <p style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginTop: 4 }}>İngilizce harf, rakam ve _ kullanılabilir. Sembol ve yalnızca rakam olamaz.</p>
              }
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 6 }}>Telefon</label>
              <input
                value={telefon}
                onChange={(e) => {
                  const fmt = telefonFormatla(e.target.value)
                  setTelefon(fmt)
                  setTelefonHata(telefonGecerliMi(fmt) ?? '')
                }}
                type="tel"
                placeholder="0533 045 00 92"
                maxLength={14}
                style={{ ...inputKabiStyle, border: `2px solid ${telefonHata ? '#EF4444' : 'transparent'}` }}
              />
              {telefonHata
                ? <p style={{ fontSize: 11, color: '#EF4444', marginTop: 4 }}>{telefonHata}</p>
                : <p style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginTop: 4 }}>Türkiye numarası — 11 rakam (örn: 0533 045 00 92)</p>
              }
            </div>

            {/* USER için İl/İlçe ve İlgi Alanları */}
            {tip === 'USER' && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 6 }}>İl</label>
                    <select value={kullaniciSehir} onChange={(e) => setKullaniciSehir(e.target.value)} style={selectStyle}>
                      <option value="">İl seçin</option>
                      {SEHIRLER.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 6 }}>İlçe</label>
                    <input value={kullaniciIlce} onChange={(e) => setKullaniciIlce(e.target.value)} placeholder="Örn: Kadıköy" style={inputKabiStyle} />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
                    İlgi Alanları <span style={{ color: '#EF4444' }}>*</span>
                    <span style={{ fontWeight: 400, color: 'var(--color-text-secondary)', marginLeft: 6, fontSize: 12 }}>en az 1 seçin</span>
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    {TURLER.map((tur) => {
                      const secili = seciliIlgilar.includes(tur.slug)
                      return (
                        <button
                          key={tur.slug}
                          type="button"
                          onClick={() => toggleIlgi(tur.slug)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px',
                            borderRadius: 12, border: `2px solid ${secili ? 'var(--color-primary)' : 'var(--color-border)'}`,
                            background: secili ? 'var(--color-primary-light)' : 'white',
                            cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left',
                          }}
                        >
                          <span style={{ fontSize: 20 }}>{tur.ikon}</span>
                          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)', lineHeight: 1.3 }}>{tur.ad}</span>
                          {secili && <span style={{ marginLeft: 'auto', color: 'var(--color-primary)', fontSize: 16 }}>✓</span>}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </>
            )}

            {hata && <div style={{ padding: '12px 16px', borderRadius: 12, background: '#FEE2E2', color: '#991B1B', fontSize: 14 }}>{hata}</div>}

            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              {!(initialTip === 'USER' && adim === 2) && (
                <button type="button" onClick={() => setAdim((p) => p - 1)} style={{ flex: 1, height: 48, fontSize: 14, fontWeight: 600, background: 'var(--color-bg-muted)', color: 'var(--color-text)', borderRadius: 12, border: 'none', cursor: 'pointer' }}>← Geri</button>
              )}
              <button
                type="button"
                onClick={ileri}
                disabled={!!kullaniciAdiHata || !!telefonHata}
                style={{ flex: 2, height: 48, fontSize: 15, fontWeight: 700, background: 'var(--color-primary)', color: 'white', borderRadius: 12, border: 'none', cursor: (kullaniciAdiHata || telefonHata) ? 'not-allowed' : 'pointer', opacity: (kullaniciAdiHata || telefonHata) ? 0.5 : 1 }}
              >
                Devam Et →
              </button>
            </div>
          </div>
        )}

        {/* ── Şifre adımı: USER=3, BUSINESS=5 ── */}
        {((tip === 'USER' && adim === 3) || (tip === 'BUSINESS' && adim === 5)) && (
          <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16, ...adimAnimasyonu }}>
            <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-text)', marginBottom: 4 }}>Şifrenizi belirleyin</p>

            <div>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 6 }}>Şifre</label>
              <input
                type="password"
                required
                value={sifre}
                onChange={(e) => setSifre(e.target.value)}
                placeholder="En az 6 karakter"
                autoComplete="new-password"
                style={inputKabiStyle}
              />
              <SifreGucu sifre={sifre} />
              <p style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginTop: 4 }}>En az 6 karakter, 1 büyük harf ve 1 sembol zorunlu.</p>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 6 }}>Şifre Onayla</label>
              <input
                type="password"
                required
                value={sifreOnay}
                onChange={(e) => setSifreOnay(e.target.value)}
                placeholder="Şifrenizi tekrar girin"
                autoComplete="new-password"
                style={{ ...inputKabiStyle, border: `2px solid ${sifreOnay && sifre !== sifreOnay ? '#EF4444' : 'transparent'}` }}
              />
              {sifreOnay && sifre !== sifreOnay && (
                <p style={{ fontSize: 11, color: '#EF4444', marginTop: 4 }}>Şifreler eşleşmiyor.</p>
              )}
            </div>

            <p style={{ fontSize: 12, textAlign: 'center', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
              Kayıt olarak{' '}
              <Link href="/hizmet-sozlesmesi" target="_blank" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Kullanım Şartları</Link>
              {' '}ve{' '}
              <Link href="/kvkk" target="_blank" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>KVKK Metni</Link>
              &apos;ni kabul etmiş olursunuz.
            </p>

            {hata && <div style={{ padding: '12px 16px', borderRadius: 12, background: '#FEE2E2', color: '#991B1B', fontSize: 14 }}>{hata}</div>}

            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <button type="button" onClick={() => setAdim((p) => p - 1)} style={{ flex: 1, height: 48, fontSize: 14, fontWeight: 600, background: 'var(--color-bg-muted)', color: 'var(--color-text)', borderRadius: 12, border: 'none', cursor: 'pointer' }}>← Geri</button>
              <button
                type="submit"
                disabled={yukleniyor}
                style={{ flex: 2, height: 52, fontSize: 16, fontWeight: 700, background: 'var(--color-primary)', color: 'white', borderRadius: 14, border: 'none', cursor: yukleniyor ? 'not-allowed' : 'pointer', opacity: yukleniyor ? 0.6 : 1, boxShadow: 'var(--shadow-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}
              >
                {yukleniyor
                  ? <><Loader renk="white" /><span style={{ fontSize: 14 }}>Kayıt yapılıyor…</span></>
                  : 'Ücretsiz Kayıt Ol 🎉'}
              </button>
            </div>
          </form>
        )}

        <div style={{ marginTop: 24, textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: 15 }}>
          Zaten hesabınız var mı?{' '}
          <Link href="/giris" style={{ color: 'var(--color-primary)', fontWeight: 700 }}>Giriş Yap</Link>
        </div>
      </div>
    </>
  )
}

export { KayitForm }

export default function KayitSayfasi() {
  return (
    <Suspense fallback={null}>
      <KayitForm />
    </Suspense>
  )
}
