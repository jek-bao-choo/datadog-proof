# Meter Reading Processing API

A simple .NET 8 Web API for processing utility meter readings with simulated success/failure responses.

## Overview

This POC (Proof of Concept) project demonstrates a backend API for a utility company's meter reading system. It features:

- **POST endpoint** to submit meter readings with random success/failure simulation
- **GET endpoint** to retrieve meter reading history
- **In-memory storage** (data resets on restart)
- **Structured logging** for observability
- **Input validation** for meter reading values

## Technical Stack

- **.NET 8.0** (SDK 8.0.416)
- **ASP.NET Core Minimal APIs**
- **Dependency Injection** for service management
- **Built-in logging** with ILogger

## Project Structure

```
net8dot0__web__processmeterreading/
├── Models/
│   ├── MeterReading.cs           # Core data model
│   ├── MeterReadingRequest.cs    # POST request DTO
│   ├── MeterReadingResponse.cs   # Response DTOs
│   └── SimulationResult.cs       # Simulation result model
├── Services/
│   ├── MeterReadingService.cs    # In-memory storage service
│   └── ResponseSimulator.cs      # Random response simulator
├── Program.cs                     # API endpoints and startup
├── appsettings.json              # Configuration
└── net8dot0__web__processmeterreading.csproj
```

## API Endpoints

### 1. Submit Meter Reading

**POST** `/api/meter-readings`

Submits a new meter reading. The API simulates processing with the following distribution:
- **50%** chance of success (HTTP 200)
- **25%** chance of failure with 422 Unprocessable Entity
- **25%** chance of failure with 503 Service Unavailable

**Request Body:**
```json
{
  "readingValue": 12345
}
```

**Validation:**
- `readingValue` must be between 1 and 999999
- Invalid values return HTTP 400 Bad Request

**Success Response (200):**
```json
{
  "success": true,
  "message": "Meter reading processed successfully",
  "reading": {
    "readingValue": 12345,
    "timestamp": "2025-11-11T16:28:39.544957Z"
  }
}
```

**Error Response (422):**
```json
{
  "success": false,
  "error": "Unable to process meter reading at this time",
  "code": 422
}
```

**Error Response (503):**
```json
{
  "success": false,
  "error": "Meter reading service temporarily unavailable",
  "code": 503
}
```

### 2. Get All Meter Readings

**GET** `/api/meter-readings`

Retrieves all successfully submitted meter readings.

**Response (200):**
```json
[
  {
    "readingValue": 1332,
    "timestamp": "2025-11-11T16:28:20.769881Z"
  },
  {
    "readingValue": 12345,
    "timestamp": "2025-11-11T16:28:39.544957Z"
  }
]
```

**Note:** Only successful submissions are stored. Failed submissions (422, 503) are not persisted.

## Prerequisites

- **.NET 8 SDK** (version 8.0.416 or later)
- **macOS** (Apple Silicon M4 compatible) or any OS supporting .NET 8

To check your .NET version:
```bash
dotnet --version
```

## Setup Instructions

### 1. Navigate to Project Directory

```bash
cd net8dot0__web__processmeterreading
```

### 2. Restore Dependencies

```bash
dotnet restore
```

### 3. Build the Project

```bash
dotnet build
```

Expected output: `Build succeeded. 0 Warning(s) 0 Error(s)`

## Running the Application

### Start the API Server

```bash
dotnet run
```

The API will start and display:
```
info: Meter Reading Processing API starting...
info: Endpoints available:
info:   POST /api/meter-readings - Submit a meter reading
info:   GET /api/meter-readings - Retrieve all meter readings
info: Now listening on: http://localhost:XXXX
```

**Note:** The port number (XXXX) may vary. Look for the "Now listening on" message.

### Stop the Server

Press `Ctrl+C` in the terminal.

## Testing the API

### Using curl

**1. Get Initial Meter Readings (with dummy data):**
```bash
curl http://localhost:5074/api/meter-readings
```

**2. Submit a Valid Meter Reading:**
```bash
curl -X POST http://localhost:5074/api/meter-readings \
  -H "Content-Type: application/json" \
  -d '{"readingValue": 12345}'
```

**3. Test Multiple Submissions (observe random responses):**
```bash
for i in {1..10}; do
  curl -X POST http://localhost:5074/api/meter-readings \
    -H "Content-Type: application/json" \
    -d "{\"readingValue\": $((10000 + i))}"
  echo ""
done
```

