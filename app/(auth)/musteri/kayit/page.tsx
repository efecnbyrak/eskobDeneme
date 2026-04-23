'use client'

import { Suspense } from 'react'
import { KayitForm } from '@/app/(auth)/kayit/page'

export default function MusteriKayitSayfasi() {
  return (
    <Suspense fallback={null}>
      <KayitForm initialTip="USER" />
    </Suspense>
  )
}
