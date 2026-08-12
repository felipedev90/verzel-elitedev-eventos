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
    <Link href={`/eventos/${event.slug}`} className="group block">
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
      {cheapestSeat && (
        <p className="text-sm text-accent">
          A partir de {formatPriceFromCents(cheapestSeat.priceCents)}
        </p>
      )}
    </Link>
  )
}
