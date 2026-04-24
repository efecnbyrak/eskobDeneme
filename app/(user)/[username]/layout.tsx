import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'

export default async function KullaniciLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ username: string }>
}) {
  const { username } = await params
  const oturum = await auth()

  if (!oturum?.user) redirect('/giris')

  const kullaniciAdi = oturum.user.kullaniciAdi
  if (!kullaniciAdi || kullaniciAdi !== username) {
    if (kullaniciAdi) {
      redirect(`/${kullaniciAdi}/genel`)
    } else {
      redirect('/')
    }
  }

  return <>{children}</>
}
