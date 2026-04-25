import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { temizMetinOpsiyonel } from '@/lib/sanitize'
import { logger } from '@/lib/logger'

interface Props {
  params: Promise<{ id: string }>
}

function parseId(raw: string): number | null {
  const n = parseInt(raw)
  return Number.isInteger(n) && n > 0 ? n : null
}

export async function GET(_req: NextRequest, { params }: Props) {
  try {
    const { id } = await params
    const numId = parseId(id)
    if (numId === null) {
      return NextResponse.json({ error: 'Geçersiz ID' }, { status: 400 })
    }

    const esnaf = await prisma.esnaf.findUnique({
      where: { id: numId },
      include: {
        kategori: true,
        hizmetler: { where: { aktif: true } },
        yorumlar: { where: { onaylı: true } },
      },
    })
    if (!esnaf) return NextResponse.json({ error: 'Bulunamadı' }, { status: 404 })
    return NextResponse.json(esnaf)
  } catch (err) {
    logger.error('esnaf[id].GET', { err: String(err) })
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: Props) {
  try {
    const oturum = await auth()
    if (!oturum?.user?.email) {
      return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })
    }

    const { id } = await params
    const numId = parseId(id)
    if (numId === null) {
      return NextResponse.json({ error: 'Geçersiz ID' }, { status: 400 })
    }

    const body = await req.json().catch(() => ({}))

    const kullanici = await prisma.kullanici.findUnique({
      where: { email: oturum.user.email },
      include: { esnaf: true },
    })

    const isAdmin =
      oturum.user.rol === 'ADMIN' || oturum.user.rol === 'SUPER_ADMIN'

    if (!isAdmin && kullanici?.esnaf?.id !== numId) {
      return NextResponse.json(
        { error: 'Bu kaydı düzenleme yetkiniz yok' },
        { status: 403 }
      )
    }

    const esnaf = await prisma.esnaf.update({
      where: { id: numId },
      data: {
        isletmeAdi:
          typeof body.isletmeAdi === 'string'
            ? body.isletmeAdi.trim().slice(0, 120)
            : undefined,
        aciklama: temizMetinOpsiyonel(body.aciklama, 500),
        telefon: temizMetinOpsiyonel(body.telefon, 30),
        whatsapp: temizMetinOpsiyonel(body.whatsapp, 30),
        website: temizMetinOpsiyonel(body.website, 200),
        instagram: temizMetinOpsiyonel(body.instagram, 60),
        kapakFoto: temizMetinOpsiyonel(body.kapakFoto, 500),
        logoUrl: temizMetinOpsiyonel(body.logoUrl, 500),
        calismaS: body.calismaS ?? undefined,
      },
      select: { id: true, slug: true, sehir: true, isletmeAdi: true, aciklama: true, telefon: true, whatsapp: true, website: true, instagram: true, kapakFoto: true, logoUrl: true, calismaS: true },
    })

    revalidatePath(`/${esnaf.sehir.toLowerCase()}/${esnaf.slug}`)
    return NextResponse.json(esnaf)
  } catch (err) {
    logger.error('esnaf[id].PUT', { err: String(err) })
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: Props) {
  try {
    const oturum = await auth()
    if (!oturum?.user?.email) {
      return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })
    }

    const { id } = await params
    const numId = parseId(id)
    if (numId === null) {
      return NextResponse.json({ error: 'Geçersiz ID' }, { status: 400 })
    }

    const kullanici = await prisma.kullanici.findUnique({
      where: { email: oturum.user.email },
      include: { esnaf: true },
    })

    const isAdmin =
      oturum.user.rol === 'ADMIN' || oturum.user.rol === 'SUPER_ADMIN'

    if (!isAdmin && kullanici?.esnaf?.id !== numId) {
      return NextResponse.json(
        { error: 'Bu kaydı silme yetkiniz yok' },
        { status: 403 }
      )
    }

    const esnaf = await prisma.esnaf.update({
      where: { id: numId },
      data: { aktif: false },
      select: { sehir: true, slug: true },
    })

    revalidatePath(`/${esnaf.sehir.toLowerCase()}/${esnaf.slug}`)
    return NextResponse.json({ ok: true })
  } catch (err) {
    logger.error('esnaf[id].DELETE', { err: String(err) })
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
