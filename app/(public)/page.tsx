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
    <div>
      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(165deg, #FFF7F0 0%, #FFFFFF 60%)' }}>
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-[0.07] -translate-y-1/2 translate-x-1/4"
          style={{ background: 'radial-gradient(circle, var(--color-primary) 0%, transparent 70%)' }}
        />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-[0.05] translate-y-1/2 -translate-x-1/4"
          style={{ background: 'radial-gradient(circle, #0BC15C 0%, transparent 70%)' }}
        />

        <div className="container-main relative py-16 sm:py-20 lg:py-24 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-xs font-medium text-[var(--color-primary)] mb-6 border border-[var(--color-border)] shadow-[var(--shadow-xs)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)] animate-pulse" />
            3.200+ esnaf zaten dijitalde
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-[var(--color-text)] mb-4 leading-tight font-display">
            İşletmeni 5 Dakikada<br />
            <span className="text-[var(--color-primary)]">Dijitale Taşı</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-[var(--color-text-secondary)] mb-8 max-w-lg mx-auto leading-relaxed">
            Türkiye&apos;nin esnaf ve KOBİ&apos;leri için dijital vitrin platformu.
            Ücretsiz kaydol, vitrinini kur, müşteri kazan.
          </p>

          {/* Search */}
          <HeroArama />

          <p className="text-xs text-[var(--color-text-secondary)] mt-4">
            Kredi kartı gerekmez · Ücretsiz başla
          </p>
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section className="border-b border-[var(--color-border)] bg-white">
        <div className="container-main py-5">
          <div className="grid grid-cols-3 divide-x divide-[var(--color-border)]">
            {[
              { sayi: '3.200+', label: 'Aktif Esnaf' },
              { sayi: '47', label: 'Şehir' },
              { sayi: '150.000+', label: 'Aylık Ziyaretçi' },
            ].map((s) => (
              <div key={s.label} className="text-center py-2">
                <p className="text-xl sm:text-2xl font-bold text-[var(--color-primary)] font-display">{s.sayi}</p>
                <p className="text-[11px] sm:text-xs text-[var(--color-text-secondary)] mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── KATEGORİLER ─── */}
      <section className="bg-white border-b border-[var(--color-border)]">
        <div className="container-main py-6">
          {/* Mobile: horizontal scroll */}
          <div className="flex gap-5 overflow-x-auto pb-2 scrollbar-hide lg:hidden">
            {KATEGORILER.map((k) => (
              <Link
                key={k.slug}
                href={`/kategori/${k.slug}`}
                className="flex-none flex flex-col items-center gap-1.5 group w-16"
              >
                <div className="w-14 h-14 rounded-full bg-[var(--color-bg-muted)] flex items-center justify-center group-hover:bg-[var(--color-primary-light)] transition-colors">
                  <span className="text-xl">{k.ikon}</span>
                </div>
                <span className="text-[11px] font-medium text-[var(--color-text-secondary)] group-hover:text-[var(--color-primary)] text-center leading-tight transition-colors">
                  {k.ad}
                </span>
              </Link>
            ))}
          </div>

          {/* Desktop: centered grid */}
          <div className="hidden lg:flex flex-wrap justify-center gap-6">
            {KATEGORILER.map((k) => (
              <Link
                key={k.slug}
                href={`/kategori/${k.slug}`}
                className="flex flex-col items-center gap-2 group w-20"
              >
                <div className="w-16 h-16 rounded-full bg-[var(--color-bg-muted)] flex items-center justify-center group-hover:bg-[var(--color-primary-light)] group-hover:shadow-sm transition-all duration-200">
                  <span className="text-2xl">{k.ikon}</span>
                </div>
                <span className="text-xs font-medium text-[var(--color-text-secondary)] group-hover:text-[var(--color-primary)] text-center leading-tight transition-colors">
                  {k.ad}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ÖNE ÇIKAN ESNAFLAR ─── */}
      <section className="bg-white">
        <div className="container-main py-10 lg:py-14">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-display">Öne Çıkan Esnaflar</h2>
              <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">Yakınındaki popüler işletmeler</p>
            </div>
            <Link href="/ara">
              <Button variant="ghost" size="sm" className="text-[var(--color-primary)] hover:!bg-[var(--color-primary-light)]">
                Tümünü Gör →
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {esnaflar.length > 0
              ? esnaflar.map((e) => <EsnafKart key={e.id} esnaf={e} />)
              : Array.from({ length: 10 }).map((_, i) => <EsnafKartSkeleton key={i} />)
            }
          </div>
        </div>
      </section>

      {/* ─── NASIL ÇALIŞIR ─── */}
      <section className="bg-[var(--color-bg-section)]">
        <div className="container-main py-14 lg:py-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-xs font-semibold text-[var(--color-primary)] mb-4 border border-[var(--color-border)]">
            Basit · Hızlı · Etkili
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-display mb-3">Nasıl Çalışır?</h2>
          <p className="text-[var(--color-text-secondary)] mb-10 max-w-md mx-auto text-sm sm:text-base">
            Sadece 3 adımda işletmeni dijitale taşı ve müşteri kazanmaya başla.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto relative">
            {/* Connection line — desktop only */}
            <div className="hidden sm:block absolute top-8 left-[20%] right-[20%] h-px bg-[var(--color-border)]" />

            {[
              { ikon: '📝', adim: '01', baslik: 'Kaydol', aciklama: 'Ücretsiz hesap oluştur, kişisel bilgilerini gir.' },
              { ikon: '🏪', adim: '02', baslik: 'Vitrinini Kur', aciklama: 'Hizmetlerini ekle, fotoğraflarını yükle.' },
              { ikon: '🎯', adim: '03', baslik: 'Müşteri Kazan', aciklama: 'Müşteriler seni bulsun, randevu alsın.' },
            ].map((item) => (
              <div key={item.adim} className="flex flex-col items-center relative">
                <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-3xl mb-4 shadow-[var(--shadow-sm)] border border-[var(--color-border)] relative z-10">
                  {item.ikon}
                </div>
                <span className="text-[10px] font-bold text-[var(--color-primary)] mb-1 tracking-widest uppercase">{item.adim}</span>
                <p className="font-semibold text-sm font-display mb-1">{item.baslik}</p>
                <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed max-w-[200px]">{item.aciklama}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 100%)' }}>
        <div className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '20px 20px',
          }}
        />
        <div className="container-main relative py-14 lg:py-20 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 font-display">
            Sen de Platformumuza Katıl
          </h2>
          <p className="text-white/70 mb-8 text-sm sm:text-lg max-w-md mx-auto">
            Binlerce esnaf zaten dijitalde. Sıra sende!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/kayit">
              <Button
                size="lg"
                className="bg-white !text-[var(--color-primary)] hover:bg-[var(--color-primary-light)] font-semibold w-full sm:w-auto"
              >
                Ücretsiz Başla
              </Button>
            </Link>
            <Link href="/ara">
              <Button
                size="lg"
                variant="secondary"
                className="!border-white/30 !text-white hover:!bg-white/10 w-full sm:w-auto"
              >
                Esnafları Keşfet
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
