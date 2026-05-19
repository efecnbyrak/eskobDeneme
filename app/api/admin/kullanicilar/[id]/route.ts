import { NextRequest } from 'next/server'
import { z } from 'zod'
import { mobilAuth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { basari, hata } from '@/lib/api'

const Schema = z.object({
  rol: z.enum(['SUPER_ADMIN', 'ADMIN', 'BUSINESS', 'USER']).optional(),
})

async function yetkili(req: NextRequest, requireSuper = false) {
  const oturum = await mobilAuth(req)
  if (!oturum?.user?.id) return null
  const rol = oturum.user.rol
  if (requireSuper && rol !== 'SUPER_ADMIN') return null
  if (!requireSuper && rol !== 'SUPER_ADMIN' && rol !== 'ADMIN') return null
  return oturum
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const oturum = await yetkili(req, true)
  if (!oturum) return hata('Yetkisiz.', 403)

  const { id } = await params
  if (id === oturum.user!.id) return hata('Kendi rolünüzü değiştiremezsiniz.', 400)

  const parsed = Schema.safeParse(await req.json())
  if (!parsed.success || !parsed.data.rol) return hata('Geçersiz veri.', 400)

  const guncel = await prisma.kullanici.update({
    where: { id: parseInt(id) },
    data: { rol: parsed.data.rol },
    select: { id: true, rol: true },
  })

  return basari(guncel)
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const oturum = await yetkili(req, true)
  if (!oturum) return hata('Yetkisiz.', 403)

  const { id } = await params
  if (id === oturum.user!.id) return hata('Kendi hesabınızı silemezsiniz.', 400)

  const hedef = await prisma.kullanici.findUnique({ where: { id: parseInt(id) } })
  if (!hedef) return hata('Bulunamadı.', 404)
  if (hedef.rol === 'SUPER_ADMIN') return hata('Süper admin silinemez.', 400)
  if (hedef.deletedAt) return hata('Kullanıcı zaten silinmiş.', 400)

  // Hard delete yerine KVKK uyumlu soft delete + audit log
  await prisma.$transaction(async (tx) => {
    await tx.kullanici.update({
      where: { id: parseInt(id) },
      data: { deletedAt: new Date() },
    })
    await tx.kvkkLog.create({
      data: {
        kullaniciId: parseInt(id),
        islem: 'ADMIN_SIL',
        aciklama: `Admin tarafından hesap silindi. Admin ID: ${oturum.user!.id}`,
        ipAdres: req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? undefined,
        userAgent: req.headers.get('user-agent') ?? undefined,
      },
    })
  })

  return basari({ ok: true })
}
