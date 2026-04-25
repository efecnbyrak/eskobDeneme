import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { YorumSchema } from '@/lib/validations'
import { rateLimit, istemciKimligi } from '@/lib/rateLimit'
import { temizMetinOpsiyonel } from '@/lib/sanitize'
import { logger } from '@/lib/logger'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const esnafIdStr = searchParams.get('esnafId')
    if (!esnafIdStr) {
      return NextResponse.json({ error: 'esnafId gerekli' }, { status: 400 })
    }
    const esnafId = parseInt(esnafIdStr)
    if (!Number.isInteger(esnafId)) {
      return NextResponse.json({ error: 'Geçersiz esnafId' }, { status: 400 })
    }

    const yorumlar = await prisma.yorum.findMany({
      where: { esnafId, onaylı: true },
      orderBy: { olusturmaT: 'desc' },
    })

    return NextResponse.json({ yorumlar })
  } catch (err) {
    logger.error('yorum.GET', { err: String(err) })
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    // ── Auth zorunlu ──
    const oturum = await auth()
    if (!oturum?.user?.id) {
      return NextResponse.json(
        { error: 'Yorum yazmak için giriş yapın' },
        { status: 401 }
      )
    }
    if (oturum.user.rol !== 'USER') {
      return NextResponse.json(
        { error: 'Sadece müşteri hesapları yorum yazabilir' },
        { status: 403 }
      )
    }

    // ── Rate limit: kullanıcı bazlı dakikada 3 yorum ──
    const limit = rateLimit(`yorum:${oturum.user.id}`, 3, 60)
    if (!limit.basarili) {
      return NextResponse.json(
        { error: 'Çok hızlı yorum denemesi. Lütfen bekleyin.' },
        { status: 429 }
      )
    }
    // Ek IP bazlı kalkan (bot için)
    const ipLimit = rateLimit(`yorum:ip:${istemciKimligi(req)}`, 10, 60)
    if (!ipLimit.basarili) {
      return NextResponse.json({ error: 'Çok hızlı' }, { status: 429 })
    }

    const body = await req.json().catch(() => null)
    const parsed = YorumSchema.safeParse(body)
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

    const kullaniciId = parseInt(oturum.user.id)
    if (!Number.isInteger(kullaniciId)) {
      return NextResponse.json({ error: 'Oturum hatası' }, { status: 401 })
    }

    // Aynı kullanıcı aynı esnafa spam yapamasın — son 24 saatte 1 yorum
    const son = await prisma.yorum.findFirst({
      where: {
        kullaniciId,
        esnafId: parsed.data.esnafId,
        olusturmaT: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      },
      select: { id: true },
    })
    if (son) {
      return NextResponse.json(
        { error: 'Bu işletmeye son 24 saatte yorum yaptınız' },
        { status: 409 }
      )
    }

    const temizYorum = temizMetinOpsiyonel(parsed.data.yorum ?? null, 500)

    const yorum = await prisma.yorum.create({
      data: {
        puan: parsed.data.puan,
        yorum: temizYorum,
        musteriAd: parsed.data.musteriAd.trim(),
        esnafId: parsed.data.esnafId,
        kullaniciId,
        onaylı: false,
      },
    })

    logger.info('yorum.olustu', { yorumId: yorum.id, esnafId: parsed.data.esnafId })
    return NextResponse.json(yorum, { status: 201 })
  } catch (err) {
    logger.error('yorum.POST', { err: String(err) })
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
