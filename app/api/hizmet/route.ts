import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { HizmetSchema } from '@/lib/validations'
import { temizMetin, temizMetinOpsiyonel } from '@/lib/sanitize'
import { logger } from '@/lib/logger'

export async function GET(req: NextRequest) {
  try {
    const oturum = await auth()
    if (!oturum?.user?.email) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

    const kullanici = await prisma.kullanici.findUnique({
      where: { email: oturum.user.email },
      include: { esnaf: true },
    })

    if (!kullanici?.esnaf) return NextResponse.json({ hizmetler: [], esnafId: 0 })

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

    const kullanici = await prisma.kullanici.findUnique({
      where: { email: oturum.user.email },
      include: { esnaf: true },
    })
    if (!kullanici?.esnaf) return NextResponse.json({ error: 'İşletme bulunamadı' }, { status: 403 })

    const body = await req.json().catch(() => null)
    const parsed = HizmetSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? 'Geçersiz veri' },
        { status: 400 }
      )
    }
    const veri = parsed.data

    const hizmet = await prisma.hizmet.create({
      data: {
        ad: temizMetin(veri.ad, 120),
        fiyat: veri.fiyat,
        sure: veri.sure,
        aciklama: temizMetinOpsiyonel(veri.aciklama, 500),
        kategori: temizMetinOpsiyonel(veri.kategori, 60),
        esnafId: kullanici.esnaf.id,
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

    const kullanici = await prisma.kullanici.findUnique({
      where: { email: oturum.user.email },
      include: { esnaf: true },
    })
    if (!kullanici?.esnaf) return NextResponse.json({ error: 'İşletme bulunamadı' }, { status: 403 })

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'ID gerekli' }, { status: 400 })

    const mevcut = await prisma.hizmet.findUnique({ where: { id: parseInt(id) } })
    if (!mevcut || mevcut.esnafId !== kullanici.esnaf.id) {
      return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })
    }

    const body = await req.json().catch(() => null)
    const parsed = HizmetSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? 'Geçersiz veri' },
        { status: 400 }
      )
    }
    const veri = parsed.data

    const hizmet = await prisma.hizmet.update({
      where: { id: parseInt(id) },
      data: {
        ad: temizMetin(veri.ad, 120),
        fiyat: veri.fiyat,
        sure: veri.sure,
        aciklama: temizMetinOpsiyonel(veri.aciklama, 500),
      },
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

    const kullanici = await prisma.kullanici.findUnique({
      where: { email: oturum.user.email },
      include: { esnaf: true },
    })
    if (!kullanici?.esnaf) return NextResponse.json({ error: 'İşletme bulunamadı' }, { status: 403 })

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'ID gerekli' }, { status: 400 })

    const mevcut = await prisma.hizmet.findUnique({ where: { id: parseInt(id) } })
    if (!mevcut || mevcut.esnafId !== kullanici.esnaf.id) {
      return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })
    }

    await prisma.hizmet.update({ where: { id: parseInt(id) }, data: { aktif: false } })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
