interface TopBarProps {
  baslik: string
  aciklama?: string
  eylemler?: React.ReactNode
}

export function TopBar({ baslik, aciklama, eylemler }: TopBarProps) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h1
          className="text-xl font-bold text-[var(--color-text)]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {baslik}
        </h1>
        {aciklama && (
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">{aciklama}</p>
        )}
      </div>
      {eylemler && <div className="flex items-center gap-3">{eylemler}</div>}
    </div>
  )
}
