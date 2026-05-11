# ESKOB Web — Claude Code Kuralları

## Log Sistemi (ZORUNLU)

Her kodlama oturumu tamamlandığında, `C:\ESKOB\logs\` klasörüne aşağıdaki formatta bir log dosyası oluştur:

**Dosya adı formatı:** `Web-GG.AA.YYYY-SS.DD.txt`  
Örnek: `Web-11.05.2026-14.45.txt`

**Dosya içeriği şunları içermeli:**
- Tarih ve saat
- Bu oturumda yapılan değişikliklerin özeti
- Değiştirilen / oluşturulan / silinen dosyaların listesi
- Kısa açıklama (ne yapıldı ve neden)

**Önemli kurallar:**
- Dosyayı en sona yaz (oturum bitince), en başa değil
- Mevcut log dosyalarını okuma — sadece yeni dosya oluştur
- Her oturum için ayrı bir dosya oluştur, mevcutları güncelleme
- Log dosyası içeriği Türkçe olabilir

## Proje Bilgileri

- **Framework:** Next.js (App Router)
- **Dil:** TypeScript
- **ORM:** Prisma
- **Ana klasörler:** `app/`, `components/`, `lib/`, `prisma/`
- **Log klasörü:** `C:\ESKOB\logs\`
