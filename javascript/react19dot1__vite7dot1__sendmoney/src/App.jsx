import { useState } from 'react'
import './App.css'
import SendMoneyForm from './components/SendMoneyForm'
import ResultPage from './components/ResultPage'
import { mockSendMoney } from './services/mockApi'

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

      // Navigate to appropriate result page
      setCurrentPage(result.status === 200 ? 'success' : 'failure')

    } catch (error) {
      console.error('App: Error processing transaction', error)

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
