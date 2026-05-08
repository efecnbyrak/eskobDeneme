import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { mobilAuth } from '@/lib/auth'
import { HizmetSchema } from '@/lib/validations'
import { temizMetin, temizMetinOpsiyonel } from '@/lib/sanitize'
import { basari, hata } from '@/lib/api'
import { logger } from '@/lib/logger'

export async function GET(req: NextRequest) {
  try {
    const oturum = await mobilAuth(req)
    if (!oturum?.user?.email) return hata('Yetkisiz', 401)

    const kullanici = await prisma.kullanici.findUnique({
      where: { email: oturum.user.email },
      include: { esnaf: true },
    })

    if (!kullanici?.esnaf) return basari({ hizmetler: [], esnafId: 0 })

    const hizmetler = await prisma.hizmet.findMany({
      where: { esnafId: kullanici.esnaf.id },
      orderBy: { sira: 'asc' },
    })

    return basari({ hizmetler, esnafId: kullanici.esnaf.id })
  } catch {
    return hata('Sunucu hatası', 500)
  }
}

export async function POST(req: NextRequest) {
  try {
    const oturum = await mobilAuth(req)
    if (!oturum?.user?.email) return hata('Yetkisiz', 401)

    const kullanici = await prisma.kullanici.findUnique({
      where: { email: oturum.user.email },
      include: { esnaf: true },
    })
    if (!kullanici?.esnaf) return hata('İşletme bulunamadı', 403)

    const body = await req.json().catch(() => null)
    const parsed = HizmetSchema.safeParse(body)
    if (!parsed.success) {
      return hata(parsed.error.issues[0]?.message ?? 'Geçersiz veri', 400)
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

    return basari(hizmet, 201)
  } catch {
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

    const mevcut = await prisma.hizmet.findUnique({ where: { id: parseInt(id) } })
    if (!mevcut || mevcut.esnafId !== kullanici.esnaf.id) return hata('Yetkisiz', 403)

    const body = await req.json().catch(() => null)
    const parsed = HizmetSchema.safeParse(body)
    if (!parsed.success) {
      return hata(parsed.error.issues[0]?.message ?? 'Geçersiz veri', 400)
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

    return basari(hizmet)
  } catch {
    return hata('Sunucu hatası', 500)
  }
}

export async function DELETE(req: NextRequest) {
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

    const mevcut = await prisma.hizmet.findUnique({ where: { id: parseInt(id) } })
    if (!mevcut || mevcut.esnafId !== kullanici.esnaf.id) return hata('Yetkisiz', 403)

    await prisma.hizmet.update({ where: { id: parseInt(id) }, data: { aktif: false } })

    return basari({ ok: true })
  } catch (err) {
    logger.error('hizmet.DELETE', { err: String(err) })
    return hata('Sunucu hatası', 500)
  }
}
