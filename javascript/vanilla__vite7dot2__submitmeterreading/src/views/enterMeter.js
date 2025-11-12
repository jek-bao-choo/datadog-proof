/**
 * Enter Meter Reading Page View
 * Shows form for entering meter details and submitting reading
 */

import { navigateTo } from '../router.js'
import { submitMeterReading, getMeterReadings } from '../utils/api.js'

// Global state for previous reading (loaded from API)
let previousReading = '0000'
const METER_UNIT = 'kWh'

/**
 * Handle digit input - auto-focus next input
 * @param {Event} e - Input event
 */
function handleDigitInput(e) {
  const input = e.target
  const maxLength = 1

  // Remove any non-numeric characters
  input.value = input.value.replace(/[^0-9]/g, '')

  // Only allow single digit
  if (input.value.length > maxLength) {
    input.value = input.value.slice(0, maxLength)
  }

  // Auto-focus next input if digit entered
  if (input.value.length === maxLength) {
    const nextInput = input.nextElementSibling
    if (nextInput && nextInput.classList.contains('digit-input')) {
      nextInput.focus()
    }
  }
}

/**
 * Handle digit keydown - support backspace navigation and block non-numeric keys
 * @param {Event} e - Keydown event
 */
function handleDigitKeydown(e) {
  const input = e.target

  // Allow: backspace, delete, tab, escape, enter, arrow keys
  const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown']

  // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X, Cmd+A, Cmd+C, Cmd+V, Cmd+X
  if ((e.ctrlKey || e.metaKey) && ['a', 'c', 'v', 'x'].includes(e.key.toLowerCase())) {
    return
  }

  // If not a number key (0-9) and not an allowed key, prevent input
  if (!allowedKeys.includes(e.key) && (e.key < '0' || e.key > '9')) {
    e.preventDefault()
    return
  }

  // If backspace and input is empty, focus previous
  if (e.key === 'Backspace' && input.value === '') {
    const prevInput = input.previousElementSibling
    if (prevInput && prevInput.classList.contains('digit-input')) {
      prevInput.focus()
      e.preventDefault()
    }
  }
}

/**
 * Handle paste event - only allow numeric characters
 * @param {Event} e - Paste event
 */
function handleDigitPaste(e) {
  e.preventDefault()

  // Get pasted text
  const pastedText = (e.clipboardData || window.clipboardData).getData('text')

  // Remove non-numeric characters
  const numericText = pastedText.replace(/[^0-9]/g, '')

  if (numericText.length === 0) {
    return
  }

  // Get all digit inputs
  const inputs = document.querySelectorAll('.digit-input')
  const currentIndex = Array.from(inputs).indexOf(e.target)

  // Fill inputs with pasted digits
  for (let i = 0; i < numericText.length && (currentIndex + i) < inputs.length; i++) {
    inputs[currentIndex + i].value = numericText[i]
  }

  // Focus the next empty input or the last filled input
  const nextEmptyIndex = currentIndex + numericText.length
  if (nextEmptyIndex < inputs.length) {
    inputs[nextEmptyIndex].focus()
  } else {
    inputs[inputs.length - 1].focus()
  }
}

/**
 * Get reading from digit inputs
 * @returns {string} The reading value
 */
function getReadingValue() {
  const inputs = document.querySelectorAll('.digit-input')
  let reading = ''
  inputs.forEach(input => {
    reading += input.value || '0'
  })
  return reading
}

/**
 * Handle form submission
 * @param {Event} e - The form submit event
 */
