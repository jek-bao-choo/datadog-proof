import { useState } from 'react'
import './App.css'
import SendMoneyForm from './components/SendMoneyForm'
import ResultPage from './components/ResultPage'
import { mockSendMoney } from './services/mockApi'
import { datadogRum } from './datadog-rum'

function App() {
  // App state management
  const [currentPage, setCurrentPage] = useState('landing') // landing, success, failure
  const [transactionData, setTransactionData] = useState({
    id: '',
    status: '',
    message: ''
  })

  // Handle form submission
  const handleSendMoney = async (phone, amount) => {
    try {
      console.log('App: Processing send money request', { phone, amount })

      // Call mock API
      const result = await mockSendMoney(phone, amount)

      console.log('App: Received API result', result)

      // Update transaction data
      setTransactionData({
        id: result.transactionId,
        status: result.status,
        message: result.message
      })

      // Stop operation based on result
      if (result.status === 200) {
        // Transaction succeeded
        datadogRum.succeedFeatureOperation('send-money-transaction', {
          operationKey: 'send-money-transaction-main',
          context: {
            transactionId: result.transactionId,
            amount: amount,
            phone: phone,
            endTime: new Date().toISOString()
          },
          description: 'Transaction completed successfully'
        })
        console.log('Operation succeeded: send-money-transaction')
      } else {
        // Transaction failed
        datadogRum.failFeatureOperation('send-money-transaction', 'error', {
          operationKey: 'send-money-transaction-main',
          context: {
            transactionId: result.transactionId,
            errorMessage: result.message,
            amount: amount,
            phone: phone,
            endTime: new Date().toISOString()
          },
          description: 'Transaction failed'
        })
        console.log('Operation failed: send-money-transaction')
      }

      // Navigate to appropriate result page
      setCurrentPage(result.status === 200 ? 'success' : 'failure')

    } catch (error) {
      console.error('App: Error processing transaction', error)

      // Stop operation with error
      datadogRum.failFeatureOperation('send-money-transaction', 'error', {
        operationKey: 'send-money-transaction-main',
        context: {
          errorType: 'system-error',
          errorMessage: error.message || 'Unknown error',
          endTime: new Date().toISOString()
        },
        description: 'Transaction failed due to system error'
      })
      console.log('Operation failed (system error): send-money-transaction')

      // Handle unexpected errors
      setTransactionData({
        id: 'ERROR-' + Date.now(),
        status: 500,
        message: 'System Error'
      })

      setCurrentPage('failure')
    }
  }

  // Return to home
  const returnToHome = () => {
    setCurrentPage('landing')
    setTransactionData({ id: '', status: '', message: '' })
  }

  // Error boundary for development
  const handleError = (error) => {
    console.error('App Error:', error)
    setCurrentPage('landing')
  }

  return (
    <div className="app">
      <div className="app-container">
        {currentPage === 'landing' && (
          <div className="page">
            <div className="landing-header">
              <h1>Send Money</h1>
              <p>Send money quickly and securely</p>
            </div>
            <SendMoneyForm onSubmit={handleSendMoney} />
          </div>
        )}

        {(currentPage === 'success' || currentPage === 'failure') && (
          <ResultPage
            status={transactionData.status}
            transactionId={transactionData.id}
            message={transactionData.message}
            onReturnHome={returnToHome}
          />
        )}
      </div>
    </div>
  )
}

export default App
