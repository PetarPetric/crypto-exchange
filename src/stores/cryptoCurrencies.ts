import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchCryptoPrices } from '@/services/apiService'
import { APP_CONFIG } from '@/types/constants'
import type { CryptoRates } from '@/types/currency'

export const useCryptoCurrenciesStore = defineStore('cryptoCurrencies', () => {
  const prices = ref<CryptoRates | null>(null)
  const isLoading = ref(false)
  const errorMessage = ref<string | null>(null)
  const lastUpdated = ref<Date | null>(null)
  const isPolling = ref(false)

  // polling interval reference (not reactive, internal use only)
  let pollingInterval: ReturnType<typeof setInterval> | null = null

  const fetchPrices = async (showLoader = true) => {
    if (showLoader) {
      isLoading.value = true
    }
    errorMessage.value = null

    try {
      const data = await fetchCryptoPrices()
      prices.value = data
      lastUpdated.value = new Date()
    } catch (err) {
      errorMessage.value = err instanceof Error ? err.message : 'Failed to fetch prices'
    } finally {
      isLoading.value = false
    }
  }

  const startPolling = () => {
    if (pollingInterval) {
      clearInterval(pollingInterval)
    }

    isPolling.value = true

    // coingecko free API updates every 60 seconds
    pollingInterval = setInterval(() => {
      fetchPrices(false) // no loader when polling
    }, APP_CONFIG.AUTO_REFRESH_INTERVAL || 60000)
  }

  const stopPolling = () => {
    if (pollingInterval) {
      clearInterval(pollingInterval)
      pollingInterval = null
    }
    isPolling.value = false
  }

  return {
    prices,
    isLoading,
    errorMessage,
    lastUpdated,
    isPolling,
    fetchPrices,
    startPolling,
    stopPolling,
  }
})
