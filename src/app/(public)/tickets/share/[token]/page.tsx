import { notFound } from 'next/navigation'
import Image from 'next/image'
import { prisma } from '@/server/db'
import { formatLongDate } from '@/lib/format'

type SharePageProps = {
  params: Promise<{ token: string }>
}

export default async function SharePage({ params }: SharePageProps) {
  const { token } = await params

  const ticket = await prisma.ticket.findUnique({
    where: { shareToken: token },
    include: {
      event: {
        select: { title: true, venueName: true, city: true, startsAt: true, posterUrl: true },
      },
      seat: { select: { row: true, number: true, sector: true } },
    },
  })

  if (!ticket) {
    notFound()
  }

  const isUsed = Boolean(ticket.usedAt)

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 py-12">
      <div className="w-full rounded-md border border-border bg-surface p-6 text-center">
        <div className="relative mx-auto mb-4 aspect-2/3 w-32 overflow-hidden rounded-md bg-bg">
          <Image
            src={ticket.event.posterUrl}
            alt={`Pôster do filme ${ticket.event.title}`}
            fill
            sizes="128px"
            className="object-cover"
          />
        </div>

        <h1 className="mb-2 font-serif text-2xl text-text">{ticket.event.title}</h1>
        <p className="mb-1 text-sm text-text-muted">
          {ticket.event.venueName} · {ticket.event.city}
        </p>
        <p className="mb-4 text-sm text-text-muted">{formatLongDate(ticket.event.startsAt)}</p>

        <p className="mb-1 text-text">
          {ticket.holderName} · Assento {ticket.seat.row}
          {ticket.seat.number}
        </p>

        <span
          className={
            isUsed
              ? 'mt-3 inline-block rounded-full bg-border px-3 py-1 text-xs text-text-muted'
              : 'mt-3 inline-block rounded-full bg-accent/20 px-3 py-1 text-xs text-accent'
          }
        >
          {isUsed ? 'Ingresso já utilizado' : 'Ingresso válido'}
        </span>
      </div>
    </main>
  )
}
