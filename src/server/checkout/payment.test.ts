import { describe, it, expect } from 'vitest'
import { simulatePayment } from './payment'

describe('simulatePayment', () => {
  it('aprova cartão terminado em dígito par', () => {
    expect(simulatePayment('1234567890123456')).toBe(true)
  })

  it('recusa cartão terminado em dígito ímpar', () => {
    expect(simulatePayment('1234567890123457')).toBe(false)
  })

  it('aprova cartão terminado em zero', () => {
    expect(simulatePayment('1234567890123450')).toBe(true)
  })
})
