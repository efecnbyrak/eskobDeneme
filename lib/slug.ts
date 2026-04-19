export function slugOlustur(metin: string): string {
  return metin
    .toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export function benzersizSlug(base: string, mevcut: string[]): string {
  let slug = slugOlustur(base)
  let sayac = 1
  while (mevcut.includes(slug)) {
    slug = `${slugOlustur(base)}-${sayac}`
    sayac++
  }
  return slug
}
