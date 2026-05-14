import { NextRequest } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/db'
import { mobilAuth } from '@/lib/auth'
import { temizMetinOpsiyonel } from '@/lib/sanitize'
import { basari, hata } from '@/lib/api'
import { logger } from '@/lib/logger'

interface Props {
  params: Promise<{ id: string }>
}

function parseId(raw: string): number | null {
  const n = parseInt(raw)
  return Number.isInteger(n) && n > 0 ? n : null
}

export async function GET(req: NextRequest, { params }: Props) {
  try {
    const { id } = await params
    const numId = parseId(id)
    if (numId === null) return hata('Geçersiz ID', 400)

    const esnaf = await prisma.esnaf.findUnique({
      where: { id: numId },
      include: {
        kategori: true,
        hizmetler: { where: { aktif: true } },
        yorumlar: { where: { onaylı: true } },
      },
    })
    if (!esnaf) return hata('Bulunamadı', 404)

    return basari(esnaf)
  } catch (err) {
    logger.error('esnaf[id].GET', { err: String(err) })
    return hata('Sunucu hatası', 500)
  }
}

export async function PUT(req: NextRequest, { params }: Props) {
  try {
    const oturum = await mobilAuth(req)
    if (!oturum?.user?.email) return hata('Yetkisiz', 401)

    const { id } = await params
    const numId = parseId(id)
    if (numId === null) return hata('Geçersiz ID', 400)

    const body = await req.json().catch(() => ({}))

    const kullanici = await prisma.kullanici.findUnique({
      where: { email: oturum.user.email },
      include: { esnaf: true },
    })

    const isAdmin = oturum.user.rol === 'ADMIN' || oturum.user.rol === 'SUPER_ADMIN'

    if (!isAdmin && kullanici?.esnaf?.id !== numId) {
      return hata('Bu kaydı düzenleme yetkiniz yok', 403)
    }

    // isletmeAdi değişikliği Süper Admin onayı gerektirir — bekleyenIsletmeAdi'na yaz
    const yeniIsletmeAdi = typeof body.isletmeAdi === 'string' ? body.isletmeAdi.trim().slice(0, 120) : undefined
    const mevcutEsnaf = await prisma.esnaf.findUnique({ where: { id: numId }, select: { isletmeAdi: true } })
    const isletmeAdiDegisti = yeniIsletmeAdi !== undefined && yeniIsletmeAdi !== mevcutEsnaf?.isletmeAdi

    const esnaf = await prisma.esnaf.update({
      where: { id: numId },
      data: {
        // Sadece admin isletmeAdi'nı doğrudan değiştirebilir, işletme sahibi bekleyenIsletmeAdi'na yazar
        ...(isAdmin && yeniIsletmeAdi !== undefined ? { isletmeAdi: yeniIsletmeAdi } : {}),
        ...((!isAdmin && isletmeAdiDegisti) ? { bekleyenIsletmeAdi: yeniIsletmeAdi } : {}),
        aciklama: temizMetinOpsiyonel(body.aciklama, 500),
        telefon: temizMetinOpsiyonel(body.telefon, 30),
        whatsapp: temizMetinOpsiyonel(body.whatsapp, 30),
        website: temizMetinOpsiyonel(body.website, 200),
        instagram: temizMetinOpsiyonel(body.instagram, 60),
        kapakFoto: temizMetinOpsiyonel(body.kapakFoto, 500),
        logoUrl: temizMetinOpsiyonel(body.logoUrl, 500),
        calismaS: body.calismaS ?? undefined,
      },
      select: {
        id: true, slug: true, sehir: true, isletmeAdi: true, bekleyenIsletmeAdi: true, aciklama: true,
        telefon: true, whatsapp: true, website: true, instagram: true,
        kapakFoto: true, logoUrl: true, calismaS: true,
      },
    })

    revalidatePath(`/${esnaf.sehir.toLowerCase()}/${esnaf.slug}`)
    return basari(esnaf)
  } catch (err) {
    logger.error('esnaf[id].PUT', { err: String(err) })
    return hata('Sunucu hatası', 500)
  }
}

export async function DELETE(req: NextRequest, { params }: Props) {
  try {
    const oturum = await mobilAuth(req)
    if (!oturum?.user?.email) return hata('Yetkisiz', 401)

    const { id } = await params
    const numId = parseId(id)
    if (numId === null) return hata('Geçersiz ID', 400)

    const kullanici = await prisma.kullanici.findUnique({
      where: { email: oturum.user.email },
      include: { esnaf: true },
    })

    const isAdmin = oturum.user.rol === 'ADMIN' || oturum.user.rol === 'SUPER_ADMIN'

    if (!isAdmin && kullanici?.esnaf?.id !== numId) {
      return hata('Bu kaydı silme yetkiniz yok', 403)
    }

    const esnaf = await prisma.esnaf.update({
      where: { id: numId },
      data: { aktif: false },
      select: { sehir: true, slug: true },
    })

    revalidatePath(`/${esnaf.sehir.toLowerCase()}/${esnaf.slug}`)
    return basari({ ok: true })
  } catch (err) {
    logger.error('esnaf[id].DELETE', { err: String(err) })
    return hata('Sunucu hatası', 500)
  }
}
