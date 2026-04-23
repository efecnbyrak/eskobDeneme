export function Loader({ renk = 'var(--color-primary)' }: { renk?: string }) {
  return (
    <>
      <style>{`
        @keyframes _eskobBounce {
          0%   { top: 60px; height: 5px; border-radius: 50px 50px 25px 25px; transform: scaleX(1.7); }
          40%  { height: 20px; border-radius: 50%; transform: scaleX(1); }
          100% { top: 0%; }
        }
        @keyframes _eskobShadow {
          0%   { transform: scaleX(1.5); }
          40%  { transform: scaleX(1); opacity: .7; }
          100% { transform: scaleX(.2); opacity: .4; }
        }
      `}</style>
      <div style={{ width: 200, height: 60, position: 'relative' }}>
        {([0, 1, 2] as const).map((i) => (
          <div
            key={i}
            style={{
              width: 20, height: 20, position: 'absolute', borderRadius: '50%',
              backgroundColor: renk,
              left: i === 2 ? 'auto' : i === 0 ? '15%' : '45%',
              right: i === 2 ? '15%' : 'auto',
              transformOrigin: '50%',
              animation: `_eskobBounce .5s alternate infinite ease`,
              animationDelay: i === 0 ? '0s' : i === 1 ? '.2s' : '.3s',
            }}
          />
        ))}
        {([0, 1, 2] as const).map((i) => (
          <div
            key={i}
            style={{
              width: 20, height: 4, borderRadius: '50%',
              backgroundColor: 'rgba(0,0,0,0.25)',
              position: 'absolute', top: 62,
              left: i === 2 ? 'auto' : i === 0 ? '15%' : '45%',
              right: i === 2 ? '15%' : 'auto',
              transformOrigin: '50%', zIndex: -1, filter: 'blur(1px)',
              animation: `_eskobShadow .5s alternate infinite ease`,
              animationDelay: i === 0 ? '0s' : i === 1 ? '.2s' : '.3s',
            }}
          />
        ))}
      </div>
    </>
  )
}
