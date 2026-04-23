'use client'

interface LockCheckboxProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
}

export function LockCheckbox({ checked, onChange, label = 'Beni Hatırla' }: LockCheckboxProps) {
  return (
    <>
      <style>{`
        .lock-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          user-select: none;
        }
        .lock-inp { display: none; }
        .btn-lock {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: #e2e8f0;
          width: 44px;
          height: 44px;
          box-sizing: border-box;
          padding: 10px 0 0 12px;
          border-radius: 50%;
          cursor: pointer;
          flex-shrink: 0;
          transition: background 0.3s ease;
        }
        .btn-lock svg { fill: none; transform: translate3d(0,0,0); }
        .btn-lock svg .bling {
          stroke: #64748b;
          stroke-width: 2.5;
          stroke-linecap: round;
          stroke-dasharray: 3;
          stroke-dashoffset: 15;
          transition: all 0.3s ease;
        }
        .btn-lock svg .lock {
          stroke: #64748b;
          stroke-width: 4;
          stroke-linejoin: round;
          stroke-linecap: round;
          stroke-dasharray: 36;
          transition: all 0.4s ease;
        }
        .btn-lock svg .lockb {
          fill: #64748b;
          fill-rule: evenodd;
          clip-rule: evenodd;
          transform: rotate(8deg);
          transform-origin: 14px 20px;
          transition: all 0.2s ease;
        }
        .lock-inp:checked + .btn-lock {
          background: var(--color-primary, #F97316);
        }
        .lock-inp:checked + .btn-lock svg .bling { stroke: #fff; animation: bling6132 0.3s linear forwards; animation-delay: 0.2s; }
        .lock-inp:checked + .btn-lock svg .lock { stroke: #fff; stroke-dasharray: 48; animation: locked 0.3s linear forwards; }
        .lock-inp:checked + .btn-lock svg .lockb { fill: #fff; transform: rotate(0); transform-origin: 14px 22px; }
        @keyframes bling6132 {
          50%  { stroke-dasharray: 3; stroke-dashoffset: 12; }
          100% { stroke-dasharray: 3; stroke-dashoffset: 9; }
        }
        @keyframes locked {
          50% { transform: translateY(1px); }
        }
      `}</style>
      <label className="lock-wrap" onClick={() => onChange(!checked)}>
        <input
          className="lock-inp"
          type="checkbox"
          checked={checked}
          readOnly
        />
        <span className="btn-lock">
          <svg width={24} height={28} viewBox="0 0 36 40">
            <path className="lockb" d="M27 27C27 34.1797 21.1797 40 14 40C6.8203 40 1 34.1797 1 27C1 19.8203 6.8203 14 14 14C21.1797 14 27 19.8203 27 27ZM15.6298 26.5191C16.4544 25.9845 17 25.056 17 24C17 22.3431 15.6569 21 14 21C12.3431 21 11 22.3431 11 24C11 25.056 11.5456 25.9845 12.3702 26.5191L11 32H17L15.6298 26.5191Z" />
            <path className="lock" d="M6 21V10C6 5.58172 9.58172 2 14 2V2C18.4183 2 22 5.58172 22 10V21" />
            <path className="bling" d="M29 20L31 22" />
            <path className="bling" d="M31.5 15H34.5" />
            <path className="bling" d="M29 10L31 8" />
          </svg>
        </span>
        <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text)' }}>{label}</span>
        <span style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginLeft: 4 }}>
          {checked ? '(Giriş kalıcı)' : '(24 saat)'}
        </span>
      </label>
    </>
  )
}
