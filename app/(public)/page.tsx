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
      {/* ─── ELITE HERO ─── */}
      <section className="relative overflow-hidden pt-32 pb-24 lg:pt-44 lg:pb-32 bg-[var(--color-bg)]">
        {/* Subtle grid background (SaaS style) */}
        <div 
          className="absolute inset-0 z-0 pointer-events-none opacity-[0.3]"
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
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[var(--color-primary-light)] blur-[100px] rounded-[100%] opacity-60 pointer-events-none" />

        <div className="container-main relative z-10 flex flex-col items-center text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/80 backdrop-blur-md border border-[var(--color-border)] shadow-sm text-sm font-semibold text-[var(--color-primary)] mb-8 transition-transform hover:scale-105">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-success)] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-success)]"></span>
            </span>
            Platformda 3.200+ Aktif İşletme
          </div>

          {/* Epic Heading */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-extrabold tracking-tight mb-8 font-display leading-[1.15] max-w-4xl mx-auto">
            <span className="text-[var(--color-text)]">İşletmeni Dakikalar İçinde </span>
            <span className="text-[var(--color-primary)]">Dijitale Taşı</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-[var(--color-text-secondary)] mb-14 max-w-2xl mx-auto leading-relaxed font-medium">
            Yeni nesil dijital vitrin çözümü ile hizmetlerini tanıt, online randevu al ve müşteri tabanını bugün büyütmeye başla.
          </p>

          {/* Search Bar - Elite */}
          <div className="w-full max-w-3xl mb-6">
            <HeroArama />
          </div>

          <p className="text-sm text-[var(--color-text-secondary)] font-medium mt-2">
            Kredi kartı gerekmez · Modern altyapı · 7/24 randevu
          </p>
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section className="bg-white py-12 border-b border-t border-[var(--color-border)]">
        <div className="container-main">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 divide-y sm:divide-y-0 sm:divide-x divide-[var(--color-border)]">
            {[
              { sayi: '3.200+', label: 'Aktif Esnaf' },
              { sayi: '47', label: 'Şehir' },
              { sayi: '150.000+', label: 'Aylık Ziyaretçi' },
            ].map((s) => (
              <div key={s.label} className="text-center pt-8 sm:pt-0">
                <p className="text-3xl md:text-4xl font-bold text-[var(--color-text)] font-display mb-2">{s.sayi}</p>
                <p className="text-sm md:text-base font-medium text-[var(--color-text-secondary)]">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── KATEGORİLER ─── */}
      <section className="bg-[var(--color-bg-muted)] py-16 lg:py-24 border-b border-[var(--color-border)]">
        <div className="container-main">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-4xl font-bold font-display mb-3 text-[var(--color-text)]">Popüler Kategoriler</h2>
            <p className="text-base text-[var(--color-text-secondary)]">İhtiyacın olan hizmeti kolayca bul</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6 lg:gap-8">
            {KATEGORILER.slice(0, 12).map((k) => (
              <Link
                key={k.slug}
                href={`/kategori/${k.slug}`}
                className="group card-elite p-6 flex flex-col items-center justify-center text-center hover:border-[var(--color-primary-light)] h-40"
              >
                <div className="w-16 h-16 rounded-2xl bg-[var(--color-bg)] flex items-center justify-center mb-4 transition-colors group-hover:bg-[var(--color-primary-light)] shadow-xs">
                  <span className="text-2xl transition-transform duration-300 group-hover:scale-110">{k.ikon}</span>
                </div>
                <span className="text-sm font-semibold text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors">
                  {k.ad}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ÖNE ÇIKAN ESNAFLAR ─── */}
      <section className="bg-white py-20 lg:py-28">
        <div className="container-main">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
            <div>
              <h2 className="text-2xl md:text-4xl font-bold font-display mb-3 text-[var(--color-text)]">Öne Çıkan Esnaflar</h2>
              <p className="text-base text-[var(--color-text-secondary)] leading-relaxed max-w-2xl">
                Yakınındaki en popüler ve yüksek puanlı işletmeleri keşfet, hemen randevunu oluştur.
              </p>
            </div>
            <Link href="/ara" className="shrink-0">
              <Button variant="outline" className="border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-bg-muted)] shadow-sm">
                Tümünü İncele →
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {esnaflar.length > 0
              ? esnaflar.map((e) => <EsnafKart key={e.id} esnaf={e} />)
              : Array.from({ length: 5 }).map((_, i) => <EsnafKartSkeleton key={i} />)
            }
          </div>
        </div>
      </section>

      {/* ─── NASIL ÇALIŞIR ─── */}
      <section className="bg-[var(--color-bg)] py-20 lg:py-32 text-center border-t border-[var(--color-border)]">
        <div className="container-main">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white text-[11px] md:text-sm font-bold tracking-wider uppercase text-[var(--color-primary)] mb-8 shadow-sm border border-[var(--color-border)]">
            Basit · Hızlı · Etkili
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-display mb-6 tracking-tight text-[var(--color-text)]">
            Nasıl Çalışır?
          </h2>
          <p className="text-[var(--color-text-secondary)] mb-16 lg:mb-24 max-w-2xl mx-auto text-base md:text-xl font-medium leading-relaxed">
            Sadece 3 adımda işletmeni dijitale taşı ve hemen yeni müşteriler kazanmaya başla. Kodlama gerektirmez.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16 max-w-5xl mx-auto">
            {[
              { ikon: '📝', adim: 'Aşama 1', baslik: 'Ücretsiz Kaydol', aciklama: 'Platforma hızlıca ücretsiz hesap oluştur ve işletmeni detaylıca tanımla.' },
              { ikon: '🏪', adim: 'Aşama 2', baslik: 'Vitrinini Kur', aciklama: 'Hizmetlerini, personellerini ve işletmene ait harika fotoğrafları yükle.' },
              { ikon: '🎯', adim: 'Aşama 3', baslik: 'Müşteri Kazan', aciklama: 'Arama sonuçlarında üstte çık, randevuları 7/24 otomatik olarak yönet.' },
            ].map((item) => (
              <div key={item.adim} className="flex flex-col items-center bg-white p-10 rounded-3xl border border-[var(--color-border)] shadow-sm hover:shadow-md transition-shadow relative">
                <span className="absolute top-6 left-6 text-xs font-black text-[var(--color-text-secondary)]/50 tracking-widest uppercase">{item.adim}</span>
                <div className="w-20 h-20 rounded-2xl bg-[var(--color-primary-light)] flex items-center justify-center text-4xl mb-8 mt-4 text-[var(--color-primary)]">
                  {item.ikon}
                </div>
                <h3 className="font-bold text-xl md:text-2xl font-display mb-4 text-[var(--color-text)]">{item.baslik}</h3>
                <p className="text-base text-[var(--color-text-secondary)] leading-relaxed font-medium">
                  {item.aciklama}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ELITE CTA ─── */}
      <section className="py-24 lg:py-40 bg-[var(--color-primary)] relative overflow-hidden">
        {/* Soft background patterns over primary background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff1a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff1a_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="container-main relative z-10 text-center flex flex-col items-center">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-8 font-display tracking-tight leading-tight max-w-4xl mx-auto">
            Sen de Kurumsal Platformumuza Katıl
          </h2>
          <p className="text-white/80 mb-14 text-lg md:text-2xl max-w-3xl mx-auto font-medium leading-relaxed">
            3 binden fazla esnaf halihazırda dijitale taşındı ve işini büyüttü. Hedef kitlene hemen şimdi ulaş!
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center w-full max-w-2xl">
            <Link href="/kayit" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto h-16 px-10 text-lg bg-white text-[var(--color-primary)] hover:bg-gray-50 font-bold rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
              >
                Hemen Ücretsiz Başla
              </Button>
            </Link>
            <Link href="/ara" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto h-16 px-10 text-lg border-white/30 text-white hover:bg-white/10 hover:border-white/50 rounded-full font-semibold transition-all backdrop-blur-sm bg-transparent"
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
