// Datadog Feature Flags - Custom React Hook
// This hook makes it easy to check feature flags in React components

import { useState, useEffect } from 'react'
import { getFeatureFlagClient } from '../datadog-feature-flags'

// Datadog Feature Flags: Custom hook to check if a feature flag is enabled
// Usage: const { isEnabled, isLoading } = useFeatureFlag('my-flag-name', false)
export function useFeatureFlag(flagName, defaultValue = false) {
  // Datadog Feature Flags: Track whether the flag is enabled
  const [isEnabled, setIsEnabled] = useState(defaultValue)
  // Datadog Feature Flags: Track loading state while checking flag
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Datadog Feature Flags: Check the flag value from Datadog
    async function checkFlag() {
      try {
        const client = getFeatureFlagClient()
        const value = await client.getBooleanValue('react19dot1-vite7dot1-sendmoney-featureflagkey', false)
        setIsEnabled(value)
        console.log(`Datadog Feature Flags: Feature flag ${flagName} is ${value}`)  
      } catch (error) {
        console.error(`Datadog Feature Flags: Error checking feature flag ${flagName}:`, error)
        // Datadog Feature Flags: Fall back to default value on error
        setIsEnabled(defaultValue)
      } finally {
        setIsLoading(false)
      }
    }

    checkFlag()
  }, [flagName, defaultValue])

  return { isEnabled, isLoading }
}
