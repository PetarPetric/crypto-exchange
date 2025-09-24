import type { CryptoRates } from '@/types/currency'
import { CURRENCIES } from '@/types/constants'
import { ValidationError } from '@/services/errorService'

export default function validateCryptoResponse(data: CryptoRates): boolean {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new ValidationError('Response is not a valid object')
  }

  const requiredCurrencies = Object.values(CURRENCIES)
  const missingCurrencies: string[] = []
  const invalidPrices: string[] = []

  for (const currency of requiredCurrencies) {
    // check if currency exists in response
    if (!data[currency]) {
      missingCurrencies.push(currency)
      continue
    }

    // check if currency data is an object
    if (typeof data[currency] !== 'object' || data[currency] === null) {
      invalidPrices.push(currency)
      continue
    }

    // check if USD price exists and is valid
    const usdPrice = data[currency].usd
    if (typeof usdPrice !== 'number' || !isFinite(usdPrice) || usdPrice < 0) {
      invalidPrices.push(currency)
      continue
    }
  }

  if (missingCurrencies.length > 0 || invalidPrices.length > 0) {
    const errors: string[] = []
    if (missingCurrencies.length > 0) {
      errors.push(`Missing currencies: ${missingCurrencies.join(', ')}`)
    }
    if (invalidPrices.length > 0) {
      errors.push(`Invalid prices for: ${invalidPrices.join(', ')}`)
    }
    throw new ValidationError(errors.join('; '), missingCurrencies)
  }

  return true
}
