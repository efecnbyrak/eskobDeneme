import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { logger } from '@/lib/logger'

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const oturum = await auth()
  if (!oturum?.user || (oturum.user.rol !== 'ADMIN' && oturum.user.rol !== 'SUPER_ADMIN')) {
    return NextResponse.json({ error: 'Yetkisiz.' }, { status: 403 })
  }

  const { id } = await params
  const numId = parseInt(id)
  if (!Number.isInteger(numId)) {
    return NextResponse.json({ error: 'Geçersiz ID' }, { status: 400 })
  }

  const yorum = await prisma.yorum.update({
    where: { id: numId },
    data: { onaylı: true },
    select: {
      id: true,
      esnaf: { select: { slug: true, sehir: true } },
    },
  })

  // Profil sayfasındaki yorum listesini yenile
  if (yorum.esnaf) {
    revalidatePath(`/${yorum.esnaf.sehir.toLowerCase()}/${yorum.esnaf.slug}`)
  }

  logger.info('yorum.onaylandi', { yorumId: yorum.id, adminId: oturum.user.id })
  return NextResponse.json({ success: true })
}
