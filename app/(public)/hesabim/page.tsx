import { redirect } from 'next/navigation'
import { auth, signOut } from '@/lib/auth'

export default async function HesabimRedirect() {
  const oturum = await auth()

  if (!oturum?.user) {
    redirect('/musteri/giris')
  }

  const kullaniciAdi = oturum.user.kullaniciAdi
  if (kullaniciAdi) {
    redirect(`/${kullaniciAdi}/genel`)
  }

  // Kullanıcı adı yoksa oturumu kapat, kayıt sayfasına yönlendir
  await signOut({ redirectTo: '/musteri/kayit' })
}
