import Link from 'next/link'

export default function KampanyaAyarlariSayfasi() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-xl font-bold text-slate-800">Kampanya Ayarları</h1>
        <p className="text-slate-500 text-sm mt-0.5">Kampanya tercihlerinizi ve varsayılan değerleri yönetin</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Kampanya Hakkında */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-800 mb-4 font-display">Kampanya Bilgileri</h2>
          <div className="space-y-4 text-sm text-slate-600">
            <div className="flex gap-3">
              <span className="text-xl">🏷️</span>
              <div>
                <p className="font-semibold text-slate-700">Kampanya Nedir?</p>
                <p className="text-slate-500 mt-0.5">Hizmetlerinize indirim yüzdesi ve geçerlilik tarihi atayarak kampanya oluşturabilirsiniz.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-xl">✨</span>
              <div>
                <p className="font-semibold text-slate-700">Görünürlük</p>
                <p className="text-slate-500 mt-0.5">Aktif kampanyalar anasayfada öne çıkar, arama sonuçlarında badge gösterir.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-xl">⏰</span>
              <div>
                <p className="font-semibold text-slate-700">Otomatik Bitiş</p>
                <p className="text-slate-500 mt-0.5">Bitiş tarihi geçen kampanyalar otomatik olarak devre dışı kalır.</p>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100">
            <Link
              href="/isletme/kampanyalar"
              className="inline-flex items-center gap-2 h-9 px-4 text-sm font-semibold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
            >
              Kampanyaları Yönet →
            </Link>
          </div>
        </div>

        {/* İpuçları */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
          <h2 className="font-semibold text-amber-800 mb-4 font-display">💡 İpuçları</h2>
          <ul className="space-y-3 text-sm text-amber-700">
            <li className="flex gap-2">
              <span className="font-bold">1.</span>
              <span>%20 ve üzeri indirimler müşterilerin dikkatini daha çok çeker.</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold">2.</span>
              <span>Hafta sonu veya özel günlere özel kampanyalar daha etkilidir.</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold">3.</span>
              <span>Aynı anda 2-3 aktif kampanya yeterlidir — çok fazla olması etkiyi azaltır.</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold">4.</span>
              <span>İlk kez gelen müşteriler için &ldquo;Hoş geldin indirimi&rdquo; ekleyebilirsiniz.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
