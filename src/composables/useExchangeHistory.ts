import { ref, computed } from 'vue'
import { APP_CONFIG } from '@/types/constants'

export interface ExchangeRecord {
  id: string
  fromCurrency: string
  toCurrency: string
  fromAmount: number
  toAmount: number
  rate: number
  timestamp: Date
}

export function useExchangeHistory() {
  const history = ref<ExchangeRecord[]>([])

  // load history from localStorage
  const loadHistory = () => {
    try {
      const stored = localStorage.getItem(APP_CONFIG.STORAGE_KEYS.EXCHANGE_HISTORY)
      if (stored) {
        const parsed = JSON.parse(stored)

        history.value = parsed.map((record: ExchangeRecord) => ({
          ...record,
          timestamp: new Date(record.timestamp),
        }))
      }
    } catch (error) {
      console.error('Failed to load exchange history:', error)
      history.value = []
    }
  }

  const saveHistory = () => {
    try {
      // I was thinking about encrypting this but it would be just security by obscurity
      localStorage.setItem(APP_CONFIG.STORAGE_KEYS.EXCHANGE_HISTORY, JSON.stringify(history.value))
    } catch (error) {
      console.error('Failed to save exchange history:', error)
    }
  }

  const addExchange = (exchange: Omit<ExchangeRecord, 'id' | 'timestamp'>) => {
    const newRecord: ExchangeRecord = {
      ...exchange,
      id: Date.now().toString(36) + Math.random().toString(36).substring(2),
      timestamp: new Date(),
    }

    history.value.unshift(newRecord)

    // keep only last 50 records
    if (history.value.length > 50) {
      history.value = history.value.slice(0, 50)
    }

    saveHistory()
  }

  const hasHistory = computed(() => history.value.length > 0)
  const historyCount = computed(() => history.value.length)

  loadHistory()

  return {
    history,
    hasHistory,
    historyCount,
    addExchange,
    loadHistory,
  }
}
