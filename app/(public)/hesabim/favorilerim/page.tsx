import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'

export default async function HesabimFavorilerimPage() {
  const oturum = await auth()
  if (!oturum?.user) redirect('/giris')
  redirect('/favorilerim')
}
