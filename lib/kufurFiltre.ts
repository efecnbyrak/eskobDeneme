const KUFUR_LISTESI = [
  'amk', 'oç', 'orospu', 'piç', 'sik', 'sikiş', 'sikeyim', 'sikerim',
  'göt', 'götveren', 'ibne', 'yarrak', 'yarak', 'amına', 'amını',
  'bok', 'boktan', 'kahpe', 'kaltak', 'oruspu', 'salak', 'gerizekalı',
  'aptal', 'mal', 'dangalak', 'şerefsiz', 'alçak', 'sürtük',
  'sıçmak', 'sıçayım', 'taşak', 'meme', 'am ', ' am', 'oç',
]

export function kufurVarMi(metin: string): boolean {
  if (!metin) return false
  const kucuk = metin.toLowerCase().replace(/[*@#!]/g, '')
  return KUFUR_LISTESI.some((k) => kucuk.includes(k))
}
