# AGENTS.md — Esnaf Dijital Vitrin Platformu

## Proje Özeti
Türkiye pazarına yönelik, esnaf / KOBİ / işletmelerin dijital vitrinine sahip olmasını sağlayan
bir platform. Kullanıcılar işletmeleri keşfeder, profil inceler, randevu alır; işletmeler ise
tüm iş akışlarını panodan yönetir.

**Stack:** Next.js 16 (App Router) · Neon PostgreSQL · Prisma 7 · NextAuth v5  
**Ortak API:** Web (Next.js) + Mobil (React Native / Expo) aynı `/api` katmanını tüketir

---

## 1. Teknoloji Katmanı Kuralları

### 1.1 Next.js 16

| Kural | Açıklama |
|-------|----------|
| `proxy.ts` kullan | `middleware.ts` **deprecated** — silmeyi unutma |
| Fonksiyon adı `proxy` | Export `export function proxy(req)` |
| Turbopack varsayılan | `--turbo` bayrağını ayrıca ekleme |
| `serverExternalPackages` | `next.config.ts`'e `['@prisma/client', '@prisma/adapter-pg']` ekle |
| Server Component önceliği | Gereksiz `"use client"` ekleme; client component'e yalnızca event / hook gerektiren leaf'lerde geç |

### 1.2 Prisma 7

| Kural | Açıklama |
|-------|----------|
| DB URL → `prisma.config.ts` | `schema.prisma` içinde `datasource` URL'si **olmaz** |
| Adapter zorunlu | `@prisma/adapter-pg` ile `PgClient` oluştur, PrismaClient'a aktar |
| Import kaynağı | `import { PrismaClient } from '@/app/generated/prisma/client'` |
| `lib/db.ts` | Adapter bağlantısını burada sarmala, global singleton yap |
| Migration | `prisma migrate dev` — asla `db push` ile production'a deploy etme |

### 1.3 NextAuth v5

- `lib/auth.ts` → config export; `app/api/auth/[...nextauth]/route.ts` → handler
- JWT stratejisi kullan; session payload'una `userId` ve `role` ekle
- Middleware (`proxy.ts`) korumalı route'ları `/dashboard/**` için filtrele
- `getServerSession()` yalnızca Server Component / Route Handler'da kullan; Client'ta `useSession()` hookunu kullan

---

## 2. Proje Dizin Yapısı

```
├── app/
│   ├── (public)/               # Müşteri tarafı — SSR + ISR
│   │   ├── page.tsx             # Ana sayfa / keşif
│   │   ├── search/              # Arama & filtre
│   │   └── [slug]/              # İşletme profil sayfası
│   ├── (dashboard)/            # İşletme yönetim paneli — Auth gerekli
│   │   ├── layout.tsx
│   │   ├── page.tsx             # Genel bakış
│   │   ├── vitrin/              # Profil & medya yönetimi
│   │   ├── hizmetler/           # Hizmet CRUD
│   │   ├── randevular/          # Takvim & onay
│   │   └── ayarlar/             # Hesap & abonelik
│   ├── api/
│   │   ├── auth/[...nextauth]/
│   │   ├── isletme/             # İşletme CRUD + slug lookup
│   │   ├── randevu/             # Slot yönetimi & rezervasyon
│   │   ├── hizmet/              # Hizmet listesi & fiyat
│   │   ├── yorum/               # Yorum & puanlama
│   │   └── upload/              # Görsel yükleme (S3/Cloudinary)
│   └── generated/
│       └── prisma/client.ts     # Prisma generated output
├── components/
│   ├── ui/                      # Atom bileşenler (Button, Input, Badge…)
│   ├── public/                  # Müşteri sayfaları bileşenleri
│   └── dashboard/               # Pano bileşenleri
├── lib/
│   ├── db.ts                    # PrismaClient singleton (adapter bağlantısı)
│   ├── auth.ts                  # NextAuth config
│   ├── utils.ts                 # cn(), formatDate(), vb.
│   ├── slug.ts                  # Slug üretme & çakışma kontrolü
│   ├── validations.ts           # Zod şemaları
│   └── constants.ts             # Kategori, şehir, vs. sabit listeler
├── prisma/
│   ├── schema.prisma            # Model tanımları (URL yok — prisma.config.ts'de)
│   └── seed.ts                  # Kategori & demo veri seed
├── prisma.config.ts             # Prisma 7 database URL + adapter config
├── proxy.ts                     # Next.js 16 Proxy (eski middleware)
└── next.config.ts
```

