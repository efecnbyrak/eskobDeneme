import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { RandevuSchema } from '@/lib/validations'

export async function GET(req: NextRequest) {
  try {
    const oturum = await auth()
    if (!oturum?.user?.email) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

    const kullanici = await prisma.kullanici.findUnique({
      where: { email: oturum.user.email },
      include: { esnaf: true },
    })
    if (!kullanici?.esnaf) return NextResponse.json({ error: 'İşletme bulunamadı' }, { status: 403 })

    const { searchParams } = new URL(req.url)
    const esnafIdStr = searchParams.get('esnafId')

    const esnafId = esnafIdStr ? parseInt(esnafIdStr) : kullanici.esnaf.id
    if (esnafId !== kullanici.esnaf.id) {
      return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })
    }

    const randevular = await prisma.randevu.findMany({
      where: { esnafId },
      include: { hizmet: true },
      orderBy: { tarih: 'desc' },
    })

    return NextResponse.json({ randevular })
  } catch {
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const veri = RandevuSchema.parse(body)

    const randevu = await prisma.randevu.create({
      data: {
        tarih: new Date(veri.tarih),
        sure: veri.sure,
        musteriAd: veri.musteriAd,
        musteriTelefon: veri.musteriTelefon,
        musteriNot: veri.musteriNot,
        esnafId: veri.esnafId,
        hizmetId: veri.hizmetId ?? null,
      },
    })

    return NextResponse.json(randevu, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Geçersiz veri' }, { status: 400 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const oturum = await auth()
    if (!oturum?.user?.email) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

    const kullanici = await prisma.kullanici.findUnique({
      where: { email: oturum.user.email },
      include: { esnaf: true },
    })
    if (!kullanici?.esnaf) return NextResponse.json({ error: 'İşletme bulunamadı' }, { status: 403 })

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'ID gerekli' }, { status: 400 })

    const mevcut = await prisma.randevu.findUnique({ where: { id: parseInt(id) } })
    if (!mevcut || mevcut.esnafId !== kullanici.esnaf.id) {
      return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })
    }

    const body = await req.json()
    const randevu = await prisma.randevu.update({
      where: { id: parseInt(id) },
      data: { durum: body.durum },
    })

    return NextResponse.json(randevu)
  } catch {
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
