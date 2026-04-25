import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { RandevuSchema } from '@/lib/validations'
import { rateLimit, istemciKimligi } from '@/lib/rateLimit'
import { temizMetinOpsiyonel } from '@/lib/sanitize'
import { logger } from '@/lib/logger'

const DurumSchema = z.enum(['BEKLIYOR', 'ONAYLANDI', 'IPTAL', 'TAMAMLANDI'])

export async function GET(req: NextRequest) {
  try {
    const oturum = await auth()
    if (!oturum?.user?.email) {
      return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })
    }

    const kullanici = await prisma.kullanici.findUnique({
      where: { email: oturum.user.email },
      include: { esnaf: true },
    })
    if (!kullanici?.esnaf) {
      return NextResponse.json({ error: 'İşletme bulunamadı' }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const esnafIdStr = searchParams.get('esnafId')
    const esnafId = esnafIdStr ? parseInt(esnafIdStr) : kullanici.esnaf.id
    if (!Number.isInteger(esnafId) || esnafId !== kullanici.esnaf.id) {
      return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })
    }

    const randevular = await prisma.randevu.findMany({
      where: { esnafId },
      include: { hizmet: true },
      orderBy: { tarih: 'desc' },
    })

    return NextResponse.json({ randevular })
  } catch (err) {
    logger.error('randevu.GET', { err: String(err) })
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    // ── Auth: sadece giriş yapmış kullanıcılar ──
    const oturum = await auth()
    if (!oturum?.user?.id) {
      return NextResponse.json({ error: 'Randevu almak için giriş yapın' }, { status: 401 })
    }
    if (oturum.user.rol !== 'USER') {
      return NextResponse.json(
        { error: 'Sadece müşteri hesapları randevu alabilir' },
        { status: 403 }
      )
    }

    // ── Rate limit: dakikada 5 randevu denemesi ──
    const ip = istemciKimligi(req)
    const limit = rateLimit(`randevu:post:${ip}`, 5, 60)
    if (!limit.basarili) {
      return NextResponse.json(
        { error: 'Çok hızlı randevu denemesi. Lütfen bir dakika bekleyin.' },
        { status: 429 }
      )
    }

    // ── Validasyon ──
    const body = await req.json().catch(() => null)
    const parsed = RandevuSchema.safeParse(body)
    if (!parsed.success) {
      const ilk = parsed.error.issues[0]
      return NextResponse.json(
        {
          error: ilk?.message ?? 'Geçersiz veri',
          alanlar: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      )
    }

    const v = parsed.data
    const baslangic = new Date(v.tarih)
    if (isNaN(baslangic.getTime())) {
      return NextResponse.json({ error: 'Geçersiz tarih' }, { status: 400 })
    }
    if (baslangic.getTime() < Date.now() - 60_000) {
      return NextResponse.json(
        { error: 'Geçmiş tarihe randevu alınamaz' },
        { status: 400 }
      )
    }
    const bitis = new Date(baslangic.getTime() + v.sure * 60_000)

    // Esnaf var mı ve aktif mi?
    const esnaf = await prisma.esnaf.findUnique({
      where: { id: v.esnafId },
      select: { id: true, aktif: true, onaylı: true },
    })
    if (!esnaf || !esnaf.aktif || !esnaf.onaylı) {
      return NextResponse.json(
        { error: 'Bu işletme şu anda randevu kabul etmiyor' },
        { status: 400 }
      )
    }

    // Hizmet varsa esnafa ait olduğunu doğrula
    if (v.hizmetId) {
      const hizmet = await prisma.hizmet.findUnique({
        where: { id: v.hizmetId },
        select: { esnafId: true, aktif: true },
      })
      if (!hizmet || hizmet.esnafId !== v.esnafId || !hizmet.aktif) {
        return NextResponse.json(
          { error: 'Hizmet bu işletmede bulunamadı' },
          { status: 400 }
        )
      }
    }

    // ── Slot çakışması kontrolü — transaction + advisory lock ──
    // Aynı esnaf için serialize et, atomik kontrol+insert garantisi
    const kullaniciId = parseInt(oturum.user.id)
    if (!Number.isInteger(kullaniciId)) {
      return NextResponse.json({ error: 'Oturum hatası' }, { status: 401 })
    }

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
        if (cakisan.length > 0) {
          throw new Error('SLOT_DOLU')
        }

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
      return NextResponse.json(randevu, { status: 201 })
    } catch (err) {
      if (err instanceof Error && err.message === 'SLOT_DOLU') {
        return NextResponse.json(
          { error: 'Bu saat dolu, lütfen farklı bir saat seçin' },
          { status: 409 }
        )
      }
      throw err
    }
  } catch (err) {
    logger.error('randevu.POST', { err: String(err) })
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const oturum = await auth()
    if (!oturum?.user?.email) {
      return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })
    }

    const kullanici = await prisma.kullanici.findUnique({
      where: { email: oturum.user.email },
      include: { esnaf: true },
    })
    if (!kullanici?.esnaf) {
      return NextResponse.json({ error: 'İşletme bulunamadı' }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'ID gerekli' }, { status: 400 })
    const numId = parseInt(id)
    if (!Number.isInteger(numId)) {
      return NextResponse.json({ error: 'Geçersiz ID' }, { status: 400 })
    }

    const mevcut = await prisma.randevu.findUnique({ where: { id: numId } })
    if (!mevcut || mevcut.esnafId !== kullanici.esnaf.id) {
      return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })
    }

    const body = await req.json().catch(() => ({}))
    const durumParsed = DurumSchema.safeParse(body?.durum)
    if (!durumParsed.success) {
      return NextResponse.json({ error: 'Geçersiz durum' }, { status: 400 })
    }

    const randevu = await prisma.randevu.update({
      where: { id: numId },
      data: { durum: durumParsed.data },
    })

    return NextResponse.json(randevu)
  } catch (err) {
    logger.error('randevu.PUT', { err: String(err) })
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