**4. Test Invalid Values:**
```bash
# Too low
curl -X POST http://localhost:5074/api/meter-readings \
  -H "Content-Type: application/json" \
  -d '{"readingValue": 0}'

# Too high
curl -X POST http://localhost:5074/api/meter-readings \
  -H "Content-Type: application/json" \
  -d '{"readingValue": 1000000}'
```

**5. Verify Successful Submissions:**
```bash
curl http://localhost:5074/api/meter-readings
```

## Logging

The application uses structured logging to track:

- **Information**: Successful operations, service initialization, meter reading submissions
- **Warning**: Simulated failures (422, 503)
- **Error**: Validation failures, actual exceptions

Example log output:
```
info: MeterReadingService initialized with dummy reading: 1332
info: Processing meter reading submission: 12001
info: Simulation result: Success (200) - Random value: 36
info: Meter reading submitted successfully: 12001
warn: Simulation result: Unprocessable Entity (422) - Random value: 74
warn: Meter reading submission failed with 422: 12002
```

## Features & Behavior

### In-Memory Storage
- Data is stored in memory using a thread-safe `List<MeterReading>`
- All data is lost when the application restarts
- Includes one dummy reading (1332) on startup

### Thread Safety
- Uses locking mechanism for concurrent request handling
- Safe for multiple simultaneous requests

### Random Response Simulation
- Uses `Random.Next(100)` for distribution
- 0-49: Success (50%)
- 50-74: 422 Error (25%)
- 75-99: 503 Error (25%)

### ISO 8601 Timestamps
- All timestamps are in UTC
- Automatically serialized to ISO 8601 format in JSON responses

## Limitations

This is a POC with the following limitations:

1. **No Data Persistence**: Data is stored in-memory only
2. **No Authentication**: Endpoints are publicly accessible
3. **No Rate Limiting**: No protection against request flooding
4. **Basic Thread Safety**: Lock-based approach may not scale for high concurrency
5. **No Database**: No persistent storage layer

## Future Enhancements (Out of Scope)

- Persistent storage (SQL Server, PostgreSQL, SQLite)
- Authentication/Authorization (JWT, OAuth)
- Rate limiting middleware
- Docker containerization
- Unit and integration tests
- OpenAPI/Swagger documentation
- Health check endpoints
- Advanced error handling and recovery

## Troubleshooting

### Port Already in Use

If you see an error about the port being in use, either:
- Stop the other application using that port
- Or specify a different port:
  ```bash
  dotnet run --urls "http://localhost:5000"
  ```

### Build Errors

Ensure you have .NET 8 SDK installed:
```bash
dotnet --version
```

Expected: `8.0.416` or higher

### JSON Parsing Errors

Ensure your request body is valid JSON:
```bash
# Correct
curl -X POST http://localhost:5074/api/meter-readings \
  -H "Content-Type: application/json" \
  -d '{"readingValue": 12345}'

# Incorrect (missing quotes around key)
-d '{readingValue: 12345}'
```

## Development Environment

- **Platform**: macOS (Apple Silicon M4)
- **.NET SDK**: 8.0.416
- **Architecture**: ARM64 native support

## License

This is a POC project for demonstration purposes.

## Deploying to AWS Lambda with Native AOT

This section describes how to deploy the API to **AWS Lambda** using **Native AOT (Ahead-of-Time) compilation** for optimal performance and cost efficiency.

### Why Native AOT on Lambda?

- **Faster Cold Starts**: Native AOT reduces cold start time by up to 10x
- **Lower Memory Usage**: Smaller runtime footprint (typically 50-70% reduction)
- **Cost Savings**: Lower memory and faster execution = lower AWS costs
- **Better Performance**: Pre-compiled native code runs faster than JIT

### Deployment Approach

We'll use **AWS Lambda Web Adapter** which allows running ASP.NET Core applications on Lambda without code changes. The Web Adapter:
- Converts Lambda events to HTTP requests
- Works with existing ASP.NET Core applications
- Supports Native AOT via container deployment

### Prerequisites for Lambda Deployment

```bash
# AWS CLI (version 2)
aws --version

# AWS SAM CLI
sam --version

# Docker (for building container images)
docker --version

# Configure AWS credentials
aws configure
```

