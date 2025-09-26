import { datadogRum } from '@datadog/browser-rum'
// import { reactPlugin } from '@datadog/browser-rum-react' // This app doesn’t use react-router, so omit router tracking

// Avoid multiple inits during Vite HMR
if (typeof window !== 'undefined' && !window.__DATADOG_RUM_INSTALLED__) {
  datadogRum.init({
    applicationId: '<REDACTED>',
    clientToken: '<REDACTED>',
    site: 'datadoghq.com',
    service: 'jek-sendmoney-app',
    env: 'test',
    version: '1.0.1',
    sessionSampleRate: 100,
    sessionReplaySampleRate: 100,
    defaultPrivacyLevel: 'mask-user-input',
    // This app doesn’t use react-router, so omit router tracking
    // plugins: [reactPlugin()],
  })

  window.__DATADOG_RUM_INSTALLED__ = true
}

export { datadogRum }
