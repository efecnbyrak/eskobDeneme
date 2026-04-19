import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-[var(--color-warm)] border-t border-[var(--color-warm-dark)] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <p className="font-bold text-xl text-[var(--color-primary)] mb-3" style={{ fontFamily: 'var(--font-display)' }}>
              Esnaf Vitrin
            </p>
            <p className="text-sm text-[var(--color-text-secondary)] max-w-xs">
              Türkiye&apos;nin esnaf ve KOBİ&apos;leri için dijital vitrin platformu.
              İşletmeni 5 dakikada dijitale taşı.
            </p>
          </div>
          <div>
            <p className="font-semibold text-sm mb-3">Keşfet</p>
            <ul className="space-y-2 text-sm text-[var(--color-text-secondary)]">
              <li><Link href="/ara" className="hover:text-[var(--color-primary)]">Esnaf Ara</Link></li>
              <li><Link href="/kategori/berber" className="hover:text-[var(--color-primary)]">Kategoriler</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-sm mb-3">İşletmem</p>
            <ul className="space-y-2 text-sm text-[var(--color-text-secondary)]">
              <li><Link href="/kayit" className="hover:text-[var(--color-primary)]">Ücretsiz Kaydol</Link></li>
              <li><Link href="/giris" className="hover:text-[var(--color-primary)]">Giriş Yap</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-[var(--color-warm-dark)] text-xs text-[var(--color-text-secondary)]">
          © {new Date().getFullYear()} Esnaf Vitrin. Tüm hakları saklıdır.
        </div>
      </div>
    </footer>
  )
}
