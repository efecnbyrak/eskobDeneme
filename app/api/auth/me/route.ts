import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
  const oturum = await auth()
  if (!oturum?.user?.id) {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }

  const kullanici = await prisma.kullanici.findUnique({
    where: { id: parseInt(oturum.user.id) },
    select: { id: true, ad: true, soyad: true, email: true, rol: true, avatarUrl: true, telefon: true },
  })

  if (!kullanici) {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }

  return NextResponse.json({
    authenticated: true,
    id: String(kullanici.id),
    email: kullanici.email,
    ad: kullanici.ad,
    soyad: kullanici.soyad,
    name: `${kullanici.ad} ${kullanici.soyad}`,
    avatarUrl: kullanici.avatarUrl,
    telefon: kullanici.telefon,
    rol: kullanici.rol,
  })
}
