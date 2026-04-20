import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

const Schema = z.object({
  esnafId: z.string().min(1),
})

export async function POST(req: NextRequest) {
  const oturum = await auth()
  if (!oturum?.user?.id) {
    return NextResponse.json({ error: 'Yetkisiz.' }, { status: 401 })
  }

  const parsed = Schema.safeParse(await req.json())
  if (!parsed.success) {
    return NextResponse.json({ error: 'Geçersiz veri.' }, { status: 400 })
  }

  const favori = await prisma.favori.upsert({
    where: {
      kullaniciId_esnafId: {
        kullaniciId: oturum.user.id,
        esnafId: parsed.data.esnafId,
      },
    },
    create: { kullaniciId: oturum.user.id, esnafId: parsed.data.esnafId },
    update: {},
  })

  return NextResponse.json({ id: favori.id, favori: true })
}

export async function DELETE(req: NextRequest) {
  const oturum = await auth()
  if (!oturum?.user?.id) {
    return NextResponse.json({ error: 'Yetkisiz.' }, { status: 401 })
  }

  const esnafId = new URL(req.url).searchParams.get('esnafId')
  if (!esnafId) {
    return NextResponse.json({ error: 'esnafId gerekli.' }, { status: 400 })
  }

  await prisma.favori.deleteMany({
    where: { kullaniciId: oturum.user.id, esnafId },
  })

  return NextResponse.json({ ok: true, favori: false })
}
