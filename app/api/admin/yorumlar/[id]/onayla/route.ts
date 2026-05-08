import { NextRequest } from 'next/server'
import { revalidatePath } from 'next/cache'
import { mobilAuth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { basari, hata } from '@/lib/api'
import { logger } from '@/lib/logger'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const oturum = await mobilAuth(req)
  if (!oturum?.user || (oturum.user.rol !== 'ADMIN' && oturum.user.rol !== 'SUPER_ADMIN')) {
    return hata('Yetkisiz.', 403)
  }

  const { id } = await params
  const numId = parseInt(id)
  if (!Number.isInteger(numId)) return hata('Geçersiz ID', 400)

  const yorum = await prisma.yorum.update({
    where: { id: numId },
    data: { onaylı: true },
    select: { id: true, esnaf: { select: { slug: true, sehir: true } } },
  })

  if (yorum.esnaf) {
    revalidatePath(`/${yorum.esnaf.sehir.toLowerCase()}/${yorum.esnaf.slug}`)
  }

  logger.info('yorum.onaylandi', { yorumId: yorum.id, adminId: oturum.user.id })
  return basari({ success: true })
}
