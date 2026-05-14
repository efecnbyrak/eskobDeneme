import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { mobilAuth } from '@/lib/auth'
import { YorumSchema } from '@/lib/validations'
import { rateLimit, istemciKimligi } from '@/lib/rateLimit'
import { temizMetinOpsiyonel } from '@/lib/sanitize'
import { kufurVarMi } from '@/lib/kufurFiltre'
import { basari, hata } from '@/lib/api'
import { logger } from '@/lib/logger'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const esnafIdStr = searchParams.get('esnafId')
    if (!esnafIdStr) return hata('esnafId gerekli', 400)
    const esnafId = parseInt(esnafIdStr)
    if (!Number.isInteger(esnafId)) return hata('Geçersiz esnafId', 400)

    const yorumlar = await prisma.yorum.findMany({
      where: { esnafId, onaylı: true },
      orderBy: { olusturmaT: 'desc' },
    })

    return basari({ yorumlar })
  } catch (err) {
    logger.error('yorum.GET', { err: String(err) })
    return hata('Sunucu hatası', 500)
  }
}

export async function POST(req: NextRequest) {
  try {
    const oturum = await mobilAuth(req)
    if (!oturum?.user?.id) return hata('Yorum yazmak için giriş yapın', 401)
    if (oturum.user.rol !== 'USER') {
      return hata('Sadece müşteri hesapları yorum yazabilir', 403)
    }

    const limit = rateLimit(`yorum:${oturum.user.id}`, 3, 60)
    if (!limit.basarili) return hata('Çok hızlı yorum denemesi. Lütfen bekleyin.', 429)

    const ipLimit = rateLimit(`yorum:ip:${istemciKimligi(req)}`, 10, 60)
    if (!ipLimit.basarili) return hata('Çok hızlı', 429)

    const body = await req.json().catch(() => null)
    const parsed = YorumSchema.safeParse(body)
    if (!parsed.success) {
      const ilk = parsed.error.issues[0]
      return hata(ilk?.message ?? 'Geçersiz veri', 400, parsed.error.flatten().fieldErrors as Record<string, string[]>)
    }

    const kullaniciId = parseInt(oturum.user.id)
    if (!Number.isInteger(kullaniciId)) return hata('Oturum hatası', 401)

    const son = await prisma.yorum.findFirst({
      where: {
        kullaniciId,
        esnafId: parsed.data.esnafId,
        olusturmaT: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      },
      select: { id: true },
    })
    if (son) return hata('Bu işletmeye son 24 saatte yorum yaptınız', 409)

    const temizYorum = temizMetinOpsiyonel(parsed.data.yorum ?? null, 500)

    if (temizYorum && kufurVarMi(temizYorum)) {
      return hata('Yorumunuz uygunsuz içerik içeriyor.', 400)
    }
    if (kufurVarMi(parsed.data.musteriAd)) {
      return hata('Yorumunuz uygunsuz içerik içeriyor.', 400)
    }

    const yorum = await prisma.yorum.create({
      data: {
        puan: parsed.data.puan,
        yorum: temizYorum,
        musteriAd: parsed.data.musteriAd.trim(),
        esnafId: parsed.data.esnafId,
        kullaniciId,
        onaylı: true,
      },
    })

    logger.info('yorum.olustu', { yorumId: yorum.id, esnafId: parsed.data.esnafId })
    return basari(yorum, 201)
  } catch (err) {
    logger.error('yorum.POST', { err: String(err) })
    return hata('Sunucu hatası', 500)
  }
}
