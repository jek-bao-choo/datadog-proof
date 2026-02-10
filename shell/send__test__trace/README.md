# Quick Start: Send OTLP Trace

## Setup

### 1. Configure Environment Variables

Create a `.env` file with your Grafana Cloud credentials:

```bash
# Copy the example file
cp .env.example .env

# Edit .env with your credentials
nano .env  # or use your preferred editor
```

Update the `.env` file with your Grafana Cloud settings:

```bash
# Grafana Cloud OTLP endpoint
export ENDPOINT="https://otlp-gateway-prod-YOUR-REGION.grafana.net/otlp/v1/traces"

# Grafana Cloud authorization header (Base64 encoded credentials)
export AUTH_HEADER="Authorization: Basic YOUR_BASE64_ENCODED_CREDENTIALS"
```

Update the `.env` file with your Datadog settings:
```bash
export OTEL_EXPORTER_OTLP_TRACES_PROTOCOL="http/protobuf"
export OTEL_EXPORTER_OTLP_TRACES_ENDPOINT="https://otlp.datadoghq.com/v1/traces"
export OTEL_EXPORTER_OTLP_TRACES_HEADERS="dd-api-key=<dd-api-key>,dd-otlp-source=US1"
```


**Where to find your credentials:**
- Get them from your Grafana Cloud portal under "OTLP Configuration"
- The endpoint includes your region (e.g., `us-central-1`, `ap-southeast-1`)
- The authorization header contains your encoded instance ID and API token

### 2. Send Test Traces

## Send to Grafana Cloud

### Live Timestamps
Send a test trace with **current timestamps** (generates fresh data each time):

```bash
cd shell/send__test__trace
./send-test-trace-grafana-live.sh
```

This script automatically generates trace data from the last 5 minutes, so it will always appear in Grafana's "Last 30 minutes" view.

### Important Notes
- **Setup required:** You must configure `.env` with your Grafana Cloud credentials (see Setup section above)
- **Timestamps matter!** Grafana only shows traces within your selected time range
- The live script generates data from "5 minutes ago to now"
- Credentials are stored in `.env` file (keep this file secure and don't commit to git)
- Data typically appears in Grafana within 1-2 minutes

### Security Note
- Add `.env` to your `.gitignore` to avoid committing credentials
- Use `.env.example` as a template for others to set up their own credentials
