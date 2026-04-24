'use client'

import { useEffect } from 'react'
import { useToast } from '@/components/ui/Toast'

export function HosgeldinToast() {
  const { toast } = useToast()

  useEffect(() => {
    const ad = sessionStorage.getItem('hosgeldin')
    if (ad) {
      sessionStorage.removeItem('hosgeldin')
      toast(`Hoş geldiniz${ad !== '1' ? ', ' + ad : ''}! Giriş başarılı 🎉`, 'success')
    }
  }, [toast])

  return null
}
