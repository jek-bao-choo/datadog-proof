'use client';

import { useEffect } from 'react';
import { datadogRum } from '@datadog/browser-rum';

export default function DatadogInit() {
  useEffect(() => {
    console.log('[Datadog] Starting initialization...');

    // Log environment variables to verify they're loaded
    const config = {
      applicationId: process.env.NEXT_PUBLIC_DATADOG_APPLICATION_ID,
      clientToken: process.env.NEXT_PUBLIC_DATADOG_CLIENT_TOKEN,
      site: process.env.NEXT_PUBLIC_DATADOG_SITE || 'datadoghq.com',
      service: process.env.NEXT_PUBLIC_DATADOG_SERVICE,
      env: process.env.NEXT_PUBLIC_DATADOG_ENV,
      version: process.env.NEXT_PUBLIC_DATADOG_VERSION || '1.0.0',
    };

    console.log('[Datadog] Config:', {
      applicationId: config.applicationId ? '✓ Set' : '✗ Missing',
      clientToken: config.clientToken ? '✓ Set' : '✗ Missing',
      site: config.site,
      service: config.service,
      env: config.env,
      version: config.version,
    });

    try {
      datadogRum.init({
        applicationId: config.applicationId,
        clientToken: config.clientToken,
        site: config.site,
        service: config.service,
        env: config.env,
        version: config.version,
        sessionSampleRate: 100,
        sessionReplaySampleRate: 100,
        trackUserInteractions: true,
        trackResources: true,
        trackLongTasks: true,
        defaultPrivacyLevel: 'mask-user-input',
      });

      console.log('[Datadog] Init called successfully');

      datadogRum.startSessionReplayRecording();
      console.log('[Datadog] Session replay recording started');
    } catch (error) {
      console.error('[Datadog] Initialization error:', error);
    }
  }, []);

  return null;
}
