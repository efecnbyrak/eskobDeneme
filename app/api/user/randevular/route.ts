import { NextRequest } from 'next/server'
import { mobilAuth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { basari, hata } from '@/lib/api'

type RandevuDurum = 'BEKLIYOR' | 'ONAYLANDI' | 'IPTAL' | 'TAMAMLANDI'
const GECERLI_DURUMLAR: RandevuDurum[] = ['BEKLIYOR', 'ONAYLANDI', 'IPTAL', 'TAMAMLANDI']

export async function GET(req: NextRequest) {
  const oturum = await mobilAuth(req)
  if (!oturum?.user?.id) return hata('Yetkisiz.', 401)

  const { searchParams } = new URL(req.url)
  const durumStr = searchParams.get('durum') as RandevuDurum | null
  const sayfa = Math.max(1, parseInt(searchParams.get('sayfa') ?? '1'))
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') ?? '20')))
  const skip = (sayfa - 1) * limit

  const kullaniciId = parseInt(oturum.user.id)

  const where = {
    kullaniciId,
    ...(durumStr && GECERLI_DURUMLAR.includes(durumStr) ? { durum: durumStr } : {}),
  }

  const [toplam, randevular] = await prisma.$transaction([
    prisma.randevu.count({ where }),
    prisma.randevu.findMany({
      where,
      include: {
        esnaf: {
          select: {
            id: true, slug: true, isletmeAdi: true, logoUrl: true,
            sehir: true, ilce: true, telefon: true,
          },
        },
        hizmet: { select: { id: true, ad: true, fiyat: true, sure: true } },
      },
      orderBy: { tarih: 'desc' },
      skip,
      take: limit,
    }),
  ])

  return basari({
    randevular,
    sayfalama: {
      toplam,
      sayfa,
      limit,
      toplamSayfa: Math.ceil(toplam / limit),
    },
  })
}

// Müşteri kendi randevusunu iptal edebilir
export async function PATCH(req: NextRequest) {
  const oturum = await mobilAuth(req)
  if (!oturum?.user?.id) return hata('Yetkisiz.', 401)

  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return hata('ID gerekli', 400)
  const numId = parseInt(id)
  if (!Number.isInteger(numId)) return hata('Geçersiz ID', 400)

  const kullaniciId = parseInt(oturum.user.id)
  const mevcut = await prisma.randevu.findUnique({ where: { id: numId } })

  if (!mevcut || mevcut.kullaniciId !== kullaniciId) return hata('Yetkisiz', 403)
  if (mevcut.durum === 'TAMAMLANDI') return hata('Tamamlanmış randevu iptal edilemez.', 400)
  if (mevcut.durum === 'IPTAL') return hata('Randevu zaten iptal edilmiş.', 400)

  const randevu = await prisma.randevu.update({
    where: { id: numId },
    data: { durum: 'IPTAL' },
  })

  return basari(randevu)
}
