import { Trash2 } from 'lucide-react'
import { formatPriceFromCents } from '@/lib/format'

type SelectedSeat = {
  id: string
  row: string
  number: number
  priceCents: number
}

type CheckoutSummaryProps = {
  eventTitle: string
  selectedSeats: SelectedSeat[]
  onRemoveSeat: (seatId: string) => void
}

export function CheckoutSummary({ eventTitle, selectedSeats, onRemoveSeat }: CheckoutSummaryProps) {
  const totalCents = selectedSeats.reduce((sum, seat) => sum + seat.priceCents, 0)

  return (
    <>
      <h2 className="mb-1 font-serif text-2xl text-text">Finalizar compra</h2>
      <p className="mb-6 text-sm text-text-muted">{eventTitle}</p>

      <ul className="mb-6 flex flex-col gap-2 border-b border-border pb-6">
        {selectedSeats.map((seat) => (
          <li key={seat.id} className="flex items-center justify-between text-sm text-text">
            <span>
              Assento {seat.row}
              {seat.number}
            </span>
            <div className="flex items-center gap-3">
              <span>{formatPriceFromCents(seat.priceCents)}</span>
              <button
                type="button"
                onClick={() => onRemoveSeat(seat.id)}
                aria-label={`Remover assento ${seat.row}${seat.number}`}
                className="text-text-muted transition-colors duration-300 cursor-pointer hover:text-red-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                <Trash2 size={16} aria-hidden="true" />
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="mb-6 flex justify-between font-serif text-xl text-text">
        <span>Total</span>
        <span>{formatPriceFromCents(totalCents)}</span>
      </div>
    </>
  )
}
