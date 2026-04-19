@AGENTS.md

# Esnaf Dijital Vitrin Platformu

Stack: Next.js 16 (App Router) + Neon PostgreSQL + Prisma 7 + NextAuth v5

## Önemli Next.js 16 Değişiklikleri
- Middleware dosyası standart `middleware.ts` adını kullanır, fonksiyon adı `middleware` olmalı
- Turbopack varsayılan olarak aktif

## Önemli Prisma 7 Değişiklikleri
- Veritabanı URL'si artık `schema.prisma` içinde değil, `prisma.config.ts` içinde
- PrismaClient adapter gerektirir: `@prisma/adapter-pg`
- Generated client: `app/generated/prisma/client.ts` (PrismaClient buradan import edilir)
- `lib/db.ts` dosyası adapter ile PrismaClient oluşturur

## Proje Yapısı
- `app/(public)/` — Müşteri tarafı (keşif, profil, arama)
- `app/(dashboard)/` — Esnaf yönetim paneli (panel, vitrin, hizmetler, randevular)
- `app/api/` — API routes (esnaf, randevu, hizmet, yorum, upload, auth)
- `components/ui/` — Temel UI bileşenleri
- `components/public/` — Müşteri tarafı bileşenler
- `components/dashboard/` — Dashboard bileşenleri
- `lib/` — db.ts, auth.ts, utils.ts, slug.ts, validations.ts, constants.ts

## Kurulum
1. `.env.local` dosyasına Neon PostgreSQL URL'sini ekle
2. `npm run db:push` ile şemayı uygula
3. `npm run db:seed` ile kategorileri yükle
4. `npm run dev` ile başlat
