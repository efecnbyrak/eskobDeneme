import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getRecommendationsService } from '@/lib/services/recommendation.service'

export async function GET(request: Request) {
  const session = await auth()
  const limit = parseInt(new URL(request.url).searchParams.get('limit') || '10', 10)

  try {
    const data = await getRecommendationsService(session?.user?.id, { limit })
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
