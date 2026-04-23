export default function IsletmeKullanimSartlari() {
  return (
    <div className="container-main" style={{ paddingTop: 64, paddingBottom: 80, maxWidth: 760 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <span style={{ fontSize: 28 }}>🏪</span>
        <h1 className="font-display" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800 }}>
          İşletme Kullanım Şartları
        </h1>
      </div>
      <p style={{ color: 'var(--color-text-secondary)', fontSize: 14, marginBottom: 48 }}>
        Son güncelleme: Nisan 2026 · İşletme hesaplarına özel şartlar
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 40, lineHeight: 1.8, color: 'var(--color-text)' }}>
        <section>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 12 }}>1. İşletme Hesabı Gereklilikleri</h2>
          <p>
            Esnaf Vitrin'e işletme olarak kayıt olabilmek için mevcut ve aktif bir işletmeye sahip
            olmanız gerekmektedir. Gerçeği yansıtmayan işletme bilgileri nedeniyle hesap onaylanmayabilir
            veya daha sonra kapatılabilir. İşletme adı, kategorisi ve konum bilgisinin doğru girilmesi
            zorunludur.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 12 }}>2. Vitrin Sorumluluğu</h2>
          <p>
            Dijital vitrinizde paylaştığınız tüm içerik (metin, fotoğraf, hizmet listesi) için
            siz sorumlusunuz. Yanıltıcı, uygunsuz veya telif hakkı ihlali içeren içerikler
            uyarı yapılmaksızın kaldırılabilir. Hizmetlerinizin doğru ve güncel tutulması
            müşteri memnuniyeti açısından kritik öneme sahiptir.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 12 }}>3. Randevu Yönetimi</h2>
          <p>
            Onayladığınız randevulara gelmeniz beklenir. Tekrar eden iptal veya gelmeme durumları
            hesabınızın değerlendirme puanını olumsuz etkiler ve kısıtlamalara yol açabilir.
            Randevuları en geç 2 saat öncesinden müşteriye bildirerek iptal etmelisiniz.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 12 }}>4. Müşteri Verilerinin Korunması</h2>
          <p>
            Randevu aracılığıyla edindiğiniz müşteri iletişim bilgilerini yalnızca o randevu
            kapsamında kullanabilirsiniz. İzinsiz pazarlama, veri satışı veya üçüncü kişilerle
            paylaşım yapılması hesabın kalıcı olarak kapatılmasına ve hukuki yaptırımlara neden olabilir.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 12 }}>5. Platform Komisyonu ve Ücretlendirme</h2>
          <p>
            Temel vitrin hizmeti ücretsizdir. Gelecekte sunulabilecek premium özellikler için
            ayrıca bilgilendirme yapılacak ve onayınız alınacaktır. Mevcut kullanım koşulları
            değiştirildiğinde 30 gün önceden bildirim yapılır.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 12 }}>6. Yasaklı İçerik ve Davranışlar</h2>
          <p>
            Rakip işletmelere hakaret, sahte yorum siparişi verme, müşterileri yanıltma ve
            platform güvenliğini tehdit etme yasaktır. Bu ihlaller tespit edildiğinde hesap
            derhal askıya alınır.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 12 }}>7. Hesap Kapatma</h2>
          <p>
            İstediğiniz zaman hesabınızı kapatabilirsiniz. Kapatma işlemi öncesinde aktif
            randevularınızın tamamlanması veya müşterilere bildirim yapılması gerekmektedir.
            Kapatılan hesaplara ait genel veriler 90 gün sonra sistemden silinir.
          </p>
        </section>
      </div>
    </div>
  )
}
