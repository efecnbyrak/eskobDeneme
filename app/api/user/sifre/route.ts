import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

const Schema = z.object({
  eski: z.string().min(1, 'Mevcut şifre gerekli.'),
  yeni: z.string().min(6, 'Yeni şifre en az 6 karakter olmalı.'),
})

export async function PATCH(req: NextRequest) {
  const oturum = await auth()
  if (!oturum?.user?.id) {
    return NextResponse.json({ error: 'Yetkisiz.' }, { status: 401 })
  }

  const parsed = Schema.safeParse(await req.json())
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Geçersiz veri.' },
      { status: 400 }
    )
  }

  const kullanici = await prisma.kullanici.findUnique({ where: { id: parseInt(oturum.user.id!) } })
  if (!kullanici) {
    return NextResponse.json({ error: 'Kullanıcı bulunamadı.' }, { status: 404 })
  }

  const dogru = await bcrypt.compare(parsed.data.eski, kullanici.sifreHash)
  if (!dogru) {
    return NextResponse.json({ error: 'Mevcut şifreniz yanlış.' }, { status: 400 })
  }

  const yeniHash = await bcrypt.hash(parsed.data.yeni, 12)
  await prisma.kullanici.update({
    where: { id: kullanici.id },
    data: { sifreHash: yeniHash },
  })

  return NextResponse.json({ ok: true })
}
