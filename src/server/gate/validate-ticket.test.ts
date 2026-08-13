import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { prisma } from '@/server/db'
import { generateTicketCode } from '@/server/tickets/qr-code'
import { validateTicket } from './validate-ticket'

describe('validateTicket', () => {
  let eventId: string
  let otherEventId: string
  let organizerId: string
  let customerId: string
  let gateUserId: string
  let ticketId: string
  let ticketCode: string

  beforeAll(async () => {
    const organizer = await prisma.user.create({
      data: {
        name: 'Organizador Teste',
        email: `organizador-gate-${Date.now()}@test.com`,
        passwordHash: 'hash-fake',
        role: 'ORGANIZER',
      },
    })
    organizerId = organizer.id

    const gateUser = await prisma.user.create({
      data: {
        name: 'Portaria Teste',
        email: `portaria-gate-${Date.now()}@test.com`,
        passwordHash: 'hash-fake',
        role: 'GATE',
      },
    })
    gateUserId = gateUser.id

    const customer = await prisma.user.create({
      data: {
        name: 'Cliente Teste',
        email: `cliente-gate-${Date.now()}@test.com`,
        passwordHash: 'hash-fake',
        role: 'CUSTOMER',
      },
    })
    customerId = customer.id

    const event = await prisma.event.create({
      data: {
        slug: `evento-gate-teste-${Date.now()}`,
        title: 'Evento de Teste Gate',
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

    const otherEvent = await prisma.event.create({
      data: {
        slug: `outro-evento-gate-teste-${Date.now()}`,
        title: 'Outro Evento',
        synopsis: 'Sinopse de teste',
        posterUrl: 'https://example.com/poster.jpg',
        backdropUrl: 'https://example.com/backdrop.jpg',
        externalId: '1',
        externalSource: 'test',
        venueName: 'Outro Local',
        city: 'Outra Cidade',
        startsAt: new Date(),
        published: true,
        organizerId,
      },
    })
    otherEventId = otherEvent.id

    const seat = await prisma.seat.create({
      data: {
        eventId,
        sector: 'Plateia',
        row: 'Y',
        number: 1,
        priceCents: 1000,
      },
    })

    const order = await prisma.order.create({
      data: {
        code: Math.random().toString(36).slice(2),
        userId: customerId,
        status: 'PAID',
        totalCents: 1000,
      },
    })

    const ticket = await prisma.ticket.create({
      data: {
        orderId: order.id,
        eventId,
        seatId: seat.id,
        holderName: 'Cliente Teste',
        shareToken: Math.random().toString(36).slice(2),
      },
    })
    ticketId = ticket.id
    ticketCode = generateTicketCode(ticket.id)
  })

  afterAll(async () => {
    await prisma.ticket.deleteMany({ where: { eventId: { in: [eventId, otherEventId] } } })
    await prisma.order.deleteMany({ where: { userId: customerId } })
    await prisma.event.deleteMany({ where: { id: { in: [eventId, otherEventId] } } })
    await prisma.user.deleteMany({ where: { id: { in: [organizerId, gateUserId, customerId] } } })
  })

  it('retorna INVALID para código forjado', async () => {
    const result = await validateTicket('id-fake.assinatura-fake', eventId, gateUserId)
    expect(result.result).toBe('INVALID')
  })

  it('retorna WRONG_EVENT quando o ticket é de outro evento', async () => {
    const result = await validateTicket(ticketCode, otherEventId, gateUserId)
    expect(result.result).toBe('WRONG_EVENT')
  })

  it('retorna VALID na primeira validação e marca o ticket como usado', async () => {
    const result = await validateTicket(ticketCode, eventId, gateUserId)
    expect(result.result).toBe('VALID')

    const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } })
    expect(ticket?.usedAt).not.toBeNull()
  })

  it('retorna ALREADY_USED na segunda tentativa', async () => {
    const result = await validateTicket(ticketCode, eventId, gateUserId)
    expect(result.result).toBe('ALREADY_USED')
  })
})
