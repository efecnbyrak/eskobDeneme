// Düz metin alanları için hafif sanitizasyon (HTML tag ve kontrol karakteri
// strip). Rich text gerektiğinde DOMPurify/sanitize-html ile değiştirilmeli.

const HTML_TAG = /<\/?[a-zA-Z][^>]*>/g
// U+0000-U+001F + U+007F kontrol karakterleri
const KONTROL = new RegExp('[\\u0000-\\u001F\\u007F]', 'g')

export function temizMetin(
  giris: string | null | undefined,
  maxUzunluk = 5000
): string {
  if (!giris) return ''
  return giris
    .replace(HTML_TAG, '')
    .replace(KONTROL, '')
    .trim()
    .slice(0, maxUzunluk)
}

export function temizMetinOpsiyonel(
  giris: string | null | undefined,
  maxUzunluk = 5000
): string | null {
  const t = temizMetin(giris, maxUzunluk)
  return t.length > 0 ? t : null
}
