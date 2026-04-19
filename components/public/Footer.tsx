import Link from 'next/link'
import { KATEGORILER } from '@/lib/constants'

export function Footer() {
  return (
    <footer className="bg-[#1A1A1A] text-[#E0E0E0] mt-auto">
      <div className="container-main py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-2 xl:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <span className="w-10 h-10 rounded-xl bg-[var(--color-primary)] text-white flex items-center justify-center font-bold font-display text-base shadow-[0_0_15px_rgba(242,122,26,0.4)]">EV</span>
              <span className="font-bold text-xl text-white font-display">Esnaf Vitrin</span>
            </div>
            <p className="text-sm text-[#A0A0A0] leading-relaxed mb-6 max-w-[280px]">
              Türkiye&apos;nin esnaf ve KOBİ&apos;leri için yeni nesil dijital vitrin platformu. İşletmeni bugün dijitale taşı, müşterilerini artır.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-[#333333] flex items-center justify-center text-white hover:bg-[var(--color-primary)] hover:shadow-[0_0_15px_rgba(242,122,26,0.5)] transition-all"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-[#333333] flex items-center justify-center text-white hover:bg-[var(--color-primary)] hover:shadow-[0_0_15px_rgba(242,122,26,0.5)] transition-all"
                aria-label="Twitter"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Keşfet */}
          <div className="col-span-1 border-t border-[#3333] pt-6 sm:border-0 sm:pt-0">
            <p className="font-semibold text-lg mb-5 text-white tracking-wide">Keşfet</p>
            <ul className="space-y-4 text-sm text-[#A0A0A0]">
              <li><Link href="/ara" className="hover:text-white hover:translate-x-1 inline-block transition-all">Esnaf Ara</Link></li>
              {KATEGORILER.slice(0, 5).map((k) => (
                <li key={k.slug}>
                  <Link href={`/kategori/${k.slug}`} className="hover:text-white hover:translate-x-1 inline-flex items-center gap-2 transition-all">
                    <span>{k.ikon}</span> {k.ad}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* İşletmem */}
          <div className="col-span-1 border-t border-[#3333] pt-6 sm:border-0 sm:pt-0">
            <p className="font-semibold text-lg mb-5 text-white tracking-wide">İşletmenizi Büyütün</p>
            <ul className="space-y-4 text-sm text-[#A0A0A0]">
              <li><Link href="/kayit" className="hover:text-[var(--color-primary)] hover:translate-x-1 inline-block transition-all font-medium">✨ Ücretsiz Kaydol</Link></li>
              <li><Link href="/giris" className="hover:text-white hover:translate-x-1 inline-block transition-all">Giriş Yap</Link></li>
              <li><Link href="/panel" className="hover:text-white hover:translate-x-1 inline-block transition-all">Yönetim Paneli</Link></li>
              <li><Link href="#" className="hover:text-white hover:translate-x-1 inline-block transition-all">Neden Biz?</Link></li>
              <li><Link href="#" className="hover:text-white hover:translate-x-1 inline-block transition-all">Fiyatlandırma</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-[#333333] flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-[#A0A0A0] text-center md:text-left">
          <span>© {new Date().getFullYear()} Esnaf Vitrin. Tüm hakları saklıdır.</span>
          <div className="flex gap-6">
            <Link href="/gizlilik" className="hover:text-white transition-colors">Gizlilik Politikası</Link>
            <Link href="/kullanim" className="hover:text-white transition-colors">Kullanım Şartları</Link>
            <Link href="/iletisim" className="hover:text-white transition-colors">İletişim</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
