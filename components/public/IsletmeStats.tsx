'use client'

import { useEffect, useRef, useState } from 'react'

function useCounter(target: number, duration = 1800) {
  const [val, setVal] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || started.current) return
      started.current = true
      io.disconnect()
      const startTime = performance.now()
      const tick = (now: number) => {
        const progress = Math.min((now - startTime) / duration, 1)
        const ease = 1 - Math.pow(1 - progress, 3)
        setVal(Math.round(ease * target))
        if (progress < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }, { threshold: 0.3 })
    io.observe(el)
    return () => io.disconnect()
  }, [target, duration])

  return { val, ref }
}

export function IsletmeStats() {
  const c1 = useCounter(3200)
  const c2 = useCounter(18000)
  const c3 = useCounter(48)

  return (
    <div style={{ display: 'flex', gap: '48px', marginTop: '72px', flexWrap: 'wrap', justifyContent: 'center' }}>
      <div ref={c1.ref} style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', fontWeight: 800, color: 'white', lineHeight: 1 }}>
          {c1.val.toLocaleString('tr-TR')}+
        </div>
        <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginTop: 6, fontWeight: 500 }}>Aktif İşletme</div>
      </div>
      <div ref={c2.ref} style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', fontWeight: 800, color: 'white', lineHeight: 1 }}>
          {c2.val.toLocaleString('tr-TR')}+
        </div>
        <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginTop: 6, fontWeight: 500 }}>Aylık Randevu</div>
      </div>
      <div ref={c3.ref} style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', fontWeight: 800, color: 'white', lineHeight: 1 }}>
          {(c3.val / 10).toFixed(1)}★
        </div>
        <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginTop: 6, fontWeight: 500 }}>Ortalama Puan</div>
      </div>
    </div>
  )
}
