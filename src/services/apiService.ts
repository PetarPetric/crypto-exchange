import { CRYPTO_API_URL, API_PARAMS, ERROR_MESSAGES, API_CONFIG } from '@/types/constants'
import { ApiError, NetworkError, ValidationError } from './errorService'
import type { CryptoRates } from '@/types/currency'
import { logError } from '@/utils/errorHandling'
import validateCryptoResponse from '@/utils/validateResponse'

// Retry mechanism
async function fetchWithRetry(url: string, options: RequestInit = {}): Promise<Response> {
  let lastError: Error

  for (let attempt = 1; attempt <= API_CONFIG.MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(url, {
        ...options,
        signal: AbortSignal.timeout(10000), // 10 second timeout
      })

      if (response.ok) {
        return response
      }

      // If a server error, 5xx, retry
      if (response.status >= 500) {
        lastError = new ApiError(`Server error: ${response.statusText}`, response.status)
        if (attempt < API_CONFIG.MAX_RETRIES) {
          await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt) * 1000))
          continue
        }
      } else {
        throw new ApiError(`Client error: ${response.statusText}`, response.status)
      }
    } catch (error) {
      lastError = error as Error

      if (error instanceof TypeError || (error as Error).name === 'TimeoutError') {
        if (attempt < API_CONFIG.MAX_RETRIES) {
          await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt) * 1000))
          continue
        }
      } else {
        throw error
      }
    }
  }

  throw lastError!
}

export async function fetchCryptoPrices(): Promise<CryptoRates> {
  try {
    if (!CRYPTO_API_URL) {
      throw new ValidationError('API URL is not configured')
    }

    const params = new URLSearchParams({
      ids: API_PARAMS.IDS,
      vs_currencies: API_PARAMS.VS_CURRENCIES,
    })

    const url = `${CRYPTO_API_URL}?${params}`

    const response = await fetchWithRetry(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
    })

    const data = await response.json()

    if (!validateCryptoResponse(data)) {
      throw new ValidationError('Invalid response structure from API')
    }

    return data
  } catch (error) {
    logError(error as Error)
    if (error instanceof ApiError) {
      throw error
    } else if (error instanceof NetworkError) {
      throw new NetworkError(ERROR_MESSAGES.NETWORK_ERROR)
    } else if (error instanceof ValidationError) {
      throw new ValidationError(ERROR_MESSAGES.INVALID_RESPONSE)
    } else if (error instanceof TypeError) {
      throw new NetworkError(ERROR_MESSAGES.NETWORK_ERROR)
    } else {
      throw new ApiError(ERROR_MESSAGES.FETCH_RATES_FAILED)
    }
  }
}
