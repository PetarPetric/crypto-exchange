<script setup lang="ts">
import { CURRENCIES, CURRENCY_SYMBOLS } from '@/types/constants'

interface Props {
  modelValue: string
  label?: string
  disabled?: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const selectId = `currency-select-${Math.random()}`

const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <div class="currency-select">
    <label v-if="label" :for="selectId" class="currency-select__label">
      {{ label }}
    </label>

    <div class="currency-select__wrapper">
      <select
        :id="selectId"
        :value="modelValue"
        @change="handleChange"
        :disabled="disabled"
        class="currency-select__field"
      >
        <option v-for="symbol in CURRENCY_SYMBOLS" :key="symbol" :value="symbol">
          {{ symbol }} - {{ CURRENCIES[symbol as keyof typeof CURRENCIES] }}
        </option>
      </select>

      <svg class="currency-select__icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path
          d="M5 7.5L10 12.5L15 7.5"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>
  </div>
</template>

<style scoped lang="scss" src="@/styles/currency-selector.scss"></style>
