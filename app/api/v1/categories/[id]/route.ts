import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const oturum = await auth()
  const rol = (oturum?.user as any)?.rol

  if (!oturum?.user || (rol !== 'SUPER_ADMIN' && rol !== 'ADMIN')) {
    return NextResponse.json({ success: false, error: 'Yetkisiz erişim' }, { status: 403 })
  }

  const { id } = await params
  const kategoriId = parseInt(id)
  if (isNaN(kategoriId)) {
    return NextResponse.json({ success: false, error: 'Geçersiz ID' }, { status: 400 })
  }

  const body = await request.json()
  const { ikonUrl } = body as { ikonUrl?: string | null }

  const guncellendi = await prisma.kategori.update({
    where: { id: kategoriId },
    data: { ikonUrl: ikonUrl ?? null },
  })

  return NextResponse.json({ success: true, data: guncellendi })
}
