import { YildizPuan } from '@/components/shared/YildizPuan'
import { formatTarih } from '@/lib/utils'
import type { Yorum } from '@/types'

interface YorumListesiProps {
  yorumlar: Yorum[]
}

export function YorumListesi({ yorumlar }: YorumListesiProps) {
  if (!yorumlar.length) {
    return (
      <p className="text-[var(--color-text-secondary)] text-sm py-8 text-center">
        Henüz yorum yok. İlk yorumu sen yap!
      </p>
    )
  }

  return (
    <div className="space-y-4">
      {yorumlar.map((yorum) => (
        <div key={yorum.id} className="bg-[var(--color-bg-muted)] rounded-[var(--radius-lg)] p-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="font-medium text-sm">{yorum.musteriAd}</p>
              <p className="text-xs text-[var(--color-text-secondary)]">
                {formatTarih(yorum.olusturmaT)}
              </p>
            </div>
            <YildizPuan puan={yorum.puan} boyut="sm" />
          </div>
          {yorum.yorum && <p className="text-sm text-[var(--color-text)]">{yorum.yorum}</p>}
          {yorum.yanitlar && (
            <div className="mt-3 pl-3 border-l-2 border-[var(--color-primary)]">
              <p className="text-xs font-medium text-[var(--color-primary)] mb-1">İşletme Yanıtı</p>
              <p className="text-sm text-[var(--color-text-secondary)]">{yorum.yanitlar}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
