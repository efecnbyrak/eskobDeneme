import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

const DURUM_RENK: Record<string, { bg: string; color: string; label: string }> = {
  BEKLIYOR:    { bg: '#FEF3C7', color: '#D97706', label: 'Bekliyor' },
  ONAYLANDI:   { bg: '#D1FAE5', color: '#059669', label: 'Onaylandı' },
  IPTAL:       { bg: '#FEE2E2', color: '#DC2626', label: 'İptal' },
  TAMAMLANDI:  { bg: '#E0E7FF', color: '#4338CA', label: 'Tamamlandı' },
}

export default async function RandevularPage() {
  const randevular = await prisma.randevu.findMany({
    orderBy: { tarih: 'desc' },
    take: 100,
    include: {
      esnaf: { select: { isletmeAdi: true, sehir: true } },
      hizmet: { select: { ad: true } },
      kullanici: { select: { ad: true, soyad: true, email: true } },
    },
  })

  const istatistik = {
    bekliyor: randevular.filter((r) => r.durum === 'BEKLIYOR').length,
    onaylandi: randevular.filter((r) => r.durum === 'ONAYLANDI').length,
    iptal: randevular.filter((r) => r.durum === 'IPTAL').length,
    tamamlandi: randevular.filter((r) => r.durum === 'TAMAMLANDI').length,
  }

  return (
    <div>
      <h1 className="font-display" style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>
        Randevular
      </h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 24 }}>
        Son 100 randevu gösteriliyor.
      </p>

      {/* Özet kartları */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 28 }}>
        {[
          { label: 'Bekliyor', deger: istatistik.bekliyor, renk: '#D97706' },
          { label: 'Onaylandı', deger: istatistik.onaylandi, renk: '#059669' },
          { label: 'İptal', deger: istatistik.iptal, renk: '#DC2626' },
          { label: 'Tamamlandı', deger: istatistik.tamamlandi, renk: '#4338CA' },
        ].map((item) => (
          <div key={item.label} style={{ background: 'white', borderRadius: 12, border: '1px solid var(--color-border)', padding: '16px 20px', boxShadow: 'var(--shadow-card)' }}>
            <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', fontWeight: 600, marginBottom: 4 }}>{item.label}</p>
            <p className="font-display" style={{ fontSize: 26, fontWeight: 800, color: item.renk }}>{item.deger}</p>
          </div>
        ))}
      </div>

      <div style={{ background: 'white', borderRadius: 16, border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-card)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ background: 'var(--color-bg-muted)', textAlign: 'left' }}>
                <th style={{ padding: '14px 20px', fontWeight: 600 }}>Müşteri</th>
                <th style={{ padding: '14px 20px', fontWeight: 600 }}>İşletme</th>
                <th style={{ padding: '14px 20px', fontWeight: 600 }}>Hizmet</th>
                <th style={{ padding: '14px 20px', fontWeight: 600 }}>Tarih</th>
                <th style={{ padding: '14px 20px', fontWeight: 600, textAlign: 'right' }}>Durum</th>
              </tr>
            </thead>
            <tbody>
              {randevular.map((r) => {
                const durum = DURUM_RENK[r.durum] ?? { bg: '#F3F4F6', color: '#6B7280', label: r.durum }
                const tarih = new Date(r.tarih).toLocaleString('tr-TR', {
                  day: '2-digit', month: 'short', year: 'numeric',
                  hour: '2-digit', minute: '2-digit',
                })
                return (
                  <tr key={r.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '14px 20px' }}>
                      <p style={{ fontWeight: 600 }}>{r.musteriAd}</p>
                      {r.musteriTelefon && (
                        <p style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{r.musteriTelefon}</p>
                      )}
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <p style={{ fontWeight: 500 }}>{r.esnaf.isletmeAdi}</p>
                      <p style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{r.esnaf.sehir}</p>
                    </td>
                    <td style={{ padding: '14px 20px', color: 'var(--color-text-secondary)' }}>
                      {r.hizmet?.ad ?? '—'}
                    </td>
                    <td style={{ padding: '14px 20px', whiteSpace: 'nowrap', color: 'var(--color-text-secondary)', fontSize: 13 }}>
                      {tarih}
                    </td>
                    <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                      <span style={{
                        padding: '4px 12px', borderRadius: 9999, fontSize: 12, fontWeight: 700,
                        background: durum.bg, color: durum.color,
                      }}>
                        {durum.label}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {randevular.length === 0 && (
            <p style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--color-text-secondary)' }}>
              Henüz randevu yok.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