---

## 3. Veritabanı & Model Kuralları

- Her tablo `id UUID DEFAULT gen_random_uuid()` kullan; `Int` auto-increment yasak
- `createdAt` / `updatedAt` her modelde zorunlu (`@default(now())` / `@updatedAt`)
- Soft delete için `deletedAt DateTime?` kullan; gerçek `DELETE` yalnızca GDPR talebi
- Enum değerleri `SCREAMING_SNAKE_CASE`; Prisma model adları `PascalCase`
- N+1 sorgularından kaçın: `include` yerine `select` ile yalnızca gerekli alanları çek
- Randevu slot çakışma kontrolü transaction içinde yapılır (`$transaction`)
- Geo sorguları için `latitude FLOAT` + `longitude FLOAT` sakla; PostGIS olmadan Haversine hesabı yap

---

## 4. API Katmanı Kuralları

- Tüm API route'ları `app/api/` altında `route.ts` dosyaları — asla `pages/api/`
- Response format standart:
  ```ts
  { success: true,  data: T }          // başarı
  { success: false, error: string }    // hata
  ```
- HTTP statüsleri: `200` başarı · `201` oluşturma · `400` validasyon · `401` auth · `403` yetki · `404` bulunamadı · `500` sunucu
- Girdi validasyonu Zod ile `lib/validations.ts` içinde tanımla; parse etmeden işlem yapma
- Rate limiting: hassas endpoint'ler (`/api/randevu`, `/api/auth`) için IP bazlı limit ekle
- Görsel yükleme: dosya sunucuya almaz; presigned URL döndür (S3 / Cloudinary)
- **Ortak API prensibi:** Web ve Mobil istemci aynı endpoint'leri tüketir; platform ayrımı header `X-Client: web | mobile` ile yapılır

---

## 5. Kimlik Doğrulama & Yetkilendirme

```
Roller: CUSTOMER | BUSINESS_OWNER | ADMIN
```

- `proxy.ts` → `/dashboard/**` yalnızca `BUSINESS_OWNER` veya `ADMIN`
- `proxy.ts` → `/api/randevu` POST yalnızca `CUSTOMER`  
- `proxy.ts` → `/api/isletme` PATCH/DELETE yalnızca kendi kaydı veya `ADMIN`
- Token yenileme: `accessToken` 15 dk, `refreshToken` 7 gün
- OAuth: Google + Apple (mobil için Apple zorunlu — App Store kuralı)
- Şifreler `bcrypt` ile hash'lenir, salt rounds ≥ 12

---

## 6. Frontend & UI Kuralları

- **Stil:** Tailwind CSS v4 + `shadcn/ui` bileşenleri
- `cn()` utility (`clsx + tailwind-merge`) sınıf birleştirme için kullan
- Server Component'lerde `async/await` ile veri çek; loading state için `<Suspense>` kullan
- `loading.tsx` her route segmentinde tanımla
- Görsel optimizasyon: her zaman `next/image`; `alt` zorunlu; `priority` yalnızca LCP görseli
- `next/link` ile navigasyon; `<a>` yasak (SPA geçişi bozar)
- Form state: `react-hook-form` + Zod resolver; `useState` ile form yönetme
- Toast bildirimleri: `sonner` kütüphanesi

---

## 7. Performans & SEO

