import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { RandevuSchema } from '@/lib/validations'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const esnafId = searchParams.get('esnafId')
    if (!esnafId) return NextResponse.json({ error: 'esnafId gerekli' }, { status: 400 })

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
        hizmetId: veri.hizmetId,
      },
    })

    return NextResponse.json(randevu, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Geçersiz veri' }, { status: 400 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'ID gerekli' }, { status: 400 })

    const body = await req.json()
    const randevu = await prisma.randevu.update({
      where: { id },
      data: { durum: body.durum },
    })

    return NextResponse.json(randevu)
  } catch {
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
