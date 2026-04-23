'use client'

interface LockCheckboxProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
}

export function LockCheckbox({ checked, onChange, label = 'Beni Hatırla' }: LockCheckboxProps) {
  return (
    <label
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        cursor: 'pointer',
        userSelect: 'none',
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={{
          width: 18,
          height: 18,
          cursor: 'pointer',
          accentColor: 'var(--color-primary)',
          borderRadius: 4,
          flexShrink: 0,
        }}
      />
      <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text)' }}>{label}</span>
      <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
        {checked ? '(Giriş kalıcı)' : '(24 saat)'}
      </span>
    </label>
  )
}
