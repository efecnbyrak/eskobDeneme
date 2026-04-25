import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { auth } from '@/lib/auth'
import { rateLimit, istemciKimligi } from '@/lib/rateLimit'
import { logger } from '@/lib/logger'

const IZINLI_TIPLER = ['image/jpeg', 'image/png', 'image/webp'] as const
const MAX_BOYUT = 5 * 1024 * 1024 // 5 MB

// Dosya imza doğrulaması (magic bytes) — Content-Type spoofing'e karşı
const IMZALAR: Record<(typeof IZINLI_TIPLER)[number], number[][]> = {
  'image/jpeg': [[0xff, 0xd8, 0xff]],
  'image/png': [[0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]],
  // RIFF....WEBP
  'image/webp': [[0x52, 0x49, 0x46, 0x46]],
}

function imzaEslesir(buf: Uint8Array, imzalar: number[][]) {
  return imzalar.some((imza) =>
    imza.every((byte, i) => buf[i] === byte)
  )
}

function uzantiFromMime(mime: string): string {
  if (mime === 'image/jpeg') return 'jpg'
  if (mime === 'image/png') return 'png'
  if (mime === 'image/webp') return 'webp'
  return 'bin'
}

export async function POST(req: NextRequest) {
  try {
    const oturum = await auth()
    if (!oturum?.user?.id) {
      return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })
    }

    // Rate limit: kullanıcı başına dakikada 20 upload
    const limit = rateLimit(`upload:${oturum.user.id}`, 20, 60)
    if (!limit.basarili) {
      return NextResponse.json(
        { error: 'Çok hızlı yükleme. Bir dakika bekleyin.' },
        { status: 429 }
      )
    }
    // IP bazlı ek kalkan
    const ipLimit = rateLimit(`upload:ip:${istemciKimligi(req)}`, 40, 60)
    if (!ipLimit.basarili) {
      return NextResponse.json({ error: 'Çok hızlı' }, { status: 429 })
    }

    const form = await req.formData()
    const dosya = form.get('file') as File | null
    if (!dosya) {
      return NextResponse.json({ error: 'Dosya bulunamadı' }, { status: 400 })
    }

    const mime = dosya.type
    if (!IZINLI_TIPLER.includes(mime as (typeof IZINLI_TIPLER)[number])) {
      return NextResponse.json(
        { error: 'Sadece JPEG, PNG ve WebP desteklenir' },
        { status: 400 }
      )
    }

    if (dosya.size <= 0) {
      return NextResponse.json({ error: 'Boş dosya' }, { status: 400 })
    }
    if (dosya.size > MAX_BOYUT) {
      return NextResponse.json(
        { error: 'Dosya 5 MB üzerinde olamaz' },
        { status: 400 }
      )
    }

    // ── Magic bytes doğrulaması ──
    const buf = new Uint8Array(await dosya.arrayBuffer())
    const beklenen = IMZALAR[mime as (typeof IZINLI_TIPLER)[number]]
    if (!imzaEslesir(buf, beklenen)) {
      logger.warn('upload.imza_hatali', { mime, kullaniciId: oturum.user.id })
      return NextResponse.json(
        { error: 'Dosya içeriği iddia edilen formatla eşleşmiyor' },
        { status: 400 }
      )
    }

    // Güvenli dosya adı: rasgele + mime uzantı (kullanıcı girdisi path olarak yok)
    const rnd = crypto.randomUUID()
    const uzanti = uzantiFromMime(mime)
    const yol = `yuklemeler/${oturum.user.id}/${rnd}.${uzanti}`

    const blob = await put(yol, new Blob([buf as BlobPart], { type: mime }), {
      access: 'public',
      contentType: mime,
      cacheControlMaxAge: 31536000,
    })

    return NextResponse.json({ url: blob.url })
  } catch (err) {
    logger.error('upload.POST', { err: String(err) })
    return NextResponse.json({ error: 'Yükleme başarısız' }, { status: 500 })
  }
}
