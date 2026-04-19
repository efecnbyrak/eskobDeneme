import { type ClassValue, clsx } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function formatFiyat(fiyat: number): string {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 0,
  }).format(fiyat)
}

export function formatTarih(tarih: string | Date): string {
  return new Intl.DateTimeFormat('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(tarih))
}

export function formatSure(dakika: number): string {
  if (dakika < 60) return `${dakika} dk`
  const saat = Math.floor(dakika / 60)
  const kalan = dakika % 60
  return kalan > 0 ? `${saat} sa ${kalan} dk` : `${saat} sa`
}

export function ortalamaPuan(yorumlar: { puan: number }[]): number {
  if (!yorumlar.length) return 0
  return yorumlar.reduce((acc, y) => acc + y.puan, 0) / yorumlar.length
}

export function isletmeAcikMi(calismaS: Record<string, { acik: string; kapali: string; kapali_gun?: boolean }> | null | undefined): boolean {
  if (!calismaS) return false
  const gunler = ['pazar', 'pazartesi', 'sali', 'carsamba', 'persembe', 'cuma', 'cumartesi']
  const bugun = gunler[new Date().getDay()]
  const bugunSaati = calismaS[bugun]
  if (!bugunSaati || bugunSaati.kapali_gun) return false

  const simdi = new Date()
  const [acikSaat, acikDakika] = bugunSaati.acik.split(':').map(Number)
  const [kapaliSaat, kapaliDakika] = bugunSaati.kapali.split(':').map(Number)
  const simdiDakika = simdi.getHours() * 60 + simdi.getMinutes()
  const acikDk = acikSaat * 60 + acikDakika
  const kapaliDk = kapaliSaat * 60 + kapaliDakika

  return simdiDakika >= acikDk && simdiDakika < kapaliDk
}
