'use client'

import { useState } from 'react'

export default function MusteriIletisim() {
  const [gonderildi, setGonderildi] = useState(false)

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setGonderildi(true)
  }

  return (
    <div className="container-main" style={{ paddingTop: 64, paddingBottom: 80, maxWidth: 900 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <span style={{ fontSize: 28 }}>👤</span>
        <h1 className="font-display" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800 }}>
          Müşteri Destek & İletişim
        </h1>
      </div>
      <p style={{ color: 'var(--color-text-secondary)', fontSize: 15, marginBottom: 48, lineHeight: 1.6 }}>
        Randevu sorunları, hesap yönetimi veya diğer konularda size yardımcı olmak için buradayız.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 40 }}>
        {/* Form */}
        <div style={{ background: 'white', borderRadius: 20, border: '1px solid var(--color-border)', padding: 32, boxShadow: 'var(--shadow-md)' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 24 }}>Bize Yazın</h2>

          {gonderildi ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
              <h3 style={{ fontWeight: 700, marginBottom: 8 }}>Mesajınız Alındı!</h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: 14 }}>
                En geç 24 saat içinde e-posta ile yanıt vereceğiz.
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 6 }}>Ad Soyad</label>
                <input required placeholder="Adınız Soyadınız" style={{ width: '100%', height: 44, padding: '0 14px', background: 'var(--color-bg-muted)', border: '2px solid transparent', borderRadius: 10, fontSize: 14, outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 6 }}>E-posta</label>
                <input type="email" required placeholder="eposta@ornek.com" style={{ width: '100%', height: 44, padding: '0 14px', background: 'var(--color-bg-muted)', border: '2px solid transparent', borderRadius: 10, fontSize: 14, outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 6 }}>Konu</label>
                <select required style={{ width: '100%', height: 44, padding: '0 14px', background: 'var(--color-bg-muted)', border: '2px solid transparent', borderRadius: 10, fontSize: 14, outline: 'none', cursor: 'pointer', color: 'var(--color-text)' }}>
                  <option value="">Konu seçin</option>
                  <option value="randevu">Randevu Sorunu</option>
                  <option value="hesap">Hesap Sorunu</option>
                  <option value="yorum">Yorum Sorunu</option>
                  <option value="esnaf">Esnaf Şikayeti</option>
                  <option value="teknik">Teknik Sorun</option>
                  <option value="genel">Genel Soru</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 6 }}>Mesaj</label>
                <textarea required rows={5} placeholder="Sorununuzu veya talebinizi detaylıca açıklayın..." style={{ width: '100%', padding: '12px 14px', background: 'var(--color-bg-muted)', border: '2px solid transparent', borderRadius: 10, fontSize: 14, outline: 'none', resize: 'vertical' }} />
              </div>
              <button type="submit" style={{ width: '100%', height: 48, fontSize: 15, fontWeight: 700, background: 'var(--color-primary)', color: 'white', borderRadius: 12, border: 'none', cursor: 'pointer', boxShadow: 'var(--shadow-sm)' }}>
                Gönder
              </button>
            </form>
          )}
        </div>

        {/* İletişim Bilgileri */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {[
            { ikon: '📧', baslik: 'Müşteri E-posta', detay: 'musteri@esnafvitrin.com', aciklama: 'Mesajlara 24 saat içinde yanıt veririz.' },
            { ikon: '🕐', baslik: 'Destek Saatleri', detay: 'Pazartesi–Cuma 09:00–18:00', aciklama: 'Hafta sonu mesajları Pazartesi yanıtlanır.' },
            { ikon: '📍', baslik: 'Adres', detay: 'İstanbul, Türkiye', aciklama: 'Yüz yüze görüşme randevu gerektirir.' },
          ].map((item) => (
            <div key={item.baslik} style={{ background: 'white', borderRadius: 16, border: '1px solid var(--color-border)', padding: 20, boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                <span style={{ fontSize: 24, flexShrink: 0 }}>{item.ikon}</span>
                <div>
                  <p style={{ fontWeight: 700, marginBottom: 4 }}>{item.baslik}</p>
                  <p style={{ fontSize: 14, color: 'var(--color-primary)', fontWeight: 600, marginBottom: 4 }}>{item.detay}</p>
                  <p style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>{item.aciklama}</p>
                </div>
              </div>
            </div>
          ))}

          <div style={{ background: 'var(--color-primary-light)', borderRadius: 16, border: '1px solid var(--color-primary)', padding: 20 }}>
            <p style={{ fontWeight: 700, color: 'var(--color-primary)', marginBottom: 8 }}>💡 Hızlı Çözüm</p>
            <p style={{ fontSize: 14, color: 'var(--color-text)', lineHeight: 1.6 }}>
              Randevu sorunları için doğrudan esnaf profil sayfasındaki WhatsApp butonunu kullanabilirsiniz.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
