'use client'

import { Suspense } from 'react'
import { KayitForm } from '@/app/(auth)/kayit/page'

export default function IsletmeKayitSayfasi() {
  return (
    <Suspense fallback={null}>
      <KayitForm initialTip="BUSINESS" />
    </Suspense>
  )
}
