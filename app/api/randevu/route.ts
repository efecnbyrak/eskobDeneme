import { NextRequest } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { mobilAuth } from '@/lib/auth'
import { RandevuSchema } from '@/lib/validations'
import { rateLimit, istemciKimligi } from '@/lib/rateLimit'
import { temizMetinOpsiyonel } from '@/lib/sanitize'
import { basari, hata } from '@/lib/api'
import { logger } from '@/lib/logger'

const DurumSchema = z.enum(['BEKLIYOR', 'ONAYLANDI', 'IPTAL', 'TAMAMLANDI'])

export async function GET(req: NextRequest) {
  try {
    const oturum = await mobilAuth(req)
    if (!oturum?.user?.email) return hata('Yetkisiz', 401)

    const kullanici = await prisma.kullanici.findUnique({
      where: { email: oturum.user.email },
      include: { esnaf: true },
    })
    if (!kullanici?.esnaf) return hata('İşletme bulunamadı', 403)

    const { searchParams } = new URL(req.url)
    const esnafIdStr = searchParams.get('esnafId')
    const esnafId = esnafIdStr ? parseInt(esnafIdStr) : kullanici.esnaf.id
    if (!Number.isInteger(esnafId) || esnafId !== kullanici.esnaf.id) {
      return hata('Yetkisiz', 403)
    }

    const randevular = await prisma.randevu.findMany({
      where: { esnafId },
      include: { hizmet: true },
      orderBy: { tarih: 'desc' },
    })

    return basari({ randevular })
  } catch (err) {
    logger.error('randevu.GET', { err: String(err) })
    return hata('Sunucu hatası', 500)
  }
}

export async function POST(req: NextRequest) {
  try {
    const oturum = await mobilAuth(req)
    if (!oturum?.user?.id) return hata('Randevu almak için giriş yapın', 401)
    if (oturum.user.rol !== 'USER') {
      return hata('Sadece müşteri hesapları randevu alabilir', 403)
    }

    const ip = istemciKimligi(req)
    const limit = rateLimit(`randevu:post:${ip}`, 5, 60)
    if (!limit.basarili) {
      return hata('Çok hızlı randevu denemesi. Lütfen bir dakika bekleyin.', 429)
    }

    const body = await req.json().catch(() => null)
    const parsed = RandevuSchema.safeParse(body)
    if (!parsed.success) {
      const ilk = parsed.error.issues[0]
      return hata(ilk?.message ?? 'Geçersiz veri', 400, parsed.error.flatten().fieldErrors as Record<string, string[]>)
    }

    const v = parsed.data
    const baslangic = new Date(v.tarih)
    if (isNaN(baslangic.getTime())) return hata('Geçersiz tarih', 400)
    if (baslangic.getTime() < Date.now() - 60_000) {
      return hata('Geçmiş tarihe randevu alınamaz', 400)
    }
    const bitis = new Date(baslangic.getTime() + v.sure * 60_000)

    const esnaf = await prisma.esnaf.findUnique({
      where: { id: v.esnafId },
      select: { id: true, aktif: true, onaylı: true },
    })
    if (!esnaf || !esnaf.aktif || !esnaf.onaylı) {
      return hata('Bu işletme şu anda randevu kabul etmiyor', 400)
    }

    if (v.hizmetId) {
      const hizmet = await prisma.hizmet.findUnique({
        where: { id: v.hizmetId },
        select: { esnafId: true, aktif: true },
      })
      if (!hizmet || hizmet.esnafId !== v.esnafId || !hizmet.aktif) {
        return hata('Hizmet bu işletmede bulunamadı', 400)
      }
    }

    const kullaniciId = parseInt(oturum.user.id)
    if (!Number.isInteger(kullaniciId)) return hata('Oturum hatası', 401)

    const temizNot = temizMetinOpsiyonel(v.musteriNot ?? null, 500)

    try {
      const randevu = await prisma.$transaction(async (tx) => {
        await tx.$executeRaw`SELECT pg_advisory_xact_lock(${v.esnafId}::bigint)`

        const cakisan = await tx.$queryRaw<Array<{ id: number }>>`
          SELECT id FROM randevular
          WHERE "esnafId" = ${v.esnafId}
            AND durum IN ('BEKLIYOR', 'ONAYLANDI')
            AND tarih < ${bitis}
            AND (tarih + (sure || ' minutes')::interval) > ${baslangic}
          LIMIT 1
        `
        if (cakisan.length > 0) throw new Error('SLOT_DOLU')

        return tx.randevu.create({
          data: {
            tarih: baslangic,
            sure: v.sure,
            musteriAd: v.musteriAd.trim(),
            musteriTelefon: v.musteriTelefon.replace(/\s+/g, ''),
            musteriNot: temizNot,
            esnafId: v.esnafId,
            hizmetId: v.hizmetId ?? null,
            kullaniciId,
          },
        })
      })

      logger.info('randevu.olustu', { randevuId: randevu.id, esnafId: v.esnafId, kullaniciId })
      return basari(randevu, 201)
    } catch (err) {
      if (err instanceof Error && err.message === 'SLOT_DOLU') {
        return hata('Bu saat dolu, lütfen farklı bir saat seçin', 409)
      }
      throw err
    }
  } catch (err) {
    logger.error('randevu.POST', { err: String(err) })
    return hata('Sunucu hatası', 500)
  }
}

export async function PUT(req: NextRequest) {
  try {
    const oturum = await mobilAuth(req)
    if (!oturum?.user?.email) return hata('Yetkisiz', 401)

    const kullanici = await prisma.kullanici.findUnique({
      where: { email: oturum.user.email },
      include: { esnaf: true },
    })
    if (!kullanici?.esnaf) return hata('İşletme bulunamadı', 403)

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return hata('ID gerekli', 400)
    const numId = parseInt(id)
    if (!Number.isInteger(numId)) return hata('Geçersiz ID', 400)

    const mevcut = await prisma.randevu.findUnique({ where: { id: numId } })
    if (!mevcut || mevcut.esnafId !== kullanici.esnaf.id) return hata('Yetkisiz', 403)

    const body = await req.json().catch(() => ({}))
    const durumParsed = DurumSchema.safeParse(body?.durum)
    if (!durumParsed.success) return hata('Geçersiz durum', 400)

    const randevu = await prisma.randevu.update({
      where: { id: numId },
      data: { durum: durumParsed.data },
    })

    return basari(randevu)
  } catch (err) {
    logger.error('randevu.PUT', { err: String(err) })
    return hata('Sunucu hatası', 500)
  }
}
