import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

const Schema = z.object({
  ad: z.string().min(2, 'Ad en az 2 karakter.'),
  soyad: z.string().min(2, 'Soyad en az 2 karakter.'),
  telefon: z.string().nullable().optional(),
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

  const kullanici = await prisma.kullanici.update({
    where: { id: oturum.user.id },
    data: {
      ad: parsed.data.ad,
      soyad: parsed.data.soyad,
      telefon: parsed.data.telefon ?? null,
    },
    select: { id: true, ad: true, soyad: true, telefon: true },
  })

  return NextResponse.json(kullanici)
}
