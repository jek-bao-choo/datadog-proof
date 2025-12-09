import { useState } from 'react'

// AddPayeeModal Component
// Modal for adding a new payee with name and mobile number
function AddPayeeModal({ onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    mobileNumber: ''
  })
  const [errors, setErrors] = useState({})

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target

    // Apply input restrictions for mobile number
    let filteredValue = value
    if (name === 'mobileNumber') {
      // Only allow digits, max 8 characters
      filteredValue = value.replace(/\D/g, '').slice(0, 8)
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

  // Validate form
  const validateForm = () => {
    const newErrors = {}

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    // Mobile number validation: exactly 8 digits
    if (!formData.mobileNumber) {
      newErrors.mobileNumber = 'Mobile number is required'
    } else if (formData.mobileNumber.length !== 8) {
      newErrors.mobileNumber = 'Mobile number must be exactly 8 digits'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle save
  const handleSave = () => {
    if (validateForm()) {
      onSave({
        id: Date.now().toString(), // Simple unique ID
        name: formData.name.trim(),
        mobileNumber: formData.mobileNumber
      })
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* Title */}
        <h2 className="modal-title">Add New Payee</h2>

        {/* Name Field */}
        <div className="form-group">
          <label htmlFor="payee-name" className="form-label">
            Name
          </label>
          <input
            type="text"
            id="payee-name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter payee name"
            className={`form-input ${errors.name ? 'error' : ''}`}
            autoComplete="off"
          />
          {errors.name && (
            <div className="error-message">{errors.name}</div>
          )}
        </div>

        {/* Mobile Number Field */}
        <div className="form-group">
          <label htmlFor="payee-mobile" className="form-label">
            Mobile Number
          </label>
          <input
            type="tel"
            id="payee-mobile"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleInputChange}
            placeholder="Enter 8-digit mobile number"
            className={`form-input ${errors.mobileNumber ? 'error' : ''}`}
            maxLength="8"
            autoComplete="tel"
            inputMode="numeric"
            pattern="[0-9]*"
          />
          {errors.mobileNumber && (
            <div className="error-message">{errors.mobileNumber}</div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="modal-buttons">
          <button
            type="button"
            onClick={onCancel}
            className="modal-button cancel-button"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="modal-button save-button"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddPayeeModal
