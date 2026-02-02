#!/bin/bash
# Script to send OTLP trace test data to Datadog
# Usage: ./send-test-trace.sh YOUR_API_KEY

# Step 2: Check if API key is provided
if [ -z "$1" ]; then
  echo "Error: API key is required"
  echo "Usage: ./send-test-trace.sh YOUR_API_KEY"
  exit 1
fi

# Store API key in variable
API_KEY="$1"
echo "✓ API key received"

# Step 3: Check if JSON file exists
JSON_FILE="otlp-trace-test.json"

if [ ! -f "$JSON_FILE" ]; then
  echo "Error: $JSON_FILE not found"
  echo "Please make sure the file exists in the current directory"
  exit 1
fi

echo "✓ JSON file found: $JSON_FILE"

# Step 4: Send trace to Datadog OTLP endpoint
echo ""
echo "Sending trace to Datadog..."
echo ""

# Datadog OTLP endpoint
ENDPOINT="https://otlp.app.datadoghq.com/v1/traces"

# Execute curl command with verbose output
curl -v -X POST "$ENDPOINT" \
  -H "Content-Type: application/json" \
  -H "dd-api-key: $API_KEY" \
  -d @"$JSON_FILE" \
  -w "\n\nHTTP Status Code: %{http_code}\n" \
  -o /tmp/datadog-response.txt

# Store the exit code
CURL_EXIT_CODE=$?

# Step 5: Handle response
echo ""
echo "================================"

if [ $CURL_EXIT_CODE -eq 0 ]; then
  echo "✓ SUCCESS: Trace sent to Datadog"
  echo ""
  echo "Response body:"
  cat /tmp/datadog-response.txt
  echo ""
  echo "================================"
  echo ""
  echo "Next: Check your Datadog APM for service 'trace-test-v5'"
  exit 0
else
  echo "✗ ERROR: Failed to send trace"
  echo "Curl exit code: $CURL_EXIT_CODE"
  exit 1
fi

