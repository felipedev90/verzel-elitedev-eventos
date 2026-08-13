import { notFound, redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import Image from 'next/image'
import Link from 'next/link'
import { prisma } from '@/server/db'
import { verifySessionToken } from '@/server/auth/session'
import { formatLongDate } from '@/lib/format'
import { SeatMap } from './seat-map'
import { ArrowLeft } from 'lucide-react'

type BuyPageProps = {
  params: Promise<{ slug: string }>
}

export default async function BuyPage({ params }: BuyPageProps) {
  const { slug } = await params

  const cookieStore = await cookies()
  const token = cookieStore.get('auth-token')?.value
  const session = token ? await verifySessionToken(token) : null

  if (!session) {
    redirect(`/login?redirect=/eventos/${slug}/comprar`)
  }

  if (session.role !== 'CUSTOMER') {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-md flex-col items-center justify-center px-6 text-center">
        <h1 className="mb-3 font-serif text-2xl text-text">Compra não disponível</h1>
        <p className="mb-6 text-text-muted">
          Contas de organizador ou portaria não podem comprar ingressos. Entre com uma conta de
          cliente para continuar.
        </p>
        <Link
          href="/"
          className="inline-flex items-center rounded-md bg-accent px-6 py-3 text-sm font-medium text-bg transition-colors duration-300 hover:bg-accent-hover"
        >
          <ArrowLeft className="mr-1 inline-block h-4 w-4" aria-hidden="true" /> Voltar para a Home
        </Link>
      </main>
    )
  }

  const event = await prisma.event.findUnique({
    where: { slug, published: true },
    include: {
      seats: {
        include: { ticket: { select: { id: true } } },
        orderBy: [{ row: 'asc' }, { number: 'asc' }],
      },
    },
  })

  if (!event) {
    notFound()
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <Link
        href={`/eventos/${event.slug}`}
        className="mb-8 inline-flex items-center gap-1 text-sm text-text-muted transition-colors duration-300 hover:text-accent"
      >
        <ArrowLeft className="mr-1 inline-block h-4 w-4" aria-hidden="true" /> Voltar
      </Link>

      <div className="mb-10 flex flex-col items-center gap-4 border-b border-border pb-6 text-center">
        <div className="relative h-20 w-14 overflow-hidden rounded-md bg-surface">
          <Image src={event.posterUrl} alt="" fill sizes="56px" className="object-cover" />
        </div>

        <div>
          <h1 className="mb-1 font-serif text-3xl text-text">{event.title}</h1>
          <p className="text-sm text-text-muted">
            {event.venueName} · {event.city} · {formatLongDate(event.startsAt)}
          </p>
        </div>
      </div>

      <h2 className="mb-10 text-center font-serif text-2xl text-text">Escolha seu assento</h2>
      <SeatMap eventId={event.id} eventTitle={event.title} seats={event.seats} />
    </main>
  )
}
