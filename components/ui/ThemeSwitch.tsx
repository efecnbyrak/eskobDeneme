'use client'
import { useState, useEffect } from 'react'

export function ThemeSwitch() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('eskob-theme')
    if (saved === 'dark') {
      setDark(true)
      document.documentElement.setAttribute('data-theme', 'dark')
    }
  }, [])

  function toggle() {
    const next = !dark
    setDark(next)
    if (next) {
      document.documentElement.setAttribute('data-theme', 'dark')
      localStorage.setItem('eskob-theme', 'dark')
    } else {
      document.documentElement.removeAttribute('data-theme')
      localStorage.setItem('eskob-theme', 'light')
    }
  }

  return (
    <div
      onClick={toggle}
      title={dark ? 'Açık moda geç' : 'Koyu moda geç'}
      style={{
        width: 88, height: 50, borderRadius: 12,
        background: dark ? '#3a3347' : '#ebe6ef',
        border: '3px solid #121331',
        display: 'flex', alignItems: 'center',
        padding: '0 6px', gap: 5, cursor: 'pointer',
        transition: 'background 0.3s', flexShrink: 0,
      }}
    >
      {/* left circle indicator */}
      <div style={{ width: 12, height: 12, flexShrink: 0, borderRadius: '50%', border: '3px solid #121331' }} />

      {/* lever */}
      <div style={{
        flex: 1, height: 26, border: '3px solid #121331', borderRadius: 4,
        transform: dark ? 'scaleX(-1)' : 'none', transition: 'transform 0.3s',
        overflow: 'hidden', position: 'relative',
      }}>
        <div style={{ width: '100%', height: '100%', background: '#f24c00', position: 'relative' }}>
          {/* top triangle */}
          <div style={{
            position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
            width: 0, height: 0, zIndex: 20,
            borderLeft: '14px solid transparent',
            borderRight: '14px solid transparent',
            borderTop: '12px solid #121331',
          }} />
          <div style={{
            position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
            width: 0, height: 0, zIndex: 19,
            borderLeft: '10px solid transparent',
            borderRight: '10px solid transparent',
            borderTop: '9px solid #e44901',
          }} />
          {/* left skew */}
          <div style={{
            width: 14, height: 20, position: 'absolute', top: 5, left: 0,
            background: '#f24c00', borderRight: '2px solid #121331',
            borderBottom: '3px solid #121331', transform: 'skewY(39deg)', zIndex: 10,
          }} />
          {/* right skew */}
          <div style={{
            width: 14, height: 20, position: 'absolute', top: 5, left: 14,
            background: '#c44002', borderRight: '3px solid #121331',
            borderLeft: '2px solid #121331', borderBottom: '3px solid #121331',
            transform: 'skewY(-39deg)', zIndex: 10,
          }} />
        </div>
      </div>

      {/* right bar */}
      <div style={{ width: 12, height: 3, flexShrink: 0, background: '#121331', borderRadius: 999 }} />
    </div>
  )
}
