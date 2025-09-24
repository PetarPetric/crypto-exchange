<script setup lang="ts">
import { CURRENCY_SYMBOLS, CURRENCY_NAMES } from '@/types/constants'
import { formatRate } from '@/utils/formatters'

interface Props {
  currency: keyof typeof CURRENCY_NAMES
  price: number
  change?: number
}

const props = defineProps<Props>()

// Get symbol and name from constants
const symbol = CURRENCY_SYMBOLS[props.currency] || props.currency.toUpperCase()
const name = CURRENCY_NAMES[props.currency] || props.currency
</script>

<template>
  <div class="rate-row">
    <div class="rate-row__cell rate-row__cell--currency">
      <span class="rate-row__symbol">{{ symbol }}</span>
      <span class="rate-row__name">{{ name }}</span>
    </div>
    <div class="rate-row__cell rate-row__cell--price">${{ formatRate(price) }}</div>
  </div>
</template>
