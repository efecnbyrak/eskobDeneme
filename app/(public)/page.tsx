import Link from 'next/link'
import { prisma } from '@/lib/db'
import { EsnafKart } from '@/components/public/EsnafKart'
import { EsnafKartSkeleton } from '@/components/ui/Skeleton'
import { HeroArama } from '@/components/public/HeroArama'
import { Button } from '@/components/ui/Button'
import { KATEGORILER } from '@/lib/constants'
import type { Esnaf } from '@/types'

async function onecikarilan(): Promise<Esnaf[]> {
  try {
    const esnaflar = await prisma.esnaf.findMany({
      where: { aktif: true, onaylı: true },
      include: {
        kategori: true,
        yorumlar: { select: { puan: true } },
        hizmetler: { where: { aktif: true }, take: 3 },
      },
      orderBy: { olusturmaT: 'desc' },
      take: 10,
    })
    if (esnaflar.length === 0) {
      // Mock data for visual presentation since DB is empty
      return [
        {
          id: '1', slug: 'ozkan-berber', isletmeAdi: 'Özkan Erkek Kuaförü', aktif: true, onaylı: true,
          sehir: 'İstanbul', ilce: 'Kadıköy', adres: 'Moda Cd.', kategoriId: '1',
          kategori: { id: '1', ad: 'Berber', ikon: '✂️', renk: '#F27A1A', slug: 'berber', sira: 1 },
          yorumlar: [{ id: '1', puan: 5, musteriAd: 'A', esnafId: '1', olusturmaT: new Date(), onaylı: true }],
          hizmetler: [{ id: '1', ad: 'Saç Kesimi', fiyat: 200, aktif: true, esnafId: '1', sira: 1, olusturmaT: new Date() }]
        },
        {
          id: '2', slug: 'lezzet-duragi', isletmeAdi: 'Lezzet Durağı Ev Yemekleri', aktif: true, onaylı: true,
          sehir: 'Ankara', ilce: 'Çankaya', adres: 'Tunalı Hilmi Cd.', kategoriId: '2',
          kategori: { id: '2', ad: 'Restoran', ikon: '🍽️', renk: '#0BC15C', slug: 'restoran', sira: 2 },
          yorumlar: [{ id: '2', puan: 4, musteriAd: 'B', esnafId: '2', olusturmaT: new Date(), onaylı: true }],
          hizmetler: [{ id: '2', ad: 'Günün Menüsü', fiyat: 150, aktif: true, esnafId: '2', sira: 1, olusturmaT: new Date() }]
        },
        {
          id: '3', slug: 'usta-eller-oto', isletmeAdi: 'Usta Eller Oto Tamir', aktif: true, onaylı: true,
          sehir: 'İzmir', ilce: 'Bornova', adres: 'Sanayi Sitesi', kategoriId: '3',
          kategori: { id: '3', ad: 'Tamirci', ikon: '🔧', renk: '#2BD4E0', slug: 'tamirci', sira: 3 },
          yorumlar: [],
          hizmetler: []
        },
        {
          id: '4', slug: 'papatya-cicekcilik', isletmeAdi: 'Papatya Çiçekçilik & Hediyelik', aktif: true, onaylı: true,
          sehir: 'Bursa', ilce: 'Nilüfer', adres: 'FSM Bulvarı', kategoriId: '4',
          kategori: { id: '4', ad: 'Çiçekçi', ikon: '🌸', renk: '#E07A5F', slug: 'cicekci', sira: 4 },
          yorumlar: [{ id: '4', puan: 5, musteriAd: 'C', esnafId: '4', olusturmaT: new Date(), onaylı: true }],
          hizmetler: [{ id: '4', ad: 'Buket', fiyat: 400, aktif: true, esnafId: '4', sira: 1, olusturmaT: new Date() }]
        },
        {
          id: '5', slug: 'fit-life-gym', isletmeAdi: 'Fit Life Spor Salonu', aktif: true, onaylı: true,
          sehir: 'Antalya', ilce: 'Muratpaşa', adres: 'Lara', kategoriId: '5',
          kategori: { id: '5', ad: 'Spor', ikon: '💪', renk: '#81B29A', slug: 'spor', sira: 5 },
          yorumlar: [{ id: '5', puan: 4.5, musteriAd: 'D', esnafId: '5', olusturmaT: new Date(), onaylı: true }],
          hizmetler: [{ id: '5', ad: 'Aylık Üyelik', fiyat: 800, aktif: true, esnafId: '5', sira: 1, olusturmaT: new Date() }]
        }
      ] as unknown as Esnaf[]
    }

    return esnaflar as unknown as Esnaf[]
  } catch {
    return []
  }
}

