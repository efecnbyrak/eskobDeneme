import { NextRequest } from 'next/server'
import { z } from 'zod'
import { mobilAuth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { basari, hata } from '@/lib/api'

const Schema = z.object({
  token: z.string().min(1).max(200),
  platform: z.enum(['ios', 'android']),
  izin: z.boolean(),
})

export async function PATCH(req: NextRequest) {
  const oturum = await mobilAuth(req)
  if (!oturum?.user?.id) return hata('Yetkisiz.', 401)

  const body = await req.json().catch(() => null)
  const parsed = Schema.safeParse(body)
  if (!parsed.success) {
    return hata(parsed.error.issues[0]?.message ?? 'Geçersiz veri', 400)
  }

  const kullaniciId = parseInt(oturum.user.id)
  await prisma.kullanici.update({
    where: { id: kullaniciId },
    data: {
      expoPushToken: parsed.data.token,
      cihazPlatformu: parsed.data.platform,
      pushIzni: parsed.data.izin,
    },
  })

  return basari({ guncellendi: true })
}
