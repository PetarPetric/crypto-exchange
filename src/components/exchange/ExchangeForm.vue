<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { CURRENCIES } from '@/types/constants'
import { formatInputPrice } from '@/utils/formatters'
import type { CryptoRates } from '@/types/currency'
import { fetchCryptoPrices } from '@/services/apiService'
import CurrencySelector from '@/components/shared/CurrencySelector.vue'
import AmountInput from '@/components/shared/AmountInput.vue'
import Decimal from 'decimal.js'
import { logError } from '@/utils/errorHandling'

interface Props {
  rates: CryptoRates | null
  isLoading?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  exchange: [
    data: {
      fromCurrency: keyof typeof CURRENCIES
      toCurrency: keyof typeof CURRENCIES
      fromAmount: number
      toAmount: number
      rate: number
    },
  ]
}>()

// Form state
const fromCurrency = ref<keyof typeof CURRENCIES>('BTC')
const toCurrency = ref<keyof typeof CURRENCIES>('ETH')
const fromAmount = ref(0)
const toAmount = ref(0)
const error = ref('')
const isVerifying = ref(false)
const priceChanged = ref(false)

const exchangeRate = computed(() => {
  if (
    !props.rates?.[CURRENCIES[fromCurrency.value]] ||
    !props.rates?.[CURRENCIES[toCurrency.value]]
  ) {
    return null
  }

  const fromPrice = props.rates[CURRENCIES[fromCurrency.value]].usd
  const toPrice = props.rates[CURRENCIES[toCurrency.value]].usd

  return new Decimal(fromPrice).div(toPrice).toNumber()
})

const isValid = computed(() => {
  return (
    fromAmount.value > 0 && fromCurrency.value !== toCurrency.value && exchangeRate.value !== null
  )
})

const calculateExchange = () => {
  priceChanged.value = false
  error.value = ''

  if (!exchangeRate.value || fromAmount.value <= 0) {
    toAmount.value = 0
    return
  }

  const amount = new Decimal(fromAmount.value)
  const rate = new Decimal(exchangeRate.value)
  toAmount.value = amount.mul(rate).toNumber()
}

const handleSubmit = async () => {
  if (!isValid.value) return

  try {
    isVerifying.value = true
    error.value = ''
    priceChanged.value = false

    // get current prices from props
    const currentFromPrice = props.rates![CURRENCIES[fromCurrency.value]].usd
    const currentToPrice = props.rates![CURRENCIES[toCurrency.value]].usd

    // get latest prices
    const latestRates = await fetchCryptoPrices()
    const latestFromPrice = latestRates[CURRENCIES[fromCurrency.value]].usd
    const latestToPrice = latestRates[CURRENCIES[toCurrency.value]].usd

    // check if price changed
    if (currentFromPrice !== latestFromPrice || currentToPrice !== latestToPrice) {
      priceChanged.value = true
      error.value = 'Price has changed! Please review the new rate and try again.'
      return
    }

    // prices are same, proceed with exchange
    emit('exchange', {
      fromCurrency: fromCurrency.value,
      toCurrency: toCurrency.value,
      fromAmount: fromAmount.value,
      toAmount: toAmount.value,
      rate: exchangeRate.value!,
    })

    // reset form
    fromAmount.value = 0
    toAmount.value = 0
    priceChanged.value = false
  } catch (err) {
    logError(err as Error)
    error.value = 'Failed to verify prices. Please try again.'
  } finally {
    isVerifying.value = false
  }
}

// watch for changes
watch([fromCurrency, toCurrency], () => {
  priceChanged.value = false
  if (fromAmount.value > 0) {
    calculateExchange()
  }
})

watch(
  () => props.rates,
  () => {
    if (fromAmount.value > 0) {
      calculateExchange()
    }
  },
  { deep: true },
)
</script>

<template>
  <div class="exchange-form">
    <h2 class="exchange-form__title">Exchange</h2>

    <form @submit.prevent="handleSubmit" class="exchange-form__form">
      <div class="exchange-form__group">
        <CurrencySelector
          v-model="fromCurrency"
          label="From"
          :disabled="isLoading || isVerifying"
          :rates="rates"
        />

        <AmountInput
          v-model="fromAmount"
          label="Amount"
          :currency="fromCurrency"
          :min="0.00000001"
          :disabled="isLoading || isVerifying"
          @keyup="calculateExchange"
        />
      </div>

      <div class="exchange-form__group">
        <CurrencySelector
          v-model="toCurrency"
          label="To"
          :disabled="isLoading || isVerifying"
          :rates="rates"
        />

        <AmountInput
          v-model="toAmount"
          label="You'll receive"
          :currency="toCurrency"
          :disabled="true"
        />
      </div>

      <div v-if="exchangeRate" class="exchange-form__rate">
        <span class="exchange-form__rate-label">Exchange Rate:</span>
        <span class="exchange-form__rate-value">
          1 {{ fromCurrency }} = {{ formatInputPrice(exchangeRate) }} {{ toCurrency }}
        </span>
      </div>

      <div v-if="priceChanged" class="exchange-form__warning">
        ⚠️ Rate updated! Please review the new amount above.
      </div>

      <div v-if="error" class="exchange-form__error">
        {{ error }}
      </div>

      <button
        type="submit"
        class="exchange-form__submit"
        :disabled="!isValid || isLoading || isVerifying"
      >
        <span v-if="isVerifying">Verifying prices...</span>
        <span v-else>{{ isLoading ? 'Loading...' : 'Exchange' }}</span>
      </button>
    </form>
  </div>
</template>

<style scoped lang="scss" src="@styles/exchange-form.scss"></style>
