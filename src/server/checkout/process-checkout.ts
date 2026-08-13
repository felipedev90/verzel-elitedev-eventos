import { randomBytes } from 'node:crypto'
import { Prisma } from '@/generated/prisma/client'
import { prisma } from '@/server/db'
import { simulatePayment } from '@/server/checkout/payment'

export class SeatMismatchError extends Error {
  constructor(public readonly seatIds: string[]) {
    super('One or more seats do not belong to this event')
    this.name = 'SeatMismatchError'
  }
}

export class SeatUnavailableError extends Error {
  constructor(public readonly seatIds: string[]) {
    super('One or more seats are no longer available')
    this.name = 'SeatUnavailableError'
  }
}

export class SeatTakenDuringCheckoutError extends Error {
  constructor() {
    super('One or more seats were just taken by another customer')
    this.name = 'SeatTakenDuringCheckoutError'
  }
}

type ProcessCheckoutInput = {
  eventId: string
  seatIds: string[]
  cardNumber: string
  holderName: string
  userId: string
}

type ProcessCheckoutResult =
  | { status: 'DECLINED' }
  | { status: 'PAID'; orderId: string; orderCode: string }

export async function processCheckout(input: ProcessCheckoutInput): Promise<ProcessCheckoutResult> {
  const { eventId, seatIds, cardNumber, holderName, userId } = input

  const seats = await prisma.seat.findMany({
    where: { id: { in: seatIds }, eventId },
    include: { ticket: true },
  })

  if (seats.length !== seatIds.length) {
    throw new SeatMismatchError(seatIds)
  }

  const alreadyTaken = seats.filter((seat) => seat.ticket !== null)
  if (alreadyTaken.length > 0) {
    throw new SeatUnavailableError(alreadyTaken.map((s) => s.id))
  }

  const totalCents = seats.reduce((sum, seat) => sum + seat.priceCents, 0)
  const paymentApproved = simulatePayment(cardNumber)
  const orderCode = randomBytes(6).toString('hex').toUpperCase()

  if (!paymentApproved) {
    await prisma.order.create({
      data: {
        code: orderCode,
        userId,
        status: 'DECLINED',
        totalCents,
      },
    })

    return { status: 'DECLINED' }
  }

  try {
    const order = await prisma.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({
        data: {
          code: orderCode,
          userId,
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

    return { status: 'PAID', orderId: order.id, orderCode: order.code }
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      throw new SeatTakenDuringCheckoutError()
    }

    throw error
  }
}
