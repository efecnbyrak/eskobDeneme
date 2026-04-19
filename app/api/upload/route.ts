import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { auth } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const oturum = await auth()
    if (!oturum?.user?.email) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

    const form = await req.formData()
    const dosya = form.get('file') as File | null

    if (!dosya) return NextResponse.json({ error: 'Dosya bulunamadı' }, { status: 400 })

    const izinliTipler = ['image/jpeg', 'image/png', 'image/webp']
    if (!izinliTipler.includes(dosya.type)) {
      return NextResponse.json({ error: 'Sadece JPEG, PNG ve WebP desteklenir' }, { status: 400 })
    }

    if (dosya.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Dosya 5MB üzerinde olamaz' }, { status: 400 })
    }

    const blob = await put(dosya.name, dosya, { access: 'public' })
    return NextResponse.json({ url: blob.url })
  } catch {
    return NextResponse.json({ error: 'Yükleme başarısız' }, { status: 500 })
  }
}
