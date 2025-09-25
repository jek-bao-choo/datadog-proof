import { ref } from 'vue'

export function useTradingAPI() {
  const isLoading = ref(false)
  const apiError = ref(null)

  // Mock trading API that randomly returns success or failure
  const mockTradeAPI = async (stockData, quantity) => {
    isLoading.value = true
    apiError.value = null

    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Random success/failure (50/50 chance)
      const isSuccess = Math.random() > 0.5

      // Generate transaction ID
      const transactionId = `TXN${Date.now()}`

      const response = {
        transactionId,
        stock: stockData,
        quantity,
        timestamp: new Date().toISOString()
      }

      if (isSuccess) {
        return {
          status: 200,
          success: true,
          message: 'Purchase successful',
          data: response
        }
      } else {
        return {
          status: 400,
          success: false,
          message: 'Transaction failed',
          data: response
        }
      }
    } catch (error) {
      apiError.value = error.message
      return {
        status: 500,
        success: false,
        message: 'Network error occurred',
        data: null
      }
    } finally {
      isLoading.value = false
    }
  }

  const executeTrade = async (selectedStock, quantity) => {
    if (!selectedStock || !quantity || quantity < 100 || quantity > 9000) {
      apiError.value = 'Invalid stock selection or quantity'
      return null
    }

    return await mockTradeAPI(selectedStock, quantity)
  }

  return {
    isLoading,
    apiError,
    mockTradeAPI,
    executeTrade
  }
}