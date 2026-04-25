import { NextResponse } from 'next/server'
import type { ApiBasari, ApiHata } from './types'

export function basari<T>(data: T, status = 200) {
  return NextResponse.json<ApiBasari<T>>(
    { success: true, data },
    { status }
  )
}

export function hata(
  error: string,
  status = 400,
  alanlar?: Record<string, string[]>
) {
  return NextResponse.json<ApiHata>(
    { success: false, error, ...(alanlar ? { alanlar } : {}) },
    { status }
  )
}
