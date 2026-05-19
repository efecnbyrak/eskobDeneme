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

  // Yorum modelinde deletedAt alanı yok; silmeden önce KVKK audit log oluştur
  const hedefYorum = await prisma.yorum.findUnique({
    where: { id: parseInt(id) },
    select: { id: true, kullaniciId: true, esnafId: true },
  })
  if (!hedefYorum) return hata('Bulunamadı.', 404)

  await prisma.$transaction(async (tx) => {
    if (hedefYorum.kullaniciId) {
      await tx.kvkkLog.create({
        data: {
          kullaniciId: hedefYorum.kullaniciId,
          islem: 'ADMIN_YORUM_SIL',
          aciklama: `Admin tarafından yorum silindi. Yorum ID: ${id}, Esnaf ID: ${hedefYorum.esnafId}. Admin: ${oturum.user.id}`,
          ipAdres: req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? undefined,
          userAgent: req.headers.get('user-agent') ?? undefined,
        },
      })
    }
    await tx.yorum.delete({ where: { id: parseInt(id) } })
  })

  return basari({ success: true })
}
