import { ref, computed } from 'vue'

// Stock options data as specified in requirements
const stockOptions = [
  { ticker: 'DDOG', exchange: 'NASDAQ.NMS', price: 136.44 },
  { ticker: 'GOOG', exchange: 'NASDAQ.NMS', price: 248.50 },
  { ticker: 'MSFT', exchange: 'NASDAQ.NMS', price: 510.63 },
  { ticker: 'META', exchange: 'NASDAQ.NMS', price: 761.80 },
  { ticker: 'CSPX', exchange: 'LSEETF', price: 710.60 },
  { ticker: 'VUAA', exchange: 'LSEETF', price: 127.44 },
  { ticker: 'VWRA', exchange: 'LSEETF', price: 163.54 },
  { ticker: 'FWRA', exchange: 'LSEETF', price: 8.05 },
  { ticker: 'AGED', exchange: 'LSEETF', price: 33.10 }
]

export function useStockData() {
  const selectedStock = ref('')

  // Computed property for formatted options display
  const formattedStockOptions = computed(() => {
    return stockOptions.map(stock => ({
      ...stock,
      displayText: `${stock.ticker} | ${stock.exchange} | ${stock.price}`
    }))
  })

  // Helper to get selected stock details
  const getSelectedStockDetails = computed(() => {
    if (!selectedStock.value) return null
    return stockOptions.find(stock =>
      `${stock.ticker} | ${stock.exchange} | ${stock.price}` === selectedStock.value
    )
  })

  return {
    stockOptions,
    formattedStockOptions,
    selectedStock,
    getSelectedStockDetails
  }
}