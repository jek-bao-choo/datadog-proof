<script setup>
import { useStockData } from '../composables/useStockData'

const props = defineProps({
  selected: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['stock-selected'])

const { formattedStockOptions } = useStockData()

const handleSelection = (event) => {
  emit('stock-selected', event.target.value)
}
</script>

<template>
  <div class="stock-dropdown">
    <select
      :value="selected"
      @change="handleSelection"
      class="stock-select"
    >
      <option value="" disabled>Choose a stock or ETF</option>
      <option
        v-for="stock in formattedStockOptions"
        :key="stock.ticker"
        :value="stock.displayText"
      >
        {{ stock.displayText }}
      </option>
    </select>
  </div>
</template>

<style scoped>
.stock-dropdown {
  position: relative;
}

.stock-select {
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23B8860B' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1rem;
  padding-right: 3rem;
  cursor: pointer;
}

.stock-select:focus {
  border-color: var(--primary-gold);
}

.stock-select option {
  padding: 0.5rem;
  background: var(--bg-input);
  color: var(--text-primary);
}

.stock-select option:hover,
.stock-select option:checked {
  background: var(--light-gold);
  color: var(--text-primary);
}

@media (max-width: 767px) {
  .stock-select {
    font-size: 0.9rem;
    padding-right: 2.5rem;
    background-size: 0.9rem;
  }
}
</style>