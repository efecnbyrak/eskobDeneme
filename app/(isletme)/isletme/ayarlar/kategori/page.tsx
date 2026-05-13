import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import { KategoriAyarlariClient } from './client'

export default async function KategoriAyarlariSayfasi() {
  const oturum = await auth()
  if (!oturum?.user) redirect('/isletme/giris')

  const kullanici = await prisma.kullanici.findUnique({
    where: { email: oturum.user.email! },
    include: {
      esnaf: {
        include: {
          kategori: {
            include: { ustKategori: true },
          },
        },
      },
    },
  })

  if (!kullanici?.esnaf) redirect('/isletme/genel')

  const esnaf = kullanici.esnaf
  const kategori = esnaf.kategori
  const ustKategoriAd = kategori.ustKategori?.ad ?? null
  const mevcutAyarlar = (esnaf.kategoriAyarlari as Record<string, unknown> | null) ?? {}

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-xl font-bold text-slate-800">Kategori Ayarları</h1>
        <p className="text-slate-500 text-sm mt-0.5">
          {kategori.ad} kategorisine özel ayarlarınızı yönetin
        </p>
      </div>

      {/* Kategori Bilgisi */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
          style={{ background: `${kategori.renk}20` }}
        >
          {kategori.ikon}
        </div>
        <div>
          <p className="font-semibold text-slate-800">{kategori.ad}</p>
          {ustKategoriAd && (
            <p className="text-sm text-slate-400">{ustKategoriAd} › {kategori.ad}</p>
          )}
        </div>
      </div>

      <KategoriAyarlariClient
        esnafId={esnaf.id}
        kategoriSlug={kategori.slug}
        kategoriAd={kategori.ad}
        ustKategoriAd={ustKategoriAd}
        mevcutAyarlar={mevcutAyarlar}
      />
    </div>
  )
}
