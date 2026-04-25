'use client'

import { useState, useEffect } from 'react'
import { signOut } from 'next-auth/react'
import { createPortal } from 'react-dom'
import { useRouter } from 'next/navigation'

export function HesapSilCard() {
  const router = useRouter()
  const [acik, setAcik] = useState(false)
  const [onayMetni, setOnayMetni] = useState('')
  const [yukleniyor, setYukleniyor] = useState(false)
  const [hata, setHata] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  async function silmeyiOnayla() {
    if (onayMetni !== 'HESABIMI SİL') {
      setHata('Onaylamak için tam olarak "HESABIMI SİL" yazın.')
      return
    }
    setYukleniyor(true)
    setHata('')
    try {
      const res = await fetch('/api/user/sil', {
        method: 'POST',
        headers: { 'X-Client': 'web' },
      })
      const cevap = await res.json().catch(() => null)
      if (!res.ok) {
        throw new Error(
          (cevap && typeof cevap.error === 'string' ? cevap.error : null) ??
            'Hesap silinemedi'
        )
      }
      await signOut({ redirect: false })
      router.replace('/?silindi=1')
    } catch (e) {
      setHata(e instanceof Error ? e.message : 'Hata oluştu')
    } finally {
      setYukleniyor(false)
    }
  }

  return (
    <>
      <div
        style={{
          background: 'white',
          borderRadius: 16,
          border: '1px solid #FECACA',
          boxShadow: 'var(--shadow-card)',
          padding: 32,
          marginTop: 20,
        }}
      >
        <h2
          className="font-display"
          style={{ fontSize: 18, fontWeight: 700, marginBottom: 4, color: '#B91C1C' }}
        >
          Hesabımı Sil (KVKK)
        </h2>
        <p
          style={{
            fontSize: 14,
            color: 'var(--color-text-secondary)',
            marginBottom: 16,
            lineHeight: 1.6,
          }}
        >
          KVKK Madde 7 kapsamında kişisel verileriniz anonimleştirilir. Bu işlem
          geri alınamaz. Yorum ve randevu kayıtlarınız işletmelere karşı
          istatistiksel veri olarak kalır ancak kimliğinizle ilişkilendirilmez.
        </p>
        <button
          onClick={() => setAcik(true)}
          style={{
            padding: '12px 24px',
            fontSize: 14,
            fontWeight: 700,
            background: 'white',
            color: '#B91C1C',
            border: '1.5px solid #FCA5A5',
            borderRadius: 12,
            cursor: 'pointer',
          }}
        >
          Hesabımı Sil
        </button>
      </div>

      {mounted &&
        acik &&
        createPortal(
          <div
            onClick={() => !yukleniyor && setAcik(false)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 99999,
              background: 'rgba(0,0,0,0.5)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 16,
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                background: 'white',
                borderRadius: 20,
                padding: '36px 32px',
                maxWidth: 480,
                width: '100%',
                boxShadow: '0 24px 64px rgba(0,0,0,0.18)',
              }}
            >
              <div style={{ fontSize: 40, marginBottom: 16, textAlign: 'center' }}>
                ⚠️
              </div>
              <h3
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                  marginBottom: 12,
                  color: '#111',
                  textAlign: 'center',
                }}
              >
                Hesabınızı silmek üzeresiniz
              </h3>
              <p
                style={{
                  fontSize: 14,
                  color: '#555',
                  marginBottom: 20,
                  lineHeight: 1.7,
                }}
              >
                Bu işlem geri alınamaz. Onaylamak için aşağıya{' '}
                <strong>HESABIMI SİL</strong> yazın.
              </p>
              <input
                type="text"
                value={onayMetni}
                onChange={(e) => setOnayMetni(e.target.value)}
                placeholder="HESABIMI SİL"
                disabled={yukleniyor}
                style={{
                  width: '100%',
                  height: 44,
                  padding: '0 14px',
                  borderRadius: 12,
                  border: '1.5px solid #E5E7EB',
                  fontSize: 14,
                  marginBottom: 12,
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
              {hata && (
                <p
                  style={{
                    fontSize: 13,
                    color: '#EF4444',
                    marginBottom: 12,
                  }}
                >
                  {hata}
                </p>
              )}
              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  onClick={() => setAcik(false)}
                  disabled={yukleniyor}
                  style={{
                    flex: 1,
                    height: 44,
                    borderRadius: 12,
                    border: '1.5px solid #E5E7EB',
                    background: 'white',
                    fontWeight: 600,
                    fontSize: 14,
                    cursor: yukleniyor ? 'not-allowed' : 'pointer',
                    color: '#111',
                  }}
                >
                  Vazgeç
                </button>
                <button
                  onClick={silmeyiOnayla}
                  disabled={yukleniyor || onayMetni !== 'HESABIMI SİL'}
                  style={{
                    flex: 1,
                    height: 44,
                    borderRadius: 12,
                    border: 'none',
                    background:
                      onayMetni === 'HESABIMI SİL' ? '#DC2626' : '#FCA5A5',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: 14,
                    cursor:
                      yukleniyor || onayMetni !== 'HESABIMI SİL'
                        ? 'not-allowed'
                        : 'pointer',
                  }}
                >
                  {yukleniyor ? 'Siliniyor...' : 'Hesabımı Sil'}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  )
}
