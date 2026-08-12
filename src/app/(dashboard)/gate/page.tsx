import Link from 'next/link'
import { getCatalogEvents } from '@/server/events/queries'
import { formatLongDate } from '@/lib/format'

export default async function GateSelectEventPage() {
  const events = await getCatalogEvents({})

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-8 font-serif text-3xl text-text">Validar ingresso</h1>
      <p className="mb-6 text-sm text-text-muted">Selecione o evento que está sendo validado:</p>

      {events.length === 0 && (
        <p className="text-text-muted">Nenhum evento publicado no momento.</p>
      )}

      <div className="flex flex-col gap-3">
        {events.map((event) => (
          <Link
            key={event.id}
            href={`/gate/${event.slug}`}
            className="rounded-md border border-border bg-surface px-5 py-4 transition-colors duration-300 hover:border-accent"
          >
            <p className="font-medium text-text">{event.title}</p>
            <p className="text-sm text-text-muted">
              {event.venueName} · {event.city} · {formatLongDate(event.startsAt)}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}
