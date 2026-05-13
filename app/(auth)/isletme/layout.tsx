export default function IsletmeAuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        '--color-primary': '#1A2744',
        '--color-primary-hover': '#243260',
        '--color-primary-light': 'rgba(26,39,68,0.10)',
      } as React.CSSProperties}
    >
      {children}
    </div>
  )
}
