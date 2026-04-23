'use client'

import { useEffect, useState } from 'react'

export function BackToTop() {
  const [goster, setGoster] = useState(false)

  useEffect(() => {
    function kontrol() {
      setGoster(window.scrollY > 400)
    }
    window.addEventListener('scroll', kontrol, { passive: true })
    return () => window.removeEventListener('scroll', kontrol)
  }, [])

  function yukariCik() {
    const baslangic = window.scrollY
    const sure = 700
    const baslamaZamani = performance.now()
    function easeInOut(t: number) {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
    }
    function adim(simdi: number) {
      const gecen = simdi - baslamaZamani
      const ilerleme = Math.min(gecen / sure, 1)
      window.scrollTo(0, baslangic * (1 - easeInOut(ilerleme)))
      if (ilerleme < 1) requestAnimationFrame(adim)
    }
    requestAnimationFrame(adim)
  }

  return (
    <>
      <style>{`
        .btt-btn {
          width: 140px;
          height: 56px;
          overflow: hidden;
          border: none;
          color: #fff;
          background: none;
          position: relative;
          padding-bottom: 2em;
          cursor: pointer;
        }
        .btt-btn > div,
        .btt-btn > svg {
          position: absolute;
          width: 100%;
          height: 100%;
          display: flex;
        }
        .btt-btn::before {
          content: "";
          position: absolute;
          height: 2px;
          bottom: 0;
          left: 0;
          width: 100%;
          transform: scaleX(0);
          transform-origin: bottom right;
          background: currentColor;
          transition: transform 0.25s ease-out;
        }
        .btt-btn:hover::before {
          transform: scaleX(1);
          transform-origin: bottom left;
        }
        .btt-btn .btt-clone > *,
        .btt-btn .btt-text > * {
          opacity: 1;
          font-size: 1.1rem;
          transition: 0.2s;
          margin-left: 4px;
        }
        .btt-btn .btt-clone > * {
          transform: translateY(60px);
        }
        .btt-btn:hover .btt-clone > * {
          opacity: 1;
          transform: translateY(0px);
          transition: all 0.2s cubic-bezier(0.215, 0.61, 0.355, 1) 0s;
        }
        .btt-btn:hover .btt-text > * {
          opacity: 1;
          transform: translateY(-60px);
          transition: all 0.2s cubic-bezier(0.215, 0.61, 0.355, 1) 0s;
        }
        .btt-btn:hover .btt-clone > :nth-child(1) { transition-delay: 0.1s; }
        .btt-btn:hover .btt-clone > :nth-child(2) { transition-delay: 0.15s; }
        .btt-btn:hover .btt-clone > :nth-child(3) { transition-delay: 0.2s; }
        .btt-btn > svg.btt-arrow {
          width: 20px;
          right: 0;
          top: 50%;
          transform: translateY(-50%) rotate(-50deg);
          transition: 0.2s ease-out;
        }
        .btt-btn:hover > svg.btt-arrow {
          transform: translateY(-50%) rotate(-90deg);
        }
        .btt-wrapper {
          position: fixed;
          bottom: 32px;
          right: 32px;
          z-index: 9000;
          background: var(--color-primary);
          border-radius: 16px;
          padding: 0 16px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.18);
          transition: opacity 0.3s ease, transform 0.3s ease;
        }
        .btt-wrapper.hidden {
          opacity: 0;
          pointer-events: none;
          transform: translateY(16px);
        }
      `}</style>

      <div className={`btt-wrapper${goster ? '' : ' hidden'}`}>
        <button className="btt-btn" onClick={yukariCik} aria-label="Başa dön">
          <div className="btt-text">
            <span>Başa</span>
            <span>dön</span>
          </div>
          <div className="btt-clone">
            <span>Başa</span>
            <span>dön</span>
          </div>
          <svg
            className="btt-arrow"
            strokeWidth={2}
            stroke="currentColor"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinejoin="round" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </>
  )
}
