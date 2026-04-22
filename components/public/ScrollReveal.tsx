'use client'

import { useEffect, useRef } from 'react'

export function ScrollRevealInit() {
  const init = useRef(false)
  useEffect(() => {
    if (init.current) return
    init.current = true

    const els = document.querySelectorAll('[data-reveal]')
    if (!els.length) return

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed')
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12 }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return null
}
