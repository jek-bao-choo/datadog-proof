import './datadog-init.js'
import './style.css'
import { initRouter } from './router.js'
import { renderLandingPage } from './views/landing.js'
import { renderEnterMeterPage } from './views/enterMeter.js'
import { renderConfirmationPage } from './views/confirmation.js'

/**
 * Initialize the application
 */
function initApp() {
  // Define route mappings
  const routes = {
    '/': renderLandingPage,
    '/enter-meter': renderEnterMeterPage,
    '/reading-submitted': renderConfirmationPage,
  }

  // Initialize router with routes
  initRouter(routes)
}

// Start the app when DOM is ready
document.addEventListener('DOMContentLoaded', initApp)
