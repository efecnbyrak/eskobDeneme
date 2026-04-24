import { redirect } from 'next/navigation'

interface Props {
  params: Promise<{ sehir: string; slug: string }>
}

export default async function MusteriEsnafRedirect({ params }: Props) {
  const { sehir, slug } = await params
  redirect(`/${sehir}/${slug}`)
}
