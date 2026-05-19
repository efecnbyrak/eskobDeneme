import { NextRequest, NextResponse } from 'next/server'
import { getCampaignsService } from '@/lib/services/campaign.service'
import { rateLimit, istemciKimligi } from '@/lib/rateLimit'

export async function GET(req: NextRequest) {
  const ip = istemciKimligi(req)
  const rl = await rateLimit(`v1:kampanyalar:${ip}`, 60, 60)
  if (!rl.basarili) {
    return new NextResponse('Çok fazla istek', { status: 429 })
  }

  const { searchParams } = new URL(req.url)
  const limit = parseInt(searchParams.get('limit') || '10', 10)
  const page = parseInt(searchParams.get('page') || '1', 10)

  try {
    const campaigns = await getCampaignsService({ limit, page })
    return NextResponse.json({ success: true, data: campaigns })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Bilinmeyen hata'
    return NextResponse.json({ success: false, error: msg }, { status: 500 })
  }
}
