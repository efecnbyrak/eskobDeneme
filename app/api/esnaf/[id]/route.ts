import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'

interface Props {
  params: Promise<{ id: string }>
}

export async function GET(_req: NextRequest, { params }: Props) {
  try {
    const { id } = await params
    const esnaf = await prisma.esnaf.findUnique({
      where: { id: parseInt(id) },
      include: {
        kategori: true,
        hizmetler: { where: { aktif: true } },
        yorumlar: { where: { onaylı: true } },
      },
    })
    if (!esnaf) return NextResponse.json({ error: 'Bulunamadı' }, { status: 404 })
    return NextResponse.json(esnaf)
  } catch {
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: Props) {
  try {
    const oturum = await auth()
    if (!oturum?.user?.email) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

    const { id } = await params
    const numId = parseInt(id)
    const body = await req.json()

    const kullanici = await prisma.kullanici.findUnique({
      where: { email: oturum.user.email },
      include: { esnaf: true },
    })

    if (kullanici?.esnaf?.id !== numId) {
      return NextResponse.json({ error: 'Bu kaydı düzenleme yetkiniz yok' }, { status: 403 })
    }

    const esnaf = await prisma.esnaf.update({
      where: { id: numId },
      data: {
        isletmeAdi: body.isletmeAdi,
        aciklama: body.aciklama,
        telefon: body.telefon,
        whatsapp: body.whatsapp,
        website: body.website,
        instagram: body.instagram,
        kapakFoto: body.kapakFoto,
        logoUrl: body.logoUrl,
        calismaS: body.calismaS,
      },
    })

    return NextResponse.json(esnaf)
  } catch {
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: Props) {
  try {
    const oturum = await auth()
    if (!oturum?.user?.email) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

    const { id } = await params
    const numId = parseInt(id)

    const kullanici = await prisma.kullanici.findUnique({
      where: { email: oturum.user.email },
      include: { esnaf: true },
    })

    if (kullanici?.esnaf?.id !== numId) {
      return NextResponse.json({ error: 'Bu kaydı silme yetkiniz yok' }, { status: 403 })
    }

    await prisma.esnaf.update({ where: { id: numId }, data: { aktif: false } })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
