import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { mobilAuth } from '@/lib/auth'
import { basari, hata } from '@/lib/api'

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const oturum = await mobilAuth(req)
  if (!oturum?.user?.email) return hata('Yetkisiz', 401)

  const kullanici = await prisma.kullanici.findUnique({
    where: { email: oturum.user.email },
    include: { esnaf: { select: { id: true } } },
  })
  if (!kullanici?.esnaf) return hata('İşletme bulunamadı', 403)

  const { id } = await params
  const katId = parseInt(id)
  if (!Number.isInteger(katId)) return hata('Geçersiz ID', 400)

  const kat = await prisma.hizmetKategorisi.findFirst({
    where: { id: katId, esnafId: kullanici.esnaf.id },
  })
  if (!kat) return hata('Kategori bulunamadı', 404)

  const body = await req.json().catch(() => ({}))
  const ad = typeof body.ad === 'string' ? body.ad.trim() : undefined

  const guncellendi = await prisma.hizmetKategorisi.update({
    where: { id: katId },
    data: { ...(ad ? { ad } : {}) },
  })

  return basari({ kategori: guncellendi })
}
