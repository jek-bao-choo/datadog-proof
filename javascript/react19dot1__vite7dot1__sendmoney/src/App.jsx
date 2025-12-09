import { useState, useEffect } from 'react'
import './App.css'
import SendMoneyForm from './components/SendMoneyForm'
import ResultPage from './components/ResultPage'
import PayeesList from './components/PayeesList'
import AddPayeeModal from './components/AddPayeeModal'
import { mockSendMoney } from './services/mockApi'
import { datadogRum } from './datadog-rum'
// Datadog Feature Flags: Import custom hook to check feature flags
import { useFeatureFlag } from './hooks/useFeatureFlag'

function App() {
  // App state management
  const [currentPage, setCurrentPage] = useState('landing') // landing, success, failure
  const [transactionData, setTransactionData] = useState({
    id: '',
    status: '',
    message: ''
  })

  // Payees state
  const [payees, setPayees] = useState([])
  const [showAddPayeeModal, setShowAddPayeeModal] = useState(false)
  const [selectedPayee, setSelectedPayee] = useState(null)

  // Datadog Feature Flags: Check if Payee feature is enabled
  // Default is false (feature hidden) if flag cannot be checked
  const { isEnabled: isPayeeFeatureEnabled, isLoading: isPayeeFlagLoading } = useFeatureFlag('enable-payee-feature', false)

  // Load payees from localStorage on mount
  useEffect(() => {
    const savedPayees = localStorage.getItem('payees')
    if (savedPayees) {
      try {
        setPayees(JSON.parse(savedPayees))
      } catch (error) {
        console.error('Error loading payees:', error)
      }
    }
  }, [])

  // Save payees to localStorage whenever they change
  useEffect(() => {
    if (payees.length >= 0) {
      localStorage.setItem('payees', JSON.stringify(payees))
    }
  }, [payees])

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
    setSelectedPayee(null) // Clear selected payee
  }

  // Payees handlers
  const handleAddPayee = () => {
    setShowAddPayeeModal(true)
  }

  const handleSavePayee = (newPayee) => {
    setPayees(prev => [...prev, newPayee])
    setShowAddPayeeModal(false)
  }

  const handleCancelAddPayee = () => {
    setShowAddPayeeModal(false)
  }

  const handleSelectPayee = (payee) => {
    setSelectedPayee(payee)
  }

  const handleDeletePayee = (payeeId) => {
    // Remove payee from the list
    setPayees(prev => prev.filter(payee => payee.id !== payeeId))
    // Clear selected payee if it was the one deleted
    if (selectedPayee && selectedPayee.id === payeeId) {
      setSelectedPayee(null)
    }
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
            <SendMoneyForm
              onSubmit={handleSendMoney}
              selectedPayee={selectedPayee}
            />
            {/* Datadog Feature Flags: Show loading state while checking flag */}
            {isPayeeFlagLoading && (
              <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
                Loading features...
              </div>
            )}
            {/* Datadog Feature Flags: Only show Payee section if flag is enabled */}
            {isPayeeFeatureEnabled && (
              <PayeesList
                payees={payees}
                onAddPayee={handleAddPayee}
                onSelectPayee={handleSelectPayee}
                onDeletePayee={handleDeletePayee}
              />
            )}
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

        {/* Add Payee Modal */}
        {showAddPayeeModal && (
          <AddPayeeModal
            onSave={handleSavePayee}
            onCancel={handleCancelAddPayee}
          />
        )}
      </div>
    </div>
  )
}

export default App
