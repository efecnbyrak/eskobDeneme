import Link from 'next/link'
import { prisma } from '@/lib/db'
import { EsnafKart } from '@/components/public/EsnafKart'
import { EsnafKartSkeleton } from '@/components/ui/Skeleton'
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
        className="py-20 px-4 text-center relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, var(--color-primary-light) 0%, var(--color-turquoise-light) 100%)' }}
      >
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, var(--color-primary) 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }}
        />
        <div className="relative max-w-3xl mx-auto">
          <h1
            className="text-4xl md:text-5xl font-bold text-[var(--color-text)] mb-4 leading-tight"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            İşletmeni 5 Dakikada<br />
            <span className="text-[var(--color-primary)]">Dijitale Taşı</span>
          </h1>
          <p className="text-lg text-[var(--color-text-secondary)] mb-8 max-w-xl mx-auto">
            Türkiye&apos;nin esnaf ve KOBİ&apos;leri için dijital vitrin platformu.
            Ücretsiz kaydol, vitrinini kur, müşteri kazan.
          </p>

          {/* Arama */}
          <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <input
              placeholder="Şehir girin..."
              className="flex-1 px-4 py-3 rounded-[var(--radius-full)] border border-[var(--color-border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)]"
            />
            <Link href="/ara">
              <Button size="lg">Esnaf Ara</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Kategori Şeridi */}
      <section className="py-8 bg-white border-b border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {KATEGORILER.map((k) => (
              <Link
                key={k.slug}
                href={`/kategori/${k.slug}`}
                className="flex-none flex flex-col items-center gap-2 px-4 py-3 rounded-[var(--radius-lg)] hover:bg-[var(--color-bg-muted)] transition-colors group"
              >
                <span className="text-2xl">{k.ikon}</span>
                <span className="text-xs font-medium text-[var(--color-text-secondary)] group-hover:text-[var(--color-text)] whitespace-nowrap">
                  {k.ad}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Öne Çıkan Esnaflar */}
      <section className="py-12 px-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
            Öne Çıkan Esnaflar
          </h2>
          <Link href="/ara">
            <Button variant="ghost" size="sm">Tümünü Gör →</Button>
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
      <section className="py-16 bg-[var(--color-warm)]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-10" style={{ fontFamily: 'var(--font-display)' }}>
            Nasıl Çalışır?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { ikon: '📝', adim: '1', baslik: 'Kaydol', aciklama: 'Ücretsiz hesap oluştur, işletme bilgilerini gir.' },
              { ikon: '🏪', adim: '2', baslik: 'Vitrinini Kur', aciklama: 'Hizmetlerini ekle, fotoğrafları yükle, çalışma saatlerini ayarla.' },
              { ikon: '🎯', adim: '3', baslik: 'Müşteri Kazan', aciklama: 'Müşteriler seni bulsun, randevu alsın, yorum yapsın.' },
            ].map((item) => (
              <div key={item.adim} className="flex flex-col items-center">
                <div
                  className="w-16 h-16 rounded-[var(--radius-xl)] flex items-center justify-center text-3xl mb-4"
                  style={{ backgroundColor: 'var(--color-primary-light)' }}
                >
                  {item.ikon}
                </div>
                <p className="font-semibold mb-2" style={{ fontFamily: 'var(--font-display)' }}>{item.baslik}</p>
                <p className="text-sm text-[var(--color-text-secondary)]">{item.aciklama}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 text-center" style={{ backgroundColor: 'var(--color-primary)' }}>
        <h2 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: 'var(--font-display)' }}>
          Sen de Platformumuza Katıl
        </h2>
        <p className="text-white/80 mb-6 max-w-sm mx-auto">
          Binlerce esnaf zaten dijitalde. Sıra sende!
        </p>
        <Link href="/kayit">
          <Button
            size="lg"
            className="bg-white !text-[var(--color-primary)] hover:bg-[var(--color-primary-light)]"
          >
            Ücretsiz Başla
          </Button>
        </Link>
      </section>

      {/* İstatistik */}
      <section className="py-10 bg-white border-t border-[var(--color-border)]">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-3 gap-6 text-center">
          {[
            { sayi: '3.200+', label: 'Esnaf' },
            { sayi: '47', label: 'Şehir' },
            { sayi: '150.000+', label: 'Müşteri' },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-bold text-[var(--color-primary)]" style={{ fontFamily: 'var(--font-display)' }}>
                {s.sayi}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
