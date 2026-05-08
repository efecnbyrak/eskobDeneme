import { NextRequest } from 'next/server'
import { z } from 'zod'
import { mobilAuth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { basari, hata } from '@/lib/api'

const Schema = z.object({
  esnafId: z.coerce.number().int().min(1),
})

export async function GET(req: NextRequest) {
  const oturum = await mobilAuth(req)
  if (!oturum?.user?.id) return hata('Yetkisiz.', 401)

  const kullaniciId = parseInt(oturum.user.id)
  const favoriler = await prisma.favori.findMany({
    where: { kullaniciId },
    include: {
      esnaf: {
        select: {
          id: true, slug: true, isletmeAdi: true, kapakFoto: true,
          logoUrl: true, sehir: true, ilce: true, aktif: true,
          kategori: { select: { id: true, ad: true, slug: true, ikon: true } },
        },
      },
    },
    orderBy: { olusturmaT: 'desc' },
  })

  return basari(favoriler.map((f) => ({
    favoriId: f.id,
    esnaf: f.esnaf,
    olusturmaT: f.olusturmaT,
  })))
}

export async function POST(req: NextRequest) {
  const oturum = await mobilAuth(req)
  if (!oturum?.user?.id) return hata('Yetkisiz.', 401)

  const parsed = Schema.safeParse(await req.json())
  if (!parsed.success) return hata('Geçersiz veri.', 400)

  const kullaniciId = parseInt(oturum.user.id)
  const favori = await prisma.favori.upsert({
    where: { kullaniciId_esnafId: { kullaniciId, esnafId: parsed.data.esnafId } },
    create: { kullaniciId, esnafId: parsed.data.esnafId },
    update: {},
  })

  return basari({ id: favori.id, favori: true })
}

export async function DELETE(req: NextRequest) {
  const oturum = await mobilAuth(req)
  if (!oturum?.user?.id) return hata('Yetkisiz.', 401)

  const esnafIdStr = new URL(req.url).searchParams.get('esnafId')
  if (!esnafIdStr) return hata('esnafId gerekli.', 400)

  const kullaniciId = parseInt(oturum.user.id)
  const esnafId = parseInt(esnafIdStr)

  await prisma.favori.deleteMany({ where: { kullaniciId, esnafId } })

  return basari({ ok: true, favori: false })
}
