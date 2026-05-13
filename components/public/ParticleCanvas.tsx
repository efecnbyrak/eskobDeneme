'use client'

import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  baseX: number
  baseY: number
  radius: number
  opacity: number
}

export function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: -9999, y: -9999 })
  const animRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let particles: Particle[] = []
    const COUNT = 100
    const CONNECT_DIST = 120
    const MOUSE_RADIUS = 140
    const MOUSE_STRENGTH = 0.018

    function resize() {
      canvas!.width = canvas!.offsetWidth
      canvas!.height = canvas!.offsetHeight
      initParticles()
    }

    function initParticles() {
      particles = Array.from({ length: COUNT }, () => {
        const x = Math.random() * canvas!.width
        const y = Math.random() * canvas!.height
        return {
          x, y,
          baseX: x, baseY: y,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          radius: Math.random() * 1.8 + 0.8,
          opacity: Math.random() * 0.4 + 0.3,
        }
      })
    }

    function draw() {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const mx = mouseRef.current.x
      const my = mouseRef.current.y

      for (const p of particles) {
        // Float
        p.x += p.vx
        p.y += p.vy

        // Bounce off edges
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1

        // Mouse gravity
        const dx = mx - p.x
        const dy = my - p.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < MOUSE_RADIUS && dist > 0) {
          const force = (1 - dist / MOUSE_RADIUS) * MOUSE_STRENGTH
          p.vx += dx * force
          p.vy += dy * force
          // Speed cap
          const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy)
          if (speed > 2.5) {
            p.vx = (p.vx / speed) * 2.5
            p.vy = (p.vy / speed) * 2.5
          }
        } else {
          // Return to base drift speed
          p.vx *= 0.99
          p.vy *= 0.99
          const minSpeed = 0.15
          const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy)
          if (speed < minSpeed) {
            p.vx += (Math.random() - 0.5) * 0.05
            p.vy += (Math.random() - 0.5) * 0.05
          }
        }

        // Draw dot
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${p.opacity})`
        ctx.fill()
      }

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < CONNECT_DIST) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(255,255,255,${0.13 * (1 - dist / CONNECT_DIST)})`
            ctx.lineWidth = 0.7
            ctx.stroke()
          }
        }
      }

      animRef.current = requestAnimationFrame(draw)
    }

    function onMouseMove(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect()
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }
    function onMouseLeave() {
      mouseRef.current = { x: -9999, y: -9999 }
    }

    resize()
    draw()

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    const parent = canvas.parentElement
    if (parent) {
      parent.addEventListener('mousemove', onMouseMove)
      parent.addEventListener('mouseleave', onMouseLeave)
    }

    return () => {
      cancelAnimationFrame(animRef.current)
      ro.disconnect()
      if (parent) {
        parent.removeEventListener('mousemove', onMouseMove)
        parent.removeEventListener('mouseleave', onMouseLeave)
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 2,
      }}
    />
  )
}
