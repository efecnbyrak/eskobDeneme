import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const limit = parseInt(searchParams.get('limit') || '10', 10)
  const page = parseInt(searchParams.get('page') || '1', 10)
  
  try {
    const campaigns = await prisma.hizmet.findMany({
      where: {
        aktif: true,
        indirimYuzde: { gt: 0 },
        indirimBitis: { gte: new Date() }
      },
      take: limit,
      skip: (page - 1) * limit,
      include: {
        esnaf: {
          select: {
            id: true,
            isletmeAdi: true,
            slug: true,
            sehir: true,
            ilce: true
          }
        }
      },
      orderBy: { indirimYuzde: 'desc' }
    })

    return NextResponse.json({ success: true, data: campaigns })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Bilinmeyen hata' }, { status: 500 })
  }
}
