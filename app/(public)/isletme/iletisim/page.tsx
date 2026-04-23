'use client'

import { useState } from 'react'

export default function IsletmeIletisim() {
  const [gonderildi, setGonderildi] = useState(false)

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setGonderildi(true)
  }

  return (
    <div className="container-main" style={{ paddingTop: 64, paddingBottom: 80, maxWidth: 900 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <span style={{ fontSize: 28 }}>🏪</span>
        <h1 className="font-display" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800 }}>
          İşletme Destek & İletişim
        </h1>
      </div>
      <p style={{ color: 'var(--color-text-secondary)', fontSize: 15, marginBottom: 48, lineHeight: 1.6 }}>
        Vitrin yönetimi, randevu sistemi veya hesap konularında işletme destek ekibimizle iletişime geçin.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 40 }}>
        {/* Form */}
        <div style={{ background: 'white', borderRadius: 20, border: '1px solid var(--color-border)', padding: 32, boxShadow: 'var(--shadow-md)' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 24 }}>İşletme Destek Talebi</h2>

          {gonderildi ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
              <h3 style={{ fontWeight: 700, marginBottom: 8 }}>Talebiniz Alındı!</h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: 14 }}>
                İşletme destek ekibimiz en geç 12 saat içinde yanıt verecektir.
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 6 }}>İşletme Adı</label>
                <input required placeholder="İşletmenizin adı" style={{ width: '100%', height: 44, padding: '0 14px', background: 'var(--color-bg-muted)', border: '2px solid transparent', borderRadius: 10, fontSize: 14, outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 6 }}>Yetkili E-posta</label>
                <input type="email" required placeholder="isletme@ornek.com" style={{ width: '100%', height: 44, padding: '0 14px', background: 'var(--color-bg-muted)', border: '2px solid transparent', borderRadius: 10, fontSize: 14, outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 6 }}>Konu</label>
                <select required style={{ width: '100%', height: 44, padding: '0 14px', background: 'var(--color-bg-muted)', border: '2px solid transparent', borderRadius: 10, fontSize: 14, outline: 'none', cursor: 'pointer', color: 'var(--color-text)' }}>
                  <option value="">Konu seçin</option>
                  <option value="vitrin">Vitrin Yönetimi</option>
                  <option value="randevu">Randevu Sistemi</option>
                  <option value="hesap">Hesap Sorunu</option>
                  <option value="onay">Hesap Onayı</option>
                  <option value="yorum">Yorum İtirazı</option>
                  <option value="teknik">Teknik Sorun</option>
                  <option value="ortaklik">Ortaklık Teklifi</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 6 }}>Mesaj</label>
                <textarea required rows={5} placeholder="Sorununuzu veya talebinizi detaylıca açıklayın..." style={{ width: '100%', padding: '12px 14px', background: 'var(--color-bg-muted)', border: '2px solid transparent', borderRadius: 10, fontSize: 14, outline: 'none', resize: 'vertical' }} />
              </div>
              <button type="submit" style={{ width: '100%', height: 48, fontSize: 15, fontWeight: 700, background: '#1A2744', color: 'white', borderRadius: 12, border: 'none', cursor: 'pointer', boxShadow: '0 4px 16px rgba(26,39,68,0.2)' }}>
                Destek Talebi Gönder
              </button>
            </form>
          )}
        </div>

        {/* İletişim Bilgileri */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {[
            { ikon: '📧', baslik: 'İşletme Destek E-posta', detay: 'isletme@esnafvitrin.com', aciklama: 'İşletme taleplerine 12 saat içinde yanıt.' },
            { ikon: '📞', baslik: 'İşletme Destek Hattı', detay: '0850 xxx xx xx', aciklama: 'Haftaiçi 09:00–18:00 arasında ulaşabilirsiniz.' },
            { ikon: '🕐', baslik: 'Destek Saatleri', detay: 'Pazartesi–Cumartesi 09:00–18:00', aciklama: 'Acil durumlar için e-posta önceliklendirilir.' },
          ].map((item) => (
            <div key={item.baslik} style={{ background: 'white', borderRadius: 16, border: '1px solid var(--color-border)', padding: 20, boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                <span style={{ fontSize: 24, flexShrink: 0 }}>{item.ikon}</span>
                <div>
                  <p style={{ fontWeight: 700, marginBottom: 4 }}>{item.baslik}</p>
                  <p style={{ fontSize: 14, color: '#1A2744', fontWeight: 600, marginBottom: 4 }}>{item.detay}</p>
                  <p style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>{item.aciklama}</p>
                </div>
              </div>
            </div>
          ))}

          <div style={{ background: 'rgba(26,39,68,0.06)', borderRadius: 16, border: '1px solid rgba(26,39,68,0.15)', padding: 20 }}>
            <p style={{ fontWeight: 700, color: '#1A2744', marginBottom: 8 }}>🚀 Hızlı Başlangıç</p>
            <p style={{ fontSize: 14, color: 'var(--color-text)', lineHeight: 1.6 }}>
              Panele ilk kez giriş yaptığınızda kurulum sihirbazı sizi yönlendirecektir.
              Sorularınız için dökümantasyon merkezimizi de ziyaret edebilirsiniz.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
