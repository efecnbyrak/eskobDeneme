import Link from 'next/link'
import { KATEGORILER } from '@/lib/constants'

export function Footer() {
  return (
    <footer className="bg-[#15232A] text-[#B0C4CC] mt-auto font-body border-t border-[var(--color-primary)]/20">
      <div className="container-main py-20 lg:py-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          
          {/* Brand - Span 4 columns on large */}
          <div className="sm:col-span-2 lg:col-span-5 pr-0 lg:pr-12">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-12 h-12 rounded-xl bg-[var(--color-primary)] text-white flex items-center justify-center font-bold font-display text-lg shadow-sm">
                EV
              </span>
              <span className="font-bold text-2xl text-white font-display tracking-tight">Esnaf Vitrin</span>
            </div>
            <p className="text-base text-[#90A8B2] leading-relaxed mb-8 max-w-sm">
              Türkiye&apos;nin esnaf ve KOBİ&apos;leri için yeni nesil dijital vitrin platformu. İşletmeni bugün dijitale taşı, hizmetlerini tanıt ve randevularını kolayca yönet.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="w-12 h-12 rounded-full bg-[#1F333D] flex items-center justify-center text-white hover:bg-[var(--color-accent)] hover:text-[#15232A] transition-all duration-300"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-12 h-12 rounded-full bg-[#1F333D] flex items-center justify-center text-white hover:bg-[var(--color-accent)] hover:text-[#15232A] transition-all duration-300"
                aria-label="Twitter"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Keşfet - Span 3 columns */}
          <div className="lg:col-span-3">
            <h3 className="font-bold text-lg mb-6 text-white tracking-wide font-display">Keşfet</h3>
            <ul className="space-y-4 text-base">
              <li>
                <Link href="/ara" className="group flex items-center text-[#90A8B2] hover:text-white transition-colors">
                  <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Tüm Esnaflar
                </Link>
              </li>
              {KATEGORILER.slice(0, 5).map((k) => (
                <li key={k.slug}>
                  <Link href={`/kategori/${k.slug}`} className="group flex items-center text-[#90A8B2] hover:text-white transition-colors">
                    <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    <span className="mr-2 opacity-50 group-hover:opacity-100">{k.ikon}</span> {k.ad}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* İşletmenizi Büyütün - Span 4 columns */}
          <div className="lg:col-span-4">
            <h3 className="font-bold text-lg mb-6 text-white tracking-wide font-display">İşletmeni Büyüt</h3>
            <ul className="space-y-4 text-base">
              <li>
                <Link href="/kayit" className="group flex items-center text-[var(--color-accent)] hover:text-white transition-colors font-semibold bg-[#1F333D]/50 w-fit px-4 py-2 rounded-lg border border-[var(--color-accent)]/20 hover:bg-[#1F333D]">
                  ✨ Hemen Ücretsiz Kaydol
                </Link>
              </li>
              <li>
                <Link href="/giris" className="group flex items-center text-[#90A8B2] hover:text-white transition-colors mt-2">
                  <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Giriş Yap
                </Link>
              </li>
              <li>
                <Link href="/panel" className="group flex items-center text-[#90A8B2] hover:text-white transition-colors">
                  <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Yönetim Paneli
                </Link>
              </li>
              <li>
                <Link href="#" className="group flex items-center text-[#90A8B2] hover:text-white transition-colors">
                  <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Nasıl Çalışır?
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-20 pt-8 border-t border-[#1F333D] flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-[#90A8B2]">
          <p>© {new Date().getFullYear()} Esnaf Vitrin. Tüm hakları saklıdır.</p>
          <div className="flex flex-wrap justify-center gap-8 font-medium">
            <Link href="/gizlilik" className="hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] rounded">Gizlilik Politikası</Link>
            <Link href="/kullanim" className="hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] rounded">Kullanım Şartları</Link>
            <Link href="/iletisim" className="hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] rounded">İletişim</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
