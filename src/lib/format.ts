const shortDateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
})

const longDateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'long',
  hour: '2-digit',
  minute: '2-digit',
})

const priceFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

export function formatShortDate(date: Date): string {
  return shortDateFormatter.format(date)
}

export function formatLongDate(date: Date): string {
  return longDateFormatter.format(date)
}

export function formatPriceFromCents(cents: number): string {
  return priceFormatter.format(cents / 100)
}
