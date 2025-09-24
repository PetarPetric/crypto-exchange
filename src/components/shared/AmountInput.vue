<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { formatInputPrice } from '@/utils/formatters'
import Decimal from 'decimal.js'

interface Props {
  modelValue: number
  label?: string
  currency?: string
  disabled?: boolean
  min?: number
  max?: number
  decimals?: number
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  min: 0,
  max: Number.MAX_SAFE_INTEGER,
  decimals: 8,
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
  keyup: []
}>()

// State
const inputId = `amount-input-${Math.random().toString(36).slice(2, 11)}`
const inputRef = ref<HTMLInputElement>()
const inputValue = ref('')
const errorMessage = ref('')

const hasError = computed(() => Boolean(errorMessage.value))

watch(
  () => props.modelValue,
  (newValue) => {
    // only update if user is not actively typing
    if (document.activeElement !== inputRef.value) {
      if (newValue === 0) {
        inputValue.value = ''
      } else {
        inputValue.value = formatInputPrice(newValue)
      }
    }
  },
  { immediate: true },
)

const handleInput = (event: Event) => {
  const input = event.target as HTMLInputElement
  let value = input.value

  // remove non-numeric except decimal
  value = value.replace(/[^\d.]/g, '')

  // only one decimal point
  const parts = value.split('.')
  if (parts.length > 2) {
    value = parts[0] + '.' + parts.slice(1).join('')
  }

  // limit decimals
  if (parts.length === 2 && parts[1].length > props.decimals) {
    value = parts[0] + '.' + parts[1].slice(0, props.decimals)
  }

  inputValue.value = value
}

// convert to number and emit
const handleKeyup = () => {
  errorMessage.value = ''

  // Empty or just decimal point
  if (!inputValue.value || inputValue.value === '.') {
    emit('update:modelValue', 0)
    emit('keyup')
    return
  }

  const decimal = new Decimal(inputValue.value)
  const numValue = decimal.toNumber()

  // validate if not zero
  if (!decimal.isZero()) {
    const minDecimal = new Decimal(props.min)
    const maxDecimal = new Decimal(props.max)

    if (decimal.lt(minDecimal)) {
      errorMessage.value = `Minimum amount is ${props.min}`
    } else if (decimal.gt(maxDecimal)) {
      errorMessage.value = `Maximum amount is ${props.max}`
    }
  }

  // awlays emit the number
  emit('update:modelValue', numValue)
  emit('keyup')
}
</script>

<template>
  <div class="amount-input" :class="{ 'amount-input--error': hasError }">
    <label v-if="label" :for="inputId" class="amount-input__label">
      {{ label }}
    </label>

    <div class="amount-input__wrapper">
      <input
        :id="inputId"
        ref="inputRef"
        type="text"
        inputmode="decimal"
        class="amount-input__field"
        v-model="inputValue"
        :disabled="disabled"
        @input="handleInput"
        @keyup="handleKeyup"
        autocomplete="off"
        spellcheck="false"
        placeholder="0.00"
      />

      <span v-if="currency" class="amount-input__currency">
        {{ currency }}
      </span>
    </div>

    <span v-if="errorMessage" class="amount-input__error-message">
      {{ errorMessage }}
    </span>
  </div>
</template>

<style scoped lang="scss" src="@/styles/input.scss"></style>
