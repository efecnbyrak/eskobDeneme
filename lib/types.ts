export type ApiBasari<T> = { success: true; data: T }
export type ApiHata = {
  success: false
  error: string
  alanlar?: Record<string, string[]>
}
export type ApiYanit<T> = ApiBasari<T> | ApiHata

export type RolYetki = 'SUPER_ADMIN' | 'ADMIN' | 'BUSINESS' | 'USER'
