# Meter Reading Processing Lambda Function

A .NET 8 AWS Lambda function for processing utility meter readings with API Gateway integration. This is a proof-of-concept (PoC) for a utility company's meter reading system.

## Overview

This Lambda function provides two HTTP endpoints:
- **GET**: Retrieve all submitted meter reading history
- **POST**: Submit a new meter reading with randomized success/failure simulation

### Key Features

- **In-Memory Storage**: Meter readings stored in memory (resets on Lambda cold starts)
- **Random Response Logic**: Simulates real-world service behavior
  - 50% Success (HTTP 200)
  - 25% Client Errors (HTTP 400, 422)
  - 25% Server Errors (HTTP 500, 503)
- **Input Validation**: Validates meter reading values (1-999999)
- **ISO 8601 Timestamps**: All timestamps in standard format
- **Thread-Safe**: Concurrent request handling with proper locking

## Project Structure

```
lambda__globalcli__net8dot0__processmeterreading/
├── src/
│   └── lambda__globalcli__net8dot0__processmeterreading/
│       ├── Function.cs                      # Main Lambda handler
│       ├── Models/
│       │   ├── MeterReading.cs              # Reading data model
│       │   ├── MeterReadingRequest.cs       # POST request model
│       │   └── ErrorResponse.cs             # Error response model
│       ├── lambda__globalcli__net8dot0__processmeterreading.csproj
│       └── aws-lambda-tools-defaults.json   # Lambda deployment config
├── test/
│   └── lambda__globalcli__net8dot0__processmeterreading.Tests/
├── README.md                                # This file
├── 2-RESEARCH.md                           # Implementation research
└── 3-PLAN.md                               # Detailed implementation plan
```

## Prerequisites

- **.NET 8.0 SDK** or later
- **AWS CLI** configured with appropriate credentials
- **AWS Lambda Tools for .NET**:
  ```bash
  dotnet tool install -g Amazon.Lambda.Tools
  ```
- **AWS Permissions**:
  - lambda:UpdateFunctionCode
  - lambda:UpdateFunctionConfiguration
  - lambda:InvokeFunction
  - iam:PassRole (for Lambda execution role)

## Local Development

### Restore Dependencies

```bash
cd src/lambda__globalcli__net8dot0__processmeterreading
dotnet restore
```

### Build the Project

```bash
dotnet build -c Release
```

### Run Tests

```bash
cd ../../test/lambda__globalcli__net8dot0__processmeterreading.Tests
dotnet test
```

## Deployment

### 1. Build Deployment Package

```bash
cd src/lambda__globalcli__net8dot0__processmeterreading
dotnet lambda package -c Release -o deployment-package.zip
```

### 2. Deploy to AWS

```bash
dotnet lambda deploy-function lambda__globalcli__net8dot0__processmeterreading --region ap-southeast-1
```

The deployment uses the configuration from `aws-lambda-tools-defaults.json`:
- **Runtime**: .NET 8 (dotnet8)
- **Architecture**: x86_64
- **Memory**: 512 MB
- **Timeout**: 30 seconds
- **Handler**: `lambda__globalcli__net8dot0__processmeterreading::lambda__globalcli__net8dot0__processmeterreading.Function::Handler`

### 3. Verify Deployment

```bash
aws lambda get-function --function-name lambda__globalcli__net8dot0__processmeterreading --region ap-southeast-1
```

## Testing


### Test 1: Get Initial Meter Readings

Retrieves all meter readings (initially contains one dummy reading).

```bash
export API_URL="<Go to AWS Console get the API Gateway Endpoint URL>"
curl $API_URL
```

**Expected Response** (HTTP 200):
```json
[
  {
    "value": 1234,
    "timestamp": "2025-11-13T16:35:10.3297559Z"
  }
]
```

### Test 2: Submit a Valid Meter Reading

Submits a meter reading. Response is randomly one of:
- **50% chance**: Success (HTTP 200) with all readings
- **25% chance**: Client error (HTTP 400 or 422)
- **25% chance**: Server error (HTTP 500 or 503)

```bash
curl -X POST $API_URL \
  -H "Content-Type: application/json" \
  -d '{"readingValue": 12345}'
```

**Success Response** (HTTP 200):
```json
[
  {
    "value": 1234,
    "timestamp": "2025-11-13T16:35:10.3297559Z"
  },
  {
    "value": 12345,
    "timestamp": "2025-11-13T16:37:11.8880635Z"
  }
]
```

