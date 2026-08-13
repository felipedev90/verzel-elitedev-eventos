import { NextResponse } from 'next/server'
import { requireRole } from '@/server/auth/require-role'
import { internalErrorResponse } from '@/server/http/api-error'
import { checkoutSchema } from '@/server/checkout/schemas'
import {
  processCheckout,
  SeatMismatchError,
  SeatUnavailableError,
  SeatTakenDuringCheckoutError,
} from '@/server/checkout/process-checkout'

export async function POST(request: Request) {
  const auth = await requireRole(['CUSTOMER'])
  if (!auth.ok) return auth.response

  const body = await request.json()
  const parsed = checkoutSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid checkout data', details: parsed.error.flatten() },
      { status: 400 },
    )
  }

  try {
    const result = await processCheckout({ ...parsed.data, userId: auth.session.userId })

    if (result.status === 'DECLINED') {
      return NextResponse.json({ status: 'DECLINED' }, { status: 402 })
    }

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    if (error instanceof SeatMismatchError) {
      return NextResponse.json({ error: error.message, seats: error.seatIds }, { status: 400 })
    }

    if (error instanceof SeatUnavailableError) {
      return NextResponse.json({ error: error.message, seats: error.seatIds }, { status: 409 })
    }

    if (error instanceof SeatTakenDuringCheckoutError) {
      return NextResponse.json({ error: error.message }, { status: 409 })
    }

    console.error('Checkout failed:', error)
    return internalErrorResponse()
  }
}
