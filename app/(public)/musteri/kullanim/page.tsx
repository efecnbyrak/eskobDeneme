export default function MusteriKullanimSartlari() {
  return (
    <div className="container-main" style={{ paddingTop: 64, paddingBottom: 80, maxWidth: 760 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <span style={{ fontSize: 28 }}>👤</span>
        <h1 className="font-display" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800 }}>
          Müşteri Kullanım Şartları
        </h1>
      </div>
      <p style={{ color: 'var(--color-text-secondary)', fontSize: 14, marginBottom: 48 }}>
        Son güncelleme: Nisan 2026 · Müşteri hesaplarına özel şartlar
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 40, lineHeight: 1.8, color: 'var(--color-text)' }}>
        <section>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 12 }}>1. Müşteri Hesabı Oluşturma</h2>
          <p>
            Esnaf Vitrin'e müşteri olarak kayıt olabilmek için 18 yaşını doldurmuş olmanız gerekmektedir.
            Kayıt sırasında sağladığınız bilgilerin doğru ve güncel olması zorunludur. Sahte bilgilerle
            oluşturulan hesaplar kalıcı olarak kapatılabilir.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 12 }}>2. Randevu Alma ve İptal</h2>
          <p>
            Randevu aldıktan sonra iptal etmek istediğinizde bunu en geç randevudan 2 saat önce yapmanız
            beklenmektedir. Sürekli randevu iptal eden veya gelmeksizin randevu alan kullanıcıların hesabı
            geçici olarak kısıtlanabilir.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 12 }}>3. Yorum Politikası</h2>
          <p>
            Esnaflar hakkında yorum yaparken gerçek deneyimlerinizi paylaşmanız beklenir. Hakaret içeren,
            asılsız veya ticari amaçlı yorumlar platformdan kaldırılır. Tekrar eden ihlaller hesabın
            kapatılmasına neden olabilir.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 12 }}>4. Favori Listesi</h2>
          <p>
            Favori listenize eklediğiniz esnaflar yalnızca size özeldir ve başkaları tarafından görülemez.
            Favori listesi bir sipariş veya randevu taahhüdü içermez.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 12 }}>5. Yasak Davranışlar</h2>
          <p>
            Platform üzerinden spam mesaj göndermek, esnafların iletişim bilgilerini ticari amaçla
            kullanmak, başka kullanıcıları taciz etmek kesinlikle yasaktır. Bu tür davranışlar tespit
            edildiğinde hesap derhal kapatılır ve gerektiğinde hukuki süreç başlatılır.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 12 }}>6. Hizmet Kesintileri</h2>
          <p>
            Esnaf Vitrin, bakım, güncelleme veya teknik sorunlar nedeniyle geçici hizmet kesintileri
            yaşanabileceğini bildirir. Bu süreçlerde aktif randevularınız korunur ve tarafınıza
            bildirim yapılır.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 12 }}>7. Şartların Değiştirilmesi</h2>
          <p>
            Bu şartlar önceden bildirim yapılmaksızın güncellenebilir. Güncel şartlar her zaman bu
            sayfada yayımlanır. Platformu kullanmaya devam etmeniz güncel şartları kabul ettiğiniz
            anlamına gelir.
          </p>
        </section>
      </div>
    </div>
  )
}
