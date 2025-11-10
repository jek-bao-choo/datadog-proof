/**
 * Landing Page View
 * Shows the main page with "Submit Meter Reading" button
 */

import { navigateTo } from '../router.js'

/**
 * Get current month and year
 * @returns {string} Formatted month year (e.g., "Nov 2025")
 */
function getCurrentMonthYear() {
  const date = new Date()
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${monthNames[date.getMonth()]} ${date.getFullYear()}`
}

/**
 * Render the landing page
 * @returns {string} HTML string for the landing page
 */
export function renderLandingPage() {
  // Set up event listener after render
  setTimeout(() => {
    const submitBtn = document.querySelector('#submit-reading-btn')
    if (submitBtn) {
      submitBtn.addEventListener('click', (e) => {
        e.preventDefault()
        navigateTo('/enter-meter')
      })
    }
  }, 0)

  const currentMonthYear = getCurrentMonthYear()

  return `
    <div class="landing-container-new">
      <div class="landing-content-new">
        <!-- Meter Illustration -->
        <div class="meter-illustration">
          <svg viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg">
            <!-- Grass/Plants on left -->
            <ellipse cx="30" cy="140" rx="15" ry="8" fill="#86efac"/>
            <ellipse cx="25" cy="135" rx="12" ry="6" fill="#4ade80"/>

            <!-- Main meter body -->
            <rect x="60" y="60" width="80" height="90" rx="4" fill="#3b82f6"/>
            <rect x="65" y="65" width="70" height="80" rx="2" fill="#60a5fa"/>

            <!-- Digital display -->
            <rect x="75" y="75" width="50" height="20" rx="2" fill="#1e3a8a"/>
            <text x="100" y="90" font-family="monospace" font-size="12" fill="#10b981" text-anchor="middle">01234</text>

            <!-- Meter dial/circle -->
            <circle cx="100" cy="115" r="12" fill="#fbbf24"/>
            <circle cx="100" cy="115" r="8" fill="#f59e0b"/>

            <!-- Sun -->
            <circle cx="150" cy="35" r="15" fill="#fbbf24"/>
            <circle cx="150" cy="35" r="12" fill="#fde047"/>

            <!-- Grass on right -->
            <ellipse cx="160" cy="142" rx="18" ry="10" fill="#86efac"/>
            <ellipse cx="165" cy="138" rx="14" ry="7" fill="#4ade80"/>

            <!-- Ruler/tool on left -->
            <rect x="20" y="30" width="8" height="40" rx="2" fill="#fb923c" transform="rotate(-30 24 50)"/>
            <rect x="21" y="32" width="6" height="36" rx="1" fill="#fdba74" transform="rotate(-30 24 50)"/>

            <!-- Wrench on right -->
            <rect x="165" y="45" width="6" height="30" rx="2" fill="#10b981" transform="rotate(35 168 60)"/>
            <circle cx="168" cy="44" r="5" fill="#10b981"/>
          </svg>
        </div>

        <!-- Property Selection -->
        <div class="property-selection">
          <label for="property-select" class="property-label">
            I want to read my own meter for:
          </label>
          <select id="property-select" class="property-dropdown">
            <option value="main">My Property</option>
            <option value="home1">Home 1</option>
            <option value="home2">Home 2</option>
          </select>
        </div>

        <!-- Call to Action -->
        <h2 class="landing-heading">Submit your reading now!</h2>
        <p class="landing-info">
          Your ${currentMonthYear} meter reading submission is open. Read your meter and submit now.
        </p>

        <button id="submit-reading-btn" class="btn btn-submit-green">
          Submit Meter Reading
        </button>

        <!-- Meter Reading History -->
        <div class="meter-history">
          <h3 class="history-title">My Meter Reading History</h3>
          <div class="history-entry">
            <div class="history-date">
              <span class="date-day">04</span>
              <span class="date-month">Mar 2020</span>
              <span class="date-status">Last Sent Reading</span>
            </div>
            <div class="history-reading">
              <span class="reading-value">19647</span>
              <span class="reading-unit">kWh</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
}
