// Datadog Real User Monitoring (RUM) initialization
import { datadogRum } from '@datadog/browser-rum';

// Get API URL from environment variable for RUM-to-APM tracing (optional)
const API_URL = import.meta.env.VITE_API_URL;

// Build allowedTracingUrls array dynamically
const allowedTracingUrls = [
  API_URL
];

datadogRum.init({
  // Hardcoded values (safe for client tokens - they're public)
  applicationId: 'a433721c-95aa-4fbe-b02e-db4219951de1',
  clientToken: 'pub4ce5102a2c27653006ef2cbc2e9013c5',
  site: 'datadoghq.com',
  service: 'android8__api26__superapp',
  env: 'testv5',
  version: '1.2.4',
  sessionSampleRate: 100,
  sessionReplaySampleRate: 100,
  trackResources: true,
  trackLongTasks: true,
  trackUserInteractions: true,
  trackBfcacheViews: true,
  defaultPrivacyLevel: 'mask-user-input',

  // RUM-to-APM connection: Links frontend traces with backend APM traces
  allowedTracingUrls: allowedTracingUrls,
});

console.log('Datadog RUM initialized with APM tracing for:', allowedTracingUrls);
