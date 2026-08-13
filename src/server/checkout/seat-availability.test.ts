import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { prisma } from '@/server/db'

describe('proteção contra venda duplicada de assento', () => {
  let eventId: string
  let seatId: string
  let organizerId: string
  let customerId: string

  beforeAll(async () => {
    const organizer = await prisma.user.create({
      data: {
        name: 'Organizador Teste',
        email: `organizador-teste-${Date.now()}@test.com`,
        passwordHash: 'hash-fake',
        role: 'ORGANIZER',
      },
    })
    organizerId = organizer.id

    const event = await prisma.event.create({
      data: {
        slug: `evento-teste-${Date.now()}`,
        title: 'Evento de Teste',
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

    const seat = await prisma.seat.create({
      data: {
        eventId,
        sector: 'Plateia',
        row: 'Z',
        number: 99,
        priceCents: 1000,
      },
    })
    seatId = seat.id

    const customer = await prisma.user.create({
      data: {
        name: 'Cliente Teste',
        email: `cliente-teste-${Date.now()}@test.com`,
        passwordHash: 'hash-fake',
        role: 'CUSTOMER',
      },
    })
    customerId = customer.id
  })

  afterAll(async () => {
    await prisma.ticket.deleteMany({ where: { eventId } })
    await prisma.order.deleteMany({ where: { userId: customerId } })
    await prisma.event.delete({ where: { id: eventId } })
    await prisma.user.delete({ where: { id: customerId } })
    await prisma.user.delete({ where: { id: organizerId } })
  })

  it('permite apenas uma venda quando duas tentativas concorrem pelo mesmo assento', async () => {
    async function attemptPurchase() {
      const order = await prisma.order.create({
        data: {
          code: Math.random().toString(36).slice(2),
          userId: customerId,
          status: 'PAID',
          totalCents: 1000,
        },
      })

      return prisma.ticket.create({
        data: {
          orderId: order.id,
          eventId,
          seatId,
          holderName: 'Cliente Teste',
          shareToken: Math.random().toString(36).slice(2),
        },
      })
    }

    const results = await Promise.allSettled([attemptPurchase(), attemptPurchase()])

    const fulfilled = results.filter((r) => r.status === 'fulfilled')
    const rejected = results.filter((r) => r.status === 'rejected')

    expect(fulfilled).toHaveLength(1)
    expect(rejected).toHaveLength(1)

    const ticketsForSeat = await prisma.ticket.findMany({ where: { seatId } })
    expect(ticketsForSeat).toHaveLength(1)
  })
})
