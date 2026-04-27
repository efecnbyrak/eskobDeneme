export default function GizlilikPolitikasi() {
  return (
    <div className="container-main" style={{ paddingTop: 64, paddingBottom: 80, maxWidth: 760 }}>
      <h1 className="font-display" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800, marginBottom: 12 }}>
        Gizlilik Politikası
      </h1>
      <p style={{ color: 'var(--color-text-secondary)', fontSize: 14, marginBottom: 48 }}>
        Son güncelleme: Nisan 2026
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 40, lineHeight: 1.8, color: 'var(--color-text)' }}>
        <section>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 12 }}>1. Toplanan Veriler</h2>
          <p>
            Müşteri Vitrin olarak platformumuzu kullandığınızda bazı kişisel veriler toplanmaktadır. Bu veriler; ad, soyad, e-posta adresi, telefon numarası, işletme bilgileri ve randevu kayıtlarını içerebilir. Ayrıca site gezintiniz sırasında çerezler ve benzeri teknolojiler aracılığıyla teknik veriler de toplanabilir.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 12 }}>2. Verilerin Kullanım Amacı</h2>
          <p>
            Toplanan veriler; hizmetlerimizi sunmak ve geliştirmek, randevu ve işletme yönetimini sağlamak, kullanıcı hesabınızı oluşturmak ve yönetmek, size özelleştirilmiş içerik sunmak ve yasal yükümlülüklerimizi yerine getirmek amacıyla kullanılmaktadır.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 12 }}>3. Verilerin Paylaşımı</h2>
          <p>
            Kişisel verileriniz; açık rızanız olmaksızın üçüncü taraflarla paylaşılmaz. Ancak yasal zorunluluk halinde yetkili makamlarla paylaşım yapılabilir. Hizmet sağlayıcılarımız (sunucu altyapısı, ödeme sistemleri vb.) yalnızca hizmet kapsamında sınırlı erişime sahiptir ve kişisel verilerinizi kendi amaçları için kullanamaz.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 12 }}>4. Çerez Politikası</h2>
          <p>
            Platformumuz, kullanıcı deneyimini iyileştirmek amacıyla çerezler kullanmaktadır. Zorunlu çerezler platformun işlevselliği için gereklidir. Analitik çerezler ise anonim kullanım istatistikleri toplamaktadır. Tarayıcı ayarlarınızdan çerezleri reddedebilirsiniz; ancak bu durumda bazı özellikler düzgün çalışmayabilir.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 12 }}>5. Veri Güvenliği</h2>
          <p>
            Verilerinizin güvenliği için HTTPS şifreleme, güvenli veritabanı altyapısı ve düzenli güvenlik denetimleri uygulanmaktadır. Bununla birlikte, internet üzerinden hiçbir veri iletiminin %100 güvenli olmadığını hatırlatırız.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 12 }}>6. Haklarınız</h2>
          <p>
            KVKK kapsamında; verilerinize erişim talep etme, yanlış verilerin düzeltilmesini isteme, verilerinizin silinmesini talep etme ve verilerinizin işlenmesine itiraz etme haklarına sahipsiniz. Bu haklarınızı kullanmak için bizimle iletişime geçebilirsiniz.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 12 }}>7. İletişim</h2>
          <p>
            Gizlilik politikamıza ilişkin sorularınız için <a href="/iletisim" style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>iletişim sayfamızı</a> ziyaret edebilirsiniz.
          </p>
        </section>
      </div>
    </div>
  )
}
