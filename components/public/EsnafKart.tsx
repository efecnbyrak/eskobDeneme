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
      className="group block card-elite rounded-[1.5rem] overflow-hidden"
    >
      {/* Image */}
      <div className="relative w-full overflow-hidden" style={{ paddingBottom: '80%' }}>
        <div className="absolute inset-0 bg-[#F5F5F5]">
          <Image
            src={esnaf.kapakFoto || `https://picsum.photos/seed/${esnaf.id}/400/400`}
            alt={esnaf.isletmeAdi}
            fill
            className="object-cover group-hover:scale-[1.08] transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] will-change-transform"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          />
        </div>

        {/* Floating gradient overlay for badges */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent opacity-80" />

        {/* Badges */}
        <div className="absolute top-3 left-3 z-10">
          <Badge
            className="text-white backdrop-blur-sm bg-white/20 border-white/30 text-[10px] px-2.5 py-1 rounded-full shadow-sm"
            style={{ backgroundColor: `${esnaf.kategori.renk}dd` }}
          >
            {esnaf.kategori.ikon} <span className="ml-1 font-medium">{esnaf.kategori.ad}</span>
          </Badge>
        </div>
        <div className="absolute top-3 right-3 z-10">
          <Badge variant={acik ? 'success' : 'default'} className="text-[10px] px-2.5 py-1 rounded-full shadow-sm font-semibold capitalize tracking-wide">
            {acik ? '• Açık' : 'Kapalı'}
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
