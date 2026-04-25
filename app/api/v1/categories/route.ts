import { NextResponse } from 'next/server'
import { getCategoriesService } from '@/lib/services/category.service'

export async function GET() {
  try {
    const kategoriler = await getCategoriesService()
    return NextResponse.json({ success: true, data: kategoriler })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Bilinmeyen hata' }, { status: 500 })
  }
}
