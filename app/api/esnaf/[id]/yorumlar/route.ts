import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { basari, hata } from '@/lib/api'

interface Props {
  params: Promise<{ id: string }>
}

export async function GET(req: NextRequest, { params }: Props) {
  const { id } = await params
  const numId = parseInt(id)
  if (!Number.isInteger(numId) || numId < 1) return hata('Geçersiz ID', 400)

  const { searchParams } = new URL(req.url)
  const sayfa = Math.max(1, parseInt(searchParams.get('sayfa') ?? '1'))
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') ?? '20')))
  const skip = (sayfa - 1) * limit

  const where = { esnafId: numId, onaylı: true }

  const [toplam, yorumlar, istatistik] = await prisma.$transaction([
    prisma.yorum.count({ where }),
    prisma.yorum.findMany({
      where,
      select: {
        id: true, puan: true, yorum: true, musteriAd: true,
        yanitlar: true, olusturmaT: true,
      },
      orderBy: { olusturmaT: 'desc' },
      skip,
      take: limit,
    }),
    prisma.yorum.aggregate({
      where,
      _avg: { puan: true },
      _count: { id: true },
    }),
  ])

  const ortalama = istatistik._avg.puan
    ? Math.round(istatistik._avg.puan * 10) / 10
    : null

  return basari({
    yorumlar,
    istatistik: {
      ortalamaPuan: ortalama,
      toplamYorum: istatistik._count.id,
    },
    sayfalama: {
      toplam,
      sayfa,
      limit,
      toplamSayfa: Math.ceil(toplam / limit),
    },
  })
}
