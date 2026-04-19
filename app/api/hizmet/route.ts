import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { HizmetSchema } from '@/lib/validations'

export async function GET(req: NextRequest) {
  try {
    const oturum = await auth()
    if (!oturum?.user?.email) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

    const kullanici = await prisma.kullanici.findUnique({
      where: { email: oturum.user.email },
      include: { esnaf: true },
    })

    if (!kullanici?.esnaf) return NextResponse.json({ hizmetler: [], esnafId: '' })

    const hizmetler = await prisma.hizmet.findMany({
      where: { esnafId: kullanici.esnaf.id },
      orderBy: { sira: 'asc' },
    })

    return NextResponse.json({ hizmetler, esnafId: kullanici.esnaf.id })
  } catch {
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const oturum = await auth()
    if (!oturum?.user?.email) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

    const body = await req.json()
    const veri = HizmetSchema.parse(body)

    const hizmet = await prisma.hizmet.create({
      data: {
        ad: veri.ad,
        fiyat: veri.fiyat,
        sure: veri.sure,
        aciklama: veri.aciklama,
        kategori: veri.kategori,
        esnafId: body.esnafId,
      },
    })

    return NextResponse.json(hizmet, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const oturum = await auth()
    if (!oturum?.user?.email) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'ID gerekli' }, { status: 400 })

    const body = await req.json()
    const veri = HizmetSchema.parse(body)

    const hizmet = await prisma.hizmet.update({
      where: { id },
      data: { ad: veri.ad, fiyat: veri.fiyat, sure: veri.sure, aciklama: veri.aciklama },
    })

    return NextResponse.json(hizmet)
  } catch {
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const oturum = await auth()
    if (!oturum?.user?.email) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'ID gerekli' }, { status: 400 })

    await prisma.hizmet.update({ where: { id }, data: { aktif: false } })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
