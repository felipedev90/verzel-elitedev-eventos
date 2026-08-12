import Image from 'next/image'
import { formatLongDate } from '@/lib/format'

type EventInfoCardProps = {
  venueName: string
  city: string
  startsAt: string
  posterUrl: string
  ticketsSold: number
  totalSeats: number
}

export function EventInfoCard({
  venueName,
  city,
  startsAt,
  posterUrl,
  ticketsSold,
  totalSeats,
}: EventInfoCardProps) {
  return (
    <div className="flex items-center justify-between gap-6 rounded-md border border-border bg-surface p-5">
      <div className="flex flex-col gap-2">
        <p className="text-text-muted">
          {venueName} · {city}
        </p>
        <p className="text-text-muted">{formatLongDate(new Date(startsAt))}</p>
        <p className="text-text-muted">
          {ticketsSold}/{totalSeats} ingressos vendidos
        </p>
      </div>

      <div className="relative h-32 w-24 shrink-0 overflow-hidden rounded-md bg-bg">
        <Image src={posterUrl} alt="" fill sizes="96px" className="object-cover" />
      </div>
    </div>
  )
}
