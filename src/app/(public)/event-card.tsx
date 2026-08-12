import Link from 'next/link'
import { EventPoster } from '@/components/ui/EventPoster'
import { formatShortDate, formatPriceFromCents } from '@/lib/format'
import type { Event, Seat } from '@/generated/prisma/client'

type EventCardProps = {
  event: Event & { seats: Pick<Seat, 'priceCents'>[] }
  priority?: boolean
}

export function EventCard({ event, priority = false }: EventCardProps) {
  const cheapestSeat = event.seats[0]

  return (
    <div className="group">
      <Link href={`/eventos/${event.slug}`} className="block">
        <EventPoster
          src={event.posterUrl}
          alt={`Pôster do filme ${event.title}`}
          priority={priority}
          className="mb-3 transition-opacity duration-300 group-hover:opacity-80"
        />
        <h3 className="mb-1 truncate font-serif text-lg text-text">{event.title}</h3>
        <p className="mb-1 text-sm text-text-muted">
          {event.city} · {formatShortDate(event.startsAt)}
        </p>
      </Link>

      {cheapestSeat && (
        <p className="mb-3 text-sm text-accent">
          A partir de {formatPriceFromCents(cheapestSeat.priceCents)}
        </p>
      )}

      <Link
        href={`/eventos/${event.slug}/comprar`}
        className="block w-full rounded-md bg-accent px-4 py-2 text-center text-sm font-medium text-bg transition-colors duration-300 hover:bg-accent-hover"
      >
        Comprar agora
      </Link>
    </div>
  )
}
