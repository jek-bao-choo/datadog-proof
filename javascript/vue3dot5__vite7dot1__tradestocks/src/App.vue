<script setup>
import { ref } from 'vue'
import TradingForm from './components/TradingForm.vue'
import ResultPage from './components/ResultPage.vue'
import { useTradingAPI } from './composables/useTradingAPI'
import { useStockData } from './composables/useStockData'

const currentPage = ref('landing')
const tradeResult = ref(null)

const { executeTrade, isLoading } = useTradingAPI()
const { getSelectedStockDetails } = useStockData()

const handleTradeSubmission = async (tradeData) => {
  try {
    // Parse the selected stock string to get stock details
    // tradeData.stock format: "DDOG | NASDAQ.NMS | 136.44"
    const stockParts = tradeData.stock.split(' | ')
    const stockDetails = {
      ticker: stockParts[0],
      exchange: stockParts[1],
      price: parseFloat(stockParts[2])
    }

    // Execute the trade
    const result = await executeTrade(stockDetails, tradeData.quantity)

    if (result) {
      tradeResult.value = result
      currentPage.value = 'results'
    }
  } catch (error) {
    console.error('Trade execution failed:', error)
    tradeResult.value = {
      success: false,
      message: 'An unexpected error occurred',
      data: {
        transactionId: `ERR${Date.now()}`,
        stock: tradeData.stock,
        quantity: tradeData.quantity
      }
    }
    currentPage.value = 'results'
  }
}

const handleBackToHome = () => {
  currentPage.value = 'landing'
  tradeResult.value = null
}
</script>

<template>
  <div id="app">
    <main class="container">
      <h1>💰 Trading Stocks PoC</h1>

      <!-- Landing Page -->
      <div v-if="currentPage === 'landing'" class="page-content">
        <TradingForm @trade-submitted="handleTradeSubmission" />
      </div>

      <!-- Results Page -->
      <div v-else-if="currentPage === 'results'" class="page-content">
        <ResultPage
          :result="tradeResult"
          @back-to-home="handleBackToHome"
        />
      </div>

      <!-- Loading Overlay -->
      <div v-if="isLoading" class="loading-overlay">
        <div class="loading-content">
          <div class="loading loading-large"></div>
          <p class="loading-text">Processing your trade...</p>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
#app {
  min-height: 100vh;
  background: var(--bg-primary);
  position: relative;
}

.container {
  max-width: 100%;
  padding: 1rem;
  text-align: center;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

h1 {
  color: var(--dark-gold);
  font-size: 2rem;
  margin-bottom: 2rem;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.page-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 248, 220, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.loading-content {
  text-align: center;
  padding: 2rem;
  background: var(--bg-card);
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.loading-large {
  width: 40px;
  height: 40px;
  border-width: 4px;
  margin-bottom: 1rem;
}

.loading-text {
  color: var(--text-secondary);
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
}

@media (min-width: 768px) {
  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
  }

  h1 {
    font-size: 2.5rem;
    margin-bottom: 3rem;
  }
}

@media (max-width: 767px) {
  .container {
    padding: 1rem;
  }

  h1 {
    font-size: 1.75rem;
    margin-bottom: 1.5rem;
  }
}
</style>
