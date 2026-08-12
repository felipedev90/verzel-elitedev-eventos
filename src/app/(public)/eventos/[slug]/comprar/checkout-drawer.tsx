'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Drawer } from '@/components/ui/Drawer'
import { CheckoutSummary } from './checkout-summary'
import { PaymentForm } from './payment-form'
import type { CheckoutFormInput } from './checkout-schema'

type SelectedSeat = {
  id: string
  row: string
  number: number
  priceCents: number
}

type CheckoutDrawerProps = {
  isOpen: boolean
  onClose: () => void
  eventId: string
  eventTitle: string
  selectedSeats: SelectedSeat[]
  onRemoveSeat: (seatId: string) => void
}

export function CheckoutDrawer({
  isOpen,
  onClose,
  eventId,
  eventTitle,
  selectedSeats,
  onRemoveSeat,
}: CheckoutDrawerProps) {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)
  const [declined, setDeclined] = useState(false)

  const totalCents = selectedSeats.reduce((sum, seat) => sum + seat.priceCents, 0)

  async function handleSubmit(data: CheckoutFormInput) {
    setServerError(null)
    setDeclined(false)

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId,
          seatIds: selectedSeats.map((seat) => seat.id),
          cardNumber: data.cardNumber,
          holderName: data.holderName,
        }),
      })

      const result = await response.json()

      if (response.status === 402) {
        setDeclined(true)
        return
      }

      if (!response.ok) {
        setServerError(result.error ?? 'Não foi possível concluir a compra.')
        return
      }

      router.push('/my-tickets')
      router.refresh()
    } catch {
      setServerError('Erro de conexão. Verifique sua internet e tente novamente.')
    }
  }

  return (
    <Drawer isOpen={isOpen} onClose={onClose}>
      <CheckoutSummary
        eventTitle={eventTitle}
        selectedSeats={selectedSeats}
        onRemoveSeat={onRemoveSeat}
      />
      <PaymentForm
        totalCents={totalCents}
        onSubmit={handleSubmit}
        declined={declined}
        serverError={serverError}
      />
    </Drawer>
  )
}
