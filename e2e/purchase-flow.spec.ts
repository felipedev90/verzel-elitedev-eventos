import { test, expect } from '@playwright/test'

test.describe('fluxo de compra de ingresso', () => {
  test('cliente faz login, escolhe assento, paga e vê o ingresso em Meus Ingressos', async ({
    page,
  }) => {
    await page.goto('/login')

    await page.getByLabel('E-mail').fill('cliente1@eventos.com')
    await page.getByRole('textbox', { name: 'Senha' }).fill('senha123')
    await page.getByRole('button', { name: 'Entrar' }).click()

    await page.waitForURL('/')

    await page.getByRole('link', { name: 'Comprar ingresso' }).first().click()

    await page.waitForURL(/\/eventos\/.+/)

    await page.getByRole('link', { name: 'Comprar ingresso' }).first().click()

    const firstAvailableSeat = page.getByRole('button', { name: /disponível/ }).first()
    await firstAvailableSeat.click()

    await page.getByRole('button', { name: 'Continuar' }).click()

    await page.getByLabel('Nome do titular').fill('Cliente E2E')
    await page.getByLabel('Número do cartão').fill('1234567890123456')

    await page.getByRole('button', { name: /Confirmar compra/ }).click()

    await page.waitForURL('/my-tickets')

    await expect(page.getByText(/Assento/).first()).toBeVisible()
  })
})

test('pagamento com cartão inválido é recusado e mostra mensagem sem sair da tela', async ({
  page,
}) => {
  await page.goto('/login')

  await page.getByLabel('E-mail').fill('cliente1@eventos.com')
  await page.getByRole('textbox', { name: 'Senha' }).fill('senha123')
  await page.getByRole('button', { name: 'Entrar' }).click()

  await page.waitForURL('/')

  await page.getByRole('link', { name: 'Comprar ingresso' }).first().click()
  await page.waitForURL(/\/eventos\/.+/)

  await page.getByRole('link', { name: 'Comprar ingresso' }).first().click()

  const firstAvailableSeat = page.getByRole('button', { name: /disponível/ }).first()
  await firstAvailableSeat.click()

  await page.getByRole('button', { name: 'Continuar' }).click()

  await page.getByLabel('Nome do titular').fill('Cliente Recusado')
  await page.getByLabel('Número do cartão').fill('1234567890123457')

  await page.getByRole('button', { name: /Confirmar compra/ }).click()

  await expect(page.getByText('Pagamento recusado')).toBeVisible()

  expect(page.url()).toContain('/comprar')
})
