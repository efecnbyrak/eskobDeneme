export default function MusteriGizlilikPolitikasi() {
  return (
    <div className="container-main" style={{ paddingTop: 64, paddingBottom: 80, maxWidth: 760 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <span style={{ fontSize: 28 }}>ğŸ‘¤</span>
        <h1 className="font-display" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800 }}>
          MÃ¼ÅŸteri Gizlilik PolitikasÄ±
        </h1>
      </div>
      <p style={{ color: 'var(--color-text-secondary)', fontSize: 14, marginBottom: 48 }}>
        Son gÃ¼ncelleme: Nisan 2026 Â· MÃ¼ÅŸteri hesaplarÄ±na Ã¶zel politika
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 40, lineHeight: 1.8, color: 'var(--color-text)' }}>
        <section>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 12 }}>1. MÃ¼ÅŸteri Olarak Toplanan Veriler</h2>
          <p>
            Müşteri Vitrin platformuna mÃ¼ÅŸteri olarak kayÄ±t olduÄŸunuzda; ad, soyad, e-posta adresi, telefon numarasÄ±,
            ÅŸehir/ilÃ§e bilgisi ve ilgi alanlarÄ±nÄ±z toplanmaktadÄ±r. Randevu aldÄ±ÄŸÄ±nÄ±zda randevu detaylarÄ±,
            yorum yaptÄ±ÄŸÄ±nÄ±zda yorum iÃ§erikleri ve favori listeleriniz kayÄ±t altÄ±na alÄ±nÄ±r.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 12 }}>2. Verilerinizin KullanÄ±m AmacÄ±</h2>
          <p>
            TopladÄ±ÄŸÄ±mÄ±z mÃ¼ÅŸteri verileri; randevu yÃ¶netimi, size Ã¶zel esnaf Ã¶nerileri, ilgi alanlarÄ±nÄ±za gÃ¶re
            kategorilerin kiÅŸiselleÅŸtirilmesi ve hesap gÃ¼venliÄŸinizin saÄŸlanmasÄ± amacÄ±yla kullanÄ±lmaktadÄ±r.
            Pazarlama amaÃ§lÄ± e-posta gÃ¶ndermek iÃ§in ayrÄ±ca onayÄ±nÄ±z alÄ±nÄ±r.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 12 }}>3. Randevu Verileri</h2>
          <p>
            Randevu aldÄ±ÄŸÄ±nÄ±zda ad, soyad ve iletiÅŸim bilgileriniz ilgili esnafla paylaÅŸÄ±lÄ±r. Bu paylaÅŸÄ±m,
            randevunuzun gerÃ§ekleÅŸtirilmesi iÃ§in zorunludur. Esnaflar yalnÄ±zca kendi randevularÄ±nÄ±za ait
            bilgilere eriÅŸebilir.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 12 }}>4. Favori ve Yorum Verileri</h2>
          <p>
            Favori listeniz yalnÄ±zca size Ã¶zeldir, diÄŸer kullanÄ±cÄ±larla paylaÅŸÄ±lmaz. YaptÄ±ÄŸÄ±nÄ±z yorumlar ise
            platformda herkese aÃ§Ä±k ÅŸekilde yayÄ±mlanÄ±r; yorum silme taleplerini destek ekibimize iletebilirsiniz.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 12 }}>5. Ã‡erezler ve Oturum</h2>
          <p>
            "Beni HatÄ±rla" seÃ§eneÄŸini iÅŸaretlemeniz halinde oturum bilgileriniz tarayÄ±cÄ±nÄ±zda kalÄ±cÄ± olarak saklanÄ±r.
            Ä°ÅŸaretlememeniz halinde oturum 24 saat geÃ§erliliÄŸini korur. TarayÄ±cÄ± Ã§erezlerini yÃ¶netim panelinden
            veya tarayÄ±cÄ± ayarlarÄ±ndan kontrol edebilirsiniz.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 12 }}>6. HaklarÄ±nÄ±z (KVKK)</h2>
          <p>
            6698 sayÄ±lÄ± KiÅŸisel Verilerin KorunmasÄ± Kanunu kapsamÄ±nda; verilerinize eriÅŸim, dÃ¼zeltme,
            silme ve taÅŸÄ±ma hakkÄ±na sahipsiniz. Talepleriniz iÃ§in{' '}
            <a href="mailto:kvkk@esnafvitrin.com" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
              kvkk@esnafvitrin.com
            </a>{' '}
            adresine baÅŸvurabilirsiniz.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 12 }}>7. Ä°letiÅŸim</h2>
          <p>
            Gizlilik politikamÄ±zla ilgili sorularÄ±nÄ±z iÃ§in{' '}
            <a href="/musteri/iletisim" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
              mÃ¼ÅŸteri iletiÅŸim sayfamÄ±zÄ±
            </a>{' '}
            ziyaret edebilirsiniz.
          </p>
        </section>
      </div>
    </div>
  )
}
