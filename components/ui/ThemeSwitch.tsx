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
    <>
      <style>{`
        .eskob-theme-switch { position: relative; display: inline-block; width: 60px; height: 34px; }
        .eskob-theme-switch input { opacity: 0; width: 0; height: 0; }
        .eskob-ts-slider {
          position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0;
          background-color: #2196f3; transition: 0.4s; z-index: 0;
          overflow: hidden; border-radius: 34px;
        }
        .eskob-ts-slider.dark { background-color: black; }
        .eskob-ts-sun-moon {
          position: absolute; height: 26px; width: 26px;
          left: 4px; bottom: 4px; background-color: yellow;
          transition: 0.4s; border-radius: 50%;
        }
        .eskob-ts-slider.dark .eskob-ts-sun-moon {
          transform: translateX(26px); background-color: white;
          animation: eskob-rotate-center 0.6s ease-in-out both;
        }
        @keyframes eskob-rotate-center {
          0% { transform: translateX(26px) rotate(0); }
          100% { transform: translateX(26px) rotate(360deg); }
        }
        .eskob-moon-dot { opacity: 0; transition: 0.4s; fill: gray; position: absolute; }
        .eskob-ts-slider.dark .eskob-moon-dot { opacity: 1; }
        .eskob-moon-dot-1 { left: 10px; top: 3px; width: 6px; height: 6px; z-index: 4; }
        .eskob-moon-dot-2 { left: 2px; top: 10px; width: 10px; height: 10px; z-index: 4; }
        .eskob-moon-dot-3 { left: 16px; top: 18px; width: 3px; height: 3px; z-index: 4; }
        .eskob-light-ray { position: absolute; z-index: -1; fill: white; opacity: 0.1; }
        .eskob-light-ray-1 { left: -8px; top: -8px; width: 43px; height: 43px; }
        .eskob-light-ray-2 { left: -50%; top: -50%; width: 55px; height: 55px; }
        .eskob-light-ray-3 { left: -18px; top: -18px; width: 60px; height: 60px; }
        .eskob-cloud-light { position: absolute; fill: #eee; animation: eskob-cloud-move 6s infinite; }
        .eskob-cloud-dark { position: absolute; fill: #ccc; animation: eskob-cloud-move 6s infinite; animation-delay: 1s; }
        @keyframes eskob-cloud-move {
          0% { transform: translateX(0px); }
          40% { transform: translateX(4px); }
          80% { transform: translateX(-4px); }
          100% { transform: translateX(0px); }
        }
        .eskob-cloud-1 { left: 30px; top: 15px; width: 40px; }
        .eskob-cloud-2 { left: 44px; top: 10px; width: 20px; }
        .eskob-cloud-3 { left: 18px; top: 24px; width: 30px; }
        .eskob-cloud-4 { left: 36px; top: 18px; width: 40px; }
        .eskob-cloud-5 { left: 48px; top: 14px; width: 20px; }
        .eskob-cloud-6 { left: 22px; top: 26px; width: 30px; }
        .eskob-ts-stars { transform: translateY(-32px); opacity: 0; transition: 0.4s; }
        .eskob-ts-slider.dark .eskob-ts-stars { transform: translateY(0); opacity: 1; }
        .eskob-star {
          fill: white; position: absolute; transition: 0.4s;
          animation: eskob-star-twinkle 2s infinite;
        }
        .eskob-star-1 { width: 20px; top: 2px; left: 3px; animation-delay: 0.3s; }
        .eskob-star-2 { width: 6px; top: 16px; left: 3px; }
        .eskob-star-3 { width: 12px; top: 20px; left: 10px; animation-delay: 0.6s; }
        .eskob-star-4 { width: 18px; top: 0px; left: 18px; animation-delay: 1.3s; }
        @keyframes eskob-star-twinkle {
          0% { transform: scale(1); }
          40% { transform: scale(1.2); }
          80% { transform: scale(0.8); }
          100% { transform: scale(1); }
        }
      `}</style>
      <label className="eskob-theme-switch" title={dark ? 'Açık moda geç' : 'Koyu moda geç'}>
        <input type="checkbox" checked={dark} onChange={toggle} />
        <div className={`eskob-ts-slider${dark ? ' dark' : ''}`}>
          <div className="eskob-ts-sun-moon">
            <svg className="eskob-moon-dot eskob-moon-dot-1" viewBox="0 0 100 100"><circle cx={50} cy={50} r={50} /></svg>
            <svg className="eskob-moon-dot eskob-moon-dot-2" viewBox="0 0 100 100"><circle cx={50} cy={50} r={50} /></svg>
            <svg className="eskob-moon-dot eskob-moon-dot-3" viewBox="0 0 100 100"><circle cx={50} cy={50} r={50} /></svg>
            <svg className="eskob-light-ray eskob-light-ray-1" viewBox="0 0 100 100"><circle cx={50} cy={50} r={50} /></svg>
            <svg className="eskob-light-ray eskob-light-ray-2" viewBox="0 0 100 100"><circle cx={50} cy={50} r={50} /></svg>
            <svg className="eskob-light-ray eskob-light-ray-3" viewBox="0 0 100 100"><circle cx={50} cy={50} r={50} /></svg>
            <svg className="eskob-cloud-dark eskob-cloud-1" viewBox="0 0 100 100"><circle cx={50} cy={50} r={50} /></svg>
            <svg className="eskob-cloud-dark eskob-cloud-2" viewBox="0 0 100 100"><circle cx={50} cy={50} r={50} /></svg>
            <svg className="eskob-cloud-dark eskob-cloud-3" viewBox="0 0 100 100"><circle cx={50} cy={50} r={50} /></svg>
            <svg className="eskob-cloud-light eskob-cloud-4" viewBox="0 0 100 100"><circle cx={50} cy={50} r={50} /></svg>
            <svg className="eskob-cloud-light eskob-cloud-5" viewBox="0 0 100 100"><circle cx={50} cy={50} r={50} /></svg>
            <svg className="eskob-cloud-light eskob-cloud-6" viewBox="0 0 100 100"><circle cx={50} cy={50} r={50} /></svg>
          </div>
          <div className="eskob-ts-stars">
            <svg className="eskob-star eskob-star-1" viewBox="0 0 20 20"><path d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z" /></svg>
            <svg className="eskob-star eskob-star-2" viewBox="0 0 20 20"><path d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z" /></svg>
            <svg className="eskob-star eskob-star-3" viewBox="0 0 20 20"><path d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z" /></svg>
            <svg className="eskob-star eskob-star-4" viewBox="0 0 20 20"><path d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z" /></svg>
          </div>
        </div>
      </label>
    </>
  )
}
