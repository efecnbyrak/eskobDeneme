'use client'

import Link from 'next/link'

function IsletmeIkon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="54" height="54" fill="none" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}

function MusteriIkon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="54" height="54" fill="none" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

export function RolButonlari() {
  return (
    <>
      <style>{`
        @keyframes rolSpin {
          0%   { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
        .rol-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border: 3px solid #000;
          border-radius: 12px;
          padding: 0;
          text-decoration: none;
          color: #000;
          font-weight: bold;
          position: relative;
          box-shadow: 4px 4px 0px #000;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          height: 130px;
          width: 130px;
          cursor: pointer;
          background: none;
          -webkit-appearance: none;
        }
        .rol-btn::before {
          content: "";
          position: absolute;
          left: 50%;
          bottom: -150%;
          width: 300%;
          height: 300%;
          border-radius: 50%;
          transform: translateX(-50%) scale(0);
          transition: transform 0.6s cubic-bezier(0.19, 1, 0.22, 1);
          z-index: 1;
        }
        .rol-btn-isletme { background-color: #1a2744; }
        .rol-btn-isletme::before { background-color: #243260; }
        .rol-btn-musteri { background-color: #1a4432; }
        .rol-btn-musteri::before { background-color: #1e5040; }
        .rol-btn:hover::before { transform: translateX(-50%) scale(1); }
        .rol-btn:hover {
          transform: translate(-4px, -4px);
          box-shadow: 8px 8px 0px #000;
        }
        .rol-btn:active {
          transform: translate(2px, 2px);
          box-shadow: 2px 2px 0px #000;
        }
        .rol-ikon {
          display: flex;
          align-items: center;
          justify-content: center;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 2;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background-color: rgba(255,255,255,0.12);
          transition: all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        }
        .rol-btn:hover .rol-ikon {
          animation: rolSpin 6s linear infinite;
          width: 48px;
          height: 48px;
          top: 26%;
        }
        .rol-btn:hover .rol-ikon svg {
          transform: scale(0.65);
        }
        .rol-metin {
          display: flex;
          flex-direction: column;
          align-items: center;
          line-height: 1.3;
          transition: all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          text-align: center;
          opacity: 0;
          transform: translateY(20px);
          z-index: 2;
          position: absolute;
          bottom: 14px;
          left: 0;
          right: 0;
          color: #d3d3d3;
        }
        .rol-metin span:first-child {
          font-size: 11px;
          font-weight: 500;
          margin-bottom: 2px;
          opacity: 0.75;
        }
        .rol-metin span:last-child {
          font-size: 15px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          color: #ffffff;
        }
        .rol-btn:hover .rol-metin {
          opacity: 1;
          transform: translateY(0);
        }
        .rol-etiket {
          font-size: 13px;
          font-weight: 700;
          color: rgba(255,255,255,0.9);
          margin-top: 10px;
          text-align: center;
          letter-spacing: 0.02em;
        }
      `}</style>

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        gap: '48px',
        width: '100%',
        maxWidth: '640px',
        margin: '0 auto',
      }}>
        {/* İşletme butonu */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Link href="/isletme" style={{ textDecoration: 'none' }}>
            <button className="rol-btn rol-btn-isletme" type="button">
              <div className="rol-ikon">
                <IsletmeIkon />
              </div>
              <div className="rol-metin">
                <span>Keşfet</span>
                <span>İşletme</span>
              </div>
            </button>
          </Link>
          <p className="rol-etiket" style={{ color: 'var(--color-text-secondary)' }}>İşletme</p>
        </div>

        {/* Müşteri butonu */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Link href="/musteri" style={{ textDecoration: 'none' }}>
            <button className="rol-btn rol-btn-musteri" type="button">
              <div className="rol-ikon">
                <MusteriIkon />
              </div>
              <div className="rol-metin">
                <span>Keşfet</span>
                <span>Müşteri</span>
              </div>
            </button>
          </Link>
          <p className="rol-etiket" style={{ color: 'var(--color-text-secondary)' }}>Müşteri</p>
        </div>
      </div>
    </>
  )
}
