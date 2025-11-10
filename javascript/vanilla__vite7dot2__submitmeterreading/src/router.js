/**
 * Client-side router for the meter reading app
 * Uses the History API for navigation without page reloads
 */

// Store routes mapping (path -> render function)
let routes = {}

/**
 * Navigate to a new path
 * @param {string} path - The path to navigate to (e.g., '/', '/enter-meter')
 */
export function navigateTo(path) {
  // Update browser history
  window.history.pushState({}, '', path)

  // Render the new view
  router()
}

/**
 * Main router function - matches current path and renders appropriate view
 */
export function router() {
  const path = window.location.pathname

  // Find matching route
  const renderFunction = routes[path]

  if (renderFunction) {
    // Render the view
    const appContainer = document.querySelector('#app')
    if (appContainer) {
      appContainer.innerHTML = renderFunction()
    }
  } else {
    // 404 - Path not found, redirect to home
    navigateTo('/')
  }
}

/**
 * Initialize the router with route mappings
 * @param {Object} routeMap - Object mapping paths to render functions
 */
export function initRouter(routeMap) {
  // Store the routes
  routes = routeMap

  // Listen for browser back/forward button clicks
  window.addEventListener('popstate', router)

  // Handle initial page load
  router()
}
