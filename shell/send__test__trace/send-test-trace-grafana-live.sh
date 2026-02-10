#!/bin/bash
# Script to send OTLP trace test data to Grafana Cloud with CURRENT timestamps
# Usage: ./send-test-trace-grafana-live.sh

# Get the directory where the script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Load environment variables from .env file
ENV_FILE="$SCRIPT_DIR/.env"

if [ ! -f "$ENV_FILE" ]; then
  echo "✗ ERROR: .env file not found at $ENV_FILE"
  echo ""
  echo "Please create a .env file with your Grafana Cloud credentials."
  echo "You can use .env.example as a template:"
  echo "  cp .env.example .env"
  echo "  # Then edit .env with your credentials"
  exit 1
fi

# Load the .env file
source "$ENV_FILE"

# Check if required variables are set
if [ -z "$ENDPOINT" ] || [ -z "$AUTH_HEADER" ]; then
  echo "✗ ERROR: Missing required environment variables"
  echo ""
  echo "Please ensure your .env file contains:"
  echo "  - ENDPOINT"
  echo "  - AUTH_HEADER"
  exit 1
fi

echo "✓ Loaded configuration from .env"

# Generate temporary JSON file with current timestamps
TEMP_JSON="/tmp/otlp-trace-live-$$.json"

echo "Generating trace data with current timestamps..."

# Use Python to generate JSON with current nanosecond timestamps
python3 << 'EOF' > "$TEMP_JSON"
import time
import json

# Current time in nanoseconds
now_ns = int(time.time() * 1_000_000_000)

# Create span that started 5 minutes ago and ended now
start_time = now_ns - (5 * 60 * 1_000_000_000)
end_time = now_ns

trace_data = {
    "resourceSpans": [
        {
            "resource": {
                "attributes": [
                    {
                        "key": "service.name",
                        "value": {
                            "stringValue": "grafana-trace-test"
                        }
                    }
                ]
            },
            "scopeSpans": [
                {
                    "scope": {
                        "name": "my.library",
                        "version": "1.0.0",
                        "attributes": [
                            {
                                "key": "my.scope.attribute",
                                "value": {
                                    "stringValue": "some scope attribute"
                                }
                            }
                        ]
                    },
                    "spans": [
                        {
                            "traceId": "71699b6fe85982c7c8995ea3d9c95df2",
                            "spanId": "3c191d03fa8be066",
                            "name": "Jek v2 I'm a healthy client span",
                            "startTimeUnixNano": str(start_time),
                            "endTimeUnixNano": str(end_time),
                            "kind": 1,
                            "attributes": [
                                {
                                    "key": "my.span.attr",
                                    "value": {
                                        "stringValue": "some value"
                                    }
                                }
                            ],
                            "status": {
                                "code": 1
                            }
                        },
                        {
                            "traceId": "71699b6fe85982c7c8995ea3d9c95df2",
                            "spanId": "3c191d03fa8be067",
                            "parentSpanId": "3c191d03fa8be066",
                            "name": "Jek v2 I'm a error server span",
                            "startTimeUnixNano": str(start_time + 1_000_000_000),
                            "endTimeUnixNano": str(end_time),
                            "kind": 2,
                            "attributes": [
                                {
                                    "key": "my.span.attr",
                                    "value": {
                                        "stringValue": "some value"
                                    }
                                }
                            ],
                            "status": {
                                "code": 2
                            }
                        }
                    ]
                }
            ]
        }
    ]
}

print(json.dumps(trace_data, indent=4))
EOF

if [ $? -ne 0 ]; then
  echo "✗ ERROR: Failed to generate JSON"
  exit 1
fi

echo "✓ Trace data generated with current timestamps"

# Send trace data to Grafana Cloud
echo ""
echo "Sending trace to Grafana Cloud..."
echo ""

curl -v -X POST "$ENDPOINT" \
  -H "Content-Type: application/json" \
  -H "$AUTH_HEADER" \
  -d @"$TEMP_JSON" \
  -w "\n\nHTTP Status Code: %{http_code}\n" \
  -o /tmp/grafana-response.txt

CURL_EXIT_CODE=$?

# Clean up temp file
rm -f "$TEMP_JSON"

# Handle response
echo ""
echo "================================"

if [ $CURL_EXIT_CODE -eq 0 ]; then
  echo "✓ SUCCESS: Trace sent to Grafana Cloud / Datadog" 
  echo ""
  echo "Response body:"
  cat /tmp/grafana-response.txt
  echo ""
  echo "================================"
  echo ""
  echo "Next: Check Grafana Cloud / Datadog for service 'grafana-trace-test'"
  echo "      The trace should appear within 1-2 minutes"
  exit 0
else
  echo "✗ ERROR: Failed to send trace"
  echo "Curl exit code: $CURL_EXIT_CODE"
  exit 1
fi
