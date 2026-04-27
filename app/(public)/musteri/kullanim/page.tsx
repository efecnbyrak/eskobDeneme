export default function MusteriKullanimSartlari() {
  return (
    <div className="container-main" style={{ paddingTop: 64, paddingBottom: 80, maxWidth: 760 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <span style={{ fontSize: 28 }}>ğŸ‘¤</span>
        <h1 className="font-display" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800 }}>
          MÃ¼ÅŸteri KullanÄ±m ÅartlarÄ±
        </h1>
      </div>
      <p style={{ color: 'var(--color-text-secondary)', fontSize: 14, marginBottom: 48 }}>
        Son gÃ¼ncelleme: Nisan 2026 Â· MÃ¼ÅŸteri hesaplarÄ±na Ã¶zel ÅŸartlar
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 40, lineHeight: 1.8, color: 'var(--color-text)' }}>
        <section>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 12 }}>1. MÃ¼ÅŸteri HesabÄ± OluÅŸturma</h2>
          <p>
            Müşteri Vitrin'e mÃ¼ÅŸteri olarak kayÄ±t olabilmek iÃ§in 18 yaÅŸÄ±nÄ± doldurmuÅŸ olmanÄ±z gerekmektedir.
            KayÄ±t sÄ±rasÄ±nda saÄŸladÄ±ÄŸÄ±nÄ±z bilgilerin doÄŸru ve gÃ¼ncel olmasÄ± zorunludur. Sahte bilgilerle
            oluÅŸturulan hesaplar kalÄ±cÄ± olarak kapatÄ±labilir.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 12 }}>2. Randevu Alma ve Ä°ptal</h2>
          <p>
            Randevu aldÄ±ktan sonra iptal etmek istediÄŸinizde bunu en geÃ§ randevudan 2 saat Ã¶nce yapmanÄ±z
            beklenmektedir. SÃ¼rekli randevu iptal eden veya gelmeksizin randevu alan kullanÄ±cÄ±larÄ±n hesabÄ±
            geÃ§ici olarak kÄ±sÄ±tlanabilir.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 12 }}>3. Yorum PolitikasÄ±</h2>
          <p>
            Esnaflar hakkÄ±nda yorum yaparken gerÃ§ek deneyimlerinizi paylaÅŸmanÄ±z beklenir. Hakaret iÃ§eren,
            asÄ±lsÄ±z veya ticari amaÃ§lÄ± yorumlar platformdan kaldÄ±rÄ±lÄ±r. Tekrar eden ihlaller hesabÄ±n
            kapatÄ±lmasÄ±na neden olabilir.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 12 }}>4. Favori Listesi</h2>
          <p>
            Favori listenize eklediÄŸiniz esnaflar yalnÄ±zca size Ã¶zeldir ve baÅŸkalarÄ± tarafÄ±ndan gÃ¶rÃ¼lemez.
            Favori listesi bir sipariÅŸ veya randevu taahhÃ¼dÃ¼ iÃ§ermez.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 12 }}>5. Yasak DavranÄ±ÅŸlar</h2>
          <p>
            Platform Ã¼zerinden spam mesaj gÃ¶ndermek, esnaflarÄ±n iletiÅŸim bilgilerini ticari amaÃ§la
            kullanmak, baÅŸka kullanÄ±cÄ±larÄ± taciz etmek kesinlikle yasaktÄ±r. Bu tÃ¼r davranÄ±ÅŸlar tespit
            edildiÄŸinde hesap derhal kapatÄ±lÄ±r ve gerektiÄŸinde hukuki sÃ¼reÃ§ baÅŸlatÄ±lÄ±r.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 12 }}>6. Hizmet Kesintileri</h2>
          <p>
            Müşteri Vitrin, bakÄ±m, gÃ¼ncelleme veya teknik sorunlar nedeniyle geÃ§ici hizmet kesintileri
            yaÅŸanabileceÄŸini bildirir. Bu sÃ¼reÃ§lerde aktif randevularÄ±nÄ±z korunur ve tarafÄ±nÄ±za
            bildirim yapÄ±lÄ±r.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 12 }}>7. ÅartlarÄ±n DeÄŸiÅŸtirilmesi</h2>
          <p>
            Bu ÅŸartlar Ã¶nceden bildirim yapÄ±lmaksÄ±zÄ±n gÃ¼ncellenebilir. GÃ¼ncel ÅŸartlar her zaman bu
            sayfada yayÄ±mlanÄ±r. Platformu kullanmaya devam etmeniz gÃ¼ncel ÅŸartlarÄ± kabul ettiÄŸiniz
            anlamÄ±na gelir.
          </p>
        </section>
      </div>
    </div>
  )
}
