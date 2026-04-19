import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'
import { KayitSchema } from '@/lib/validations'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const veri = KayitSchema.parse(body)

    const mevcut = await prisma.kullanici.findUnique({ where: { email: veri.email } })
    if (mevcut) {
      return NextResponse.json({ error: 'Bu e-posta zaten kayıtlı.' }, { status: 400 })
    }

    const sifreHash = await bcrypt.hash(veri.sifre, 12)
    const kullanici = await prisma.kullanici.create({
      data: { ad: veri.ad, soyad: veri.soyad, email: veri.email, sifreHash },
    })

    return NextResponse.json({ id: kullanici.id }, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: 'Geçersiz veri.' }, { status: 400 })
  }
}
