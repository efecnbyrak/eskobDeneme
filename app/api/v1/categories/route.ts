import { NextRequest, NextResponse } from 'next/server'
import { getCategoriesService } from '@/lib/services/category.service'
import { rateLimit, istemciKimligi } from '@/lib/rateLimit'

export async function GET(req: NextRequest) {
  const ip = istemciKimligi(req)
  const rl = await rateLimit(`v1:kategoriler:${ip}`, 60, 60)
  if (!rl.basarili) {
    return new NextResponse('Çok fazla istek', { status: 429 })
  }

  try {
    const kategoriler = await getCategoriesService()
    return NextResponse.json({ success: true, data: kategoriler })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Bilinmeyen hata'
    return NextResponse.json({ success: false, error: msg }, { status: 500 })
  }
}
