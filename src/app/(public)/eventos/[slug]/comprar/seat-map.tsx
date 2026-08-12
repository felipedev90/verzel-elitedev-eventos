'use client'

import { useMemo, useState } from 'react'
import { formatPriceFromCents } from '@/lib/format'
import { Button } from '@/components/ui/Button'
import { SeatButton } from './seat-button'
import { SeatLegend } from './seat-legend'
import { CheckoutDrawer } from './checkout-drawer'

type SeatWithTicket = {
  id: string
  row: string
  number: number
  priceCents: number
  sector: string
  ticket: { id: string } | null
}

type SeatMapProps = {
  eventId: string
  eventTitle: string
  seats: SeatWithTicket[]
}

export function SeatMap({ eventId, eventTitle, seats }: SeatMapProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const seatsByRow = useMemo(() => {
    const grouped = new Map<string, SeatWithTicket[]>()
    for (const seat of seats) {
      const rowSeats = grouped.get(seat.row) ?? []
      rowSeats.push(seat)
      grouped.set(seat.row, rowSeats)
    }
    return grouped
  }, [seats])

  const selectedSeats = seats.filter((seat) => selectedIds.has(seat.id))
  const totalCents = selectedSeats.reduce((sum, seat) => sum + seat.priceCents, 0)

  function toggleSeat(seat: SeatWithTicket) {
    if (seat.ticket) return

    setSelectedIds((current) => {
      const next = new Set(current)
      if (next.has(seat.id)) {
        next.delete(seat.id)
      } else {
        next.add(seat.id)
      }
      return next
    })
  }

  return (
    <div className="pb-24">
      <div className="mb-10 flex flex-col items-center gap-2">
        <div className="h-1.5 w-full max-w-md rounded-full bg-linear-to-r from-transparent via-border to-transparent" />
        <span className="text-xs tracking-widest text-text-muted uppercase">Tela</span>
      </div>

      <div className="mb-8 flex flex-col items-center gap-3">
        {Array.from(seatsByRow.entries()).map(([row, rowSeats]) => (
          <div key={row} className="flex items-center gap-3">
            <span className="w-4 text-sm text-text-muted">{row}</span>
            <div className="flex gap-2">
              {rowSeats.map((seat) => (
                <SeatButton
                  key={seat.id}
                  row={seat.row}
                  number={seat.number}
                  isOccupied={Boolean(seat.ticket)}
                  isSelected={selectedIds.has(seat.id)}
                  onToggle={() => toggleSeat(seat)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <SeatLegend />

      {selectedSeats.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 border-t border-border bg-surface/95 backdrop-blur-md">
          <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
            <div>
              <p className="text-sm text-text-muted">
                {selectedSeats.length} {selectedSeats.length === 1 ? 'assento' : 'assentos'}
              </p>
              <p className="font-serif text-xl text-text">{formatPriceFromCents(totalCents)}</p>
            </div>
            <Button onClick={() => setIsDrawerOpen(true)}>Continuar</Button>
          </div>
        </div>
      )}

      <CheckoutDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        eventId={eventId}
        eventTitle={eventTitle}
        selectedSeats={selectedSeats}
        onRemoveSeat={(seatId) =>
          setSelectedIds((current) => {
            const next = new Set(current)
            next.delete(seatId)
            return next
          })
        }
      />
    </div>
  )
}
