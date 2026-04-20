import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

const Schema = z.object({
  aktif: z.boolean().optional(),
  onayli: z.boolean().optional(),
})

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const oturum = await auth()
  const rol = oturum?.user?.rol
  if (rol !== 'SUPER_ADMIN' && rol !== 'ADMIN') {
    return NextResponse.json({ error: 'Yetkisiz.' }, { status: 403 })
  }

  const { id } = await params
  const parsed = Schema.safeParse(await req.json())
  if (!parsed.success) {
    return NextResponse.json({ error: 'Geçersiz veri.' }, { status: 400 })
  }

  const data: { aktif?: boolean; onaylı?: boolean } = {}
  if (parsed.data.aktif !== undefined) data.aktif = parsed.data.aktif
  if (parsed.data.onayli !== undefined) data.onaylı = parsed.data.onayli

  const guncel = await prisma.esnaf.update({
    where: { id: parseInt(id) },
    data,
    select: { id: true, aktif: true, onaylı: true },
  })

  return NextResponse.json(guncel)
}
