import { describe, it, expect } from 'vitest'
import { hashPassword, verifyPassword } from './password'

describe('hashPassword / verifyPassword', () => {
  it('gera um hash diferente da senha original', async () => {
    const hash = await hashPassword('senha123')
    expect(hash).not.toBe('senha123')
  })

  it('verifica a senha correta como válida', async () => {
    const hash = await hashPassword('senha123')
    const result = await verifyPassword('senha123', hash)
    expect(result).toBe(true)
  })

  it('rejeita a senha incorreta', async () => {
    const hash = await hashPassword('senha123')
    const result = await verifyPassword('senha-errada', hash)
    expect(result).toBe(false)
  })

  it('gera hashes diferentes para a mesma senha (salt aleatório)', async () => {
    const hash1 = await hashPassword('senha123')
    const hash2 = await hashPassword('senha123')
    expect(hash1).not.toBe(hash2)
  })
})
