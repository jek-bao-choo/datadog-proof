// Datadog Feature Flags - Configuration and initialization
// This file sets up OpenFeature with Datadog provider for feature flag management

import { DatadogProvider } from '@datadog/openfeature-browser'
import { OpenFeature } from '@openfeature/web-sdk'

// Datadog Feature Flags: Create provider with same credentials as RUM
// This connects our app to Datadog's feature flag service
const provider = new DatadogProvider({
  clientToken: 'pub20a017f260010c0da83a1c19c16e43d6',
  applicationId: 'fe7cf0b0-6e91-4317-a068-17e870e0cc20',
  enableExposureLogging: true, // Datadog Feature Flags: Log when flags are evaluated to RUM
  site: 'datadoghq.com',
  env: 'test',
  service: 'jek-sendmoney-app',
  version: '1.0.2'
})

// Datadog Feature Flags: Initialize OpenFeature provider
// This must be called before using any feature flags
export async function initializeFeatureFlags() {
  try {
    console.log('Datadog Feature Flags: Initializing feature flags...')
    await OpenFeature.setProviderAndWait(provider)
    console.log('Datadog Feature Flags: Feature flags initialized successfully')
  } catch (error) {
    console.error('Datadog Feature Flags: Failed to initialize feature flags:', error)
  }
}

// Datadog Feature Flags: Get the OpenFeature client
// Use this client to evaluate feature flags in your app
export function getFeatureFlagClient() {
  return OpenFeature.getClient()
}

// Datadog Feature Flags: Set user context for targeting
// This allows Datadog to target flags to specific users
export async function setFeatureFlagContext(userId = 'anonymous-user') {
  try {
    await OpenFeature.setContext({
      user: { id: userId },
      targetingKey: userId
    })
    console.log('Datadog Feature Flags: Feature flag context set:', userId)
  } catch (error) {
    console.error('Datadog Feature Flags: Failed to set feature flag context:', error)
  }
}
