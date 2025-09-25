<script setup>
import BackButton from './BackButton.vue'

const props = defineProps({
  result: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['back-to-home'])

const handleBackClick = () => {
  emit('back-to-home')
}

const isSuccess = props.result?.success || false
const transactionId = props.result?.data?.transactionId || ''
const message = props.result?.message || ''
const stockData = props.result?.data?.stock || ''
const quantity = props.result?.data?.quantity || 0
</script>

<template>
  <div class="result-page">
    <div class="result-container card">
      <!-- Success State -->
      <div v-if="isSuccess" class="result-content success-state">
        <div class="status-icon success-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22,4 12,14.01 9,11.01"></polyline>
          </svg>
        </div>

        <h2 class="result-title success-title">Purchase Successful!</h2>

        <div class="transaction-details">
          <p class="transaction-id">
            <strong>Transaction ID:</strong> {{ transactionId }}
          </p>

          <div class="trade-summary">
            <h3>Trade Summary</h3>
            <p><strong>Stock/ETF:</strong> {{ stockData }}</p>
            <p><strong>Quantity:</strong> {{ quantity.toLocaleString() }} shares</p>
          </div>

          <p class="success-message">
            {{ message }}
          </p>
        </div>
      </div>

      <!-- Failure State -->
      <div v-else class="result-content failure-state">
        <div class="status-icon failure-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
        </div>

        <h2 class="result-title failure-title">Transaction Failed</h2>

        <div class="transaction-details">
          <p class="transaction-id">
            <strong>Transaction ID:</strong> {{ transactionId }}
          </p>

          <div class="trade-summary">
            <h3>Attempted Trade</h3>
            <p><strong>Stock/ETF:</strong> {{ stockData }}</p>
            <p><strong>Quantity:</strong> {{ quantity.toLocaleString() }} shares</p>
          </div>

          <p class="failure-message">
            {{ message }}
          </p>

          <p class="retry-text">
            Please try again or contact support if the issue persists.
          </p>
        </div>
      </div>

      <!-- Back Button -->
      <div class="action-container mt-4">
        <BackButton @back-clicked="handleBackClick" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.result-page {
  max-width: 500px;
  margin: 0 auto;
}

.result-container {
  text-align: center;
}

.result-content {
  padding: 1rem 0;
}

.status-icon {
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.success-icon {
  color: var(--success-green);
}

.failure-icon {
  color: var(--error-red);
}

.result-title {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  font-weight: 700;
}

.success-title {
  color: var(--success-green);
}

.failure-title {
  color: var(--error-red);
}

.transaction-details {
  text-align: left;
  max-width: 400px;
  margin: 0 auto;
}

.transaction-id {
  background: rgba(255, 215, 0, 0.1);
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid var(--gold-accent);
  margin-bottom: 1.5rem;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  color: var(--text-primary);
}

.trade-summary {
  background: var(--light-gold);
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  border: 1px solid rgba(218, 165, 32, 0.3);
}

.trade-summary h3 {
  margin: 0 0 0.5rem 0;
  color: var(--dark-gold);
  font-size: 1rem;
}

.trade-summary p {
  margin: 0.25rem 0;
  color: var(--text-secondary);
}

.success-message {
  color: var(--success-green);
  font-weight: 600;
  text-align: center;
  font-size: 1.1rem;
}

.failure-message {
  color: var(--error-red);
  font-weight: 600;
  text-align: center;
  font-size: 1.1rem;
}

.retry-text {
  color: var(--text-muted);
  font-style: italic;
  text-align: center;
  margin-top: 1rem;
}

.action-container {
  display: flex;
  justify-content: center;
  padding-top: 1rem;
  border-top: 1px solid rgba(218, 165, 32, 0.2);
}

@media (max-width: 767px) {
  .result-title {
    font-size: 1.5rem;
  }

  .transaction-details {
    max-width: 100%;
  }

  .status-icon svg {
    width: 48px;
    height: 48px;
  }
}
</style>