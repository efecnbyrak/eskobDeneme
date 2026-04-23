'use client'

import { useState } from 'react'

export default function Iletisim() {
  const [form, setForm] = useState({ ad: '', email: '', konu: '', mesaj: '' })
  const [gonderildi, setGonderildi] = useState(false)

  function gonder(e: React.FormEvent) {
    e.preventDefault()
    setGonderildi(true)
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 16px',
    fontSize: 14,
    border: '1px solid var(--color-border)',
    borderRadius: 12,
    background: 'white',
    outline: 'none',
    color: 'var(--color-text)',
    transition: 'border-color 0.2s',
  }

  return (
    <div className="container-main" style={{ paddingTop: 64, paddingBottom: 80, maxWidth: 900 }}>
      <h1 className="font-display" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800, marginBottom: 12 }}>
        İletişim
      </h1>
      <p style={{ color: 'var(--color-text-secondary)', fontSize: 15, marginBottom: 56, lineHeight: 1.7 }}>
        Sorularınız, önerileriniz veya işbirliği talepleriniz için bize ulaşabilirsiniz.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 48 }}>
        {/* Form */}
        <div>
          {gonderildi ? (
            <div style={{
              background: '#F0FDF4', border: '1px solid #86EFAC', borderRadius: 16,
              padding: '40px 32px', textAlign: 'center',
            }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
              <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 8, color: '#166534' }}>Mesajınız Alındı!</h3>
              <p style={{ color: '#15803D', fontSize: 14, lineHeight: 1.7 }}>
                En kısa sürede size geri dönüş yapacağız.
              </p>
            </div>
          ) : (
            <form onSubmit={gonder} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: 'var(--color-text)' }}>
                    Ad Soyad
                  </label>
                  <input
                    required
                    placeholder="Adınız"
                    style={inputStyle}
                    value={form.ad}
                    onChange={(e) => setForm({ ...form, ad: e.target.value })}
                    onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--color-primary)')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--color-border)')}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: 'var(--color-text)' }}>
                    E-posta
                  </label>
                  <input
                    required
                    type="email"
                    placeholder="ornek@mail.com"
                    style={inputStyle}
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--color-primary)')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--color-border)')}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: 'var(--color-text)' }}>
                  Konu
                </label>
                <select
                  style={{ ...inputStyle, cursor: 'pointer' }}
                  value={form.konu}
                  onChange={(e) => setForm({ ...form, konu: e.target.value })}
                >
                  <option value="">Konu seçin</option>
                  <option value="genel">Genel Soru</option>
                  <option value="teknik">Teknik Destek</option>
                  <option value="isletme">İşletme Kaydı</option>
                  <option value="sikayet">Şikayet / Bildirim</option>
                  <option value="isbirligi">İşbirliği</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: 'var(--color-text)' }}>
                  Mesajınız
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="Mesajınızı buraya yazın..."
                  style={{ ...inputStyle, resize: 'vertical' }}
                  value={form.mesaj}
                  onChange={(e) => setForm({ ...form, mesaj: e.target.value })}
                  onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--color-primary)')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--color-border)')}
                />
              </div>

              <button
                type="submit"
                style={{
                  height: 48, borderRadius: 12, border: 'none',
                  background: 'var(--color-primary)', color: 'white',
                  fontWeight: 700, fontSize: 15, cursor: 'pointer',
                  transition: 'opacity 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
              >
                Mesaj Gönder
              </button>
            </form>
          )}
        </div>

        {/* Bilgi */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          <div>
            <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 16, color: 'var(--color-text)' }}>
              Bize Ulaşın
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { ikon: '📧', baslik: 'E-posta', deger: 'destek@esnafvitrin.com' },
                { ikon: '📍', baslik: 'Adres', deger: 'İstanbul, Türkiye' },
                { ikon: '⏰', baslik: 'Yanıt Süresi', deger: 'Genellikle 24 saat içinde' },
              ].map((item) => (
                <div key={item.baslik} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 22, flexShrink: 0 }}>{item.ikon}</span>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 2 }}>{item.baslik}</p>
                    <p style={{ fontSize: 15, color: 'var(--color-text)' }}>{item.deger}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: 'var(--color-bg-muted)', borderRadius: 16, padding: '24px 20px' }}>
            <h4 style={{ fontWeight: 700, fontSize: 15, marginBottom: 10, color: 'var(--color-text)' }}>
              Sık Sorulan Sorular
            </h4>
            <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
              Sorunuzun yanıtını bulamıyor musunuz? Sık sorulan sorular bölümümüzü inceleyebilir ya da doğrudan mesaj gönderebilirsiniz.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
