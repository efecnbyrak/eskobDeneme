import { ReactNode } from 'react'

export default function AccountLayout({ children }: { children: ReactNode }) {
  return (
    <div className="container-main" style={{ paddingTop: 100, paddingBottom: 100 }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        {children}
      </div>
    </div>
  )
}
