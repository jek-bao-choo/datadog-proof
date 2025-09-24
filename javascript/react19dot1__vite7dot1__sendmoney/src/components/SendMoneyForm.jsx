import { useState } from 'react'

function SendMoneyForm({ onSubmit }) {
  // Form state
  const [formData, setFormData] = useState({
    phone: '',
    amount: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})

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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

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
      >
        {isLoading ? 'Processing...' : 'Send Money'}
      </button>

      {isLoading && (
        <div className="loading-message">
          <div className="loading-spinner"></div>
          <span>Processing your payment...</span>
        </div>
      )}
    </form>
  )
}

export default SendMoneyForm