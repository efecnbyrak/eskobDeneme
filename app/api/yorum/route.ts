import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { YorumSchema } from '@/lib/validations'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const esnafIdStr = searchParams.get('esnafId')
    if (!esnafIdStr) return NextResponse.json({ error: 'esnafId gerekli' }, { status: 400 })

    const yorumlar = await prisma.yorum.findMany({
      where: { esnafId: parseInt(esnafIdStr), onaylı: true },
      orderBy: { olusturmaT: 'desc' },
    })

    return NextResponse.json({ yorumlar })
  } catch {
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const veri = YorumSchema.parse(body)

    const yorum = await prisma.yorum.create({
      data: {
        puan: veri.puan,
        yorum: veri.yorum,
        musteriAd: veri.musteriAd,
        esnafId: veri.esnafId,
      },
    })

    return NextResponse.json(yorum, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Geçersiz veri' }, { status: 400 })
  }
}
