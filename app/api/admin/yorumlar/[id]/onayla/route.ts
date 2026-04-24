import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const oturum = await auth()
  if (!oturum?.user || (oturum.user.rol !== 'ADMIN' && oturum.user.rol !== 'SUPER_ADMIN')) {
    return NextResponse.json({ error: 'Yetkisiz.' }, { status: 403 })
  }

  const { id } = await params
  await prisma.yorum.update({
    where: { id: parseInt(id) },
    data: { onaylı: true },
  })

  return NextResponse.json({ success: true })
}
