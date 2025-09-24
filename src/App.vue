<script setup lang="ts">
// Components
import AppHeader from '@/components/AppHeader.vue'
import RatesTable from '@/components/rates/RatesTable.vue'
import ExchangeForm from '@/components/exchange/ExchangeForm.vue'
import HistoryList from '@/components/history/HistoryList.vue'
// Composables
import { useCryptoCurrenciesStore } from '@/stores/cryptoCurrencies'
import { useExchangeHistory } from './composables/useExchangeHistory'
import BaseCard from './components/shared/BaseCard.vue'
import { onMounted, onUnmounted } from 'vue'

const cryptoStore = useCryptoCurrenciesStore()
const { history, addExchange } = useExchangeHistory()

onMounted(() => {
  cryptoStore.fetchPrices()
  cryptoStore.startPolling()
})

onUnmounted(() => {
  cryptoStore.stopPolling()
})
</script>

<template>
  <div class="app">
    <AppHeader />
    <main class="app__main">
      <div class="app__container">
        <div class="app__exchange-section">
          <section class="app__rates">
            <BaseCard>
              <RatesTable
                :is-loading="cryptoStore.isLoading"
                :prices="cryptoStore.prices"
                :error-message="cryptoStore.errorMessage"
                :last-updated="cryptoStore.lastUpdated"
              />
            </BaseCard>
          </section>
          <section class="app__form">
            <BaseCard>
              <ExchangeForm
                :rates="cryptoStore.prices"
                :is-loading="cryptoStore.isLoading"
                @exchange="addExchange"
              />
            </BaseCard>
          </section>
        </div>
        <section class="app__history">
          <BaseCard>
            <HistoryList :history="history" />
          </BaseCard>
        </section>
      </div>
    </main>
  </div>
</template>

<style scoped lang="scss" src="@/styles/main.scss"></style>
