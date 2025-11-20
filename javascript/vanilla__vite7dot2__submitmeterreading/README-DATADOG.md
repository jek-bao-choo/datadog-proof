You should see:
```json
"dependencies": {
  "@datadog/browser-rum": "^6.24.1"
}
```

#### 3. Start Development

```bash
npm run dev
```

The app will start on `http://localhost:5173/` with Datadog monitoring active.

---

## Configuration Details

Datadog is initialized in `src/datadog-init.js` with these settings:

```javascript
datadogRum.init({
  applicationId: 'XXXXXX',  // Your Datadog app ID
  clientToken: 'YYYYYYY',     // Public client token
  site: 'datadoghq.com',                                  // Datadog region (US)
  service: 'vanilla__vite7dot2__submitmeterreading',      // Service name
  env: 'testv4',                                          // Environment name
  sessionSampleRate: 100,                                 // Track 100% of sessions
  sessionReplaySampleRate: 100,                           // Record 100% of sessions
  trackResources: true,                                   // Track API calls and assets
  trackLongTasks: true,                                   // Track slow operations
  trackUserInteractions: true,                            // Track clicks and inputs
  trackBfcacheViews: true,                                // Track back/forward cache
  defaultPrivacyLevel: 'mask-user-input',                 // Mask sensitive inputs

  // RUM-to-APM connection: Links frontend traces with backend APM traces
  allowedTracingUrls: [
    'https://XXXXXXXXXX.com'                              // From environment variable
  ],
});
```

#### 1. Local Testing

After running `npm run dev`:

1. Open `http://localhost:5173/` in browser
2. Open DevTools → Console
3. Confirm: `"Datadog RUM initialized"` appears
4. Open DevTools → Network tab
5. Look for requests to: `browser-intake-datadoghq.com`
6. Status should be: **200 OK**

#### 2. Datadog Dashboard

1. Log in to: https://app.datadoghq.com/
2. Navigate to: **RUM → Applications**
3. Select: `vanilla__vite7dot2__submitmeterreading`
4. You should see:
   - Active sessions
   - Page views
   - User actions
   - Performance metrics

**Note:** Data appears in the dashboard within **1-2 minutes** of user activity.

#### 3. Session Replays

1. In Datadog dashboard: **RUM → Sessions**
2. Click on any session
3. Click **"Replay"** button
4. Watch the session replay (like a video of user interactions)

**Privacy Note:** Input fields are automatically masked due to `defaultPrivacyLevel: 'mask-user-input'`

---

## Troubleshooting

### Issue: No Datadog initialization message in console

**Symptoms:**
- Console doesn't show "Datadog RUM initialized"
- No network requests to Datadog

**Solutions:**
1. Verify `src/datadog-init.js` exists
2. Check `src/main.js` has `import './datadog-init.js'` as first line
3. Clear browser cache and hard reload (Ctrl+Shift+R)
4. Check browser console for JavaScript errors