**Client Error Response** (HTTP 400):
```json
{
  "error": "Invalid meter reading format",
  "statusCode": 400,
  "details": "The submitted data format is incorrect"
}
```

**Client Error Response** (HTTP 422):
```json
{
  "error": "Meter reading value out of acceptable range",
  "statusCode": 422,
  "details": "The reading does not meet validation criteria"
}
```

**Server Error Response** (HTTP 500):
```json
{
  "error": "Database connection failure. Please try again later.",
  "statusCode": 500,
  "details": "Internal server error occurred"
}
```

**Server Error Response** (HTTP 503):
```json
{
  "error": "Service temporarily overloaded. Please retry in a few moments.",
  "statusCode": 503,
  "details": "The service is currently unavailable"
}
```

### Test 3: Multiple Submissions (Observe Random Responses)

Submit 10 meter readings to observe the distribution of success/error responses.

```bash
for i in {1..10}; do
  echo "=== Test $i ==="
  curl -X POST $API_URL \
    -H "Content-Type: application/json" \
    -d "{\"readingValue\": $((10000 + i))}"
  echo ""
done
```

You should observe approximately:
- 5 successful responses (200)
- 2-3 client errors (400, 422)
- 2-3 server errors (500, 503)

### Test 4: Invalid Meter Reading

Submit a reading outside the valid range (1-999999).

```bash
curl -X POST $API_URL \
  -H "Content-Type: application/json" \
  -d '{"readingValue": 2000000}'
```

**Expected Response** (HTTP 422):
```json
{
  "error": "Meter reading value must be between 1 and 999999",
  "statusCode": 422,
  "details": null
}
```

### Direct Lambda Invocation (for testing without API Gateway)

Create a test payload file:

```bash
cat > test-get.json << 'EOF'
{
  "httpMethod": "GET",
  "headers": {"Content-Type": "application/json"},
  "body": null,
  "isBase64Encoded": false,
  "requestContext": {"requestId": "test-get"}
}
EOF

aws lambda invoke \
  --function-name lambda__globalcli__net8dot0__processmeterreading \
  --region ap-southeast-1 \
  --cli-binary-format raw-in-base64-out \
  --payload file://test-get.json \
  response.json

cat response.json | jq .
```

## Architecture

### Request Flow

1. **API Gateway** receives HTTP request
2. **API Gateway** transforms request to `APIGatewayProxyRequest`
3. **Lambda Function** processes request:
   - Routes based on HTTP method (GET/POST)
   - For POST: Validates input and randomly determines outcome
   - Updates in-memory storage (for successful POST)
4. **Lambda Function** returns `APIGatewayProxyResponse`
5. **API Gateway** transforms response to HTTP response

### Data Storage

- **Type**: In-memory (static List)
- **Persistence**: Data persists during Lambda warm starts
- **Reset**: Data resets on Lambda cold starts
- **Thread Safety**: Protected with lock mechanism
- **Initialization**: Starts with one dummy reading (random 4-digit number)

### Random Error Simulation

The POST endpoint uses a random number generator (0-99) to determine the outcome:
- **0-49 (50%)**: Success → HTTP 200 with all readings
- **50-74 (25%)**: Client Error → HTTP 400 or 422
- **75-99 (25%)**: Server Error → HTTP 500 or 503

## API Reference

### GET /

Retrieves all meter reading history.

**Request**:
- Method: `GET`
- Headers: None required

**Response** (HTTP 200):
```json
[
  {
    "value": 12345,
    "timestamp": "2025-11-13T16:37:11.8880635Z"
  }
]
```

### POST /

Submits a new meter reading.

**Request**:
- Method: `POST`
- Headers: `Content-Type: application/json`
- Body:
  ```json
  {
    "readingValue": 12345
  }
  ```

**Success Response** (HTTP 200):
```json
[
  {
    "value": 1234,
    "timestamp": "2025-11-13T16:35:10.3297559Z"
  },
  {
    "value": 12345,
    "timestamp": "2025-11-13T16:37:11.8880635Z"
  }
]
```

**Error Response** (HTTP 4XX/5XX):
```json
{
  "error": "Error message",
  "statusCode": 400,
  "details": "Additional details"
}
```

## Error Handling

### Validation Errors (HTTP 422)

