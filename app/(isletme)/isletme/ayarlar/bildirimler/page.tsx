export default function BildirimlerSayfasi() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-xl font-bold text-slate-800">Bildirimler</h1>
        <p className="text-slate-500 text-sm mt-0.5">Bildirim tercihlerinizi yönetin</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
        {[
          { baslik: 'Yeni Randevu', aciklama: 'Müşteri randevu aldığında bildirim gönder', aktif: true },
          { baslik: 'Randevu İptali', aciklama: 'Müşteri randevuyu iptal ettiğinde bildirim gönder', aktif: true },
          { baslik: 'Yeni Yorum', aciklama: 'Yeni bir değerlendirme geldiğinde bildirim gönder', aktif: true },
          { baslik: 'Kampanya Bitiş Uyarısı', aciklama: 'Aktif kampanya sona ermeden önce uyar', aktif: false },
        ].map((b) => (
          <div key={b.baslik} className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-700">{b.baslik}</p>
              <p className="text-xs text-slate-400 mt-0.5">{b.aciklama}</p>
            </div>
            <label className="relative cursor-pointer shrink-0">
              <input type="checkbox" defaultChecked={b.aktif} className="sr-only" />
              <div className={`w-10 h-6 rounded-full ${b.aktif ? 'bg-indigo-600' : 'bg-slate-200'}`} />
              <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${b.aktif ? 'translate-x-4' : 'translate-x-0'}`} />
            </label>
          </div>
        ))}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-700">
        <p className="font-semibold mb-1">🔔 E-posta Bildirimleri</p>
        <p>Bildirimler kayıtlı e-posta adresinize gönderilir. Mobil push bildirimleri uygulamadan aktif edilebilir.</p>
      </div>
    </div>
  )
}
