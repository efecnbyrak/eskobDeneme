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
      className="group block bg-white rounded-lg overflow-hidden border border-[var(--color-border)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-200"
    >
      {/* Image */}
      <div className="relative w-full" style={{ paddingBottom: '75%' }}>
        {esnaf.kapakFoto ? (
          <Image
            src={esnaf.kapakFoto}
            alt={esnaf.isletmeAdi}
            fill
            className="object-cover group-hover:scale-[1.03] transition-transform duration-300"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          />
        ) : (
          <div className="absolute inset-0 bg-[var(--color-bg-muted)] flex items-center justify-center">
            <span className="text-4xl">{esnaf.kategori.ikon}</span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2">
          <Badge
            className="text-white text-[10px] px-2 py-0.5"
            style={{ backgroundColor: esnaf.kategori.renk }}
          >
            {esnaf.kategori.ikon} {esnaf.kategori.ad}
          </Badge>
        </div>
        <div className="absolute top-2 right-2">
          <Badge variant={acik ? 'success' : 'default'} className="text-[10px] px-2 py-0.5">
            {acik ? 'Açık' : 'Kapalı'}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        <h3 className="font-semibold text-sm text-[var(--color-text)] line-clamp-2 leading-snug mb-1 font-display">
          {esnaf.isletmeAdi}
        </h3>
        <p className="text-xs text-[var(--color-text-secondary)] mb-2 truncate">
          📍 {esnaf.ilce}, {esnaf.sehir}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <YildizPuan puan={puan} boyut="sm" />
          <span className="text-xs text-[var(--color-text-secondary)]">
            ({esnaf.yorumlar?.length || 0})
          </span>
        </div>

        {/* Price */}
        {minFiyat !== null && (
          <div className="pt-2 border-t border-[var(--color-border)]">
            <span className="text-sm font-bold text-[var(--color-primary)]">
              {formatFiyat(minFiyat)}
            </span>
            <span className="text-[10px] text-[var(--color-text-secondary)] ml-1">
              &apos;den başlayan
            </span>
          </div>
        )}
      </div>
    </Link>
  )
}