async function handleSubmit(e) {
  e.preventDefault()

  // Get reading from digit inputs
  const currentReading = getReadingValue()

  // Validate reading
  const readingNum = parseInt(currentReading)
  if (isNaN(readingNum) || readingNum <= parseInt(previousReading)) {
    showError(`Current reading must be greater than previous reading (${previousReading})`)
    return
  }

  // Show loading state
  const submitBtn = document.querySelector('#submit-btn')
  const errorMsg = document.querySelector('#error-message')
  submitBtn.disabled = true
  submitBtn.textContent = 'Submitting...'
  errorMsg.style.display = 'none'

  try {
    // Submit to API (only send the reading value as a number)
    await submitMeterReading(readingNum)

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
 * Load previous reading from API
 */
async function loadPreviousReading() {
  try {
    const readings = await getMeterReadings()

    if (readings && readings.length > 0) {
      // Sort by timestamp to get the most recent reading
      const sortedReadings = [...readings].sort((a, b) =>
        new Date(b.Timestamp) - new Date(a.Timestamp)
      )

      // Get the latest reading value
      const latestReading = sortedReadings[0].ReadingValue
      previousReading = latestReading.toString().padStart(4, '0')
    } else {
      // No previous readings, use default
      previousReading = '0000'
    }

    // Update the display with the loaded value
    updatePreviousReadingDisplay()
  } catch (error) {
    console.error('Error loading previous reading:', error)
    // Keep default value on error
    previousReading = '0000'
    updatePreviousReadingDisplay()
  }
}

/**
 * Update the previous reading display in the DOM
 */
function updatePreviousReadingDisplay() {
  const prevDigits = previousReading.split('')
  const digitDisplays = document.querySelectorAll('.digit-display')

  digitDisplays.forEach((display, index) => {
    if (prevDigits[index]) {
      display.textContent = prevDigits[index]
    }
  })
}

/**
 * Render the enter meter page
 * @returns {string} HTML string for the enter meter page
 */
export function renderEnterMeterPage() {
  // Set up event listeners after render
  setTimeout(() => {
    const form = document.querySelector('#meter-form')
    if (form) {
      form.addEventListener('submit', handleSubmit)
    }

    // Add digit input handlers
    const digitInputs = document.querySelectorAll('.digit-input')
    digitInputs.forEach(input => {
      input.addEventListener('input', handleDigitInput)
      input.addEventListener('keydown', handleDigitKeydown)
      input.addEventListener('paste', handleDigitPaste)
    })

    // Focus first input
    if (digitInputs.length > 0) {
      digitInputs[0].focus()
    }

    // Load previous reading from API
    loadPreviousReading()
  }, 0)

  // Split previous reading into digits for display (will be updated by loadPreviousReading)
  const prevDigits = previousReading.split('')

  return `
    <div class="form-container-new">
      <div class="form-content-new">
        <form id="meter-form" class="meter-form-new">

          <!-- Previous Meter Reading Display -->
          <div class="reading-section">
            <label class="reading-label">Previous Meter Reading</label>
            <div class="digit-display-container">
              <div class="digit-display-row">
                ${prevDigits.map(digit => `<div class="digit-display">${digit}</div>`).join('')}
              </div>
              <span class="unit-badge">${METER_UNIT}</span>
            </div>
          </div>

          <!-- Current Meter Reading Input -->
          <div class="reading-section">
            <label class="reading-label">Current Meter Reading</label>
            <div class="digit-display-container">
              <div class="digit-input-row">
                <input type="text" class="digit-input" maxlength="1" pattern="[0-9]" inputmode="numeric" autocomplete="off" />
                <input type="text" class="digit-input" maxlength="1" pattern="[0-9]" inputmode="numeric" autocomplete="off" />
                <input type="text" class="digit-input" maxlength="1" pattern="[0-9]" inputmode="numeric" autocomplete="off" />
                <input type="text" class="digit-input" maxlength="1" pattern="[0-9]" inputmode="numeric" autocomplete="off" />
              </div>
              <span class="unit-badge">${METER_UNIT}</span>
            </div>
          </div>

          <!-- Note -->
          <p class="reading-note">
            Note: Please round up the numbers if the reading values are showing decimal points on
          </p>

          <div id="error-message" class="error-message" style="display: none;"></div>

          <!-- Submit Button -->
          <button type="submit" id="submit-btn" class="btn btn-submit-green btn-submit-bottom">
            Submit Reading
          </button>
        </form>
      </div>
    </div>
  `
}
