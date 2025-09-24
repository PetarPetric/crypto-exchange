import { ApiError, NetworkError, ValidationError } from '@/services/errorService'
import { ERROR_MESSAGES } from '@/types/constants'

export function formatError(context: string, error: unknown): string {
  if (error instanceof ApiError) {
    return `${context}: ${error.message} (Status: ${error.status})`
  }
  if (error instanceof NetworkError) {
    return `${context}: ${error.message}`
  }
  return `${context}: ${ERROR_MESSAGES.INVALID_RESPONSE}`
}

// Get Error for UI display
export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return error.status
      ? `${ERROR_MESSAGES.FETCH_RATES_FAILED} (HTTP ${error.status})`
      : ERROR_MESSAGES.FETCH_RATES_FAILED
  } else if (error instanceof NetworkError) {
    return ERROR_MESSAGES.NETWORK_ERROR
  } else if (error instanceof ValidationError) {
    return ERROR_MESSAGES.INVALID_RESPONSE
  } else {
    return ERROR_MESSAGES.FETCH_RATES_FAILED
  }
}

export function logError(error: Error) {
  // Log errors only in development, for prod should use logger
  if (import.meta.env.MODE !== 'production') {
    console.error(error.name, error.message)
  }
}
