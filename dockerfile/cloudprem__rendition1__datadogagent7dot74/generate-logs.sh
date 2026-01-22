#!/bin/bash
# Log Generator Script
# This script helps you generate test logs that will be collected by the Datadog agent

echo "=== Datadog Agent Log Generator ==="
echo ""
echo "Choose an option:"
echo "1. Start continuous log generator (outputs every second)"
echo "2. Generate 10 test log entries"
echo "3. Generate logs with different levels (INFO, WARN, ERROR)"
echo "4. Stop all log generators"
echo ""
read -p "Enter your choice (1-4): " choice

case $choice in
  1)
    echo "Starting continuous log generator..."
    docker run -d --name log-generator \
      --label owner=jek \
      --label env=test \
      alpine sh -c 'while true; do echo "{\"message\":\"Test log with custom attributes\",\"timestamp\":\"$(date -Iseconds)\",\"owner\":\"jek\",\"env\":\"test\",\"level\":\"info\"}"; sleep 1; done'
    echo "✓ Log generator started with JSON logs!"
    echo "  - Outputs JSON format logs"
    echo "  - Custom attributes: owner=jek, env=test"
    echo "View logs in CloudPrem: http://localhost:7280/logs"
    echo "To stop: docker stop log-generator && docker rm log-generator"
    ;;

  2)
    echo "Generating 10 test log entries..."
    docker run --rm \
      --label owner=jek \
      --label env=test \
      alpine sh -c 'for i in $(seq 1 10); do echo "{\"message\":\"Test log entry $i of 10\",\"timestamp\":\"$(date -Iseconds)\",\"owner\":\"jek\",\"env\":\"test\",\"entry_number\":$i}"; sleep 0.5; done'
    echo "✓ Done! Check CloudPrem in 30 seconds for JSON logs with owner=jek, env=test"
    ;;

  3)
    echo "Starting multi-level log generator..."
    docker run -d --name app-simulator \
      --label owner=jek \
      --label env=test \
      alpine sh -c '
    while true; do
      echo "{\"message\":\"Application running normally\",\"timestamp\":\"$(date -Iseconds)\",\"owner\":\"jek\",\"env\":\"test\",\"level\":\"info\"}"
      sleep 2
      echo "{\"message\":\"Memory usage at 85%\",\"timestamp\":\"$(date -Iseconds)\",\"owner\":\"jek\",\"env\":\"test\",\"level\":\"warn\",\"memory_percent\":85}"
      sleep 2
      echo "{\"message\":\"Database connection failed\",\"timestamp\":\"$(date -Iseconds)\",\"owner\":\"jek\",\"env\":\"test\",\"level\":\"error\",\"error_code\":\"DB_CONN_FAIL\"}"
      sleep 2
      echo "{\"message\":\"Processing request\",\"timestamp\":\"$(date -Iseconds)\",\"owner\":\"jek\",\"env\":\"test\",\"level\":\"debug\",\"request_id\":\"$(date +%s)\"}"
      sleep 2
    done'
    echo "✓ Multi-level log generator started with JSON logs!"
    echo "  - Outputs JSON format logs"
    echo "  - Custom attributes: owner=jek, env=test"
    echo "  - Multiple log levels: info, warn, error, debug"
    echo "View logs in CloudPrem: http://localhost:7280/logs"
    echo "To stop: docker stop app-simulator && docker rm app-simulator"
    ;;

  4)
    echo "Stopping all log generators..."
    docker stop log-generator app-simulator 2>/dev/null
    docker rm log-generator app-simulator 2>/dev/null
    echo "✓ All log generators stopped"
    ;;

  *)
    echo "Invalid choice. Please run the script again and choose 1-4."
    exit 1
    ;;
esac