- Meter reading value < 1
- Meter reading value > 999999

### Client Errors (HTTP 400)

- Missing request body
- Invalid JSON format
- Missing readingValue field

### Server Errors (HTTP 500)

- Unexpected exceptions
- JSON serialization errors

### Method Not Allowed (HTTP 405)

- Unsupported HTTP methods (only GET and POST are supported)

## Monitoring and Debugging

### CloudWatch Logs

View logs in AWS CloudWatch:

```bash
aws logs tail /aws/lambda/lambda__globalcli__net8dot0__processmeterreading \
  --region ap-southeast-1 \
  --follow
```

### Key Log Messages

- `Received {method} request` - Request received
- `Processing meter reading: {value}` - POST request processing
- `Random outcome: {outcome}` - Random number generated (0-99)
- `Successfully added meter reading: {value}` - Reading added successfully
- `Returning {count} meter readings` - GET request response

## Troubleshooting

### Issue: Build Fails

**Solution**: Ensure .NET 8.0 SDK is installed
```bash
dotnet --version  # Should be 8.0.x or higher
```

### Issue: Deployment Fails - Credentials Error

**Solution**: Configure AWS credentials
```bash
aws configure
aws sts get-caller-identity  # Verify credentials
```

### Issue: Lambda Returns 405 Error

**Solution**: Check that API Gateway is configured to pass the correct HTTP method to Lambda. The function expects `request.HttpMethod` to be "GET" or "POST".

### Issue: In-Memory Data Lost

**Cause**: Lambda cold start occurred
**Solution**: This is expected behavior with in-memory storage. Data resets when Lambda container is recycled. For persistent storage, consider using DynamoDB.

### Issue: Always Getting Same Error Type

**Cause**: Random number generator might need better seeding
**Solution**: The current implementation uses `new Random()` which should provide adequate randomness for this PoC.

## macOS ARM64 (M4) Considerations

This project was developed on macOS ARM64 (M4 chip). The deployment automatically handles cross-compilation to Linux x86_64:

- **Build Target**: `linux-x64` (specified in deployment config)
- **Cross-Compilation**: Handled automatically by `dotnet lambda` tools
- **No Docker Required**: Native .NET tools handle architecture differences
- **PublishReadyToRun**: Enabled for improved cold start performance

## Security Considerations

- **No Secrets**: No hardcoded credentials or API keys
- **No PII**: No personally identifiable information stored
- **Input Validation**: All inputs validated before processing
- **Error Messages**: Error details exclude sensitive information
- **Public Repository Safe**: All code is safe to commit to public GitHub

## Performance

- **Cold Start**: ~1-2 seconds (optimized with PublishReadyToRun)
- **Warm Invocation**: ~50-100ms
- **Memory Usage**: < 100 MB typical
- **Package Size**: ~150 KB

## Limitations

1. **In-Memory Storage**: Data lost on cold starts
2. **No Authentication**: No API authentication implemented
3. **No Rate Limiting**: No request throttling
4. **Simulated Errors**: Error scenarios are simulated, not real failures
5. **Single Region**: Deployed to ap-southeast-1 only

## Future Enhancements

- [ ] Add DynamoDB for persistent storage
- [ ] Implement API authentication (API Gateway API Keys or Cognito)
- [ ] Add request validation with JSON schema
- [ ] Implement rate limiting
- [ ] Add metrics and alarms (CloudWatch)
- [ ] Support for batch submissions
- [ ] Add update/delete operations
- [ ] Implement pagination for GET endpoint

## Cleanup

To delete the Lambda function:

```bash
aws lambda delete-function \
  --function-name lambda__globalcli__net8dot0__processmeterreading \
  --region ap-southeast-1
```

To delete the entire CloudFormation stack (if using SAM):

```bash
aws cloudformation delete-stack \
  --stack-name lambda__globalcli__net8dot0__processmeterreading \
  --region ap-southeast-1
```

## License

This is a proof-of-concept project for educational and demonstration purposes.

## References

- [AWS Lambda for .NET](https://aws.amazon.com/lambda/dotnet/)
- [AWS Lambda Developer Guide](https://docs.aws.amazon.com/lambda/latest/dg/welcome.html)
- [.NET 8 Documentation](https://learn.microsoft.com/en-us/dotnet/core/whats-new/dotnet-8)
- [API Gateway Documentation](https://docs.aws.amazon.com/apigateway/)
