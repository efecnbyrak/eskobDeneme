import { NextRequest } from 'next/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { mobilAuth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { basari, hata } from '@/lib/api'
import { logger } from '@/lib/logger'

const Schema = z.object({
  aktif: z.boolean().optional(),
  onayli: z.boolean().optional(),
})

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const oturum = await mobilAuth(req)
  const rol = oturum?.user?.rol
  if (rol !== 'SUPER_ADMIN' && rol !== 'ADMIN') return hata('Yetkisiz.', 403)

  const { id } = await params
  const numId = parseInt(id)
  if (!Number.isInteger(numId)) return hata('Geçersiz ID', 400)

  const parsed = Schema.safeParse(await req.json().catch(() => ({})))
  if (!parsed.success) return hata('Geçersiz veri.', 400)

  const data: { aktif?: boolean; onaylı?: boolean } = {}
  if (parsed.data.aktif !== undefined) data.aktif = parsed.data.aktif
  if (parsed.data.onayli !== undefined) data.onaylı = parsed.data.onayli

  const guncel = await prisma.esnaf.update({
    where: { id: numId },
    data,
    select: { id: true, slug: true, sehir: true, aktif: true, onaylı: true },
  })

  revalidatePath(`/${guncel.sehir.toLowerCase()}/${guncel.slug}`)
  revalidatePath('/ara')
  revalidatePath('/')

  logger.info('admin.esnaf_patch', { esnafId: guncel.id, adminId: oturum?.user?.id, data })
  return basari({ id: guncel.id, aktif: guncel.aktif, onaylı: guncel.onaylı })
}
