'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { KATEGORILER } from '@/lib/constants'

function SocialButtons() {
  return (
    <>
      <style>{`
        .ev-social-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }
        .ev-social-item {
          position: relative;
        }
        .ev-social-item .ev-tooltip {
          position: absolute;
          top: -36px;
          left: 50%;
          transform: translateX(-50%);
          color: #fff;
          padding: 5px 10px;
          border-radius: 12px;
          opacity: 0;
          visibility: hidden;
          font-size: 12px;
          white-space: nowrap;
          transition: all 0.3s ease;
          pointer-events: none;
          font-weight: 500;
        }
        .ev-social-item:hover .ev-tooltip {
          opacity: 1;
          visibility: visible;
          top: -44px;
        }
        .ev-social-item a {
          position: relative;
          overflow: hidden;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 50px;
          height: 50px;
          border-radius: 14px;
          color: #4d4d4d;
          background-color: #ffffff;
          transition: all 0.3s ease-in-out;
          text-decoration: none;
        }
        .ev-social-item a:hover {
          box-shadow: 3px 2px 45px 0px rgb(0 0 0 / 50%);
          color: white;
        }
        .ev-social-item a svg {
          position: relative;
          z-index: 1;
          width: 26px;
          height: 26px;
        }
        .ev-social-filled {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 0;
          transition: all 0.3s ease-in-out;
        }
        .ev-social-item a:hover .ev-social-filled {
          height: 100%;
        }
        .ev-social-item a[data-social="instagram"] .ev-social-filled,
        .ev-social-item a[data-social="instagram"] ~ .ev-tooltip {
          background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888);
        }
        .ev-social-item a[data-social="facebook"] .ev-social-filled,
        .ev-social-item a[data-social="facebook"] ~ .ev-tooltip {
          background-color: #1877f2;
        }
        .ev-social-item a[data-social="whatsapp"] .ev-social-filled,
        .ev-social-item a[data-social="whatsapp"] ~ .ev-tooltip {
          background-color: #25d366;
        }
        .ev-social-item a[data-social="telegram"] .ev-social-filled,
        .ev-social-item a[data-social="telegram"] ~ .ev-tooltip {
          background-color: #0088cc;
        }
      `}</style>
      <ul className="ev-social-list">
        <li className="ev-social-item">
          <a href="#" aria-label="Instagram" data-social="instagram">
            <div className="ev-social-filled" />
            <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>
          <div className="ev-tooltip">Instagram</div>
        </li>
        <li className="ev-social-item">
          <a href="#" aria-label="Facebook" data-social="facebook">
            <div className="ev-social-filled" />
            <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </a>
          <div className="ev-tooltip">Facebook</div>
        </li>
        <li className="ev-social-item">
          <a href="#" aria-label="WhatsApp" data-social="whatsapp">
            <div className="ev-social-filled" />
            <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </a>
          <div className="ev-tooltip">WhatsApp</div>
        </li>
        <li className="ev-social-item">
          <a href="https://telegram.org/" aria-label="Telegram" data-social="telegram">
            <div className="ev-social-filled" />
            <svg version="1.1" viewBox="0 0 100 100" fill="currentColor">
              <path d="M95,9.9c-1.3-1.1-3.4-1.2-7-0.1c0,0,0,0,0,0c-2.5,0.8-24.7,9.2-44.3,17.3c-17.6,7.3-31.9,13.7-33.6,14.5  c-1.9,0.6-6,2.4-6.2,5.2c-0.1,1.8,1.4,3.4,4.3,4.7c3.1,1.6,16.8,6.2,19.7,7.1c1,3.4,6.9,23.3,7.2,24.5c0.4,1.8,1.6,2.8,2.2,3.2  c0.1,0.1,0.3,0.3,0.5,0.4c0.3,0.2,0.7,0.3,1.2,0.3c0.7,0,1.5-0.3,2.2-0.8c3.7-3,10.1-9.7,11.9-11.6c7.9,6.2,16.5,13.1,17.3,13.9  c0,0,0.1,0.1,0.1,0.1c1.9,1.6,3.9,2.5,5.7,2.5c0.6,0,1.2-0.1,1.8-0.3c2.1-0.7,3.6-2.7,4.1-5.4c0-0.1,0.1-0.5,0.3-1.2  c3.4-14.8,6.1-27.8,8.3-38.7c2.1-10.7,3.8-21.2,4.8-26.8c0.2-1.4,0.4-2.5,0.5-3.2C96.3,13.5,96.5,11.2,95,9.9z M30,58.3l47.7-31.6  c0.1-0.1,0.3-0.2,0.4-0.3c0,0,0,0,0,0c0.1,0,0.1-0.1,0.2-0.1c0.1,0,0.1,0,0.2-0.1c-0.1,0.1-0.2,0.4-0.4,0.6L66,38.1  c-8.4,7.7-19.4,17.8-26.7,24.4c0,0,0,0,0,0.1c0,0-0.1,0.1-0.1,0.1c0,0,0,0.1-0.1,0.1c0,0.1,0,0.1-0.1,0.2c0,0,0,0.1,0,0.1  c0,0,0,0,0,0.1c-0.5,5.6-1.4,15.2-1.8,19.5c0,0,0,0,0-0.1C36.8,81.4,31.2,62.3,30,58.3z" />
            </svg>
          </a>
          <div className="ev-tooltip">Telegram</div>
        </li>
      </ul>
    </>
  )
}

