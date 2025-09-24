<script setup lang="ts">
import { computed } from 'vue'
import { formatTime, formatRate } from '@/utils/formatters'
import type { ExchangeRecord } from '@/composables/useExchangeHistory'

const props = defineProps<ExchangeRecord>()

const formattedTimestamp = computed(() => {
  const date = new Date(props.timestamp)
  return formatTime(date)
})
</script>
<template>
  <div class="history-item">
    <div class="history-item__main">
      <div class="history-item__currencies">
        <span class="history-item__from"
          >{{ formatRate(props.fromAmount) }} {{ props.fromCurrency }}</span
        >
        <span class="history-item__arrow">→</span>
        <span class="history-item__to"
          >{{ formatRate(props.toAmount) }} {{ props.toCurrency }}</span
        >
      </div>
      <div class="history-item__rate">
        1 {{ props.fromCurrency }} = {{ props.rate }} {{ props.toCurrency }}
      </div>
    </div>
    <div class="history-item__meta">
      <span class="history-item__timestamp">{{ formattedTimestamp }}</span>
    </div>
  </div>
</template>

<style lang="scss" scoped src="@/styles/history.scss"></style>
