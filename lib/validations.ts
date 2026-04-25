import { z } from 'zod'

const TURKCE_HARF = /^[\p{L}\s'-]+$/u
const SESLI = /[aeıioöuüAEIİOÖUÜ]/

const adSchema = z
  .string()
  .min(2, 'En az 2 karakter olmalı')
  .regex(TURKCE_HARF, 'Sadece harf girin (rakam ve sembol girilemiyor)')
  .refine((v) => SESLI.test(v), 'Lütfen gerçek adınızı girin')

const KABUL_EDILEN_DOMAINLER = [
  'gmail.com', 'hotmail.com', 'outlook.com',
  'yahoo.com', 'icloud.com', 'yandex.com',
]

const emailSchema = z
  .string()
  .email('Geçerli bir e-posta girin')
  .refine(
    (v) => KABUL_EDILEN_DOMAINLER.some((d) => v.toLowerCase().endsWith('@' + d)),
    'Sadece bilinen e-posta sağlayıcıları kabul edilir (gmail, hotmail, outlook, yahoo...)'
  )

const sifreSchema = z
  .string()
  .min(8, 'Şifre en az 8 karakter olmalı')
  .max(128, 'Şifre en fazla 128 karakter olabilir')
  .refine((v) => /[A-Z]/.test(v), 'Şifre en az 1 büyük harf içermeli')
  .refine((v) => /[a-z]/.test(v), 'Şifre en az 1 küçük harf içermeli')
  .refine((v) => /[0-9]/.test(v), 'Şifre en az 1 rakam içermeli')
  .refine((v) => /[^A-Za-z0-9]/.test(v), 'Şifre en az 1 sembol içermeli (!@#$... vb.)')

const telefonSchema = z
  .string()
  .refine(
    (v) => /^0[5-9]\d{9}$/.test(v.replace(/\s/g, '')),
    'Geçerli bir Türk telefon numarası girin (örn: 0533 045 00 92)'
  )

export const KullaniciKayitSchema = z.object({
  tip: z.literal('USER'),
  ad: adSchema,
  soyad: adSchema,
  email: emailSchema,
  sifre: sifreSchema,
  kullaniciAdi: z
    .string()
    .min(3, 'Kullanıcı adı en az 3 karakter olmalı')
    .max(30, 'Kullanıcı adı en fazla 30 karakter olabilir')
    .regex(/^[a-zA-Z0-9_]+$/, 'Sadece İngilizce harf, rakam ve alt çizgi (_) kullanılabilir')
    .refine((v) => !/^[0-9_]+$/.test(v), 'En az bir harf içermeli')
    .optional()
    .or(z.literal('')),
  telefon: telefonSchema.optional().or(z.literal('')),
  sehir: z.string().min(1, 'Şehir seçin'),
  ilce: z.string().min(1, 'İlçe girin'),
  ilgiAlanlari: z.array(z.string()).min(1, 'En az 1 tür seçin'),
})

export const IsletmeKayitSchema = z.object({
  tip: z.literal('BUSINESS'),
  ad: adSchema,
  soyad: adSchema,
  email: emailSchema,
  sifre: sifreSchema,
  telefon: telefonSchema.optional().or(z.literal('')),
  isletmeAdi: z.string().min(2, 'İşletme adı en az 2 karakter olmalı'),
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
  hizmetId: z.coerce.number().int().optional(),
  esnafId: z.coerce.number().int().min(1, 'Esnaf ID gerekli'),
  sure: z.number().positive(),
})

export const YorumSchema = z.object({
  puan: z.number().min(1).max(5),
  yorum: z.string().max(500).optional(),
  musteriAd: z.string().min(2, 'İsim en az 2 karakter olmalı'),
  esnafId: z.coerce.number().int().min(1),
})
