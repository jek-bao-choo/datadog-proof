<script setup>
import { ref } from 'vue'
import { useTradingAPI } from '../composables/useTradingAPI'

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['buy-clicked'])

const { isLoading } = useTradingAPI()
const buttonText = ref('Buy Stocks / ETFs')

const handleClick = () => {
  if (!props.disabled) {
    emit('buy-clicked')
  }
}
</script>

<template>
  <div class="buy-button-container">
    <button
      class="buy-button"
      :disabled="disabled || isLoading"
      @click="handleClick"
      type="button"
    >
      <span v-if="isLoading" class="loading-content">
        <span class="loading"></span>
        Processing...
      </span>
      <span v-else>{{ buttonText }}</span>
    </button>

    <p v-if="disabled && !isLoading" class="button-help">
      Please select a stock and enter a valid quantity (100-9000)
    </p>
  </div>
</template>

<style scoped>
.buy-button-container {
  text-align: center;
}

.buy-button {
  width: 100%;
  min-height: 48px;
  font-size: 1.1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: linear-gradient(135deg, var(--primary-gold) 0%, var(--gold-accent) 100%);
  border: 2px solid var(--dark-gold);
  color: var(--text-primary);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.buy-button:hover:not(:disabled) {
  background: linear-gradient(135deg, var(--gold-accent) 0%, var(--dark-gold) 100%);
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
}

.buy-button:active:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
}

.buy-button:disabled {
  background: #ccc;
  border-color: #999;
  color: #666;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.loading-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.loading {
  width: 18px;
  height: 18px;
  border-width: 2px;
}

.button-help {
  margin-top: 0.5rem;
  color: var(--text-muted);
  font-size: 0.875rem;
  font-style: italic;
}

@media (min-width: 768px) {
  .buy-button {
    max-width: 300px;
    margin: 0 auto;
  }
}

@media (max-width: 767px) {
  .buy-button {
    min-height: 52px;
    font-size: 1rem;
  }
}
</style>