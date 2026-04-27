export default function KullanimSartlari() {
  return (
    <div className="container-main" style={{ paddingTop: 64, paddingBottom: 80, maxWidth: 760 }}>
      <h1 className="font-display" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800, marginBottom: 12 }}>
        Kullanım Şartları
      </h1>
      <p style={{ color: 'var(--color-text-secondary)', fontSize: 14, marginBottom: 48 }}>
        Son güncelleme: Nisan 2026
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 40, lineHeight: 1.8, color: 'var(--color-text)' }}>
        <section>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 12 }}>1. Hizmet Tanımı</h2>
          <p>
            Müşteri Vitrin, Türkiye&apos;deki esnaf ve KOBİ&apos;lerin dijital ortamda vitrin oluşturmasına, hizmetlerini tanıtmasına ve randevu yönetimi yapmasına olanak tanıyan bir platformdur. Platformumuzu kullanarak bu şartları kabul etmiş sayılırsınız.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 12 }}>2. Hesap Oluşturma</h2>
          <p>
            Platforma kayıt olurken gerçek ve güncel bilgiler sağlamakla yükümlüsünüz. Hesap güvenliğinden siz sorumlusunuz; şifrenizi kimseyle paylaşmamanızı öneririz. Sahte, yanıltıcı veya başkasına ait bilgilerle oluşturulan hesaplar askıya alınabilir veya kalıcı olarak silinebilir.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 12 }}>3. İşletme Profili</h2>
          <p>
            İşletme hesabı sahipleri; paylaşılan bilgilerin doğruluğundan, hizmet açıklamalarından ve müşteri ile kurulan iletişimden sorumludur. Yanıltıcı içerik, sahte yorumlar veya izinsiz telif hakkı ihlali içeren materyaller yayınlanamaz.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 12 }}>4. Yasaklı İçerikler</h2>
          <p>
            Platform üzerinde; ırkçı, ayrımcı, hakaret içeren, şiddet özendiren veya yasadışı faaliyetleri destekleyen içerikler paylaşılamaz. Bu tür içeriklerin tespit edilmesi halinde hesap uyarısız olarak kapatılabilir.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 12 }}>5. Randevu ve İptal Politikası</h2>
          <p>
            Randevular, işletme ve kullanıcı arasında yapılan karşılıklı bir anlaşmadır. Müşteri Vitrin, randevu süreçlerinde aracı konumunda olup uyuşmazlıklarda taraf tutmaz. İptal ve iade koşulları her işletme tarafından ayrıca belirlenir.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 12 }}>6. Hizmetin Kesintisi</h2>
          <p>
            Bakım, teknik arıza veya mücbir sebep halleri nedeniyle hizmetin geçici olarak kesintiye uğrayabileceğini önceden bildiririz. Bu durumlardan kaynaklanabilecek zararlardan Müşteri Vitrin sorumlu tutulamaz.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 12 }}>7. Değişiklikler</h2>
          <p>
            Bu kullanım şartları zaman zaman güncellenebilir. Önemli değişiklikler e-posta veya platform bildirimi aracılığıyla duyurulur. Güncelleme sonrasında platformu kullanmaya devam etmeniz, yeni şartları kabul ettiğiniz anlamına gelir.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 12 }}>8. İletişim</h2>
          <p>
            Kullanım şartlarına ilişkin sorularınız için <a href="/iletisim" style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>iletişim sayfamızı</a> ziyaret edebilirsiniz.
          </p>
        </section>
      </div>
    </div>
  )
}
