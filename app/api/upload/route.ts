import { NextRequest } from 'next/server'
import { storage } from '@/lib/storage'
import { mobilAuth } from '@/lib/auth'
import { rateLimit, istemciKimligi } from '@/lib/rateLimit'
import { basari, hata } from '@/lib/api'
import { logger } from '@/lib/logger'

const IZINLI_TIPLER = ['image/jpeg', 'image/png', 'image/webp'] as const
const MAX_BOYUT = 5 * 1024 * 1024 // 5 MB

const IMZALAR: Record<(typeof IZINLI_TIPLER)[number], number[][]> = {
  'image/jpeg': [[0xff, 0xd8, 0xff]],
  'image/png': [[0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]],
  'image/webp': [[0x52, 0x49, 0x46, 0x46]],
}

function imzaEslesir(buf: Uint8Array, imzalar: number[][]) {
  return imzalar.some((imza) => imza.every((byte, i) => buf[i] === byte))
}

function uzantiFromMime(mime: string): string {
  if (mime === 'image/jpeg') return 'jpg'
  if (mime === 'image/png') return 'png'
  if (mime === 'image/webp') return 'webp'
  return 'bin'
}

export async function POST(req: NextRequest) {
  try {
    const oturum = await mobilAuth(req)
    if (!oturum?.user?.id) return hata('Yetkisiz', 401)

    const limit = await rateLimit(`upload:${oturum.user.id}`, 20, 60)
    if (!limit.basarili) return hata('Çok hızlı yükleme. Bir dakika bekleyin.', 429)

    const ipLimit = await rateLimit(`upload:ip:${istemciKimligi(req)}`, 40, 60)
    if (!ipLimit.basarili) return hata('Çok hızlı', 429)

    const form = await req.formData()
    const dosya = form.get('file') as File | null
    if (!dosya) return hata('Dosya bulunamadı', 400)

    const mime = dosya.type
    if (!IZINLI_TIPLER.includes(mime as (typeof IZINLI_TIPLER)[number])) {
      return hata('Sadece JPEG, PNG ve WebP desteklenir', 400)
    }

    if (dosya.size <= 0) return hata('Boş dosya', 400)
    if (dosya.size > MAX_BOYUT) return hata('Dosya 5 MB üzerinde olamaz', 400)

    const buf = new Uint8Array(await dosya.arrayBuffer())
    const beklenen = IMZALAR[mime as (typeof IZINLI_TIPLER)[number]]
    if (!imzaEslesir(buf, beklenen)) {
      logger.warn('upload.imza_hatali', { mime, kullaniciId: oturum.user.id })
      return hata('Dosya içeriği iddia edilen formatla eşleşmiyor', 400)
    }

    const rnd = crypto.randomUUID()
    const uzanti = uzantiFromMime(mime)
    const yol = `yuklemeler/${oturum.user.id}/${rnd}.${uzanti}`

    const url = await storage.upload(yol, new Blob([buf as BlobPart], { type: mime }), {
      contentType: mime,
    })

    return basari({ url })
  } catch (err) {
    logger.error('upload.POST', { err: String(err) })
    return hata('Yükleme başarısız', 500)
  }
}
