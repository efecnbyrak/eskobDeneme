import { NextRequest } from 'next/server'
import { mobilAuth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { basari, hata } from '@/lib/api'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const oturum = await mobilAuth(req)
  const rol = oturum?.user?.rol

  if (!oturum?.user || (rol !== 'SUPER_ADMIN' && rol !== 'ADMIN')) {
    return hata('Yetkisiz erişim', 403)
  }

  const { id } = await params
  const kategoriId = parseInt(id)
  if (isNaN(kategoriId)) return hata('Geçersiz ID', 400)

  const body = await req.json()
  const { ikonUrl } = body as { ikonUrl?: string | null }

  const guncellendi = await prisma.kategori.update({
    where: { id: kategoriId },
    data: { ikonUrl: ikonUrl ?? null },
  })

  return basari(guncellendi)
}
