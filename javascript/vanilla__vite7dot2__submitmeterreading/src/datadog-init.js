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
  applicationId: 'c5c2b4e5-dd38-4619-af9e-40aa999eafa7',
  clientToken: 'pubaad709db3d0245fdf0fbca24065386ec',
  site: 'datadoghq.com',
  service: 'vanilla__vite7dot2__submitmeterreading',
  env: 'testv4',
  version: '1.2.3',
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
