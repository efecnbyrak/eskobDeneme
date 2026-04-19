export type Plan = 'UCRETSIZ' | 'STARTER' | 'PRO'

export type RandevuDurum = 'BEKLIYOR' | 'ONAYLANDI' | 'IPTAL' | 'TAMAMLANDI'

export interface Kategori {
  id: string
  ad: string
  slug: string
  ikon: string
  renk: string
  sira: number
}

export interface Kullanici {
  id: string
  email: string
  ad: string
  soyad: string
  avatarUrl?: string | null
  plan: Plan
}

export interface Hizmet {
  id: string
  ad: string
  aciklama?: string | null
  fiyat: number
  sure?: number | null
  fotoUrl?: string | null
  aktif: boolean
  sira: number
  esnafId: string
}

export interface Yorum {
  id: string
  puan: number
  yorum?: string | null
  musteriAd: string
  yanitlar?: string | null
  onaylı: boolean
  olusturmaT: string
  esnafId: string
}

export interface CalismaGunu {
  acik: string
  kapali: string
  kapali_gun?: boolean
}

export interface CalismaSaatleri {
  pazartesi?: CalismaGunu
  sali?: CalismaGunu
  carsamba?: CalismaGunu
  persembe?: CalismaGunu
  cuma?: CalismaGunu
  cumartesi?: CalismaGunu
  pazar?: CalismaGunu
}

export interface Esnaf {
  id: string
  slug: string
  isletmeAdi: string
  aciklama?: string | null
  kategori: Kategori
  kategoriId: string
  kapakFoto?: string | null
  logoUrl?: string | null
  fotograflar: string[]
  sehir: string
  ilce: string
  adres?: string | null
  enlem?: number | null
  boylam?: number | null
  telefon?: string | null
  whatsapp?: string | null
  website?: string | null
  instagram?: string | null
  calismaS?: CalismaSaatleri | null
  aktif: boolean
  onaylı: boolean
  olusturmaT: string
  hizmetler?: Hizmet[]
  yorumlar?: Yorum[]
}

export interface Randevu {
  id: string
  tarih: string
  sure: number
  durum: RandevuDurum
  musteriAd: string
  musteriTelefon: string
  musteriNot?: string | null
  olusturmaT: string
  esnafId: string
  hizmetId?: string | null
  hizmet?: Hizmet | null
}

export interface Istatistik {
  id: string
  tarih: string
  goruntulenme: number
  tiklanma: number
  randevuSay: number
  whatsappT: number
  esnafId: string
}
