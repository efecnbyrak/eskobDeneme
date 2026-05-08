import { NextRequest } from 'next/server'
import { mobilAuth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { basari, hata } from '@/lib/api'

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const oturum = await mobilAuth(req)
  if (!oturum?.user || (oturum.user.rol !== 'ADMIN' && oturum.user.rol !== 'SUPER_ADMIN')) {
    return hata('Yetkisiz.', 403)
  }

  const { id } = await params
  await prisma.yorum.delete({ where: { id: parseInt(id) } })

  return basari({ success: true })
}
