export default function IsletmeGizlilikPolitikasi() {
  return (
    <div className="container-main" style={{ paddingTop: 64, paddingBottom: 80, maxWidth: 760 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <span style={{ fontSize: 28 }}>🏪</span>
        <h1 className="font-display" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800 }}>
          İşletme Gizlilik Politikası
        </h1>
      </div>
      <p style={{ color: 'var(--color-text-secondary)', fontSize: 14, marginBottom: 48 }}>
        Son güncelleme: Nisan 2026 · İşletme hesaplarına özel politika
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 40, lineHeight: 1.8, color: 'var(--color-text)' }}>
        <section>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 12 }}>1. İşletme Olarak Toplanan Veriler</h2>
          <p>
            İşletme hesabı oluştururken; işletme adı, kategori, şehir/ilçe, yetkili kişi ad-soyadı,
            e-posta, telefon numarası ve şifresi toplanmaktadır. Vitrin oluşturma sürecinde fotoğraf,
            hizmet tanımları ve çalışma saatleri gibi işletme bilgileri de platforma yüklenir.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 12 }}>2. İşletme Verilerinin Kullanımı</h2>
          <p>
            İşletmenize ait veriler; platformdaki arama sonuçlarında görünür olmanız, müşterilerin
            sizi bulabilmesi ve randevu yönetimi için kullanılır. İşletme adı, kategori, şehir/ilçe
            ve hizmet bilgileri kamuya açık şekilde yayımlanır.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 12 }}>3. Müşteri Verilerine Erişim</h2>
          <p>
            Randevu alan müşterilerin ad-soyadı ve iletişim bilgilerine yalnızca o randevuya ilişkin
            olarak erişim sağlarsınız. Müşteri verilerini randevu dışında kullanmak, pazarlama
            amaçlı gönderi yapmak veya üçüncü taraflarla paylaşmak kesinlikle yasaktır.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 12 }}>4. Yorum ve Değerlendirmeler</h2>
          <p>
            Müşterilerin işletmenize bıraktığı yorumlar kamuya açıktır. Yanıt verme hakkınız
            bulunmaktadır. Gerçeği yansıtmayan yorumlar için itiraz formunu doldurabilirsiniz;
            moderasyon ekibimiz inceleme yapar.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 12 }}>5. Fotoğraf ve İçerik</h2>
          <p>
            Platforma yüklediğiniz görseller ve içerikler, platformda işletmenizin tanıtımı
            amacıyla kullanılır. İşletmenizi kapattığınızda bu içeriklerin kaldırılmasını
            talep edebilirsiniz.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 12 }}>6. Veri Güvenliği</h2>
          <p>
            Şifreleriniz bcrypt ile şifrelenerek saklanır, düz metin olarak hiçbir yerde
            tutulmaz. Veritabanı bağlantıları SSL ile şifrelenir. Güvenlik ihlali şüphesi
            durumunda derhal bildirim yapılır.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 12 }}>7. Haklarınız (KVKK)</h2>
          <p>
            İşletme hesabınıza ait tüm verilere erişim, düzeltme veya silme talebinde
            bulunabilirsiniz. Talepler için{' '}
            <a href="mailto:kvkk@esnafvitrin.com" style={{ color: '#1A2744', fontWeight: 600 }}>
              kvkk@esnafvitrin.com
            </a>{' '}
            adresine yazabilirsiniz.
          </p>
        </section>
      </div>
    </div>
  )
}
