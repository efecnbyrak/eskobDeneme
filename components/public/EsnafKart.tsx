import Link from 'next/link'
import Image from 'next/image'
import { Badge } from '@/components/ui/Badge'
import { YildizPuan } from '@/components/shared/YildizPuan'
import { ortalamaPuan, isletmeAcikMi, formatFiyat } from '@/lib/utils'
import type { Esnaf } from '@/types'

interface EsnafKartProps {
  esnaf: Esnaf
}

export function EsnafKart({ esnaf }: EsnafKartProps) {
  const puan = ortalamaPuan(esnaf.yorumlar || [])
  const acik = isletmeAcikMi(esnaf.calismaS as Record<string, { acik: string; kapali: string; kapali_gun?: boolean }> | null)
  const minFiyat = esnaf.hizmetler?.length
    ? Math.min(...esnaf.hizmetler.map((h) => Number(h.fiyat)))
    : null

  return (
    <Link
      href={`/${esnaf.sehir.toLowerCase()}/${esnaf.slug}`}
      className="group block bg-white border border-[var(--color-border)] rounded-[var(--radius-lg)] overflow-hidden hover:shadow-[var(--shadow-md)] hover:scale-[1.01] transition-all duration-200"
    >
      <div className="relative" style={{ aspectRatio: '4/3' }}>
        {esnaf.kapakFoto ? (
          <Image
            src={esnaf.kapakFoto}
            alt={esnaf.isletmeAdi}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-[var(--color-bg-muted)] flex items-center justify-center text-4xl">
            {esnaf.kategori.ikon}
          </div>
        )}

        <div className="absolute top-2 left-2">
          <Badge
            className="text-white"
            style={{ backgroundColor: esnaf.kategori.renk }}
          >
            {esnaf.kategori.ikon} {esnaf.kategori.ad}
          </Badge>
        </div>

        <div className="absolute top-2 right-2">
          <Badge variant={acik ? 'success' : 'default'}>
            {acik ? 'Açık' : 'Kapalı'}
          </Badge>
        </div>
      </div>

      <div className="p-4">
        <h3
          className="font-semibold text-base text-[var(--color-text)] truncate mb-1"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {esnaf.isletmeAdi}
        </h3>
        <p className="text-xs text-[var(--color-text-secondary)] mb-2">
          📍 {esnaf.ilce}, {esnaf.sehir}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <YildizPuan puan={puan} boyut="sm" />
            <span className="text-xs text-[var(--color-text-secondary)]">
              ({esnaf.yorumlar?.length || 0})
            </span>
          </div>
          {minFiyat !== null && (
            <span className="text-xs font-medium text-[var(--color-primary)]">
              {formatFiyat(minFiyat)} &apos;den
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
