import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Nasıl Çalışır? | Esnaf Vitrin',
  description: '3 adımda işletmenizi dijitale taşıyın.',
}

const ADIMLAR = [
  {
    no: '01',
    baslik: 'Ücretsiz Kaydolun',
    ikon: '👤',
    aciklama: 'İşletme hesabınızı oluşturun. Kredi kartı gerekmez. Kayıt sadece 2 dakika sürer.',
    detaylar: [
      'İşletme adı ve kategorisi seçin',
      'Şehir ve ilçe bilgisi girin',
      'E-posta ve şifre belirleyin',
    ],
  },
  {
    no: '02',
    baslik: 'Vitrinizi Kurun',
    ikon: '🏪',
    aciklama: 'Hizmetlerinizi, fiyatlarınızı ve fotoğraflarınızı ekleyin. İşletme panelinizden her şeyi kolayca yönetin.',
    detaylar: [
      'Profil fotoğrafı ve kapak görseli yükleyin',
      'Hizmetler ve fiyatlandırma ekleyin',
      'Çalışma saatlerinizi belirleyin',
      'İletişim bilgilerini tamamlayın',
    ],
  },
  {
    no: '03',
    baslik: 'Müşteri Kazanın',
    ikon: '🎯',
    aciklama: 'Arama sonuçlarında görünün, müşterilerden randevu alın ve yorumlar ile güvenilirliğinizi artırın.',
    detaylar: [
      'Platform içi aramada görünün',
      '7/24 online randevu alın',
      'Müşteri yorumları toplayın',
      'WhatsApp üzerinden iletişim kurun',
    ],
  },
  {
    no: '04',
    baslik: 'Büyütün & Yönetin',
    ikon: '📈',
    aciklama: 'İşletme panelinden tüm randevularınızı, müşterilerinizi ve istatistiklerinizi takip edin.',
    detaylar: [
      'Randevu onaylama ve yönetimi',
      'Müşteri geçmişi',
      'Görüntülenme istatistikleri',
      'Vitrin güncellemeleri',
    ],
  },
]

export default function NasilCalisirSayfasi() {
  return (
    <div style={{ background: 'var(--color-bg)' }}>
      {/* Hero */}
      <section style={{ background: '#1A2744', paddingTop: 80, paddingBottom: 80, textAlign: 'center' }}>
        <div className="container-main">
          <h1 className="font-display" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, color: 'white', marginBottom: 20 }}>
            Nasıl Çalışır?
          </h1>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.7)', maxWidth: 540, margin: '0 auto', lineHeight: 1.7 }}>
            4 adımda işletmenizi dijitale taşıyın ve binlerce müşteriye ulaşın.
          </p>
        </div>
      </section>

      {/* Adımlar */}
      <section style={{ paddingTop: 80, paddingBottom: 80 }}>
        <div className="container-main">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 48, maxWidth: 800, margin: '0 auto' }}>
            {ADIMLAR.map((adim, i) => (
              <div key={adim.no} style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }} className="flex-col sm:flex-row">
                <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ width: 72, height: 72, borderRadius: 18, background: '#1A2744', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, boxShadow: '0 8px 24px rgba(26,39,68,0.3)' }}>
                    {adim.ikon}
                  </div>
                  {i < ADIMLAR.length - 1 && (
                    <div style={{ width: 2, height: 48, background: 'var(--color-border)', marginTop: 12 }} />
                  )}
                </div>
                <div className="card-elite" style={{ flex: 1, padding: 28, borderRadius: 16 }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: '#1A2744', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
                    Adım {adim.no}
                  </div>
                  <h2 className="font-display" style={{ fontWeight: 700, fontSize: 22, marginBottom: 12 }}>{adim.baslik}</h2>
                  <p style={{ fontSize: 15, color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: 20 }}>{adim.aciklama}</p>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {adim.detaylar.map((d) => (
                      <li key={d} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: 'var(--color-text)' }}>
                        <span style={{ color: '#1A2744', fontWeight: 700 }}>✓</span>
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: '#1A2744', paddingTop: 60, paddingBottom: 60, textAlign: 'center' }}>
        <div className="container-main">
          <h2 className="font-display" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', fontWeight: 700, color: 'white', marginBottom: 24 }}>
            Başlamaya Hazır mısınız?
          </h2>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/isletme/kayit">
              <button style={{ height: 52, padding: '0 36px', fontSize: 15, fontWeight: 700, background: 'white', color: '#1A2744', borderRadius: 14, border: 'none', cursor: 'pointer' }}>
                Ücretsiz Kayıt Ol
              </button>
            </Link>
            <Link href="/isletme">
              <button style={{ height: 52, padding: '0 32px', fontSize: 15, fontWeight: 600, background: 'transparent', color: 'rgba(255,255,255,0.8)', borderRadius: 14, border: '2px solid rgba(255,255,255,0.25)', cursor: 'pointer' }}>
                ← Geri Dön
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
