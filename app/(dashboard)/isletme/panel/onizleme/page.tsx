import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function OnizlemeSayfasi() {
  const oturum = await auth()
  if (!oturum?.user) redirect('/isletme/giris')

  const kullanici = await prisma.kullanici.findUnique({
    where: { email: oturum.user.email! },
    include: { esnaf: { select: { sehir: true, slug: true, isletmeAdi: true } } },
  })

  const esnaf = kullanici?.esnaf

  if (!esnaf) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center', padding: '40px 24px' }}>
        <div style={{ fontSize: 64, marginBottom: 24 }}>🏪</div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--color-text)', marginBottom: 12 }}>
          İşletme Bulunamadı
        </h1>
        <p style={{ fontSize: 15, color: 'var(--color-text-secondary)', maxWidth: 400, lineHeight: 1.7, marginBottom: 28 }}>
          Ön izleme yapabilmek için önce bir işletme profili oluşturmanız gerekiyor.
        </p>
        <Link
          href="/isletme/panel/vitrin"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '12px 24px', borderRadius: 12,
            background: 'var(--color-primary)', color: 'white',
            fontWeight: 700, fontSize: 14, textDecoration: 'none',
          }}
        >
          Vitrin Oluştur
        </Link>
      </div>
    )
  }

  const sayfaUrl = `/${esnaf.sehir.toLowerCase()}/${esnaf.slug}`

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '24px 24px 0' }}>
      {/* Başlık */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: 'var(--color-text)', marginBottom: 4 }}>
            Ön İzleme
          </h1>
          <p style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
            Müşteriler <strong>{esnaf.isletmeAdi}</strong> sayfanızı bu şekilde görüyor
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link
            href={sayfaUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '9px 18px', borderRadius: 10,
              border: '1.5px solid var(--color-border)',
              background: 'white', color: 'var(--color-text)',
              fontWeight: 600, fontSize: 13, textDecoration: 'none',
              transition: 'all 0.2s',
            }}
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Yeni Sekmede Aç
          </Link>
          <Link
            href="/isletme/panel/vitrin"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '9px 18px', borderRadius: 10,
              background: 'var(--color-primary)', color: 'white',
              fontWeight: 600, fontSize: 13, textDecoration: 'none',
              transition: 'all 0.2s',
            }}
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Vitrinini Düzenle
          </Link>
        </div>
      </div>

      {/* Bilgi banner */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '10px 16px', borderRadius: 10, marginBottom: 16,
        background: '#FFF8F0', border: '1px solid #FFD9B0',
        fontSize: 13, color: '#7A4A00',
      }}>
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Aşağıdaki önizleme, müşterilerinizin gördüğü sayfayı yansıtır. Değişiklik yapmak için <strong style={{ marginLeft: 3 }}>Vitrinini Düzenle</strong> butonuna tıklayın.
      </div>

      {/* iframe */}
      <div style={{
        flex: 1,
        border: '1.5px solid var(--color-border)',
        borderRadius: '12px 12px 0 0',
        overflow: 'hidden',
        background: 'var(--color-bg-muted)',
        minHeight: 600,
      }}>
        <iframe
          src={sayfaUrl}
          style={{ width: '100%', height: '100%', border: 'none', minHeight: 600 }}
          title={`${esnaf.isletmeAdi} — Ön İzleme`}
        />
      </div>
    </div>
  )
}
