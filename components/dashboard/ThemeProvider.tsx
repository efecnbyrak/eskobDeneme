'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

type Tema = 'varsayilan' | 'gece' | 'zumrut' | 'gul'

interface TemaContext {
  tema: Tema
  temaDegistir: (t: Tema) => void
}

const TemaCtx = createContext<TemaContext>({ tema: 'varsayilan', temaDegistir: () => {} })

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [tema, setTema] = useState<Tema>('varsayilan')

  useEffect(() => {
    const kayitli = localStorage.getItem('eskob-tema') as Tema | null
    if (kayitli) setTema(kayitli)
  }, [])

  useEffect(() => {
    const panel = document.querySelector('.isletme-panel')
    if (!panel) return
    if (tema === 'varsayilan') {
      panel.removeAttribute('data-tema')
    } else {
      panel.setAttribute('data-tema', tema)
    }
  }, [tema])

  function temaDegistir(t: Tema) {
    setTema(t)
    localStorage.setItem('eskob-tema', t)
  }

  return <TemaCtx.Provider value={{ tema, temaDegistir }}>{children}</TemaCtx.Provider>
}

export function useTema() {
  return useContext(TemaCtx)
}
