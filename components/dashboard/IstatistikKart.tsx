import { Card, CardBody } from '@/components/ui/Card'

interface IstatistikKartProps {
  baslik: string
  deger: string | number
  ikon: string
  renk?: string
  degisim?: number
}

export function IstatistikKart({ baslik, deger, ikon, renk = 'var(--color-primary)', degisim }: IstatistikKartProps) {
  return (
    <Card>
      <CardBody className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-[var(--color-text-secondary)]">{baslik}</p>
            <p
              className="text-2xl font-bold mt-1"
              style={{ fontFamily: 'var(--font-display)', color: renk }}
            >
              {deger}
            </p>
            {degisim !== undefined && (
              <p className={`text-xs mt-1 ${degisim >= 0 ? 'text-[var(--color-success)]' : 'text-red-500'}`}>
                {degisim >= 0 ? '↑' : '↓'} %{Math.abs(degisim)} geçen aya göre
              </p>
            )}
          </div>
          <div
            className="text-2xl w-12 h-12 flex items-center justify-center rounded-[var(--radius-lg)]"
            style={{ backgroundColor: `${renk}18` }}
          >
            {ikon}
          </div>
        </div>
      </CardBody>
    </Card>
  )
}
