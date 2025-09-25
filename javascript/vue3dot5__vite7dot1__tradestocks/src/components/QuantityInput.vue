<script setup>
import { computed } from 'vue'

const props = defineProps({
  value: {
    type: Number,
    default: 100
  }
})

const emit = defineEmits(['quantity-changed'])

const isValid = computed(() => {
  return props.value >= 100 && props.value <= 9000
})

const errorMessage = computed(() => {
  if (props.value < 100) return 'Minimum quantity is 100'
  if (props.value > 9000) return 'Maximum quantity is 9000'
  return ''
})

const handleInput = (event) => {
  const value = parseInt(event.target.value) || 0
  emit('quantity-changed', value)
}
</script>

<template>
  <div class="quantity-input">
    <input
      type="number"
      :value="value"
      min="100"
      max="9000"
      step="1"
      placeholder="Enter quantity (100-9000)"
      @input="handleInput"
      class="quantity-field"
      :class="{ 'error-state': !isValid && value > 0 }"
    />

    <div class="validation-feedback">
      <p v-if="!isValid && value > 0" class="error-text">
        {{ errorMessage }}
      </p>
      <p v-else-if="isValid" class="success-text">
        ✓ Valid quantity
      </p>
      <p v-else class="help-text">
        Enter a quantity between 100 and 9000
      </p>
    </div>
  </div>
</template>

<style scoped>
.quantity-input {
  position: relative;
}

.quantity-field {
  font-size: 1rem;
  text-align: center;
}

.quantity-field.error-state {
  border-color: var(--error-red);
  box-shadow: 0 0 0 3px rgba(244, 67, 54, 0.2);
}

.quantity-field:focus {
  border-color: var(--primary-gold);
  box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.2);
}

.validation-feedback {
  margin-top: 0.5rem;
  min-height: 1.2rem;
}

.error-text {
  color: var(--error-red);
  font-size: 0.875rem;
  margin: 0;
}

.success-text {
  color: var(--success-green);
  font-size: 0.875rem;
  margin: 0;
}

.help-text {
  color: var(--text-muted);
  font-size: 0.875rem;
  margin: 0;
}

/* Remove spinner arrows on WebKit browsers */
.quantity-field::-webkit-outer-spin-button,
.quantity-field::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Remove spinner arrows on Firefox */
.quantity-field[type=number] {
  -moz-appearance: textfield;
}

@media (max-width: 767px) {
  .quantity-field {
    font-size: 1rem;
    padding: 1rem 0.75rem;
  }
}
</style>