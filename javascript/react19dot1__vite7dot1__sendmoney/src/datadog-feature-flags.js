// Datadog Feature Flags - Configuration and initialization
// This file sets up OpenFeature with Datadog provider for feature flag management
//
// HOW IT WORKS:
// 1. Create a Datadog provider with your app credentials
// 2. Call initializeFeatureFlags() when your app starts (see src/main.jsx)
// 3. Use getFeatureFlagClient() to evaluate flags in your components
// 4. Make sure targetingKey matches datadogRum.setUser() id for proper tracking

import { DatadogProvider } from '@datadog/openfeature-browser'
import { OpenFeature } from '@openfeature/web-sdk'

// Datadog Feature Flags: Create provider with same credentials as RUM
// This connects our app to Datadog's feature flag service
// NOTE: These credentials (clientToken, applicationId) should match src/datadog-rum.js
const provider = new DatadogProvider({
  clientToken: 'pub20a017f260010c0da83a1c19c16e43d6',
  applicationId: 'fe7cf0b0-6e91-4317-a068-17e870e0cc20',
  enableExposureLogging: true, // Datadog Feature Flags: Log when flags are evaluated to RUM
  site: 'datadoghq.com',
  env: 'dev',
  service: 'jek-sendmoney-app',
  version: '1.0.3'
})

// Datadog Feature Flags: Initialize OpenFeature provider
// This must be called before using any feature flags
export async function initializeFeatureFlags() {
  try {
    console.log('Datadog Feature Flags: Initializing feature flags...')

    // Datadog Feature Flags: Set evaluation context with custom attributes.
    // Reference these attributes in your targeting rules to control who sees each variant.
    //
    // IMPORTANT: The targetingKey here MUST match the user.id in datadogRum.setUser()
    // This ensures feature flag evaluations and RUM events are linked to the same user
    // See: src/datadog-rum.js where datadogRum.setUser({ id: 'user-12345', ... }) is called
    const evaluationContext = {
        targetingKey: 'user-12345', // MUST match datadogRum.setUser({ id: 'user-12345' })
        userId: 'user-12345',        // Additional user identifier for targeting rules
        userRole: 'beta-tester',     // Custom attribute for role-based targeting
        email: 'user-12345@example.com' // Custom attribute for email-based targeting
    };

    // Datadog Feature Flags: Set the provider and evaluation context
    await OpenFeature.setProviderAndWait(provider, evaluationContext)

    console.log('Datadog Feature Flags: Feature flags initialized successfully')
  } catch (error) {
    console.error('Datadog Feature Flags: Failed to initialize feature flags:', error)
  }
}

// Datadog Feature Flags: Get the OpenFeature client
// Use this client to evaluate feature flags in your app
//
// USAGE EXAMPLE:
//   const client = getFeatureFlagClient()
//   const value = await client.getBooleanValue('my-flag-key', false)
//   const details = await client.getBooleanDetails('my-flag-key', false)
export function getFeatureFlagClient() {
  return OpenFeature.getClient()
}