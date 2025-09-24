<script setup lang="ts">
import { computed } from 'vue'
import type { CryptoRates } from '@/types/currency'
import RatesRow from './RatesRow.vue'
import { formatTime } from '@/utils/formatters'

interface Props {
  isLoading: boolean
  errorMessage: string | null
  prices: CryptoRates | null
  lastUpdated: Date | null
}

const props = defineProps<Props>()

const formattedTime = computed(() => {
  return props.lastUpdated ? formatTime(props.lastUpdated) : 'Could not get last updated time'
})
</script>

<template>
  <div class="rates">
    <h2 class="rates__title">Current Rates</h2>
    <p>Currency rates automatically update every 60 seconds</p>
    <template v-if="isLoading"> Loading... </template>
    <template v-else-if="errorMessage">{{ errorMessage }}</template>

    <div v-else class="rates__table">
      <div class="rates__header">
        <div class="rates__cell rates__cell--currency">Currency</div>
        <div class="rates__cell rates__cell--price">Price (USD)</div>
      </div>
      <div class="rates__body">
        <RatesRow
          v-for="(data, currency) in prices"
          :key="currency"
          :currency="currency"
          :price="data.usd"
        />
      </div>
    </div>

    <div v-if="lastUpdated" class="rates__footer">Last updated: {{ formattedTime }}</div>
  </div>
</template>

<style lang="scss" src="@/styles/rates.scss"></style>
