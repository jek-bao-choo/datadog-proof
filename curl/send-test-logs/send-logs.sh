#!/bin/bash

# Load environment variables from .env file
if [ -f ".env" ]; then
    source .env
else
    echo "Error: .env file not found!"
    echo "Please create a .env file with your DATADOG_API_KEY"
    exit 1
fi

# Validate that API key is set
if [ -z "$DATADOG_API_KEY" ] || [ "$DATADOG_API_KEY" = "YOUR_API_KEY_HERE" ]; then
    echo "Error: DATADOG_API_KEY is not set or still has placeholder value!"
    echo "Please update your .env file with a valid Datadog API key"
    exit 1
fi

# Define the log payload
LOG_PAYLOAD='{
    "ddsource": "jek-local-machine",
    "message": "jek-test-log-v1",
    "ddtags": "env:test,team:dd",
    "service": "jek-test-log",
    "hostname": "jek-localhost",
    "level": "info"
}'

# Datadog logs intake URL
DATADOG_URL="https://http-intake.logs.datadoghq.com/v1/input/$DATADOG_API_KEY"

echo "Sending test log to Datadog..."
echo "Payload: $LOG_PAYLOAD"

# Send the log to Datadog
RESPONSE=$(curl -X POST "$DATADOG_URL" \
    --header 'Content-Type: application/json' \
    --data-raw "$LOG_PAYLOAD" \
    --write-out "HTTPSTATUS:%{http_code}" \
    --silent)

# Extract HTTP status code and response body
HTTP_STATUS=$(echo $RESPONSE | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
RESPONSE_BODY=$(echo $RESPONSE | sed -e 's/HTTPSTATUS\:.*//g')

# Handle response
if [ $HTTP_STATUS -eq 200 ] || [ $HTTP_STATUS -eq 202 ]; then
    echo "✅ Success! Log sent to Datadog successfully"
    echo "HTTP Status: $HTTP_STATUS"
    if [ -n "$RESPONSE_BODY" ]; then
        echo "Response: $RESPONSE_BODY"
    fi
else
    echo "❌ Error! Failed to send log to Datadog"
    echo "HTTP Status: $HTTP_STATUS"
    echo "Response: $RESPONSE_BODY"
    exit 1
fi