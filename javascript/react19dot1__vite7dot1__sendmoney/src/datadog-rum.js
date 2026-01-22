import { datadogRum } from '@datadog/browser-rum'
// import { reactPlugin } from '@datadog/browser-rum-react' // This app doesn’t use react-router, so omit router tracking

// Avoid multiple inits during Vite HMR
if (typeof window !== 'undefined' && !window.__DATADOG_RUM_INSTALLED__) {
  datadogRum.init({
    applicationId: 'fe7cf0b0-6e91-4317-a068-17e870e0cc20',
    clientToken: 'pub20a017f260010c0da83a1c19c16e43d6',
    site: 'datadoghq.com',
    service: 'jek-sendmoney-app',
    env: 'test',
    version: '1.0.2',
    enableExperimentalFeatures: ['feature_operation_vital'],
    sessionSampleRate: 100,
    sessionReplaySampleRate: 100,
    defaultPrivacyLevel: 'mask-user-input',
    // This app doesn't use react-router, so omit router tracking
    // plugins: [reactPlugin()],
  })

  // Set user information for RUM tracking
  // IMPORTANT: This user.id must match the targetingKey in feature flags
  datadogRum.setUser({
    id: 'user-12345',
    name: 'John Doe',
    email: 'user-12345@example.com',
    plan: 'premium',
    userRole: 'beta-tester'
  })

  window.__DATADOG_RUM_INSTALLED__ = true
}

export { datadogRum }
