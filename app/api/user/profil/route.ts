import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

const Schema = z.object({
  ad: z.string().min(2, 'Ad en az 2 karakter.'),
  soyad: z.string().min(2, 'Soyad en az 2 karakter.'),
  email: z.string().email('Geçerli bir e-posta adresi girin.').optional(),
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

  const { ad, soyad, email, telefon } = parsed.data
  const userId = parseInt(oturum.user.id!)

  if (email) {
    const mevcutKullanici = await prisma.kullanici.findFirst({
      where: { email, NOT: { id: userId } },
      select: { id: true },
    })
    if (mevcutKullanici) {
      return NextResponse.json(
        { error: 'Bu e-posta adresi başka bir hesap tarafından kullanılıyor.' },
        { status: 400 }
      )
    }
  }

  const kullanici = await prisma.kullanici.update({
    where: { id: userId },
    data: {
      ad,
      soyad,
      ...(email ? { email } : {}),
      telefon: telefon ?? null,
    },
    select: { id: true, ad: true, soyad: true, email: true, telefon: true },
  })

  return NextResponse.json(kullanici)
}
