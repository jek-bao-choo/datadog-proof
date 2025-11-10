/**
 * Confirmation Page View
 * Shows success message after meter reading submission
 */

import { navigateTo } from '../router.js'

/**
 * Render the confirmation page
 * @returns {string} HTML string for the confirmation page
 */
export function renderConfirmationPage() {
  // Set up event listener after render
  setTimeout(() => {
    const submitAnotherBtn = document.querySelector('#submit-another-btn')
    if (submitAnotherBtn) {
      submitAnotherBtn.addEventListener('click', (e) => {
        e.preventDefault()
        navigateTo('/')
      })
    }
  }, 0)

  return `
    <div class="confirmation-container">
      <div class="confirmation-content">
        <div class="success-icon">
          <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
            <circle class="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
            <path class="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
          </svg>
        </div>

        <h1 class="confirmation-title">Reading Submitted!</h1>

        <p class="confirmation-message">
          Thank you for submitting your meter reading.
          Your submission has been received successfully.
        </p>

        <p class="confirmation-details">
          We'll process your reading and update your account shortly.
        </p>

        <button id="submit-another-btn" class="btn btn-secondary">
          Submit Another Reading
        </button>
      </div>
    </div>
  `
}
