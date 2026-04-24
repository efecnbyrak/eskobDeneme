import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'

export default async function HesabimRedirect() {
  const oturum = await auth()
  const kullaniciAdi = oturum?.user?.kullaniciAdi
  if (kullaniciAdi) {
    redirect(`/${kullaniciAdi}/genel`)
  }
  redirect('/giris')
}
