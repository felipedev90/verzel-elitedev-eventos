import { describe, it, expect } from 'vitest'
import { generateTicketCode, verifyTicketCode } from './qr-code'

describe('generateTicketCode / verifyTicketCode', () => {
  it('gera um código no formato ticketId.assinatura', () => {
    const code = generateTicketCode('ticket-123')
    expect(code).toMatch(/^ticket-123\.[a-f0-9]{64}$/)
  })

  it('verifica um código válido corretamente', () => {
    const code = generateTicketCode('ticket-123')
    const result = verifyTicketCode(code)

    expect(result.valid).toBe(true)
    expect(result.ticketId).toBe('ticket-123')
  })

  it('rejeita um código com assinatura forjada', () => {
    const forged = 'ticket-123.0000000000000000000000000000000000000000000000000000000000000000'
    const result = verifyTicketCode(forged)

    expect(result.valid).toBe(false)
    expect(result.ticketId).toBeNull()
  })

  it('rejeita um código sem separador', () => {
    const result = verifyTicketCode('codigo-invalido-sem-ponto')

    expect(result.valid).toBe(false)
    expect(result.ticketId).toBeNull()
  })

  it('rejeita se o ticketId foi alterado mas a assinatura não', () => {
    const code = generateTicketCode('ticket-123')
    const tampered = code.replace('ticket-123', 'ticket-999')
    const result = verifyTicketCode(tampered)

    expect(result.valid).toBe(false)
  })
})
