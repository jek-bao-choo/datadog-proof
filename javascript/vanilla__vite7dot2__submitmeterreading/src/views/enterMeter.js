/**
 * Enter Meter Reading Page View
 * Shows form for entering meter details and submitting reading
 */

import { navigateTo } from '../router.js'
import { submitMeterReading } from '../utils/api.js'

/**
 * Get today's date in YYYY-MM-DD format
 * @returns {string} Today's date
 */
function getTodayDate() {
  const today = new Date()
  return today.toISOString().split('T')[0]
}

/**
 * Handle form submission
 * @param {Event} e - The form submit event
 */
async function handleSubmit(e) {
  e.preventDefault()

  // Get form elements
  const meterNumber = document.querySelector('#meter-number').value.trim()
  const currentReading = document.querySelector('#current-reading').value.trim()
  const readingDate = document.querySelector('#reading-date').value

  // Validate inputs
  if (!meterNumber || !currentReading || !readingDate) {
    showError('Please fill in all required fields.')
    return
  }

  if (isNaN(currentReading) || Number(currentReading) < 0) {
    showError('Current reading must be a valid positive number.')
    return
  }

  // Show loading state
  const submitBtn = document.querySelector('#submit-btn')
  const errorMsg = document.querySelector('#error-message')
  submitBtn.disabled = true
  submitBtn.textContent = 'Submitting...'
  errorMsg.style.display = 'none'

  try {
    // Submit to API
    const meterData = {
      meterNumber,
      currentReading: Number(currentReading),
      readingDate,
    }

    await submitMeterReading(meterData)

    // Success - navigate to confirmation page
    navigateTo('/reading-submitted')
  } catch (error) {
    // Show error message
    showError(error.message || 'Failed to submit reading. Please try again.')

    // Re-enable submit button
    submitBtn.disabled = false
    submitBtn.textContent = 'Submit Reading'
  }
}

/**
 * Show error message
 * @param {string} message - Error message to display
 */
function showError(message) {
  const errorMsg = document.querySelector('#error-message')
  if (errorMsg) {
    errorMsg.textContent = message
    errorMsg.style.display = 'block'
  }
}

/**
 * Render the enter meter page
 * @returns {string} HTML string for the enter meter page
 */
export function renderEnterMeterPage() {
  // Set up event listener after render
  setTimeout(() => {
    const form = document.querySelector('#meter-form')
    if (form) {
      form.addEventListener('submit', handleSubmit)
    }
  }, 0)

  return `
    <div class="form-container">
      <div class="form-content">
        <h1 class="form-title">Enter Meter Reading</h1>
        <p class="form-description">
          Please enter your meter details below
        </p>

        <form id="meter-form" class="meter-form">
          <div class="form-group">
            <label for="meter-number" class="form-label">
              Meter Number <span class="required">*</span>
            </label>
            <input
              type="text"
              id="meter-number"
              name="meter-number"
              class="form-input"
              required
              placeholder="e.g., MTR-12345"
            />
          </div>

          <div class="form-group">
            <label for="current-reading" class="form-label">
              Current Reading <span class="required">*</span>
            </label>
            <input
              type="number"
              id="current-reading"
              name="current-reading"
              class="form-input"
              required
              min="0"
              step="0.01"
              placeholder="e.g., 12345.67"
            />
          </div>

          <div class="form-group">
            <label for="reading-date" class="form-label">
              Reading Date <span class="required">*</span>
            </label>
            <input
              type="date"
              id="reading-date"
              name="reading-date"
              class="form-input"
              required
              value="${getTodayDate()}"
              max="${getTodayDate()}"
            />
          </div>

          <div id="error-message" class="error-message" style="display: none;"></div>

          <button type="submit" id="submit-btn" class="btn btn-primary">
            Submit Reading
          </button>
        </form>
      </div>
    </div>
  `
}
