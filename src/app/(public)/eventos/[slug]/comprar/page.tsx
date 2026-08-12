import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { prisma } from '@/server/db'
import { formatLongDate } from '@/lib/format'
import { SeatMap } from './seat-map'

type BuyPageProps = {
  params: Promise<{ slug: string }>
}

export default async function BuyPage({ params }: BuyPageProps) {
  const { slug } = await params

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
        ← Voltar
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
