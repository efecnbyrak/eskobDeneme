import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const kategoriler = await prisma.kategori.findMany({
      where: { ustKategoriId: null },
      orderBy: { sira: 'asc' },
      include: {
        altKategoriler: {
          orderBy: { sira: 'asc' }
        }
      }
    })

    return NextResponse.json({ success: true, data: kategoriler })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Bilinmeyen hata' }, { status: 500 })
  }
}
