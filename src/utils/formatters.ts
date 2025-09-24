import Decimal from 'decimal.js'

export const formatInputPrice = (price: number | string) => {
  const decimal = new Decimal(price)

  if (decimal.gte(1000)) {
    // 2 decimals, commas
    return decimal.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }
  if (decimal.gte(1)) {
    // 4 decimals
    return decimal.toFixed(4)
  }
  // 8 decimals for small values
  return decimal.toFixed(8)
}

export function formatRate(amount: string | number | Decimal): string {
  const value = new Decimal(amount)

  let formatted: string

  if (value.greaterThanOrEqualTo(1)) {
    formatted = value.toFixed(2)
  } else if (value.greaterThanOrEqualTo(0.01)) {
    formatted = value.toFixed(5)
  } else {
    formatted = value.toFixed(8)
  }

  return formatted
}

export const formatTime = (dateTime: Date) => {
  return dateTime.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}
