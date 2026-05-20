-- AlterTable
ALTER TABLE "hizmetler" ADD COLUMN     "hizmetKategorisiId" INTEGER;

-- CreateTable
CREATE TABLE "hizmet_kategorileri" (
    "id" SERIAL NOT NULL,
    "ad" TEXT NOT NULL,
    "sira" INTEGER NOT NULL DEFAULT 0,
    "olusturmaT" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "esnafId" INTEGER NOT NULL,
    "ustId" INTEGER,

    CONSTRAINT "hizmet_kategorileri_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "hizmet_kategorileri_esnafId_idx" ON "hizmet_kategorileri"("esnafId");

-- AddForeignKey
ALTER TABLE "hizmet_kategorileri" ADD CONSTRAINT "hizmet_kategorileri_esnafId_fkey" FOREIGN KEY ("esnafId") REFERENCES "esnaflar"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hizmet_kategorileri" ADD CONSTRAINT "hizmet_kategorileri_ustId_fkey" FOREIGN KEY ("ustId") REFERENCES "hizmet_kategorileri"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hizmetler" ADD CONSTRAINT "hizmetler_hizmetKategorisiId_fkey" FOREIGN KEY ("hizmetKategorisiId") REFERENCES "hizmet_kategorileri"("id") ON DELETE SET NULL ON UPDATE CASCADE;
