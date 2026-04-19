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
      take: 6,
    })
    return esnaflar as unknown as Esnaf[]
  } catch {
    return []
  }
}

export default async function AnaSayfa() {
  const esnaflar = await onecikarilan()

  return (
    <div>
      {/* Hero */}
      <section
        className="py-24 px-4 text-center relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, var(--color-primary-light) 0%, var(--color-turquoise-light) 100%)' }}
      >
        {/* Nokta deseni */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, var(--color-primary) 1px, transparent 0)',
            backgroundSize: '28px 28px',
          }}
        />
        {/* Dekoratif şekil */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, var(--color-turquoise) 0%, transparent 70%)' }}
        />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, var(--color-primary) 0%, transparent 70%)' }}
        />

        <div className="relative max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 text-xs font-medium text-[var(--color-primary)] mb-6 border border-[var(--color-border)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)] animate-pulse" />
            3.200+ esnaf zaten dijitalde
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-[var(--color-text)] mb-5 leading-tight font-display">
            İşletmeni 5 Dakikada<br />
            <span className="text-[var(--color-primary)]">Dijitale Taşı</span>
          </h1>
          <p className="text-lg text-[var(--color-text-secondary)] mb-10 max-w-xl mx-auto leading-relaxed">
            Türkiye&apos;nin esnaf ve KOBİ&apos;leri için dijital vitrin platformu.
            Ücretsiz kaydol, vitrinini kur, müşteri kazan.
          </p>
          <HeroArama />
          <p className="text-xs text-[var(--color-text-secondary)] mt-4">
            Kredi kartı gerekmez · Ücretsiz başla
          </p>
        </div>
      </section>

      {/* Güven Logoları */}
      <section className="py-6 bg-white border-b border-[var(--color-border)]">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { sayi: '3.200+', label: 'Aktif Esnaf' },
              { sayi: '47', label: 'Şehir' },
              { sayi: '150.000+', label: 'Aylık Ziyaretçi' },
            ].map((s) => (
              <div key={s.label} className="py-3">
                <p className="text-2xl font-bold text-[var(--color-primary)] font-display">{s.sayi}</p>
                <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Kategori Şeridi */}
      <section className="py-8 bg-white border-b border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {KATEGORILER.map((k) => (
              <Link
                key={k.slug}
                href={`/kategori/${k.slug}`}
                className="flex-none flex flex-col items-center gap-1.5 px-4 py-3 rounded-[var(--radius-lg)] hover:bg-[var(--color-primary-light)] hover:text-[var(--color-primary)] transition-all group border border-transparent hover:border-[var(--color-border)]"
              >
                <span className="text-2xl">{k.ikon}</span>
                <span className="text-xs font-medium text-[var(--color-text-secondary)] group-hover:text-[var(--color-primary)] whitespace-nowrap">
                  {k.ad}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Öne Çıkan Esnaflar */}
      <section className="py-14 px-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold font-display">Öne Çıkan Esnaflar</h2>
            <p className="text-sm text-[var(--color-text-secondary)] mt-1">Yakınındaki popüler işletmeler</p>
          </div>
          <Link href="/ara">
            <Button variant="secondary" size="sm">Tümünü Gör →</Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {esnaflar.length > 0
            ? esnaflar.map((e) => <EsnafKart key={e.id} esnaf={e} />)
            : Array.from({ length: 6 }).map((_, i) => <EsnafKartSkeleton key={i} />)
          }
        </div>
      </section>

      {/* Nasıl Çalışır */}
      <section className="py-20 bg-[var(--color-warm)]">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--color-primary-light)] text-xs font-semibold text-[var(--color-primary)] mb-4">
            Basit · Hızlı · Etkili
          </div>
          <h2 className="text-3xl font-bold font-display mb-3">Nasıl Çalışır?</h2>
          <p className="text-[var(--color-text-secondary)] mb-12 max-w-md mx-auto">Sadece 3 adımda işletmeni dijitale taşı ve müşteri kazanmaya başla.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Bağlantı çizgisi */}
            <div className="hidden md:block absolute top-10 left-[calc(33%-40px)] right-[calc(33%-40px)] h-0.5 bg-[var(--color-warm-dark)]" />
            {[
              { ikon: '📝', adim: '01', baslik: 'Kaydol', aciklama: 'Ücretsiz hesap oluştur, kişisel bilgilerini gir. 2 dakika sürer.' },
              { ikon: '🏪', adim: '02', baslik: 'Vitrinini Kur', aciklama: 'Hizmetlerini ekle, fotoğraflarını yükle, çalışma saatlerini ayarla.' },
              { ikon: '🎯', adim: '03', baslik: 'Müşteri Kazan', aciklama: 'Müşteriler seni bulsun, randevu alsın, yorum yapsın.' },
            ].map((item) => (
              <div key={item.adim} className="flex flex-col items-center relative">
                <div
                  className="w-20 h-20 rounded-[var(--radius-xl)] flex items-center justify-center text-4xl mb-5 shadow-[var(--shadow-sm)] relative z-10"
                  style={{ backgroundColor: 'white' }}
                >
                  {item.ikon}
                </div>
                <span className="text-xs font-bold text-[var(--color-primary)] mb-2 tracking-widest">{item.adim}</span>
                <p className="font-semibold text-base font-display mb-2">{item.baslik}</p>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed max-w-xs">{item.aciklama}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 text-center relative overflow-hidden" style={{ backgroundColor: 'var(--color-primary)' }}>
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
        />
        <div className="relative max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-4 font-display">
            Sen de Platformumuza Katıl
          </h2>
          <p className="text-white/75 mb-8 text-lg">
            Binlerce esnaf zaten dijitalde. Sıra sende!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/kayit">
              <Button
                size="lg"
                className="bg-white !text-[var(--color-primary)] hover:bg-[var(--color-primary-light)] font-semibold"
              >
                Ücretsiz Başla
              </Button>
            </Link>
            <Link href="/ara">
              <Button
                size="lg"
                variant="secondary"
                className="!border-white/40 !text-white hover:!bg-white/10"
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