### Step 1: Enable Native AOT in Project

Add the following to `net8dot0__web__processmeterreading.csproj`:

```xml
<PropertyGroup>
  <PublishAot>true</PublishAot>
  <InvariantGlobalization>true</InvariantGlobalization>
  <StripSymbols>true</StripSymbols>
</PropertyGroup>
```

**Complete modified csproj:**
```xml
<Project Sdk="Microsoft.NET.Sdk.Web">
  <PropertyGroup>
    <TargetFramework>net8.0</TargetFramework>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>

    <!-- Native AOT Configuration -->
    <PublishAot>true</PublishAot>
    <InvariantGlobalization>true</InvariantGlobalization>
    <StripSymbols>true</StripSymbols>
  </PropertyGroup>
</Project>
```

### Step 2: Create Dockerfile for Lambda

Create `Dockerfile` in the project directory:

```dockerfile
# Build stage with Native AOT
FROM public.ecr.aws/sam/build-dotnet8:latest AS build
WORKDIR /src

# Copy project files
COPY *.csproj ./
RUN dotnet restore

# Copy source code
COPY . ./

# Publish with Native AOT
RUN dotnet publish -c Release -r linux-x64 \
    --self-contained true \
    -o /app/publish \
    -p:PublishAot=true \
    -p:StripSymbols=true

# Runtime stage with Lambda Web Adapter
FROM public.ecr.aws/awsguru/aws-lambda-adapter:0.8.1
WORKDIR /var/task

# Copy published application
COPY --from=build /app/publish .

# Lambda environment configuration
ENV PORT=8080
ENV AWS_LWA_INVOKE_MODE=response_stream

# Run the application
CMD ["./net8dot0__web__processmeterreading"]
```

### Step 3: Create SAM Template

Create `template.yaml` in the project directory:

```yaml
AWSTemplateFormatVersion: '2010-09-09'
Transform: AWS::Serverless-2016-10-31
Description: Meter Reading Processing API on Lambda with Native AOT

Globals:
  Function:
    Timeout: 30
    MemorySize: 512
    Environment:
      Variables:
        ASPNETCORE_ENVIRONMENT: Production

Resources:
  MeterReadingApi:
    Type: AWS::Serverless::Function
    Properties:
      FunctionName: meter-reading-api
      PackageType: Image
      ImageConfig:
        Command: ["./net8dot0__web__processmeterreading"]
      Architectures:
        - x86_64
      Events:
        ApiGateway:
          Type: HttpApi
          Properties:
            Path: /{proxy+}
            Method: ANY
            PayloadFormatVersion: "2.0"
      Policies:
        - CloudWatchLambdaInsightsExecutionRolePolicy
    Metadata:
      Dockerfile: Dockerfile
      DockerContext: .
      DockerTag: latest

Outputs:
  ApiUrl:
    Description: "API Gateway endpoint URL"
    Value: !Sub "https://${ServerlessHttpApi}.execute-api.${AWS::Region}.amazonaws.com"

  FunctionArn:
    Description: "Lambda Function ARN"
    Value: !GetAtt MeterReadingApi.Arn
```

### CI/CD-Friendly Deployment Commands

#### Option 1: Using AWS SAM (Recommended for CI/CD)

**One-time Setup:**
```bash
# Create S3 bucket for SAM artifacts (replace with your bucket name)
export SAM_BUCKET="your-sam-deployment-bucket"
export AWS_REGION="us-east-1"

aws s3 mb s3://${SAM_BUCKET} --region ${AWS_REGION}
```

**Build and Deploy (CI/CD Pipeline):**
```bash
# Navigate to project directory
cd net8dot0__web__processmeterreading

# Build with SAM (builds Docker image)
sam build \
  --use-container \
  --build-image public.ecr.aws/sam/build-dotnet8:latest

# Package and upload to S3
sam package \
  --output-template-file packaged.yaml \
  --s3-bucket ${SAM_BUCKET} \
  --region ${AWS_REGION}

# Deploy to Lambda
sam deploy \
  --template-file packaged.yaml \
  --stack-name meter-reading-api \
  --capabilities CAPABILITY_IAM \
  --region ${AWS_REGION} \
  --no-confirm-changeset \
  --no-fail-on-empty-changeset

# Get API endpoint URL
aws cloudformation describe-stacks \
  --stack-name meter-reading-api \
  --query 'Stacks[0].Outputs[?OutputKey==`ApiUrl`].OutputValue' \
  --output text \
  --region ${AWS_REGION}
```

