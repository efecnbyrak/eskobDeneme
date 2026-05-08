import { NextRequest } from 'next/server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { mobilAuth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { basari, hata } from '@/lib/api'

const Schema = z.object({
  eski: z.string().min(1, 'Mevcut şifre gerekli.'),
  yeni: z
    .string()
    .min(8, 'Yeni şifre en az 8 karakter olmalı.')
    .max(128, 'Şifre en fazla 128 karakter olabilir.')
    .refine((v) => /[A-Z]/.test(v), 'En az 1 büyük harf içermeli.')
    .refine((v) => /[a-z]/.test(v), 'En az 1 küçük harf içermeli.')
    .refine((v) => /[0-9]/.test(v), 'En az 1 rakam içermeli.')
    .refine((v) => /[^A-Za-z0-9]/.test(v), 'En az 1 sembol içermeli.'),
})

export async function PATCH(req: NextRequest) {
  const oturum = await mobilAuth(req)
  if (!oturum?.user?.id) return hata('Yetkisiz.', 401)

  const parsed = Schema.safeParse(await req.json())
  if (!parsed.success) {
    return hata(parsed.error.issues[0]?.message ?? 'Geçersiz veri.', 400)
  }

  const kullanici = await prisma.kullanici.findUnique({
    where: { id: parseInt(oturum.user.id) },
  })
  if (!kullanici) return hata('Kullanıcı bulunamadı.', 404)

  const dogru = await bcrypt.compare(parsed.data.eski, kullanici.sifreHash)
  if (!dogru) return hata('Mevcut şifreniz yanlış.', 400)

  const yeniHash = await bcrypt.hash(parsed.data.yeni, 12)
  await prisma.kullanici.update({
    where: { id: kullanici.id },
    data: { sifreHash: yeniHash },
  })

  return basari({ ok: true })
}