export function Footer() {
  const pathname = usePathname()
  const isMusteri = pathname === '/musteri' || pathname?.startsWith('/musteri/')
  const isIsletme = pathname === '/isletme' || pathname?.startsWith('/isletme/')

  const gizlilikHref = isMusteri ? '/musteri/gizlilik' : isIsletme ? '/isletme/gizlilik' : '/gizlilik'
  const kullanimHref = isMusteri ? '/musteri/kullanim' : isIsletme ? '/isletme/kullanim' : '/kullanim'
  const iletisimHref = isMusteri ? '/musteri/iletisim' : isIsletme ? '/isletme/iletisim' : '/iletisim'

  return (
    <footer className="bg-[#15232A] text-[#B0C4CC] mt-auto">
      <div className="container-main py-12 sm:py-16 lg:py-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 sm:gap-12 lg:gap-12">

          {/* Brand */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-5">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[var(--color-primary)] text-white flex items-center justify-center font-bold font-display text-base sm:text-lg shadow-sm flex-shrink-0">
                EV
              </span>
              <span className="font-bold text-xl sm:text-2xl text-white font-display tracking-tight">Esnaf Vitrin</span>
            </div>
            <p className="text-sm sm:text-base text-[#90A8B2] leading-[1.8] mb-8 max-w-sm">
              Türkiye&apos;nin esnaf ve KOBİ&apos;leri için yeni nesil dijital vitrin platformu. İşletmeni bugün dijitale taşı, hizmetlerini tanıt ve randevularını kolayca yönet.
            </p>
            <SocialButtons />
          </div>

          {/* Orta kolon — context'e göre değişir */}
          <div className="lg:col-span-3">
            {isMusteri ? (
              <>
                <h3 className="font-bold text-sm sm:text-base mb-5 sm:mb-8 text-white tracking-wide font-display uppercase">Keşfet</h3>
                <ul className="space-y-4 sm:space-y-5">
                  <li>
                    <Link href="/musteri/ara" className="text-[#90A8B2] hover:text-white transition-colors text-sm sm:text-[15px] leading-relaxed">
                      Tüm İşletmeler
                    </Link>
                  </li>
                  {KATEGORILER.slice(0, 5).map((k) => (
                    <li key={k.slug}>
                      <Link href={`/musteri/kategori/${k.slug}`} className="flex items-center gap-3 text-[#90A8B2] hover:text-white transition-colors text-sm sm:text-[15px] leading-relaxed">
                        <span className="opacity-60">{k.ikon}</span>
                        <span>{k.ad}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            ) : isIsletme ? (
              <>
                <h3 className="font-bold text-sm sm:text-base mb-5 sm:mb-8 text-white tracking-wide font-display uppercase">İşletme</h3>
                <ul className="space-y-4 sm:space-y-5">
                  <li>
                    <Link href="/isletme" className="text-[#90A8B2] hover:text-white transition-colors text-sm sm:text-[15px] leading-relaxed">
                      Neden Eskob?
                    </Link>
                  </li>
                  <li>
                    <Link href="/isletme/ozellikler" className="text-[#90A8B2] hover:text-white transition-colors text-sm sm:text-[15px] leading-relaxed">
                      Özellikler
                    </Link>
                  </li>
                  <li>
                    <Link href="/isletme/nasil-calisir" className="text-[#90A8B2] hover:text-white transition-colors text-sm sm:text-[15px] leading-relaxed">
                      Nasıl Çalışır?
                    </Link>
                  </li>
                  <li>
                    <Link href="/isletme/iletisim" className="text-[#90A8B2] hover:text-white transition-colors text-sm sm:text-[15px] leading-relaxed">
                      İletişim
                    </Link>
                  </li>
                </ul>
              </>
            ) : (
              <>
                <h3 className="font-bold text-sm sm:text-base mb-5 sm:mb-8 text-white tracking-wide font-display uppercase">Keşfet</h3>
                <ul className="space-y-4 sm:space-y-5">
                  <li>
                    <Link href="/ara" className="text-[#90A8B2] hover:text-white transition-colors text-sm sm:text-[15px] leading-relaxed">
                      Tüm Esnaflar
                    </Link>
                  </li>
                  {KATEGORILER.slice(0, 5).map((k) => (
                    <li key={k.slug}>
                      <Link href={`/kategori/${k.slug}`} className="flex items-center gap-3 text-[#90A8B2] hover:text-white transition-colors text-sm sm:text-[15px] leading-relaxed">
                        <span className="opacity-60">{k.ikon}</span>
                        <span>{k.ad}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          {/* Sağ kolon — context'e göre değişir */}
          <div className="lg:col-span-4">
            {isMusteri ? (
              <>
                <h3 className="font-bold text-sm sm:text-base mb-5 sm:mb-8 text-white tracking-wide font-display uppercase">Hesabım</h3>
                <ul className="space-y-4 sm:space-y-5">
                  <li>
                    <Link href="/musteri/kayit" className="inline-flex items-center gap-2 text-[var(--color-accent)] hover:text-white transition-colors text-sm sm:text-[15px] font-semibold leading-relaxed">
                      ✨ Ücretsiz Kaydol
                    </Link>
                  </li>
                  <li>
                    <Link href="/musteri/giris" className="text-[#90A8B2] hover:text-white transition-colors text-sm sm:text-[15px] leading-relaxed">
                      Giriş Yap
                    </Link>
                  </li>
                  <li>
                    <Link href="/hesabim" className="text-[#90A8B2] hover:text-white transition-colors text-sm sm:text-[15px] leading-relaxed">
                      Hesabım
                    </Link>
                  </li>
                  <li>
                    <Link href="/hesabim" className="text-[#90A8B2] hover:text-white transition-colors text-sm sm:text-[15px] leading-relaxed">
                      Randevularım
                    </Link>
                  </li>
                  <li>
                    <Link href="/hesabim" className="text-[#90A8B2] hover:text-white transition-colors text-sm sm:text-[15px] leading-relaxed">
                      Favorilerim
                    </Link>
                  </li>
                </ul>
              </>
            ) : isIsletme ? (
              <>
                <h3 className="font-bold text-sm sm:text-base mb-5 sm:mb-8 text-white tracking-wide font-display uppercase">Başla</h3>
                <ul className="space-y-4 sm:space-y-5">
                  <li>
                    <Link href="/isletme/kayit" className="inline-flex items-center gap-2 text-[var(--color-accent)] hover:text-white transition-colors text-sm sm:text-[15px] font-semibold leading-relaxed">
                      ✨ Hemen Ücretsiz Kaydol
                    </Link>
                  </li>
                  <li>
                    <Link href="/isletme/giris" className="text-[#90A8B2] hover:text-white transition-colors text-sm sm:text-[15px] leading-relaxed">
                      Giriş Yap
                    </Link>
                  </li>
                  <li>
                    <Link href="/isletme/panel" className="text-[#90A8B2] hover:text-white transition-colors text-sm sm:text-[15px] leading-relaxed">
                      İşletme Paneli
                    </Link>
                  </li>
                  <li>
                    <Link href="/isletme/panel/vitrin" className="text-[#90A8B2] hover:text-white transition-colors text-sm sm:text-[15px] leading-relaxed">
                      Vitrinim
                    </Link>
                  </li>
                  <li>
                    <Link href="/isletme/panel/randevular" className="text-[#90A8B2] hover:text-white transition-colors text-sm sm:text-[15px] leading-relaxed">
                      Randevular
                    </Link>
                  </li>
                </ul>
              </>
            ) : (
              <>
                <h3 className="font-bold text-sm sm:text-base mb-5 sm:mb-8 text-white tracking-wide font-display uppercase">İşletmeni Büyüt</h3>
                <ul className="space-y-4 sm:space-y-5">
                  <li>
                    <Link href="/kayit" className="inline-flex items-center gap-2 text-[var(--color-accent)] hover:text-white transition-colors text-sm sm:text-[15px] font-semibold leading-relaxed">
                      ✨ Hemen Ücretsiz Kaydol
                    </Link>
                  </li>
                  <li>
                    <Link href="/giris" className="text-[#90A8B2] hover:text-white transition-colors text-sm sm:text-[15px] leading-relaxed">
                      Giriş Yap
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-[#90A8B2] hover:text-white transition-colors text-sm sm:text-[15px] leading-relaxed">
                      Nasıl Çalışır?
                    </Link>
                  </li>
                </ul>
              </>
            )}
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 sm:mt-16 lg:mt-20 pt-8 sm:pt-10 border-t border-[#1F333D] flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 text-xs sm:text-sm text-[#7A9AA6]">
          <p className="text-center sm:text-left">© {new Date().getFullYear()} Esnaf Vitrin. Tüm hakları saklıdır.</p>
          <div className="flex flex-wrap justify-center gap-5 sm:gap-8 font-medium">
            <Link href={gizlilikHref} className="hover:text-white transition-colors">Gizlilik Politikası</Link>
            <Link href={kullanimHref} className="hover:text-white transition-colors">Kullanım Şartları</Link>
            <Link href={iletisimHref} className="hover:text-white transition-colors">İletişim</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
