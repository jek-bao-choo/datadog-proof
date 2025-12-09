import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import './datadog-rum.js' // initialise datadog rum as early as possible
// Datadog Feature Flags: Import initialization functions
import { initializeFeatureFlags, setFeatureFlagContext } from './datadog-feature-flags'

// Datadog Feature Flags: Initialize feature flags before rendering app
// This ensures flags are ready when components mount
;(async () => {
  // Datadog Feature Flags: Initialize the OpenFeature provider
  await initializeFeatureFlags()

  // Datadog Feature Flags: Set user context for targeting
  await setFeatureFlagContext('anonymous-user')

  console.log('Datadog Feature Flags: Feature flags ready')

  // Render the app after feature flags are initialized
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})()
