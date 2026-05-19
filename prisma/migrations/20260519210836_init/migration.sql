-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'BUSINESS', 'USER');

-- CreateEnum
CREATE TYPE "Plan" AS ENUM ('UCRETSIZ', 'STARTER', 'PRO');

-- CreateEnum
CREATE TYPE "RandevuDurum" AS ENUM ('BEKLIYOR', 'ONAYLANDI', 'IPTAL', 'TAMAMLANDI');

-- CreateTable
CREATE TABLE "kullaniciler" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "kullaniciAdi" TEXT,
    "telefon" TEXT,
    "sifreHash" TEXT NOT NULL,
    "ad" TEXT NOT NULL,
    "soyad" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "rol" "Rol" NOT NULL DEFAULT 'USER',
    "emailOnay" BOOLEAN NOT NULL DEFAULT false,
    "plan" "Plan" NOT NULL DEFAULT 'UCRETSIZ',
    "planBitisTarihi" TIMESTAMP(3),
    "olusturmaT" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "guncelleT" TIMESTAMP(3) NOT NULL,
    "sehir" TEXT,
    "ilce" TEXT,
    "ilgiAlanlari" TEXT[],
    "expoPushToken" TEXT,
    "cihazPlatformu" TEXT,
    "pushIzni" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "bekleyenEmail" TEXT,
    "emailKodHash" TEXT,
    "emailKodSon" TIMESTAMP(3),

    CONSTRAINT "kullaniciler_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "esnaflar" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "isletmeAdi" TEXT NOT NULL,
    "aciklama" TEXT,
    "kategoriId" INTEGER NOT NULL,
    "kapakFoto" TEXT,
    "logoUrl" TEXT,
    "fotograflar" TEXT[],
    "sehir" TEXT NOT NULL,
    "ilce" TEXT NOT NULL,
    "adres" TEXT,
    "enlem" DOUBLE PRECISION,
    "boylam" DOUBLE PRECISION,
    "telefon" TEXT,
    "whatsapp" TEXT,
    "website" TEXT,
    "instagram" TEXT,
    "facebook" TEXT,
    "tiktok" TEXT,
    "youtube" TEXT,
    "bildirimAyarlari" JSONB,
    "calismaS" JSONB,
    "kategoriAyarlari" JSONB,
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "onaylı" BOOLEAN NOT NULL DEFAULT false,
    "bekleyenIsletmeAdi" TEXT,
    "olusturmaT" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "guncelleT" TIMESTAMP(3) NOT NULL,
    "kullaniciId" INTEGER NOT NULL,

    CONSTRAINT "esnaflar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kategoriler" (
    "id" SERIAL NOT NULL,
    "ad" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "ikon" TEXT NOT NULL,
    "ikonUrl" TEXT,
    "renk" TEXT NOT NULL,
    "sira" INTEGER NOT NULL DEFAULT 0,
    "ustKategoriId" INTEGER,

    CONSTRAINT "kategoriler_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hizmetler" (
    "id" SERIAL NOT NULL,
    "ad" TEXT NOT NULL,
    "aciklama" TEXT,
    "fiyat" DECIMAL(10,2) NOT NULL,
    "sure" INTEGER,
    "kategori" TEXT,
    "fotoUrl" TEXT,
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "sira" INTEGER NOT NULL DEFAULT 0,
    "olusturmaT" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "esnafId" INTEGER NOT NULL,
    "indirimYuzde" INTEGER,
    "indirimBaslangic" TIMESTAMP(3),
    "indirimBitis" TIMESTAMP(3),
    "oncelik" INTEGER NOT NULL DEFAULT 0,
    "oneCikan" BOOLEAN NOT NULL DEFAULT false,
    "onlineOdeme" BOOLEAN NOT NULL DEFAULT false,
    "minOnRezervasyon" INTEGER,
    "maksKatilimci" INTEGER NOT NULL DEFAULT 1,
    "etiketler" TEXT[],

    CONSTRAINT "hizmetler_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "randevular" (
    "id" SERIAL NOT NULL,
    "tarih" TIMESTAMP(3) NOT NULL,
    "sure" INTEGER NOT NULL,
    "durum" "RandevuDurum" NOT NULL DEFAULT 'BEKLIYOR',
    "musteriAd" TEXT NOT NULL,
    "musteriTelefon" TEXT NOT NULL,
    "musteriNot" TEXT,
    "olusturmaT" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "guncelleT" TIMESTAMP(3) NOT NULL,
    "esnafId" INTEGER NOT NULL,
    "hizmetId" INTEGER,
    "kullaniciId" INTEGER,

    CONSTRAINT "randevular_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "yorumlar" (
    "id" SERIAL NOT NULL,
    "puan" INTEGER NOT NULL,
    "yorum" TEXT,
    "musteriAd" TEXT NOT NULL,
    "yanitlar" TEXT,
    "onaylı" BOOLEAN NOT NULL DEFAULT false,
    "bildirildi" BOOLEAN NOT NULL DEFAULT false,
    "bildirimNot" TEXT,
    "olusturmaT" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "esnafId" INTEGER NOT NULL,
    "kullaniciId" INTEGER,

    CONSTRAINT "yorumlar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "oturumlar" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "kullaniciId" INTEGER NOT NULL,
    "sonT" TIMESTAMP(3) NOT NULL,
    "olusturmaT" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "oturumlar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favoriler" (
    "id" SERIAL NOT NULL,
    "kullaniciId" INTEGER NOT NULL,
    "esnafId" INTEGER NOT NULL,
    "olusturmaT" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favoriler_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "istatistikler" (
    "id" SERIAL NOT NULL,
    "tarih" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "goruntulenme" INTEGER NOT NULL DEFAULT 0,
    "tiklanma" INTEGER NOT NULL DEFAULT 0,
    "randevuSay" INTEGER NOT NULL DEFAULT 0,
    "whatsappT" INTEGER NOT NULL DEFAULT 0,
    "esnafId" INTEGER NOT NULL,

    CONSTRAINT "istatistikler_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kvkk_loglari" (
    "id" SERIAL NOT NULL,
    "kullaniciId" INTEGER NOT NULL,
    "islem" TEXT NOT NULL,
    "aciklama" TEXT,
    "ipAdres" TEXT,
    "userAgent" TEXT,
    "olusturmaT" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "kvkk_loglari_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gezilen_esnaflar" (
    "id" SERIAL NOT NULL,
    "kullaniciId" INTEGER NOT NULL,
    "esnafId" INTEGER NOT NULL,
    "sonGorulmeT" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "gezilen_esnaflar_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "kullaniciler_email_key" ON "kullaniciler"("email");

-- CreateIndex
CREATE UNIQUE INDEX "kullaniciler_kullaniciAdi_key" ON "kullaniciler"("kullaniciAdi");

-- CreateIndex
CREATE INDEX "kullaniciler_deletedAt_idx" ON "kullaniciler"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "esnaflar_slug_key" ON "esnaflar"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "esnaflar_kullaniciId_key" ON "esnaflar"("kullaniciId");

-- CreateIndex
CREATE INDEX "esnaflar_sehir_kategoriId_idx" ON "esnaflar"("sehir", "kategoriId");

-- CreateIndex
CREATE INDEX "esnaflar_slug_idx" ON "esnaflar"("slug");

-- CreateIndex
CREATE INDEX "esnaflar_aktif_onaylı_idx" ON "esnaflar"("aktif", "onaylı");

-- CreateIndex
CREATE UNIQUE INDEX "kategoriler_ad_key" ON "kategoriler"("ad");

-- CreateIndex
CREATE UNIQUE INDEX "kategoriler_slug_key" ON "kategoriler"("slug");

-- CreateIndex
CREATE INDEX "hizmetler_esnafId_aktif_idx" ON "hizmetler"("esnafId", "aktif");

-- CreateIndex
CREATE INDEX "randevular_esnafId_tarih_idx" ON "randevular"("esnafId", "tarih");

-- CreateIndex
CREATE INDEX "randevular_esnafId_tarih_durum_idx" ON "randevular"("esnafId", "tarih", "durum");

-- CreateIndex
CREATE INDEX "randevular_kullaniciId_idx" ON "randevular"("kullaniciId");

-- CreateIndex
CREATE INDEX "yorumlar_kullaniciId_idx" ON "yorumlar"("kullaniciId");

-- CreateIndex
CREATE INDEX "yorumlar_esnafId_onaylı_idx" ON "yorumlar"("esnafId", "onaylı");

-- CreateIndex
CREATE UNIQUE INDEX "oturumlar_token_key" ON "oturumlar"("token");

-- CreateIndex
CREATE INDEX "favoriler_kullaniciId_idx" ON "favoriler"("kullaniciId");

-- CreateIndex
CREATE UNIQUE INDEX "favoriler_kullaniciId_esnafId_key" ON "favoriler"("kullaniciId", "esnafId");

-- CreateIndex
CREATE UNIQUE INDEX "istatistikler_esnafId_tarih_key" ON "istatistikler"("esnafId", "tarih");

-- CreateIndex
CREATE INDEX "kvkk_loglari_kullaniciId_olusturmaT_idx" ON "kvkk_loglari"("kullaniciId", "olusturmaT");

-- CreateIndex
CREATE INDEX "kvkk_loglari_islem_olusturmaT_idx" ON "kvkk_loglari"("islem", "olusturmaT");

-- CreateIndex
CREATE INDEX "gezilen_esnaflar_kullaniciId_sonGorulmeT_idx" ON "gezilen_esnaflar"("kullaniciId", "sonGorulmeT" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "gezilen_esnaflar_kullaniciId_esnafId_key" ON "gezilen_esnaflar"("kullaniciId", "esnafId");

-- AddForeignKey
ALTER TABLE "esnaflar" ADD CONSTRAINT "esnaflar_kategoriId_fkey" FOREIGN KEY ("kategoriId") REFERENCES "kategoriler"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "esnaflar" ADD CONSTRAINT "esnaflar_kullaniciId_fkey" FOREIGN KEY ("kullaniciId") REFERENCES "kullaniciler"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kategoriler" ADD CONSTRAINT "kategoriler_ustKategoriId_fkey" FOREIGN KEY ("ustKategoriId") REFERENCES "kategoriler"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hizmetler" ADD CONSTRAINT "hizmetler_esnafId_fkey" FOREIGN KEY ("esnafId") REFERENCES "esnaflar"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "randevular" ADD CONSTRAINT "randevular_esnafId_fkey" FOREIGN KEY ("esnafId") REFERENCES "esnaflar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "randevular" ADD CONSTRAINT "randevular_hizmetId_fkey" FOREIGN KEY ("hizmetId") REFERENCES "hizmetler"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "randevular" ADD CONSTRAINT "randevular_kullaniciId_fkey" FOREIGN KEY ("kullaniciId") REFERENCES "kullaniciler"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "yorumlar" ADD CONSTRAINT "yorumlar_esnafId_fkey" FOREIGN KEY ("esnafId") REFERENCES "esnaflar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "yorumlar" ADD CONSTRAINT "yorumlar_kullaniciId_fkey" FOREIGN KEY ("kullaniciId") REFERENCES "kullaniciler"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "oturumlar" ADD CONSTRAINT "oturumlar_kullaniciId_fkey" FOREIGN KEY ("kullaniciId") REFERENCES "kullaniciler"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favoriler" ADD CONSTRAINT "favoriler_kullaniciId_fkey" FOREIGN KEY ("kullaniciId") REFERENCES "kullaniciler"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favoriler" ADD CONSTRAINT "favoriler_esnafId_fkey" FOREIGN KEY ("esnafId") REFERENCES "esnaflar"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "istatistikler" ADD CONSTRAINT "istatistikler_esnafId_fkey" FOREIGN KEY ("esnafId") REFERENCES "esnaflar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kvkk_loglari" ADD CONSTRAINT "kvkk_loglari_kullaniciId_fkey" FOREIGN KEY ("kullaniciId") REFERENCES "kullaniciler"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gezilen_esnaflar" ADD CONSTRAINT "gezilen_esnaflar_kullaniciId_fkey" FOREIGN KEY ("kullaniciId") REFERENCES "kullaniciler"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gezilen_esnaflar" ADD CONSTRAINT "gezilen_esnaflar_esnafId_fkey" FOREIGN KEY ("esnafId") REFERENCES "esnaflar"("id") ON DELETE CASCADE ON UPDATE CASCADE;
