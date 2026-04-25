export default function Loading() {
  return (
    <div
      style={{
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
      }}
    >
      <div
        aria-label="Yükleniyor"
        style={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          border: '3px solid rgba(0,0,0,0.08)',
          borderTopColor: 'var(--color-primary, #F27A1A)',
          animation: 'eskob-spin 0.8s linear infinite',
        }}
      />
      <style>{`@keyframes eskob-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