export default async function AnaSayfa() {
  const esnaflar = await onecikarilan()

  return (
    <div className="flex flex-col min-h-screen">

      {/* ═══════════════════════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden pt-32 pb-28 lg:pt-44 lg:pb-36 bg-[var(--color-bg)]">
        {/* Subtle dot grid */}
        <div 
          className="absolute inset-0 z-0 pointer-events-none opacity-[0.25]"
          style={{
            backgroundImage: `
              linear-gradient(to right, var(--color-border) 1px, transparent 1px),
              linear-gradient(to bottom, var(--color-border) 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px',
            maskImage: 'radial-gradient(ellipse at center, black 10%, transparent 80%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 10%, transparent 80%)'
          }}
        />
        
        {/* Soft background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[var(--color-primary-light)] blur-[120px] rounded-[100%] opacity-50 pointer-events-none" />

        <div className="container-main relative z-10 flex flex-col items-center text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white/80 backdrop-blur-md border border-[var(--color-border)] shadow-sm text-sm font-semibold text-[var(--color-primary)] mb-10 transition-transform hover:scale-105">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-success)] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-success)]"></span>
            </span>
            Platformda 3.200+ Aktif İşletme
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-8 font-display leading-[1.15] max-w-4xl mx-auto">
            <span className="text-[var(--color-text)]">İşletmeni Dakikalar İçinde </span>
            <span className="text-[var(--color-primary)]">Dijitale Taşı</span>
          </h1>

          {/* Subtitle — increased spacing */}
          <p className="text-lg md:text-xl text-[var(--color-text-secondary)] mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
            Yeni nesil dijital vitrin çözümü ile hizmetlerini tanıt, online randevu al ve müşteri tabanını bugün büyütmeye başla.
          </p>

          {/* Search Bar */}
          <div className="w-full max-w-2xl mb-8">
            <HeroArama />
          </div>

          <p className="text-sm text-[var(--color-text-secondary)]/70 font-medium mt-2 tracking-wide">
            Kredi kartı gerekmez · Modern altyapı · 7/24 randevu
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          STATS
      ═══════════════════════════════════════════════════ */}
      <section className="bg-white py-14 border-b border-t border-[var(--color-border)]">
        <div className="container-main">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-0 divide-y sm:divide-y-0 sm:divide-x divide-[var(--color-border)]">
            {[
              { sayi: '3.200+', label: 'Aktif Esnaf' },
              { sayi: '47', label: 'Şehir' },
              { sayi: '150.000+', label: 'Aylık Ziyaretçi' },
            ].map((s) => (
              <div key={s.label} className="text-center pt-10 sm:pt-0 first:pt-0">
                <p className="text-3xl md:text-4xl font-bold text-[var(--color-text)] font-display mb-3">{s.sayi}</p>
                <p className="text-sm md:text-base font-medium text-[var(--color-text-secondary)]">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          KATEGORİLER
      ═══════════════════════════════════════════════════ */}
      <section className="bg-[var(--color-bg-muted)] py-20 lg:py-28 border-b border-[var(--color-border)]">
        <div className="container-main">
          <div className="text-center mb-14 lg:mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold font-display mb-4 text-[var(--color-text)]">
              Popüler Kategoriler
            </h2>
            <p className="text-base md:text-lg text-[var(--color-text-secondary)] leading-relaxed max-w-xl mx-auto">
              İhtiyacın olan hizmeti kolayca bul, en iyisi ile çalış.
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5 md:gap-6">
            {KATEGORILER.slice(0, 12).map((k) => (
              <Link
                key={k.slug}
                href={`/kategori/${k.slug}`}
                className="group card-elite p-8 flex flex-col items-center justify-center text-center hover:border-[var(--color-primary)]/30"
              >
                <div className="w-16 h-16 rounded-2xl bg-[var(--color-bg)] flex items-center justify-center mb-5 transition-all duration-300 group-hover:bg-[var(--color-primary-light)] group-hover:scale-105">
                  <span className="text-2xl">{k.ikon}</span>
                </div>
                <span className="text-sm font-semibold text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors leading-snug">
                  {k.ad}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          ÖNE ÇIKAN ESNAFLAR
      ═══════════════════════════════════════════════════ */}
      <section className="bg-white py-20 lg:py-28">
        <div className="container-main">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
            <div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold font-display mb-4 text-[var(--color-text)]">
                Öne Çıkan Esnaflar
              </h2>
              <p className="text-base md:text-lg text-[var(--color-text-secondary)] leading-relaxed max-w-2xl">
                Yakınındaki en popüler ve yüksek puanlı işletmeleri keşfet, hemen randevunu oluştur.
              </p>
            </div>
            <Link href="/ara" className="shrink-0">
              <Button variant="secondary" size="sm">
                Tümünü İncele →
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 lg:gap-8">
            {esnaflar.length > 0
              ? esnaflar.map((e) => <EsnafKart key={e.id} esnaf={e} />)
              : Array.from({ length: 5 }).map((_, i) => <EsnafKartSkeleton key={i} />)
            }
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          NASIL ÇALIŞIR — Steps Section
      ═══════════════════════════════════════════════════ */}
      <section className="bg-[var(--color-bg)] py-24 lg:py-36 border-t border-[var(--color-border)]">
        <div className="container-main">
          {/* Header — centered */}
          <div className="text-center mb-16 lg:mb-20">
            <div className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-white text-xs md:text-sm font-bold tracking-wider uppercase text-[var(--color-primary)] mb-8 shadow-sm border border-[var(--color-border)]">
              Basit · Hızlı · Etkili
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-display mb-6 tracking-tight text-[var(--color-text)]">
              Nasıl Çalışır?
            </h2>
            <p className="text-[var(--color-text-secondary)] max-w-2xl mx-auto text-base md:text-lg leading-relaxed font-medium">
              Sadece 3 adımda işletmeni dijitale taşı ve hemen yeni müşteriler kazanmaya başla. Kodlama gerektirmez.
            </p>
          </div>

          {/* Steps grid — perfectly centered */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 max-w-5xl mx-auto">
            {[
              { ikon: '📝', adim: '01', baslik: 'Ücretsiz Kaydol', aciklama: 'Platforma hızlıca ücretsiz hesap oluştur ve işletmeni detaylıca tanımla.' },
              { ikon: '🏪', adim: '02', baslik: 'Vitrinini Kur', aciklama: 'Hizmetlerini, personellerini ve işletmene ait harika fotoğrafları yükle.' },
              { ikon: '🎯', adim: '03', baslik: 'Müşteri Kazan', aciklama: 'Arama sonuçlarında üstte çık, randevuları 7/24 otomatik olarak yönet.' },
            ].map((item) => (
              <div
                key={item.adim}
                className="flex flex-col items-center text-center bg-white p-10 lg:p-12 rounded-3xl border border-[var(--color-border)] shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-300 hover:-translate-y-1"
              >
                {/* Step number */}
                <span className="text-xs font-black text-[var(--color-primary)] tracking-widest uppercase mb-6">
                  Aşama {item.adim}
                </span>

                {/* Icon */}
                <div className="w-20 h-20 rounded-2xl bg-[var(--color-primary-light)] flex items-center justify-center text-4xl mb-8">
                  {item.ikon}
                </div>

                {/* Title */}
                <h3 className="font-bold text-xl md:text-2xl font-display mb-4 text-[var(--color-text)]">
                  {item.baslik}
                </h3>

                {/* Description */}
                <p className="text-base text-[var(--color-text-secondary)] leading-relaxed font-medium">
                  {item.aciklama}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          CTA SECTION
      ═══════════════════════════════════════════════════ */}
      <section className="py-24 lg:py-40 bg-[var(--color-primary)] relative overflow-hidden">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0d_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0d_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        {/* Decorative blobs */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-white opacity-[0.07] rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-48 -left-32 w-[500px] h-[500px] bg-[var(--color-accent)] opacity-[0.08] rounded-full blur-3xl pointer-events-none"></div>

        <div className="container-main relative z-10 text-center flex flex-col items-center">
          <h2 className="text-3xl md:text-4xl lg:text-6xl font-bold text-white mb-8 font-display tracking-tight leading-tight max-w-4xl mx-auto">
            Sen de Kurumsal Platformumuza Katıl
          </h2>
          <p className="text-white/70 mb-14 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
            3 binden fazla esnaf halihazırda dijitale taşındı ve işini büyüttü. Hedef kitlene hemen şimdi ulaş!
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center w-full max-w-xl">
            {/* PRIMARY CTA — white bg + dark text for full contrast */}
            <Link href="/kayit" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto h-16 px-12 text-base bg-white !text-[var(--color-primary)] hover:bg-[var(--color-bg)] font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
              >
                Hemen Ücretsiz Başla
              </Button>
            </Link>
            {/* SECONDARY CTA */}
            <Link href="/ara" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="ghost"
                className="w-full sm:w-auto h-16 px-12 text-base border-2 border-white/25 !text-white hover:bg-white/10 hover:border-white/40 rounded-2xl font-semibold transition-all backdrop-blur-sm"
              >
                Esnafları İncele
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