- İşletme profil sayfaları ISR ile önbellekle: `revalidate: 3600` (1 saat)
- Arama sayfası SSR; randevu takvimi CSR
- `generateMetadata()` her profil sayfasında: title, description, OG image
- `sitemap.ts` ile dinamik sitemap üret (tüm aktif işletme slug'ları)
- Görseller WebP formatında sakla; max 1200px genişlik
- Bundle analizi için `@next/bundle-analyzer` ekle; chunk > 200kb'ı split et

---

## 8. Güvenlik Kuralları

- CSRF: NextAuth v5 built-in koruma aktif (form action'larına `csrfToken` ekle)
- SQL Injection: Prisma ORM dışında ham sorgu **yasak**; zorunlu durumlarda `$queryRaw` parametreli kullan
- XSS: kullanıcı içerikleri `DOMPurify` ile sanitize et; `dangerouslySetInnerHTML` yasak
- Env değişkenleri: client'a açık olanlar `NEXT_PUBLIC_` prefix; gizli anahtarlar asla client bundle'a girmesin
- `.env.local` asla commit edilmez; `.env.example` ile şablon tut
- Upload: dosya tipi MIME + magic bytes ile doğrula; max boyut 5 MB

---

## 9. Mobil Mimari Notu

```
┌──────────────┐     ┌──────────────┐
│  Next.js Web │     │ React Native │
│  (App Router)│     │   (Expo)     │
└──────┬───────┘     └──────┬───────┘
       │                    │
       └────────┬───────────┘
                ▼
        ┌───────────────┐
        │  Ortak REST   │
        │  /api katmanı │
        │  (Next.js)    │
        └───────────────┘
```

- Mobil için ayrı backend **yazmayacaksın** — mevcut `app/api/` endpoint'lerini kullan
- Expo için `expo-secure-store` ile token sakla; `AsyncStorage` hassas veri **için değil**
- Push bildirim: Expo Notifications API → randevu hatırlatıcı & onay bildirimleri

---

## 10. Geliştirme Akışı & Komutlar

```bash
# Kurulum
cp .env.example .env.local
# .env.local içine Neon DATABASE_URL ve AUTH_SECRET ekle

npm install
npm run db:push          # Şemayı Neon'a uygula
npm run db:seed          # Kategori & test verisi
npm run dev              # Turbopack ile başlat (port 3000)

# Veritabanı
npm run db:studio        # Prisma Studio (görsel arayüz)
npm run db:migrate       # Migration oluştur (production öncesi)

# Kod kalitesi
npm run lint             # ESLint
npm run type-check       # tsc --noEmit
npm run test             # Vitest

# Production
npm run build
npm run start
```

---

## 11. Kod Kalitesi Standartları

- TypeScript strict mode açık; `any` yasak — `unknown` + type guard kullan
- Component dosyaları: `PascalCase.tsx`; utility/hook: `camelCase.ts`
- Hook isimleri `use` prefix ile başlar: `useAppointments`, `useBusinessProfile`
- Her API route için tip güvenli response tipleri tanımla (`lib/types.ts`)
- Comment dili: **Türkçe** (domain mantığı) / **İngilizce** (teknik açıklama)
- `console.log` production'da bırakma; `logger` utility kullan

---

## 12. Yapılmaması Gerekenler (Anti-Pattern)

| Yasak | Alternatif |
|-------|------------|
| `pages/api/` route | `app/api/route.ts` |
| `middleware.ts` | `proxy.ts` |
| Schema içinde DB URL | `prisma.config.ts` |
| `Int` id | `UUID` |
| Client'ta `fetch` + `useEffect` ile veri çekme | Server Component `async` |
| `<img>` | `next/image` |
| `<a href>` | `next/link` |
| `useState` ile form yönetimi | `react-hook-form` |
| Hard-coded string | `lib/constants.ts` |
| Gerçek `DELETE` | `deletedAt` soft delete |
