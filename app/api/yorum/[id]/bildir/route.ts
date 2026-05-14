import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { mobilAuth } from '@/lib/auth'
import { basari, hata } from '@/lib/api'
import { logger } from '@/lib/logger'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const oturum = await mobilAuth(req)
    if (!oturum?.user?.email) return hata('Yetkisiz', 401)
    if (oturum.user.rol !== 'BUSINESS') return hata('Sadece işletme sahibi bildirebilir', 403)

    const { id } = await params
    const yorumId = parseInt(id)
    if (!Number.isInteger(yorumId)) return hata('Geçersiz ID', 400)

    const kullanici = await prisma.kullanici.findUnique({
      where: { email: oturum.user.email },
      include: { esnaf: { select: { id: true } } },
    })
    if (!kullanici?.esnaf) return hata('İşletme bulunamadı', 403)

    const yorum = await prisma.yorum.findUnique({
      where: { id: yorumId },
      select: { id: true, esnafId: true, bildirildi: true },
    })
    if (!yorum) return hata('Yorum bulunamadı', 404)
    if (yorum.esnafId !== kullanici.esnaf.id) return hata('Bu yorumu bildiremezsiniz', 403)
    if (yorum.bildirildi) return hata('Bu yorum zaten bildirildi', 409)

    const body = await req.json().catch(() => ({}))
    const bildirimNot = typeof body.bildirimNot === 'string' ? body.bildirimNot.slice(0, 200) : null

    await prisma.yorum.update({
      where: { id: yorumId },
      data: { bildirildi: true, bildirimNot },
    })

    logger.info('yorum.bildirildi', { yorumId, esnafId: kullanici.esnaf.id })
    return basari({ ok: true })
  } catch (err) {
    logger.error('yorum.bildir', { err: String(err) })
    return hata('Sunucu hatası', 500)
  }
}
