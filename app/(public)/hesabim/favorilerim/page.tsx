import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'

export default async function HesabimFavorilerimPage() {
  const oturum = await auth()
  if (!oturum?.user) redirect('/giris')
  if (!oturum.user.kullaniciAdi) redirect('/musteri/kayit')
  redirect(`/${oturum.user.kullaniciAdi}/favorilerim`)
}
