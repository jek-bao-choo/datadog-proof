<script setup>
import { ref } from 'vue'
import StockDropdown from './StockDropdown.vue'
import QuantityInput from './QuantityInput.vue'
import BuyButton from './BuyButton.vue'

const emit = defineEmits(['trade-submitted'])

const selectedStock = ref('')
const quantity = ref(100)

const handleStockSelect = (stock) => {
  selectedStock.value = stock
}

const handleQuantityChange = (value) => {
  quantity.value = value
}

const handleTrade = () => {
  if (selectedStock.value && quantity.value >= 100 && quantity.value <= 9000) {
    emit('trade-submitted', {
      stock: selectedStock.value,
      quantity: quantity.value
    })
  }
}
</script>

<template>
  <div class="trading-form">
    <div class="form-container card">
      <h2 class="form-title mb-4">Buy Stocks & ETFs</h2>

      <div class="form-field mb-3">
        <label class="field-label mb-2">Select Stock or ETF</label>
        <StockDropdown
          :selected="selectedStock"
          @stock-selected="handleStockSelect"
        />
        <p class="price-update-text mt-1">prices last updated on 25 Sep 2025</p>
      </div>

      <div class="form-field mb-4">
        <label class="field-label mb-2">Quantity</label>
        <QuantityInput
          :value="quantity"
          @quantity-changed="handleQuantityChange"
        />
      </div>

      <BuyButton
        :disabled="!selectedStock || quantity < 100 || quantity > 9000"
        @buy-clicked="handleTrade"
      />
    </div>
  </div>
</template>

<style scoped>
.trading-form {
  max-width: 500px;
  margin: 0 auto;
}

.form-container {
  text-align: left;
}

.form-title {
  text-align: center;
  color: var(--dark-gold);
  font-size: 1.8rem;
}

.form-field {
  display: flex;
  flex-direction: column;
}

.field-label {
  font-weight: 600;
  color: var(--text-secondary);
  font-size: 1rem;
  display: block;
}

.price-update-text {
  font-size: 0.875rem;
  color: var(--text-muted);
  font-style: italic;
  margin: 0;
}

@media (max-width: 767px) {
  .trading-form {
    max-width: 100%;
  }

  .form-title {
    font-size: 1.5rem;
  }
}
</style>