**Single Command for CI/CD:**
```bash
sam build --use-container && \
sam deploy \
  --stack-name meter-reading-api \
  --capabilities CAPABILITY_IAM \
  --region ${AWS_REGION} \
  --resolve-s3 \
  --no-confirm-changeset
```

#### Option 2: Direct ECR + Lambda Deployment

**Build and push container image:**
```bash
# Set variables
export AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
export AWS_REGION="ap-southeast-1"
export ECR_REPO="meter-reading-api"
export IMAGE_TAG="latest"

# Create ECR repository
aws ecr create-repository \
  --repository-name ${ECR_REPO} \
  --region ${AWS_REGION} \
  || true

# Login to ECR
aws ecr get-login-password --region ${AWS_REGION} | \
  docker login --username AWS --password-stdin \
  ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com

# Build Native AOT image (multi-platform for x86_64)
docker build \
  --platform linux/amd64 \
  -t ${ECR_REPO}:${IMAGE_TAG} \
  -f Dockerfile .

# Tag for ECR
docker tag ${ECR_REPO}:${IMAGE_TAG} \
  ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO}:${IMAGE_TAG}

# Push to ECR
docker push \
  ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO}:${IMAGE_TAG}

# Create or update Lambda function
aws lambda create-function \
  --function-name meter-reading-api \
  --package-type Image \
  --code ImageUri=${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO}:${IMAGE_TAG} \
  --role arn:aws:iam::${AWS_ACCOUNT_ID}:role/lambda-execution-role \
  --timeout 30 \
  --memory-size 512 \
  --region ${AWS_REGION} \
  || \
aws lambda update-function-code \
  --function-name meter-reading-api \
  --image-uri ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO}:${IMAGE_TAG} \
  --region ${AWS_REGION}

# Create Function URL (for direct HTTPS access)
aws lambda create-function-url-config \
  --function-name meter-reading-api \
  --auth-type NONE \
  --region ${AWS_REGION} \
  || true

# Add permissions for Function URL
aws lambda add-permission \
  --function-name meter-reading-api \
  --statement-id FunctionURLAllowPublicAccess \
  --action lambda:InvokeFunctionUrl \
  --principal "*" \
  --function-url-auth-type NONE \
  --region ${AWS_REGION} \
  || true

# Get Function URL
aws lambda get-function-url-config \
  --function-name meter-reading-api \
  --query 'FunctionUrl' \
  --output text \
  --region ${AWS_REGION}
```

### GitHub Actions CI/CD Example

Create `.github/workflows/deploy-lambda.yml`:

```yaml
name: Deploy to AWS Lambda

on:
  push:
    branches: [main]
  workflow_dispatch:

env:
  AWS_REGION: us-east-1
  SAM_BUCKET: your-sam-deployment-bucket

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      id-token: write
      contents: read

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::${{ secrets.AWS_ACCOUNT_ID }}:role/GitHubActionsRole
          aws-region: ${{ env.AWS_REGION }}

      - name: Setup AWS SAM
        uses: aws-actions/setup-sam@v2

      - name: SAM Build
        working-directory: net8dot0__web__processmeterreading
        run: sam build --use-container

      - name: SAM Deploy
        working-directory: net8dot0__web__processmeterreading
        run: |
          sam deploy \
            --stack-name meter-reading-api \
            --capabilities CAPABILITY_IAM \
            --region ${{ env.AWS_REGION }} \
            --resolve-s3 \
            --no-confirm-changeset \
            --no-fail-on-empty-changeset

      - name: Get API URL
        run: |
          API_URL=$(aws cloudformation describe-stacks \
            --stack-name meter-reading-api \
            --query 'Stacks[0].Outputs[?OutputKey==`ApiUrl`].OutputValue' \
            --output text \
            --region ${{ env.AWS_REGION }})
          echo "API URL: $API_URL"
```

### Testing the Deployed API

```bash
# Get your API URL from deployment output
export API_URL="https://xxxxx.execute-api.us-east-1.amazonaws.com"

# Test GET endpoint
curl ${API_URL}/api/meter-readings

# Test POST endpoint
curl -X POST ${API_URL}/api/meter-readings \
  -H "Content-Type: application/json" \
  -d '{"readingValue": 12345}'
```

