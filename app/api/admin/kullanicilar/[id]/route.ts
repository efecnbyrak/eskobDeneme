import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

const Schema = z.object({
  rol: z.enum(['SUPER_ADMIN', 'ADMIN', 'BUSINESS', 'USER']).optional(),
})

async function yetkili(requireSuper = false) {
  const oturum = await auth()
  if (!oturum?.user?.id) return null
  const rol = oturum.user.rol
  if (requireSuper && rol !== 'SUPER_ADMIN') return null
  if (!requireSuper && rol !== 'SUPER_ADMIN' && rol !== 'ADMIN') return null
  return oturum
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const oturum = await yetkili(true)
  if (!oturum) return NextResponse.json({ error: 'Yetkisiz.' }, { status: 403 })

  const { id } = await params
  if (id === oturum.user!.id) {
    return NextResponse.json(
      { error: 'Kendi rolünüzü değiştiremezsiniz.' },
      { status: 400 }
    )
  }

  const parsed = Schema.safeParse(await req.json())
  if (!parsed.success || !parsed.data.rol) {
    return NextResponse.json({ error: 'Geçersiz veri.' }, { status: 400 })
  }

  const guncel = await prisma.kullanici.update({
    where: { id },
    data: { rol: parsed.data.rol },
    select: { id: true, rol: true },
  })

  return NextResponse.json(guncel)
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const oturum = await yetkili(true)
  if (!oturum) return NextResponse.json({ error: 'Yetkisiz.' }, { status: 403 })

  const { id } = await params
  if (id === oturum.user!.id) {
    return NextResponse.json(
      { error: 'Kendi hesabınızı silemezsiniz.' },
      { status: 400 }
    )
  }

  const hedef = await prisma.kullanici.findUnique({ where: { id } })
  if (!hedef) return NextResponse.json({ error: 'Bulunamadı.' }, { status: 404 })
  if (hedef.rol === 'SUPER_ADMIN') {
    return NextResponse.json(
      { error: 'Süper admin silinemez.' },
      { status: 400 }
    )
  }

  await prisma.kullanici.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
