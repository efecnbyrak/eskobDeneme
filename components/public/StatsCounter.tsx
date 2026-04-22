'use client'

import { useEffect, useRef, useState } from 'react'

function useCounter(target: number, duration = 1800) {
  const [val, setVal] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const io = new IntersectionObserver(
      ([entry]) => {
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
      },
      { threshold: 0.3 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [target, duration])

  return { val, ref }
}

export function StatsSection() {
  const c1 = useCounter(3200)
  const c2 = useCounter(47)
  const c3 = useCounter(150000)

  const stats = [
    { counter: c1, suffix: '+', label: 'Aktif Esnaf', format: (n: number) => n.toLocaleString('tr-TR') },
    { counter: c2, suffix: '', label: 'Şehir', format: (n: number) => n.toString() },
    { counter: c3, suffix: '+', label: 'Aylık Ziyaretçi', format: (n: number) => n.toLocaleString('tr-TR') },
  ]

  return (
    <section
      style={{
        background: 'white',
        paddingTop: 56,
        paddingBottom: 56,
        borderTop: '1px solid var(--color-border)',
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      <div className="container-main">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 32,
            textAlign: 'center',
          }}
        >
          {stats.map((s, i) => (
            <div
              key={s.label}
              ref={s.counter.ref}
              data-reveal="up"
              data-reveal-delay={String(i + 1)}
            >
              <p
                className="font-display"
                style={{
                  fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
                  fontWeight: 700,
                  color: 'var(--color-primary)',
                  marginBottom: 8,
                }}
              >
                {s.format(s.counter.val)}{s.suffix}
              </p>
              <p style={{ fontSize: 15, fontWeight: 500, color: 'var(--color-text-secondary)' }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
