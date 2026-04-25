import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'

export async function GET(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const limit = parseInt(searchParams.get('limit') || '10', 10)

  try {
    const userId = parseInt(session.user.id, 10)
    const recentlyViewed = await prisma.gezilenEsnaf.findMany({
      where: { kullaniciId: userId },
      orderBy: { sonGorulmeT: 'desc' },
      take: limit,
      include: {
        esnaf: {
          include: {
            kategori: true,
            yorumlar: { select: { puan: true } },
          }
        }
      }
    })

    return NextResponse.json({ success: true, data: recentlyViewed.map(rv => rv.esnaf) })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { esnafId } = await request.json()
    if (!esnafId) return NextResponse.json({ success: false, error: 'esnafId required' }, { status: 400 })

    const userId = parseInt(session.user.id, 10)
    
    // Upsert tracking record
    await prisma.gezilenEsnaf.upsert({
      where: {
        kullaniciId_esnafId: {
          kullaniciId: userId,
          esnafId: parseInt(esnafId, 10)
        }
      },
      update: {
        sonGorulmeT: new Date()
      },
      create: {
        kullaniciId: userId,
        esnafId: parseInt(esnafId, 10)
      }
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
