#!/bin/bash

echo "Testing Spring Boot Application Endpoints"
echo "========================================"

# Test GET endpoint
echo "Testing GET /api/data..."
curl -X GET http://localhost:8080/api/data \
  -H "Content-Type: application/json" \
  -v
echo -e "\n\n"

# Test POST endpoint
echo "Testing POST /api/submit..."
curl -X POST http://localhost:8080/api/submit \
  -H "Content-Type: application/json" \
  -d '{"data": "test payload", "id": 123}' \
  -v
echo -e "\n\n"

# Test PUT endpoint
echo "Testing PUT /api/status..."
curl -X PUT http://localhost:8080/api/status \
  -H "Content-Type: application/json" \
  -v
echo -e "\n\n"

echo "Testing complete!"