import { z } from 'zod'

export const KullaniciKayitSchema = z.object({
  tip: z.literal('USER'),
  ad: z.string().min(2, 'Ad en az 2 karakter olmalı'),
  soyad: z.string().min(2, 'Soyad en az 2 karakter olmalı'),
  email: z.string().email('Geçerli bir e-posta girin'),
  sifre: z.string().min(6, 'Şifre en az 6 karakter olmalı'),
  telefon: z.string().optional(),
})

export const IsletmeKayitSchema = z.object({
  tip: z.literal('BUSINESS'),
  ad: z.string().min(2, 'Ad en az 2 karakter olmalı'),
  soyad: z.string().min(2, 'Soyad en az 2 karakter olmalı'),
  email: z.string().email('Geçerli bir e-posta girin'),
  sifre: z.string().min(6, 'Şifre en az 6 karakter olmalı'),
  telefon: z.string().optional(),
  isletmeAdi: z.string().min(2, 'İşletme adı gerekli'),
  kategoriSlug: z.string().min(1, 'Kategori seçin'),
  sehir: z.string().min(1, 'Şehir seçin'),
  ilce: z.string().min(1, 'İlçe girin'),
})

export const KayitSchema = z.discriminatedUnion('tip', [
  KullaniciKayitSchema,
  IsletmeKayitSchema,
])

export const GirisSchema = z.object({
  email: z.string().email('Geçerli bir e-posta girin'),
  sifre: z.string().min(1, 'Şifre gerekli'),
})

export const EsnafSchema = z.object({
  isletmeAdi: z.string().min(2, 'İşletme adı en az 2 karakter olmalı'),
  kategoriId: z.string().min(1, 'Kategori seçin'),
  sehir: z.string().min(1, 'Şehir seçin'),
  ilce: z.string().min(1, 'İlçe girin'),
  adres: z.string().optional(),
  telefon: z.string().optional(),
  whatsapp: z.string().optional(),
  website: z.string().url('Geçerli URL girin').optional().or(z.literal('')),
  instagram: z.string().optional(),
  aciklama: z.string().max(500, 'Açıklama en fazla 500 karakter').optional(),
})

export const HizmetSchema = z.object({
  ad: z.string().min(1, 'Hizmet adı gerekli'),
  fiyat: z.number().positive('Fiyat sıfırdan büyük olmalı'),
  sure: z.number().positive().optional(),
  aciklama: z.string().optional(),
  kategori: z.string().optional(),
})

export const RandevuSchema = z.object({
  tarih: z.string().min(1, 'Tarih gerekli'),
  musteriAd: z.string().min(2, 'İsim en az 2 karakter olmalı'),
  musteriTelefon: z.string().min(10, 'Geçerli telefon numarası girin'),
  musteriNot: z.string().optional(),
  hizmetId: z.string().optional(),
  esnafId: z.string().min(1, 'Esnaf ID gerekli'),
  sure: z.number().positive(),
})

export const YorumSchema = z.object({
  puan: z.number().min(1).max(5),
  yorum: z.string().max(500).optional(),
  musteriAd: z.string().min(2, 'İsim en az 2 karakter olmalı'),
  esnafId: z.string().min(1),
})
