import { ErrorNames } from '@/types/constants'
// error classes for better error handling
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string,
  ) {
    super(message)
    this.name = ErrorNames.API_ERROR
  }
}

export class NetworkError extends Error {
  constructor(message: string) {
    super(message)
    this.name = ErrorNames.NETWORK_ERROR
  }
}

export class ValidationError extends Error {
  constructor(
    message: string,
    public missingCurrencies?: string[],
  ) {
    super(message)
    this.name = ErrorNames.VALIDATION_ERROR
  }
}
