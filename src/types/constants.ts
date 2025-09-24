// api Config
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL,
  ENDPOINTS: {
    PRICE: import.meta.env.VITE_API_PRICE_ENDPOINT,
  },
  TIMEOUT: 10000,
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
} as const

export const CRYPTO_API_URL = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PRICE}`

// currencies
export const CURRENCIES = {
  BTC: 'bitcoin',
  ETH: 'ethereum',
  USDT: 'tether',
  SOL: 'solana',
} as const

// display names
export const CURRENCY_NAMES = {
  bitcoin: 'Bitcoin',
  ethereum: 'Ethereum',
  tether: 'Tether',
  solana: 'Solana',
} as const

// symbols for display
export const CURRENCY_SYMBOLS = {
  bitcoin: 'BTC',
  ethereum: 'ETH',
  tether: 'USDT',
  solana: 'SOL',
}

export const API_PARAMS = {
  VS_CURRENCIES: 'usd',
  IDS: Object.values(CURRENCIES).join(','),
} as const

// app configuration
export const APP_CONFIG = {
  AUTO_REFRESH_INTERVAL: 60000,
  STORAGE_KEYS: {
    EXCHANGE_HISTORY: 'exchangeHistory',
  },
} as const

// error messages
export const ERROR_MESSAGES = {
  FETCH_RATES_FAILED: 'Failed to fetch cryptocurrency rates',
  NETWORK_ERROR: 'Network error occurred. Please check your connection.',
  INVALID_RESPONSE: 'Invalid response from server',
  STORAGE_ERROR: 'Could not access local storage',
  API_UNAVAILABLE: 'Cryptocurrency API is currently unavailable',
  TIMEOUT_ERROR: 'Request timed out. Please try again.',
  RATE_LIMIT_EXCEEDED: 'Rate limit exceeded. Please wait before trying again.',
  INVALID_CURRENCY: 'Invalid currency selected',
  INSUFFICIENT_DATA: 'Insufficient data for calculation',
} as const

export const ErrorNames = {
  API_ERROR: 'ApiError',
  NETWORK_ERROR: 'NetworkError',
  VALIDATION_ERROR: 'ValidationError',
} as const
