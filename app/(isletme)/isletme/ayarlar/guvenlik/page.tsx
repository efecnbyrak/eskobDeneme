'use client'

import { useState } from 'react'
import { useToast } from '@/components/ui/Toast'
import { Button } from '@/components/ui/Button'

export default function GuvenlikSayfasi() {
  const { toast } = useToast()
  const [yukleniyor, setYukleniyor] = useState(false)
  const [form, setForm] = useState({ eski: '', yeni: '', yeniTekrar: '' })
  const [goster, setGoster] = useState({ eski: false, yeni: false, yeniTekrar: false })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (form.yeni !== form.yeniTekrar) {
      toast('Yeni şifreler eşleşmiyor.', 'error')
      return
    }
    setYukleniyor(true)
    try {
      const res = await fetch('/api/user/sifre', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eski: form.eski, yeni: form.yeni }),
      })
      const data = await res.json()
      if (res.ok) {
        toast('Şifreniz başarıyla güncellendi.', 'success')
        setForm({ eski: '', yeni: '', yeniTekrar: '' })
      } else {
        toast(data.error || 'Bir hata oluştu.', 'error')
      }
    } finally {
      setYukleniyor(false)
    }
  }

  function GozIkonu({ acik }: { acik: boolean }) {
    return acik ? (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
      </svg>
    ) : (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    )
  }

  function SifreInput({
    label, alan, placeholder,
  }: { label: string; alan: keyof typeof form; placeholder?: string }) {
    return (
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-slate-700">{label}</label>
        <div className="relative">
          <input
            type={goster[alan] ? 'text' : 'password'}
            value={form[alan]}
            required
            placeholder={placeholder}
            onChange={(e) => setForm((p) => ({ ...p, [alan]: e.target.value }))}
            className="w-full px-4 py-2.5 pr-10 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
          <button
            type="button"
            onClick={() => setGoster((p) => ({ ...p, [alan]: !p[alan] }))}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <GozIkonu acik={goster[alan]} />
          </button>
        </div>
      </div>
    )
  }

  const gereksinimler = [
    { label: 'En az 8 karakter', ok: form.yeni.length >= 8 },
    { label: 'En az 1 büyük harf', ok: /[A-Z]/.test(form.yeni) },
    { label: 'En az 1 küçük harf', ok: /[a-z]/.test(form.yeni) },
    { label: 'En az 1 rakam', ok: /[0-9]/.test(form.yeni) },
    { label: 'En az 1 sembol (!@#...)', ok: /[^A-Za-z0-9]/.test(form.yeni) },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-xl font-bold text-slate-800">Güvenlik & Şifre</h1>
        <p className="text-slate-500 text-sm mt-0.5">Hesabınızın güvenliğini yönetin</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="font-semibold text-slate-800 mb-5">Şifre Değiştir</h2>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
          <SifreInput label="Mevcut Şifre" alan="eski" />
          <SifreInput label="Yeni Şifre" alan="yeni" placeholder="En az 8 karakter" />

          {/* Şifre Gereksinimleri */}
          {form.yeni.length > 0 && (
            <div className="bg-slate-50 rounded-xl p-4 grid grid-cols-1 gap-1.5">
              {gereksinimler.map((g) => (
                <div key={g.label} className="flex items-center gap-2">
                  <span className={`text-sm ${g.ok ? 'text-emerald-500' : 'text-slate-300'}`}>
                    {g.ok ? '✓' : '○'}
                  </span>
                  <span className={`text-xs ${g.ok ? 'text-emerald-700' : 'text-slate-500'}`}>{g.label}</span>
                </div>
              ))}
            </div>
          )}

          <SifreInput label="Yeni Şifre (Tekrar)" alan="yeniTekrar" />

          {form.yeni && form.yeniTekrar && form.yeni !== form.yeniTekrar && (
            <p className="text-xs text-red-500">Şifreler eşleşmiyor.</p>
          )}

          <Button type="submit" loading={yukleniyor} className="w-full">
            Şifreyi Güncelle
          </Button>
        </form>
      </div>

      {/* Güvenlik Bilgisi */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 flex gap-4">
        <div className="text-2xl">🔒</div>
        <div>
          <p className="text-sm font-semibold text-blue-800 mb-1">Hesap Güvenliği İpuçları</p>
          <ul className="text-xs text-blue-700 space-y-1 list-disc list-inside">
            <li>Şifrenizi kimseyle paylaşmayın.</li>
            <li>Farklı siteler için farklı şifreler kullanın.</li>
            <li>Şüpheli aktivite fark ederseniz hemen şifrenizi değiştirin.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
