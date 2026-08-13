import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { prisma } from '@/server/db'
import { processCheckout, SeatMismatchError, SeatUnavailableError } from './process-checkout'

describe('processCheckout', () => {
  let eventId: string
  let organizerId: string
  let customerId: string
  let availableSeatId: string
  let takenSeatId: string

  beforeAll(async () => {
    const organizer = await prisma.user.create({
      data: {
        name: 'Organizador Teste',
        email: `organizador-checkout-${Date.now()}@test.com`,
        passwordHash: 'hash-fake',
        role: 'ORGANIZER',
      },
    })
    organizerId = organizer.id

    const customer = await prisma.user.create({
      data: {
        name: 'Cliente Teste',
        email: `cliente-checkout-${Date.now()}@test.com`,
        passwordHash: 'hash-fake',
        role: 'CUSTOMER',
      },
    })
    customerId = customer.id

    const event = await prisma.event.create({
      data: {
        slug: `evento-checkout-teste-${Date.now()}`,
        title: 'Evento de Teste Checkout',
        synopsis: 'Sinopse de teste',
        posterUrl: 'https://example.com/poster.jpg',
        backdropUrl: 'https://example.com/backdrop.jpg',
        externalId: '0',
        externalSource: 'test',
        venueName: 'Local de Teste',
        city: 'Cidade Teste',
        startsAt: new Date(),
        published: true,
        organizerId,
      },
    })
    eventId = event.id

    const availableSeat = await prisma.seat.create({
      data: { eventId, sector: 'Plateia', row: 'X', number: 1, priceCents: 2000 },
    })
    availableSeatId = availableSeat.id

    const takenSeat = await prisma.seat.create({
      data: { eventId, sector: 'Plateia', row: 'X', number: 2, priceCents: 2000 },
    })
    takenSeatId = takenSeat.id

    const order = await prisma.order.create({
      data: {
        code: 'JAOCUPADO',
        userId: customerId,
        status: 'PAID',
        totalCents: 2000,
      },
    })

    await prisma.ticket.create({
      data: {
        orderId: order.id,
        eventId,
        seatId: takenSeatId,
        holderName: 'Outro Cliente',
        shareToken: Math.random().toString(36).slice(2),
      },
    })
  })

  afterAll(async () => {
    await prisma.ticket.deleteMany({ where: { eventId } })
    await prisma.order.deleteMany({ where: { userId: customerId } })
    await prisma.event.delete({ where: { id: eventId } })
    await prisma.user.deleteMany({ where: { id: { in: [organizerId, customerId] } } })
  })

  it('aprova com cartão par e cria o ticket', async () => {
    const result = await processCheckout({
      eventId,
      seatIds: [availableSeatId],
      cardNumber: '1234567890123456',
      holderName: 'Cliente Teste',
      userId: customerId,
    })

    expect(result.status).toBe('PAID')

    const ticket = await prisma.ticket.findUnique({ where: { seatId: availableSeatId } })
    expect(ticket).not.toBeNull()
  })

  it('recusa com cartão ímpar e não cria ticket', async () => {
    const anotherSeat = await prisma.seat.create({
      data: { eventId, sector: 'Plateia', row: 'X', number: 3, priceCents: 2000 },
    })

    const result = await processCheckout({
      eventId,
      seatIds: [anotherSeat.id],
      cardNumber: '1234567890123457',
      holderName: 'Cliente Teste',
      userId: customerId,
    })

    expect(result.status).toBe('DECLINED')

    const ticket = await prisma.ticket.findUnique({ where: { seatId: anotherSeat.id } })
    expect(ticket).toBeNull()
  })

  it('lança SeatUnavailableError quando o assento já tem ticket', async () => {
    await expect(
      processCheckout({
        eventId,
        seatIds: [takenSeatId],
        cardNumber: '1234567890123456',
        holderName: 'Cliente Teste',
        userId: customerId,
      }),
    ).rejects.toThrow(SeatUnavailableError)
  })

  it('lança SeatMismatchError quando o assento não pertence ao evento', async () => {
    await expect(
      processCheckout({
        eventId,
        seatIds: ['assento-inexistente'],
        cardNumber: '1234567890123456',
        holderName: 'Cliente Teste',
        userId: customerId,
      }),
    ).rejects.toThrow(SeatMismatchError)
  })
})
