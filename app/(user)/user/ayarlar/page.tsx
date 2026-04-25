'use client'

import { useState, useEffect } from 'react'
import { signOut } from 'next-auth/react'
import { createPortal } from 'react-dom'
import { SifreForm } from './SifreForm'
import { HesapSilCard } from '@/components/user/HesapSilCard'

export const dynamic = 'force-dynamic'

function CikisModal({ onOnayla, onIptal }: { onOnayla: () => void; onIptal: () => void }) {
  return (
    <div
      onClick={onIptal}
      style={{
        position: 'fixed', inset: 0, zIndex: 99999,
        background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'white', borderRadius: 20, padding: '36px 32px',
          maxWidth: 360, width: '90%', textAlign: 'center',
          boxShadow: '0 24px 64px rgba(0,0,0,0.18)',
        }}
      >
        <div style={{ fontSize: 40, marginBottom: 16 }}>👋</div>
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10, color: '#111' }}>
          Çıkış yapmak istiyor musunuz?
        </h3>
        <p style={{ fontSize: 14, color: '#666', marginBottom: 28, lineHeight: 1.6 }}>
          Hesabınızdan çıkış yaptığınızda tekrar giriş yapmanız gerekecek.
        </p>
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={onIptal}
            style={{
              flex: 1, height: 44, borderRadius: 12, border: '1.5px solid #e5e7eb',
              background: 'white', fontWeight: 600, fontSize: 14, cursor: 'pointer', color: '#111',
            }}
          >
            İptal
          </button>
          <button
            onClick={onOnayla}
            style={{
              flex: 1, height: 44, borderRadius: 12, border: 'none',
              background: '#EF4444', color: 'white', fontWeight: 700, fontSize: 14, cursor: 'pointer',
            }}
          >
            Evet, Çıkış Yap
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AyarlarPage() {
  const [cikisModal, setCikisModal] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  return (
    <div>
      {mounted && cikisModal && createPortal(
        <CikisModal
          onOnayla={() => signOut({ callbackUrl: '/musteri/giris' })}
          onIptal={() => setCikisModal(false)}
        />,
        document.body
      )}

      <h1 className="font-display" style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>
        Ayarlar
      </h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 24 }}>
        Güvenlik ve hesap tercihlerinizi yönetin.
      </p>

      <div
        style={{
          background: 'white',
          borderRadius: 16,
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-card)',
          padding: 32,
          marginBottom: 20,
        }}
      >
        <h2 className="font-display" style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>
          Şifre Değiştir
        </h2>
        <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', marginBottom: 24 }}>
          Güvenliğiniz için güçlü bir şifre kullanın.
        </p>
        <SifreForm />
      </div>

      <div
        style={{
          background: 'white',
          borderRadius: 16,
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-card)',
          padding: 32,
        }}
      >
        <h2 className="font-display" style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>
          Oturum
        </h2>
        <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', marginBottom: 16 }}>
          Hesabınızdan güvenli bir şekilde çıkış yapın.
        </p>
        <button
          onClick={() => setCikisModal(true)}
          style={{
            display: 'inline-block',
            padding: '12px 24px',
            fontSize: 14,
            fontWeight: 700,
            background: 'white',
            color: '#DC2626',
            border: '1px solid #FCA5A5',
            borderRadius: 12,
            cursor: 'pointer',
          }}
        >
          Çıkış Yap
        </button>
      </div>

      <HesapSilCard />
    </div>
  )
}
