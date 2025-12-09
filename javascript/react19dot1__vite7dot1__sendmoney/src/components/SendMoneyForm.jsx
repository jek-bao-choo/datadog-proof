import { useState, useEffect } from 'react'
import ScamAlertModal from './ScamAlertModal'
import { datadogRum } from '../datadog-rum' // Import Datadog RUM for adding custom actions

function SendMoneyForm({ onSubmit, selectedPayee }) {
  // Form state
  const [formData, setFormData] = useState({
    phone: '',
    amount: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})
  // Modal state for scam alert
  const [showScamAlert, setShowScamAlert] = useState(false)
  // Blacklisted numbers list
  const BLACKLISTED_NUMBERS = ['88888888']

  // Start operation when landing page loads
  useEffect(() => {
    const operationKey = 'send-money-transaction-main'

    datadogRum.startFeatureOperation('send-money-transaction', {
      operationKey: operationKey,
      context: {
        startTime: new Date().toISOString(),
        page: 'landing'
      },
      description: 'User journey from landing page to transaction result'
    })

    console.log('Started operation: send-money-transaction')
  }, [])

  // Auto-fill phone when payee is selected
  useEffect(() => {
    if (selectedPayee) {
      setFormData(prev => ({
        ...prev,
        phone: selectedPayee.mobileNumber
      }))
    }
  }, [selectedPayee])

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target

    // Apply input restrictions
    let filteredValue = value

    if (name === 'phone') {
      // Only allow digits, max 8 characters
      filteredValue = value.replace(/\D/g, '').slice(0, 8)
    } else if (name === 'amount') {
      // Only allow digits, max 4 characters, positive numbers
      filteredValue = value.replace(/\D/g, '').slice(0, 4)
    }

    setFormData(prev => ({
      ...prev,
      [name]: filteredValue
    }))

    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  // Form validation
  const validateForm = () => {
    const newErrors = {}

    // Phone validation: exactly 8 digits
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required'
    } else if (formData.phone.length !== 8) {
      newErrors.phone = 'Phone number must be exactly 8 digits'
    }

    // Amount validation: 1-4 digits, positive
    if (!formData.amount) {
      newErrors.amount = 'Amount is required'
    } else if (formData.amount === '0') {
      newErrors.amount = 'Amount must be greater than 0'
    } else if (formData.amount.length > 4) {
      newErrors.amount = 'Amount cannot exceed 4 digits'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Check if phone number is blacklisted
  const isBlacklisted = (phoneNumber) => {
    return BLACKLISTED_NUMBERS.includes(phoneNumber)
  }

  // Process the actual transaction
  const processTransaction = async () => {
    setIsLoading(true)

    try {
      // Call the onSubmit prop with form data
      await onSubmit(formData.phone, formData.amount)
    } catch (error) {
      console.error('Form submission error:', error)
      // In a real app, we'd show an error message
    } finally {
      setIsLoading(false)
    }
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    // Check if phone number is blacklisted
    if (isBlacklisted(formData.phone)) {
      // Start nested operation for scam alert decision
      const parentOperationKey = 'send-money-transaction-main'
      const scamAlertOperationKey = 'send-money-transaction-main:scam-alert'

      datadogRum.startFeatureOperation('scam-alert-decision', {
        operationKey: scamAlertOperationKey,
        context: {
          parentOperationKey: parentOperationKey,
          phoneNumber: formData.phone,
          amount: formData.amount,
          startTime: new Date().toISOString()
        },
        description: 'User decision on scam alert warning'
      })
      console.log('Started nested operation: scam-alert-decision')

      // Show scam alert modal
      setShowScamAlert(true)
      return
    }

    // If not blacklisted, proceed with transaction
    await processTransaction()
  }

  // Handle Accept button in modal
  const handleAcceptRisk = async () => {
    // STATIC operation keys (same as when we started)
    const parentOperationKey = 'send-money-transaction-main'
    const scamAlertOperationKey = 'send-money-transaction-main:scam-alert'

    // Track Accept action in Datadog RUM as Custom Action in Datadog RUM
    datadogRum.addAction('acceptScamRisk', {
      phoneNumber: formData.phone,
      scamAmount: parseFloat(formData.amount),
      scamBlacklistedNumber: true
    })

    // STOP nested operation with SUCCESS (user made a decision)
    datadogRum.succeedFeatureOperation('scam-alert-decision', {
      operationKey: scamAlertOperationKey,
      context: {
        parentOperationKey: parentOperationKey,
        decision: 'accepted',
        phoneNumber: formData.phone,
        amount: formData.amount,
        endTime: new Date().toISOString()
      },
      description: 'User accepted the scam risk'
    })
    console.log('Nested operation succeeded: scam-alert-decision (accepted)')

    // Close modal
    setShowScamAlert(false)
    // Proceed with transaction even though number is blacklisted
    await processTransaction()
  }

  // Handle Reject button in modal
  const handleRejectRisk = () => {
    // STATIC operation keys (same as when we started)
    const parentOperationKey = 'send-money-transaction-main'
    const scamAlertOperationKey = 'send-money-transaction-main:scam-alert'

    // Track Reject action in Datadog RUM as Custom Action in Datadog RUM
    datadogRum.addAction('rejectScamRisk', {
      phoneNumber: formData.phone,
      scamAmount: parseFloat(formData.amount),
      scamBlacklistedNumber: true
    })

    // STOP nested operation with SUCCESS (user made a decision)
    datadogRum.succeedFeatureOperation('scam-alert-decision', {
      operationKey: scamAlertOperationKey,
      context: {
        parentOperationKey: parentOperationKey,
        decision: 'rejected',
        phoneNumber: formData.phone,
        amount: formData.amount,
        endTime: new Date().toISOString()
      },
      description: 'User rejected the scam risk'
    })
    console.log('Nested operation succeeded: scam-alert-decision (rejected)')

    // STOP main operation with FAILURE (transaction abandoned)
    datadogRum.failFeatureOperation('send-money-transaction', 'abandoned', {
      operationKey: parentOperationKey,
      context: {
        reason: 'user-rejected-scam-alert',
        phoneNumber: formData.phone,
        amount: formData.amount,
        endTime: new Date().toISOString()
      },
      description: 'Transaction abandoned - user rejected scam alert'
    })
    console.log('Main operation failed: send-money-transaction (abandoned)')

    // Close modal and do nothing
    setShowScamAlert(false)
  }

  return (
    <form onSubmit={handleSubmit} className="send-money-form">
      <div className="form-group">
        <label htmlFor="phone" className="form-label">
          Phone Number
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          placeholder="Enter 8-digit phone number"
          className={`form-input ${errors.phone ? 'error' : ''}`}
          maxLength="8"
          disabled={isLoading}
          autoComplete="tel"
          inputMode="numeric"
          pattern="[0-9]*"
        />
        {errors.phone && (
          <div className="error-message">{errors.phone}</div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="amount" className="form-label">
          Amount
        </label>
        <input
          type="number"
          id="amount"
          name="amount"
          value={formData.amount}
          onChange={handleInputChange}
          placeholder="Enter amount"
          className={`form-input ${errors.amount ? 'error' : ''}`}
          maxLength="4"
          min="1"
          max="9999"
          disabled={isLoading}
          autoComplete="off"
          inputMode="numeric"
          pattern="[0-9]*"
        />
        {errors.amount && (
          <div className="error-message">{errors.amount}</div>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading || !formData.phone || !formData.amount}
        className="submit-button"
        data-dd-action-name="Jek defined action name called Send Money haha"
      >
        {isLoading ? 'Processing...' : 'Send Money'}
      </button>

      {isLoading && (
        <div className="loading-message">
          <div className="loading-spinner"></div>
          <span>Processing your payment...</span>
        </div>
      )}

      {/* Scam Alert Modal */}
      {showScamAlert && (
        <ScamAlertModal
          phoneNumber={formData.phone}
          onAccept={handleAcceptRisk}
          onReject={handleRejectRisk}
        />
      )}
    </form>
  )
}

export default SendMoneyForm