#!/bin/bash
# Clear CloudPrem Logs Script
# This script stops CloudPrem, deletes all log data, and restarts it

echo "=== Clear CloudPrem Logs ==="
echo ""
echo "⚠️  WARNING: This will permanently delete ALL logs in CloudPrem!"
echo ""
read -p "Are you sure you want to continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "Aborted."
    exit 0
fi

echo ""
echo "1. Stopping CloudPrem container..."
docker stop cloudprem

echo "2. Finding CloudPrem data directory..."
QWDATA_PATH=$(docker inspect cloudprem 2>/dev/null | grep -A 1 '"Source"' | grep qwdata | cut -d'"' -f4)

if [ -z "$QWDATA_PATH" ]; then
    echo "❌ Could not find CloudPrem data directory"
    echo "Looking for qwdata directories..."
    find ~ -name "qwdata" -type d 2>/dev/null
    exit 1
fi

echo "3. Found data at: $QWDATA_PATH"
echo "   Current size: $(du -sh "$QWDATA_PATH" | cut -f1)"

echo "4. Deleting all log data..."
rm -rf "$QWDATA_PATH"/*

echo "5. Verifying deletion..."
if [ -z "$(ls -A "$QWDATA_PATH")" ]; then
    echo "   ✅ Directory is now empty"
else
    echo "   ⚠️  Some files remain:"
    ls -la "$QWDATA_PATH"
fi

echo "6. Restarting CloudPrem..."
docker start cloudprem

echo ""
echo "✅ Done! CloudPrem has been cleared and restarted."
echo "Visit http://localhost:7280/logs to verify logs are cleared"
