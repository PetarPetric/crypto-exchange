<script lang="ts" setup>
import { type ExchangeRecord } from '@/composables/useExchangeHistory'
import HistoryItem from './HistoryItem.vue'

interface Props {
  history: ExchangeRecord[]
}

defineProps<Props>()
</script>

<template>
  <h2>Exchange History</h2>
  <HistoryItem v-for="item in history" v-bind="item" :key="item.id" />
</template>
