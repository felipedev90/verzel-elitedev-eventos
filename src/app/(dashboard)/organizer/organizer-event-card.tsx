import Link from 'next/link'
import { formatLongDate } from '@/lib/format'

type OrganizerEvent = {
  id: string
  slug: string
  title: string
  venueName: string
  city: string
  startsAt: string
  published: boolean
  _count: { seats: number; tickets: number }
}

type OrganizerEventCardProps = {
  event: OrganizerEvent
}

export function OrganizerEventCard({ event }: OrganizerEventCardProps) {
  return (
    <Link
      href={`/organizer/${event.slug}`}
      className="flex items-center justify-between rounded-md border border-border bg-surface px-5 py-4 transition-colors duration-300 hover:border-accent"
    >
      <div>
        <p className="font-medium text-text">{event.title}</p>
        <p className="text-sm text-text-muted">
          {event.venueName} · {event.city} · {formatLongDate(new Date(event.startsAt))}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm text-text-muted">
          {event._count.tickets}/{event._count.seats} vendidos
        </span>
        <span
          className={
            event.published
              ? 'rounded-full bg-accent/20 px-3 py-1 text-xs text-accent'
              : 'rounded-full bg-border px-3 py-1 text-xs text-text-muted'
          }
        >
          {event.published ? 'Publicado' : 'Rascunho'}
        </span>
      </div>
    </Link>
  )
}
