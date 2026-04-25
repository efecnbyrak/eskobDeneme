import { NextResponse } from 'next/server'
import { getCampaignsService } from '@/lib/services/campaign.service'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const limit = parseInt(searchParams.get('limit') || '10', 10)
  const page = parseInt(searchParams.get('page') || '1', 10)
  
  try {
    const campaigns = await getCampaignsService({ limit, page })
    return NextResponse.json({ success: true, data: campaigns })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Bilinmeyen hata' }, { status: 500 })
  }
}
