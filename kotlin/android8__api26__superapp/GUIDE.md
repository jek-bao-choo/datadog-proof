# RUM-to-APM Correlation Guide

## Why RUM-to-APM Correlation Requires Both Client AND Server Instrumentation

Datadog RUM-to-APM correlation works by propagating trace context from the mobile client to the backend server:

1. **Client side (RUM)**: The Android SDK's `DatadogInterceptor` and `TracingInterceptor` inject `x-datadog-trace-id` and `x-datadog-parent-id` headers into outgoing HTTP requests
2. **Server side (APM)**: The backend must be running `dd-java-agent` (or equivalent) to read those headers, continue the trace, and report spans to Datadog

If the server is **not** instrumented, the trace headers are ignored and no correlated APM trace appears in the Datadog RUM Traces tab.

## What We Verified

The remote server at `34.8.246.70.nip.io` does **not** return Datadog trace headers in its responses — it is not running `dd-java-agent`. This means:

- RUM resources (network requests) are captured correctly
- But clicking on a RUM resource shows **no correlated APM trace** in the Traces tab
- The "Test API" button confirms the server responds, but without APM instrumentation

## Workaround: Port-Forwarded GKE Spring Boot App

To verify RUM-to-APM correlation end-to-end, we use a Spring Boot app deployed on GKE that **is** instrumented with `dd-java-agent`.

### Setup

1. **Port-forward the instrumented pod to localhost:8080**:
   ```bash
   kubectl port-forward <pod-name> 8080:8080
   ```

2. **Android emulator routing**: The emulator uses `10.0.2.2` to reach the host machine's `localhost`. The app is configured to call `http://10.0.2.2:8080` for v2 API tests.

3. **Build and run** the Android app on the emulator.

### How to Use

1. Ensure the port-forward is active (`kubectl port-forward <pod> 8080:8080`)
2. Open the app on the emulator
3. Scroll to the **Testing** category
4. Tap **"Test API v2"** — this calls the port-forwarded Spring Boot app
5. Verify the dialog shows successful responses (GET, POST, PUT)
6. In Datadog RUM, find the session and click on a `10.0.2.2` resource
7. The **Traces** tab should now show a correlated APM trace from the Spring Boot app

### Comparison

| Button | Target | Server Instrumented? | RUM-to-APM Correlation? |
|--------|--------|---------------------|------------------------|
| Test API | `34.8.246.70.nip.io` | No | No |
| Test API v2 | `10.0.2.2:8080` (port-forwarded GKE) | Yes (`dd-java-agent`) | Yes |
