import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { basari, hata } from '@/lib/api'

interface Props {
  params: Promise<{ id: string }>
}

type CalismaSGun = {
  acilis?: string
  kapanis?: string
  kapali?: boolean
}

const GUN_ADLARI = ['pazar', 'pazartesi', 'sali', 'carsamba', 'persembe', 'cuma', 'cumartesi'] as const

export async function GET(req: NextRequest, { params }: Props) {
  const { id } = await params
  const numId = parseInt(id)
  if (!Number.isInteger(numId) || numId < 1) return hata('Geçersiz ID', 400)

  const { searchParams } = new URL(req.url)
  const tarihStr = searchParams.get('tarih') // YYYY-MM-DD
  const hizmetIdStr = searchParams.get('hizmetId')

  if (!tarihStr) return hata('tarih parametresi gerekli (YYYY-MM-DD)', 400)

  // YYYY-MM-DD parse — yerel saat olarak işle
  const [yil, ay, gun] = tarihStr.split('-').map(Number)
  if (!yil || !ay || !gun) return hata('Geçersiz tarih formatı (YYYY-MM-DD)', 400)
  const tarih = new Date(yil, ay - 1, gun)
  if (isNaN(tarih.getTime())) return hata('Geçersiz tarih', 400)

  const esnaf = await prisma.esnaf.findUnique({
    where: { id: numId },
    select: { id: true, aktif: true, onaylı: true, calismaS: true },
  })
  if (!esnaf || !esnaf.aktif || !esnaf.onaylı) return hata('İşletme bulunamadı', 404)

  // Hizmet süresini belirle
  let slotSureDk = 30
  if (hizmetIdStr) {
    const hizmetId = parseInt(hizmetIdStr)
    if (Number.isInteger(hizmetId)) {
      const hizmet = await prisma.hizmet.findUnique({
        where: { id: hizmetId },
        select: { sure: true, esnafId: true, aktif: true },
      })
      if (hizmet && hizmet.esnafId === numId && hizmet.aktif && hizmet.sure) {
        slotSureDk = hizmet.sure
      }
    }
  }

  // Çalışma saatlerini parse et
  const gunAdi = GUN_ADLARI[tarih.getDay()]!
  const calismaS = esnaf.calismaS as Record<string, CalismaSGun> | null
  const gunProgram = calismaS?.[gunAdi]

  if (!gunProgram || gunProgram.kapali) {
    return basari({ slotlar: [], slotSureDk, mesaj: 'Bu gün kapalı' })
  }

  const acilisParcalar = (gunProgram.acilis ?? '09:00').split(':').map(Number)
  const kapanisParcalar = (gunProgram.kapanis ?? '18:00').split(':').map(Number)
  const acilisDkTotal = (acilisParcalar[0] ?? 9) * 60 + (acilisParcalar[1] ?? 0)
  const kapanisDkTotal = (kapanisParcalar[0] ?? 18) * 60 + (kapanisParcalar[1] ?? 0)

  // Gün içindeki mevcut randevuları çek
  const gunBaslangic = new Date(yil, ay - 1, gun, 0, 0, 0)
  const gunBitis = new Date(yil, ay - 1, gun, 23, 59, 59)

  const mevcutRandevular = await prisma.randevu.findMany({
    where: {
      esnafId: numId,
      tarih: { gte: gunBaslangic, lte: gunBitis },
      durum: { in: ['BEKLIYOR', 'ONAYLANDI'] },
    },
    select: { tarih: true, sure: true },
  })

  // Slot listesini oluştur
  const slotlar: Array<{ baslangic: string; bitis: string; musait: boolean }> = []
  let slotBaslangicDk = acilisDkTotal

  while (slotBaslangicDk + slotSureDk <= kapanisDkTotal) {
    const slotBitisDk = slotBaslangicDk + slotSureDk

    const slotBaslangicDate = new Date(yil, ay - 1, gun,
      Math.floor(slotBaslangicDk / 60), slotBaslangicDk % 60, 0)
    const slotBitisDate = new Date(yil, ay - 1, gun,
      Math.floor(slotBitisDk / 60), slotBitisDk % 60, 0)

    const cakisma = mevcutRandevular.some((r) => {
      const rBitis = new Date(r.tarih.getTime() + r.sure * 60_000)
      return r.tarih < slotBitisDate && rBitis > slotBaslangicDate
    })

    const gecmis = slotBaslangicDate.getTime() < Date.now()

    slotlar.push({
      baslangic: slotBaslangicDate.toISOString(),
      bitis: slotBitisDate.toISOString(),
      musait: !cakisma && !gecmis,
    })

    slotBaslangicDk += slotSureDk
  }

  return basari({ slotlar, slotSureDk })
}
