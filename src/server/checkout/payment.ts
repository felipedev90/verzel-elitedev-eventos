export function simulatePayment(cardNumber: string): boolean {
  const lastDigit = Number(cardNumber.at(-1))
  return lastDigit % 2 === 0
}
