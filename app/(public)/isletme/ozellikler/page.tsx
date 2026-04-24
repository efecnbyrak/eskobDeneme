import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Özellikler | Esnaf Vitrin',
  description: 'İşletmenizi büyütmek için ihtiyaç duyduğunuz tüm araçlar tek platformda.',
}

const OZELLIKLER = [
  {
    ikon: '🖥️',
    baslik: 'Dijital Vitrin',
    aciklama: 'Dakikalar içinde profesyonel işletme profili oluşturun. Fotoğraf, hizmet ve konum bilgilerinizi ekleyin. Müşteriler sizi kolayca bulsun.',
    detaylar: ['Logo ve kapak fotoğrafı', 'Hizmet listesi ve fiyatlandırma', 'Adres ve harita entegrasyonu', 'Çalışma saatleri'],
  },
  {
    ikon: '📅',
    baslik: '7/24 Online Randevu',
    aciklama: 'Müşterileriniz istedikleri zaman randevu alsın. Telefon beklemek zorunda kalmayın. Tüm randevularınızı tek panelden yönetin.',
    detaylar: ['Anlık randevu bildirimi', 'Randevu onaylama / reddetme', 'Müşteri geçmişi', 'Takvim görünümü'],
  },
  {
    ikon: '⭐',
    baslik: 'Yorum & Puanlama',
    aciklama: 'Müşteri yorumlarını toplayın, güvenilirliğinizi artırın ve yeni müşteri çekin. İşletme yanıtı ile iletişimi güçlendirin.',
    detaylar: ['Doğrulanmış müşteri yorumları', 'Yıldız puanlama sistemi', 'İşletme yanıt özelliği', 'Yorum bildirimleri'],
  },
  {
    ikon: '📊',
    baslik: 'İşletme Paneli',
    aciklama: 'Randevularınızı, müşterilerinizi ve vitrininizi tek bir panelden yönetin. Performans istatistiklerinizi takip edin.',
    detaylar: ['Görüntülenme istatistikleri', 'Randevu yönetimi', 'Müşteri listesi', 'Vitrin düzenleme'],
  },
  {
    ikon: '🔍',
    baslik: 'Arama & Keşif',
    aciklama: 'Platform içi arama ve kategori sayfalarında üst sıralarda görünün. Şehir ve kategori bazlı filtrelemede öne çıkın.',
    detaylar: ['Kategori bazlı listeleme', 'Şehir / ilçe filtresi', 'Hizmet türü araması', 'SEO optimizasyonu'],
  },
  {
    ikon: '📱',
    baslik: 'QR Kod & Paylaşım',
    aciklama: 'İşletme vitrin sayfanızın QR kodunu alın, müşterilerinizle paylaşın. Whatsapp üzerinden doğrudan iletişim kurun.',
    detaylar: ['Otomatik QR kod oluşturma', 'WhatsApp entegrasyonu', 'Sosyal medya paylaşımı', 'Vitrin linki'],
  },
]

export default function OzelliklerSayfasi() {
  return (
    <div style={{ background: 'var(--color-bg)' }}>
      {/* Hero */}
      <section style={{ background: '#1A2744', paddingTop: 80, paddingBottom: 80, textAlign: 'center' }}>
        <div className="container-main">
          <h1 className="font-display" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, color: 'white', marginBottom: 20 }}>
            Tüm Özellikler
          </h1>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.7)', maxWidth: 560, margin: '0 auto 36px', lineHeight: 1.7 }}>
            İşletmenizi büyütmek için ihtiyaç duyduğunuz her araç Esnaf Vitrin&apos;de.
          </p>
          <Link href="/isletme/kayit">
            <button style={{ height: 52, padding: '0 36px', fontSize: 16, fontWeight: 700, background: 'white', color: '#1A2744', borderRadius: 14, border: 'none', cursor: 'pointer' }}>
              Ücretsiz Başla →
            </button>
          </Link>
        </div>
      </section>

      {/* Özellikler Grid */}
      <section style={{ paddingTop: 80, paddingBottom: 80 }}>
        <div className="container-main">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 28 }}>
            {OZELLIKLER.map((o) => (
              <div key={o.baslik} className="card-elite" style={{ padding: 32, borderRadius: 20, borderTop: '3px solid #1A2744' }}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>{o.ikon}</div>
                <h2 className="font-display" style={{ fontWeight: 700, fontSize: 22, marginBottom: 12 }}>{o.baslik}</h2>
                <p style={{ fontSize: 15, color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: 20 }}>{o.aciklama}</p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {o.detaylar.map((d) => (
                    <li key={d} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: 'var(--color-text)' }}>
                      <span style={{ color: '#1A2744', fontWeight: 700 }}>✓</span>
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: '#1A2744', paddingTop: 60, paddingBottom: 60, textAlign: 'center' }}>
        <div className="container-main">
          <h2 className="font-display" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', fontWeight: 700, color: 'white', marginBottom: 20 }}>
            Hemen Başlayın
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