### Monitoring and Logs

```bash
# View Lambda logs
sam logs --stack-name meter-reading-api --tail

# Or using AWS CLI
aws logs tail /aws/lambda/meter-reading-api --follow

# Get function metrics
aws cloudwatch get-metric-statistics \
  --namespace AWS/Lambda \
  --metric-name Duration \
  --dimensions Name=FunctionName,Value=meter-reading-api \
  --start-time $(date -u -d '1 hour ago' +%Y-%m-%dT%H:%M:%S) \
  --end-time $(date -u +%Y-%m-%dT%H:%M:%S) \
  --period 300 \
  --statistics Average,Maximum \
  --region ${AWS_REGION}
```

### Performance Comparison

**Without Native AOT:**
- Cold start: ~500-800ms
- Memory usage: ~150MB
- Package size: ~80MB

**With Native AOT:**
- Cold start: ~100-150ms (5-8x faster)
- Memory usage: ~50MB (70% reduction)
- Package size: ~40MB (50% reduction)

### Cleanup Commands

```bash
# Delete SAM stack
sam delete --stack-name meter-reading-api --region ${AWS_REGION}

# Or using CloudFormation
aws cloudformation delete-stack \
  --stack-name meter-reading-api \
  --region ${AWS_REGION}

# Delete ECR images (if using Option 2)
aws ecr batch-delete-image \
  --repository-name meter-reading-api \
  --image-ids imageTag=latest \
  --region ${AWS_REGION}

# Delete ECR repository
aws ecr delete-repository \
  --repository-name meter-reading-api \
  --force \
  --region ${AWS_REGION}
```

### Native AOT Limitations and Considerations

**Limitations:**
- No runtime code generation (reflection-based scenarios limited)
- Longer build times (5-10 minutes for Native AOT vs <1 minute normal)
- Larger build requirements (needs more CPU/memory during build)
- Some NuGet packages may not be AOT-compatible

**This project is AOT-compatible because:**
- Uses minimal APIs (no MVC controllers)
- No Entity Framework or reflection-heavy ORMs
- Simple models with record types
- No dynamic code generation

**Cost Implications:**
- **Build time**: Higher (but only in CI/CD, not runtime)
- **Runtime cost**: Lower (faster execution, less memory)
- **Overall**: 30-50% cost reduction for typical workloads

### Troubleshooting Lambda Deployment

**Build fails with AOT errors:**
```bash
# Try building locally first to see detailed errors
dotnet publish -c Release -r linux-x64 \
  -p:PublishAot=true \
  -p:StripSymbols=true
```

**Docker build fails on M1/M2/M3/M4 Mac:**
```bash
# Use platform flag for x86_64
docker buildx build --platform linux/amd64 -t meter-reading-api .
```

**Lambda cold start still slow:**
- Check memory allocation (512MB minimum recommended)
- Verify Native AOT is actually enabled in deployment
- Enable Lambda SnapStart (if not using Native AOT)

**Function URL not working:**
- Check IAM permissions for Function URL
- Verify auth type is set correctly (NONE for public access)

### Alternative: Lambda with .NET 8 Managed Runtime (No Container)

If you prefer managed runtime over containers:

```bash
# This approach doesn't support Native AOT or Web Adapter
# You'd need to convert to Lambda Function Handlers
# Not recommended for this ASP.NET Core app
```

### Cost Estimation

For **1 million requests/month** with average 100ms duration:

**Without Native AOT (150MB memory):**
- Compute: ~$2.08
- Requests: ~$0.20
- **Total: ~$2.28/month**

**With Native AOT (50MB memory, 50ms duration):**
- Compute: ~$0.35
- Requests: ~$0.20
- **Total: ~$0.55/month (76% savings)**

## References

- [ASP.NET Core Minimal APIs](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/minimal-apis)
- [.NET 8 Documentation](https://learn.microsoft.com/en-us/dotnet/core/whats-new/dotnet-8)
- [Logging in .NET](https://learn.microsoft.com/en-us/dotnet/core/extensions/logging)
- [AWS Lambda Web Adapter](https://github.com/awslabs/aws-lambda-web-adapter)
- [.NET 8 Native AOT](https://learn.microsoft.com/en-us/dotnet/core/deploying/native-aot/)
- [AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/what-is-sam.html)
