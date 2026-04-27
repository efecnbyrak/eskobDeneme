export default function MusteriGizlilikPolitikasi() {
  return (
    <div className="container-main" style={{ paddingTop: 64, paddingBottom: 80, maxWidth: 760 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <span style={{ fontSize: 28 }}>👤</span>
        <h1 className="font-display" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800 }}>
          Müşteri Gizlilik Politikası
        </h1>
      </div>
      <p style={{ color: 'var(--color-text-secondary)', fontSize: 14, marginBottom: 48 }}>
        Son güncelleme: Nisan 2026 · Müşteri hesaplarına özel politika
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 40, lineHeight: 1.8, color: 'var(--color-text)' }}>
        <section>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 12 }}>1. Müşteri Olarak Toplanan Veriler</h2>
          <p>
            Müşteri Vitrin platformuna müşteri olarak kayıt olduğunuzda; ad, soyad, e-posta adresi, telefon numarası,
            şehir/ilçe bilgisi ve ilgi alanlarınız toplanmaktadır. Randevu aldığınızda randevu detayları,
            yorum yaptığınızda yorum içerikleri ve favori listeleriniz kayıt altına alınır.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 12 }}>2. Verilerinizin Kullanım Amacı</h2>
          <p>
            Topladığımız müşteri verileri; randevu yönetimi, size özel esnaf önerileri, ilgi alanlarınıza göre
            kategorilerin kişiselleştirilmesi ve hesap güvenliğinizin sağlanması amacıyla kullanılmaktadır.
            Pazarlama amaçlı e-posta göndermek için ayrıca onayınız alınır.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 12 }}>3. Randevu Verileri</h2>
          <p>
            Randevu aldığınızda ad, soyad ve iletişim bilgileriniz ilgili esnafla paylaşılır. Bu paylaşım,
            randevunuzun gerçekleştirilmesi için zorunludur. Esnaflar yalnızca kendi randevularınıza ait
            bilgilere erişebilir.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 12 }}>4. Favori ve Yorum Verileri</h2>
          <p>
            Favori listeniz yalnızca size özeldir, diğer kullanıcılarla paylaşılmaz. Yaptığınız yorumlar ise
            platformda herkese açık şekilde yayımlanır; yorum silme taleplerini destek ekibimize iletebilirsiniz.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 12 }}>5. Çerezler ve Oturum</h2>
          <p>
            "Beni Hatırla" seçeneğini işaretlemeniz halinde oturum bilgileriniz tarayıcınızda kalıcı olarak saklanır.
            İşaretlememeniz halinde oturum 24 saat geçerliliğini korur. Tarayıcı çerezlerini yönetim panelinden
            veya tarayıcı ayarlarından kontrol edebilirsiniz.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 12 }}>6. Haklarınız (KVKK)</h2>
          <p>
            6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında; verilerinize erişim, düzeltme,
            silme ve taşıma hakkına sahipsiniz. Talepleriniz için{' '}
            <a href="mailto:kvkk@esnafvitrin.com" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
              kvkk@esnafvitrin.com
            </a>{' '}
            adresine başvurabilirsiniz.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 12 }}>7. İletişim</h2>
          <p>
            Gizlilik politikamızla ilgili sorularınız için{' '}
            <a href="/musteri/iletisim" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
              müşteri iletişim sayfamızı
            </a>{' '}
            ziyaret edebilirsiniz.
          </p>
        </section>
      </div>
    </div>
  )
}
