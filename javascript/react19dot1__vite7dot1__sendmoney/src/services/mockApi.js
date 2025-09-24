// Mock API service for send money functionality
// Simulates real API calls with random success/failure responses

/**
 * Generates a random transaction ID
 * @returns {string} 8-character uppercase transaction ID
 */
const generateTransactionId = () => {
  return Math.random().toString(36).substring(2, 10).toUpperCase()
}

/**
 * Simulates API delay
 * @param {number} ms - Delay in milliseconds
 * @returns {Promise} Promise that resolves after specified delay
 */
const delay = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Mock send money API call
 * @param {string} phone - Phone number (8 digits)
 * @param {string} amount - Amount to send (1-4 digits)
 * @returns {Promise<Object>} Promise resolving to transaction result
 */
export const mockSendMoney = async (phone, amount) => {
  console.log('MockAPI: Sending money request', { phone, amount })

  // Simulate API processing delay (1.5 seconds)
  await delay(1500)

  // Generate transaction ID for both success and failure
  const transactionId = generateTransactionId()

  // Random success/failure (50/50 chance)
  const isSuccess = Math.random() > 0.5

  console.log('MockAPI: Transaction result', { isSuccess, transactionId })

  if (isSuccess) {
    return {
      status: 200,
      transactionId,
      message: 'Success',
      data: {
        phone,
        amount: parseInt(amount),
        timestamp: new Date().toISOString()
      }
    }
  } else {
    // Return various 4XX error codes for realism
    const errorCodes = [400, 402, 404, 429]
    const errorMessages = [
      'Bad Request - Invalid transaction data',
      'Payment Required - Insufficient funds',
      'Not Found - Recipient not found',
      'Too Many Requests - Please try again later'
    ]

    const errorIndex = Math.floor(Math.random() * errorCodes.length)

    return {
      status: errorCodes[errorIndex],
      transactionId,
      message: 'Failed',
      error: errorMessages[errorIndex],
      data: {
        phone,
        amount: parseInt(amount),
        timestamp: new Date().toISOString()
      }
    }
  }
}

/**
 * Mock API health check
 * @returns {Promise<Object>} API status
 */
export const mockHealthCheck = async () => {
  await delay(100)

  return {
    status: 200,
    message: 'API is healthy',
    timestamp: new Date().toISOString()
  }
}

// Export default for convenience
export default {
  mockSendMoney,
  mockHealthCheck
}