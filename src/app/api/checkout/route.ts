import { NextResponse } from 'next/server'
import { randomBytes } from 'node:crypto'
import { Prisma } from '@/generated/prisma/client'
import { prisma } from '@/server/db'
import { requireRole } from '@/server/auth/require-role'
import { internalErrorResponse } from '@/server/http/api-error'
import { checkoutSchema } from '@/server/checkout/schemas'
import { simulatePayment } from '@/server/checkout/payment'

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

  const { eventId, seatIds, cardNumber, holderName } = parsed.data

  try {
    const seats = await prisma.seat.findMany({
      where: { id: { in: seatIds }, eventId },
      include: { ticket: true },
    })

    if (seats.length !== seatIds.length) {
      return NextResponse.json(
        { error: 'One or more seats do not belong to this event' },
        { status: 400 },
      )
    }

    const alreadyTaken = seats.filter((seat) => seat.ticket !== null)
    if (alreadyTaken.length > 0) {
      return NextResponse.json(
        {
          error: 'One or more seats are no longer available',
          seats: alreadyTaken.map((s) => s.id),
        },
        { status: 409 },
      )
    }

    const totalCents = seats.reduce((sum, seat) => sum + seat.priceCents, 0)
    const paymentApproved = simulatePayment(cardNumber)
    const orderCode = randomBytes(6).toString('hex').toUpperCase()

    if (!paymentApproved) {
      await prisma.order.create({
        data: {
          code: orderCode,
          userId: auth.session.userId,
          status: 'DECLINED',
          totalCents,
        },
      })

      return NextResponse.json({ status: 'DECLINED' }, { status: 402 })
    }

    const order = await prisma.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({
        data: {
          code: orderCode,
          userId: auth.session.userId,
          status: 'PAID',
          totalCents,
        },
      })

      await tx.ticket.createMany({
        data: seats.map((seat) => ({
          orderId: createdOrder.id,
          eventId,
          seatId: seat.id,
          holderName,
          shareToken: randomBytes(16).toString('hex'),
        })),
      })

      return createdOrder
    })

    return NextResponse.json(
      { status: 'PAID', orderId: order.id, orderCode: order.code },
      { status: 201 },
    )
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return NextResponse.json(
        { error: 'One or more seats were just taken by another customer. Please try again.' },
        { status: 409 },
      )
    }

    console.error('Checkout failed:', error)
    return internalErrorResponse()
  }
}
