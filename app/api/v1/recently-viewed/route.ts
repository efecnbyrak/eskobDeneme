import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getRecentlyViewedService, trackRecentlyViewedService } from '@/lib/services/recently-viewed.service'

export async function GET(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const limit = parseInt(searchParams.get('limit') || '10', 10)

  try {
    const data = await getRecentlyViewedService(session.user.id, { limit })
    return NextResponse.json({ success: true, data })
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

    const result = await trackRecentlyViewedService(session.user.id, esnafId)
    if (!result.success) {
      return NextResponse.json(result, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
