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
      include: { hizmetKategorisi: true },
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

    const hizmetKategorisiId = typeof body?.hizmetKategorisiId === 'number' ? body.hizmetKategorisiId : null

    const hizmet = await prisma.hizmet.create({
      data: {
        ad: temizMetin(veri.ad, 120),
        fiyat: veri.fiyat,
        sure: veri.sure,
        aciklama: temizMetinOpsiyonel(veri.aciklama, 500),
        kategori: temizMetinOpsiyonel(veri.kategori, 60),
        sira: veri.sira ?? 0,
        oneCikan: veri.oneCikan ?? false,
        onlineOdeme: veri.onlineOdeme ?? false,
        minOnRezervasyon: veri.minOnRezervasyon ?? 0,
        maksKatilimci: veri.maksKatilimci ?? 1,
        esnafId: kullanici.esnaf.id,
        hizmetKategorisiId,
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

    const { indirimYuzde, indirimBaslangic, indirimBitis, hizmetKategorisiId } = body as {
      indirimYuzde?: number | null
      indirimBaslangic?: string | null
      indirimBitis?: string | null
      hizmetKategorisiId?: number | null
    }

    const hizmet = await prisma.hizmet.update({
      where: { id: parseInt(id) },
      data: {
        ad: temizMetin(veri.ad, 120),
        fiyat: veri.fiyat,
        sure: veri.sure,
        aciklama: temizMetinOpsiyonel(veri.aciklama, 500),
        kategori: temizMetinOpsiyonel(veri.kategori, 60),
        ...(veri.sira !== undefined && { sira: veri.sira }),
        ...(veri.oneCikan !== undefined && { oneCikan: veri.oneCikan }),
        ...(veri.onlineOdeme !== undefined && { onlineOdeme: veri.onlineOdeme }),
        ...(veri.minOnRezervasyon !== undefined && { minOnRezervasyon: veri.minOnRezervasyon }),
        ...(veri.maksKatilimci !== undefined && { maksKatilimci: veri.maksKatilimci }),
        ...(indirimYuzde !== undefined && { indirimYuzde: indirimYuzde ?? null }),
        ...(indirimBaslangic !== undefined && { indirimBaslangic: indirimBaslangic ? new Date(indirimBaslangic) : null }),
        ...(indirimBitis !== undefined && { indirimBitis: indirimBitis ? new Date(indirimBitis) : null }),
        ...(hizmetKategorisiId !== undefined && { hizmetKategorisiId: hizmetKategorisiId ?? null }),
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
