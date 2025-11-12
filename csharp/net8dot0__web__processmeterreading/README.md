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
- **Logging**: Microsoft.Extensions.Logging (built-in .NET logging framework)

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
├── AppJsonSerializerContext.cs   # JSON source generation for Native AOT
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

### Logging Framework

This project uses **Microsoft.Extensions.Logging**, the built-in .NET logging framework that comes with ASP.NET Core.

**What it includes:**
- Part of the .NET runtime (no additional packages required)
- Uses the `ILogger<T>` interface for dependency injection
- Configured via `appsettings.json`
- Outputs to console/stdout by default
- Supports structured logging with message templates

**Why Microsoft.Extensions.Logging?**
- Zero dependencies (built into .NET)
- Native AOT compatible
- Simple and lightweight for POC projects
- Easy to extend with providers (Serilog, NLog, Application Insights, etc.)

**Configuration:**

Located in `appsettings.json`:
```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  }
}
```

**Log Levels Used:**
- **Information**: Successful operations, service initialization, meter reading submissions
- **Warning**: Simulated failures (422, 503)
- **Error**: Validation failures, actual exceptions

**Example log output:**
```
info: net8dot0__web__processmeterreading.Services.MeterReadingService[0]
      MeterReadingService initialized with dummy reading: 1332
info: Program[0]
      Processing meter reading submission: 12001
info: net8dot0__web__processmeterreading.Services.ResponseSimulator[0]
      Simulation result: Success (200) - Random value: 36
info: net8dot0__web__processmeterreading.Services.MeterReadingService[0]
      Added meter reading: 12001 at 11/11/2025 16:28:39
info: Program[0]
      Meter reading submitted successfully: 12001
warn: net8dot0__web__processmeterreading.Services.ResponseSimulator[0]
      Simulation result: Unprocessable Entity (422) - Random value: 74
warn: Program[0]
      Meter reading submission failed with 422: 12002
```

**Usage in Code:**

```csharp
public class MeterReadingService
{
    private readonly ILogger<MeterReadingService> _logger;

    public MeterReadingService(ILogger<MeterReadingService> logger)
    {
        _logger = logger;
        _logger.LogInformation("Service initialized");
    }
}
```

**Alternative Logging Frameworks:**

If you need more advanced features, you can easily add:
- **Serilog** - Rich structured logging with many sinks (files, databases, cloud)
- **NLog** - Highly configurable with extensive documentation

To add Serilog, for example:
```bash
dotnet add package Serilog.AspNetCore
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

### Step 2: Configure global.json for Docker Build Compatibility

Update or create `global.json` to allow SDK version flexibility in Docker containers:

```json
{
  "sdk": {
    "version": "8.0.0",
    "rollForward": "latestMinor"
  }
}
```

**Why this is needed:**
- The SAM build container may not have your exact local SDK version
- `rollForward: "latestMinor"` allows any .NET 8.0.x version
- Prevents SDK version mismatch errors during Docker builds

**Alternative:** Add `global.json` to `.dockerignore` to skip SDK version checks entirely:

```
# .dockerignore
bin/
obj/
*.md
.git/
.gitignore
.vs/
.vscode/
*.user
*.suo
global.json
```

### Step 3: Add JSON Source Generation for Native AOT

Native AOT doesn't support reflection-based JSON serialization. Create `AppJsonSerializerContext.cs`:

```csharp
using System.Text.Json.Serialization;
using net8dot0__web__processmeterreading.Models;

namespace net8dot0__web__processmeterreading;

/// <summary>
/// JSON serializer context for Native AOT support.
/// This provides compile-time type information for JSON serialization.
/// </summary>
[JsonSerializable(typeof(MeterReading))]
[JsonSerializable(typeof(MeterReadingRequest))]
[JsonSerializable(typeof(SuccessResponse))]
[JsonSerializable(typeof(ErrorResponse))]
[JsonSerializable(typeof(List<MeterReading>))]
public partial class AppJsonSerializerContext : JsonSerializerContext
{
}
```

Update `Program.cs` to configure Kestrel and JSON serialization:

```csharp
// Configure Kestrel to listen on PORT environment variable (for Lambda Web Adapter)
var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";
builder.WebHost.ConfigureKestrel(serverOptions =>
{
    serverOptions.ListenAnyIP(int.Parse(port));
});

// Configure JSON serialization for Native AOT
builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.TypeInfoResolverChain.Insert(0, AppJsonSerializerContext.Default);
});
```

**Why Kestrel configuration is needed:**
- Lambda Web Adapter forwards requests to port 8080
- Default Kestrel binds to `localhost` which is not accessible from Lambda
- `ListenAnyIP()` binds to `0.0.0.0` making the app accessible to the adapter

Update all API responses to use explicit JSON serialization:

```csharp
// Example: GET endpoint
return Results.Json(readings, AppJsonSerializerContext.Default.ListMeterReading);

// Example: Success response
return Results.Json(
    new SuccessResponse(Success: true, Message: message, Reading: reading),
    AppJsonSerializerContext.Default.SuccessResponse
);

// Example: Error response
return Results.Json(
    new ErrorResponse(Success: false, Error: message, Code: 400),
    AppJsonSerializerContext.Default.ErrorResponse,
    statusCode: 400
);
```

### Step 4: Create Dockerfile for Lambda

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

# Publish with Native AOT for ARM64
RUN dotnet publish -c Release -r linux-arm64 \
    --self-contained true \
    -o /app/publish \
    -p:PublishAot=true \
    -p:StripSymbols=true

# Set executable permissions in build stage
RUN chmod +x /app/publish/net8dot0__web__processmeterreading

# Runtime stage - Use Amazon Linux 2023 with Lambda Web Adapter
FROM public.ecr.aws/lambda/provided:al2023

# Install Lambda Web Adapter extension
COPY --from=public.ecr.aws/awsguru/aws-lambda-adapter:0.8.4 /lambda-adapter /opt/extensions/lambda-adapter

# Copy published application with permissions already set
COPY --from=build /app/publish /var/task/

# Lambda environment configuration
ENV PORT=8080
ENV ASPNETCORE_URLS=http://+:8080

# Create bootstrap script that Lambda expects
RUN echo '#!/bin/sh' > /var/runtime/bootstrap && \
    echo 'cd /var/task' >> /var/runtime/bootstrap && \
    echo 'exec ./net8dot0__web__processmeterreading' >> /var/runtime/bootstrap && \
    chmod +x /var/runtime/bootstrap
```

**Key changes from basic Dockerfile:**
- Uses `public.ecr.aws/lambda/provided:al2023` as runtime base
- Lambda Web Adapter installed as extension layer
- Creates bootstrap script for Lambda custom runtime
- Permissions set in build stage (has shell available)
- Removed `AWS_LWA_INVOKE_MODE=response_stream` (not needed with explicit JSON serialization)

### Step 5: Create SAM Template

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
        ASPNETCORE_ENVIRONMENT: Development
    Tags:
      Environment: development
      Project: meter-reading-api

Resources:
  MeterReadingApi:
    Type: AWS::Serverless::Function
    Properties:
      FunctionName: jek-meter-reading-api
      PackageType: Image
      ImageConfig:
        Command: ["./net8dot0__web__processmeterreading"]
      Architectures:
        - arm64
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

AWS SAM can **automatically create and manage** S3 buckets and ECR repositories for you. You have three deployment approaches:

##### Option 1A: Simplest - Fully Automated (Recommended)

**No manual S3 or ECR creation required!** SAM creates everything automatically.

- Ensure I have Docker Desktop running on my Mac before running the command.

```bash
# Set your AWS region
export AWS_REGION="ap-southeast-1"

# Navigate to project directory
cd net8dot0__web__processmeterreading

# Build and deploy in one command
sam build --use-container && \
sam deploy \
  --stack-name jek-meter-reading-api \
  --capabilities CAPABILITY_IAM \
  --region ${AWS_REGION} \
  --resolve-s3 \
  --resolve-image-repos \
  --no-confirm-changeset

# Get API endpoint URL
aws cloudformation describe-stacks \
  --stack-name jek-meter-reading-api \
  --query 'Stacks[0].Outputs[?OutputKey==`ApiUrl`].OutputValue' \
  --output text \
  --region ${AWS_REGION}
  
```

#### Testing the Deployed Lambda API

After deployment, get your API endpoint URL:
```bash
aws cloudformation describe-stacks \
  --stack-name jek-meter-reading-api \
  --query 'Stacks[0].Outputs[?OutputKey==`ApiUrl`].OutputValue' \
  --output text \
  --region ap-southeast-1
```

Then test with curl (replace `$API_URL` with your actual endpoint):

**1. Get Initial Meter Readings (with dummy data):**
```bash
export API_URL="https://xxxxx.execute-api.ap-southeast-1.amazonaws.com"
curl $API_URL/api/meter-readings
```

**2. Submit a Valid Meter Reading:**
```bash
curl -X POST $API_URL/api/meter-readings \
  -H "Content-Type: application/json" \
  -d '{"readingValue": 12345}'
```

**3. Test Multiple Submissions (observe random responses):**
```bash
for i in {1..10}; do
  curl -X POST $API_URL/api/meter-readings \
    -H "Content-Type: application/json" \
    -d "{\"readingValue\": $((10000 + i))}"
  echo ""
done
```

**4. Verify Successful Submissions:**
```bash
curl $API_URL/api/meter-readings
```

**What SAM does automatically:**
- ✅ Creates S3 bucket for CloudFormation templates (with `--resolve-s3`)
- ✅ Creates ECR repository for Docker images (with `--resolve-image-repos`)
- ✅ Builds Docker image with Native AOT
- ✅ Pushes image to ECR
- ✅ Deploys Lambda function
- ✅ Creates API Gateway HTTP API
- ✅ Configures IAM roles and permissions

##### Option 1B: First-Time Interactive Setup

If you prefer to review settings before deployment:

```bash
# First deployment (interactive - SAM will prompt for settings)
cd net8dot0__web__processmeterreading

sam build --use-container

sam deploy \
  --guided \
  --capabilities CAPABILITY_IAM

# SAM will ask:
# - Stack Name: jek-meter-reading-api
# - AWS Region: ap-southeast-1 (or your preferred region)
# - Confirm changes: N (skip confirmation)
# - Allow SAM CLI IAM role creation: Y
# - Save arguments to configuration file: Y

# Subsequent deployments (uses saved config)
sam build --use-container && sam deploy
```

##### Option 1C: Manual S3 Bucket (For Reusable Infrastructure)

If you want to reuse the same S3 bucket across multiple projects:

```bash
# One-time setup: Create S3 bucket
export SAM_BUCKET="your-company-sam-deployments"
export AWS_REGION="ap-southeast-1"

aws s3 mb s3://${SAM_BUCKET} --region ${AWS_REGION}

# Build and deploy
cd net8dot0__web__processmeterreading

sam build --use-container

sam package \
  --output-template-file packaged.yaml \
  --s3-bucket ${SAM_BUCKET} \
  --region ${AWS_REGION}

sam deploy \
  --template-file packaged.yaml \
  --stack-name jek-meter-reading-api \
  --capabilities CAPABILITY_IAM \
  --region ${AWS_REGION} \
  --resolve-image-repos \
  --no-confirm-changeset

# Get API endpoint URL
aws cloudformation describe-stacks \
  --stack-name jek-meter-reading-api \
  --query 'Stacks[0].Outputs[?OutputKey==`ApiUrl`].OutputValue' \
  --output text \
  --region ${AWS_REGION}
```

**Summary of SAM Flags:**

| Flag | Purpose | Creates What |
|------|---------|--------------|
| `--resolve-s3` | Auto-create S3 bucket | Managed S3 bucket for templates |
| `--resolve-image-repos` | Auto-create ECR repository | Managed ECR repo for container images |
| `--guided` | Interactive setup | Saves config to `samconfig.toml` |
| `--use-container` | Build in Docker | Consistent build environment |
| `--no-confirm-changeset` | Skip confirmation | Useful for CI/CD automation |

#### Option 2: Direct ECR + Lambda Deployment

**Build and push container image:**
```bash
# Set variables
export AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
export AWS_REGION="ap-southeast-1"
export ECR_REPO="jek-meter-reading-api"
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
  --function-name jek-meter-reading-api \
  --package-type Image \
  --code ImageUri=${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO}:${IMAGE_TAG} \
  --role arn:aws:iam::${AWS_ACCOUNT_ID}:role/lambda-execution-role \
  --timeout 30 \
  --memory-size 512 \
  --region ${AWS_REGION} \
  || \
aws lambda update-function-code \
  --function-name jek-meter-reading-api \
  --image-uri ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO}:${IMAGE_TAG} \
  --region ${AWS_REGION}

# Create Function URL (for direct HTTPS access)
aws lambda create-function-url-config \
  --function-name jek-meter-reading-api \
  --auth-type NONE \
  --region ${AWS_REGION} \
  || true

# Add permissions for Function URL
aws lambda add-permission \
  --function-name jek-meter-reading-api \
  --statement-id FunctionURLAllowPublicAccess \
  --action lambda:InvokeFunctionUrl \
  --principal "*" \
  --function-url-auth-type NONE \
  --region ${AWS_REGION} \
  || true

# Get Function URL
aws lambda get-function-url-config \
  --function-name jek-meter-reading-api \
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
  AWS_REGION: ap-southeast-1
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
            --stack-name jek-meter-reading-api \
            --capabilities CAPABILITY_IAM \
            --region ${{ env.AWS_REGION }} \
            --resolve-s3 \
            --no-confirm-changeset \
            --no-fail-on-empty-changeset

      - name: Get API URL
        run: |
          API_URL=$(aws cloudformation describe-stacks \
            --stack-name jek-meter-reading-api \
            --query 'Stacks[0].Outputs[?OutputKey==`ApiUrl`].OutputValue' \
            --output text \
            --region ${{ env.AWS_REGION }})
          echo "API URL: $API_URL"
```

### Testing the Deployed API

```bash
# Get your API URL from deployment output
export API_URL="https://xxxxx.execute-api.ap-southeast-1.amazonaws.com"

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
sam logs --stack-name jek-meter-reading-api --tail

# Or using AWS CLI
aws logs tail /aws/lambda/jek-meter-reading-api --follow

# Get function metrics
aws cloudwatch get-metric-statistics \
  --namespace AWS/Lambda \
  --metric-name Duration \
  --dimensions Name=FunctionName,Value=jek-meter-reading-api \
  --start-time $(date -u -d '1 hour ago' +%Y-%m-%dT%H:%M:%S) \
  --end-time $(date -u +%Y-%m-%dT%H:%M:%S) \
  --period 300 \
  --statistics Average,Maximum \
  --region ${AWS_REGION}
```

### Performance Comparison

**Without Native AOT (x86_64):**
- Cold start: ~500-800ms
- Memory usage: ~150MB
- Package size: ~80MB
- Cost: Standard Lambda pricing

**With Native AOT (ARM64):**
- Cold start: ~100-150ms (5-8x faster)
- Memory usage: ~50MB (70% reduction)
- Package size: ~40MB (50% reduction)
- Cost: **~20% cheaper** than x86_64 (AWS Graviton2 pricing)

**Why ARM64?**
- **Better performance**: AWS Graviton2 processors optimized for ARM64
- **Lower cost**: AWS Lambda charges 20% less for ARM64 functions
- **Faster builds**: Native compilation on M4 Mac (no cross-architecture emulation)
- **Industry standard**: Apple Silicon, AWS Graviton, and most modern mobile devices use ARM

### Cleanup Commands

```bash
# Delete SAM stack
sam delete --stack-name jek-meter-reading-api --region ${AWS_REGION}

# Or using CloudFormation
aws cloudformation delete-stack \
  --stack-name jek-meter-reading-api \
  --region ${AWS_REGION}

# Delete ECR images (if using Option 2)
aws ecr batch-delete-image \
  --repository-name jek-meter-reading-api \
  --image-ids imageTag=latest \
  --region ${AWS_REGION}

# Delete ECR repository
aws ecr delete-repository \
  --repository-name jek-meter-reading-api \
  --force \
  --region ${AWS_REGION}
```

### Native AOT Limitations and Considerations

**Limitations:**
- No runtime code generation (reflection-based scenarios limited)
- **JSON serialization requires source generation** (cannot use reflection)
- Longer build times (5-10 minutes for Native AOT vs <1 minute normal)
- Larger build requirements (needs more CPU/memory during build)
- Some NuGet packages may not be AOT-compatible

**This project is AOT-compatible because:**
- Uses minimal APIs (no MVC controllers)
- **Implements JSON source generation** (`AppJsonSerializerContext`)
- All responses use explicit `Results.Json()` with serializer context
- No Entity Framework or reflection-heavy ORMs
- Simple models with record types
- No dynamic code generation

**Critical for Native AOT:**
```csharp
// Must declare all serializable types in context
[JsonSerializable(typeof(MeterReading))]
[JsonSerializable(typeof(MeterReadingRequest))]
[JsonSerializable(typeof(List<MeterReading>))]
public partial class AppJsonSerializerContext : JsonSerializerContext { }

// Must use explicit serialization in all endpoints
return Results.Json(data, AppJsonSerializerContext.Default.TypeInfo);
```

**Cost Implications:**
- **Build time**: Higher (but only in CI/CD, not runtime)
- **Runtime cost**: Lower (faster execution, less memory)
- **Overall**: 30-50% cost reduction for typical workloads

### Troubleshooting Lambda Deployment

**Error: "Running AWS SAM projects locally requires a container runtime"**
```bash
# Docker is not running - start Docker Desktop
open -a Docker

# Wait for Docker to start, then verify
docker info

# Retry SAM build
sam build --use-container
```

**Error: ".NET SDK was not found" or SDK version mismatch:**
```bash
# The Docker container doesn't have your exact SDK version
# Solution 1: Update global.json to allow version flexibility
{
  "sdk": {
    "version": "8.0.0",
    "rollForward": "latestMinor"
  }
}

# Solution 2: Add global.json to .dockerignore
echo "global.json" >> .dockerignore

# Then rebuild
sam build --use-container
```

**Error: Internal Server Error (500) - JSON Serialization Issue:**

**Symptom:** API returns HTTP 500, CloudWatch logs show:
```
System.NotSupportedException: JsonTypeInfo metadata for type 'MeterReadingRequest' was not provided
```

**Solution:** Native AOT requires explicit JSON source generation. You must:
1. Create `AppJsonSerializerContext.cs` with all serializable types
2. Configure JSON options in `Program.cs`
3. Use `Results.Json()` with explicit serializer context (NOT `Results.Ok()`)

```csharp
// ❌ WRONG - Does not work with Native AOT
return Results.Ok(readings);

// ✅ CORRECT - Works with Native AOT
return Results.Json(readings, AppJsonSerializerContext.Default.ListMeterReading);
```

**Error: "/var/runtime/bootstrap: No such file or directory"**

**Solution:** Lambda's `provided:al2023` runtime requires a bootstrap script:
```dockerfile
# Add to Dockerfile
RUN echo '#!/bin/sh' > /var/runtime/bootstrap && \
    echo 'cd /var/task' >> /var/runtime/bootstrap && \
    echo 'exec ./net8dot0__web__processmeterreading' >> /var/runtime/bootstrap && \
    chmod +x /var/runtime/bootstrap
```

**Build fails with AOT errors:**
```bash
# Try building locally first to see detailed errors (for ARM64)
dotnet publish -c Release -r linux-arm64 \
  -p:PublishAot=true \
  -p:StripSymbols=true

# Note: Using linux-arm64 for native Apple Silicon M4 builds
```

**Cross-architecture build warning on M4 Mac:**
```bash
# This happens if template.yaml uses x86_64 instead of arm64
# Update template.yaml:
Architectures:
  - arm64  # Change from x86_64

# Update Dockerfile:
RUN dotnet publish -c Release -r linux-arm64  # Change from linux-x64
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

---

# IMPORTANT FOR DATADOG INSTRUMENTATION


## Instrumenting .NET Serverless Applications on AWS Lambda with Datadog

This section describes how to add **Datadog observability** to your Lambda function for monitoring metrics, traces, and logs.

### Understanding Lambda Layers vs Lambda Extensions

Before we dive into instrumentation, it's important to understand two key AWS Lambda concepts:

#### What is a Lambda Extension?

A **Lambda Extension** is a separate process that runs **alongside** your Lambda function in the same execution environment. Think of it as a "sidecar" process.

**Key characteristics:**
- Runs in the Lambda execution environment (inside `/opt/extensions/`)
- Has its own lifecycle (starts before your function, can run after)
- Can perform tasks like:
  - Collecting telemetry data (logs, metrics, traces)
  - Sending data to external services
  - Caching, secrets management, monitoring
- **Datadog Lambda Extension** is one example - it collects traces/logs/metrics and sends them to Datadog

**How Lambda Extensions work:**
```
┌─────────────────────────────────────────┐
│   AWS Lambda Execution Environment      │
│                                          │
│  ┌──────────────────┐  ┌──────────────┐│
│  │  Your Function   │  │   Extension  ││
│  │  (main process)  │  │   Process    ││
│  │                  │  │              ││
│  │  meter-reading   │  │   Datadog    ││
│  │  API code        │  │   Extension  ││
│  └──────────────────┘  └──────────────┘│
│          ↓                     ↓        │
│     Handles requests    Collects data   │
│                         & sends to      │
│                         Datadog         │
└─────────────────────────────────────────┘
```

#### What is a Lambda Layer?

A **Lambda Layer** is a **distribution mechanism** (like a zip file) that contains:
- Libraries
- Dependencies
- Runtime components
- **Even Lambda Extensions!**

**Key characteristics:**
- A packaging and deployment method
- Contents are extracted to `/opt/` in Lambda execution environment
- Can contain anything: Python packages, Node modules, binaries, extensions
- Reusable across multiple functions

**Lambda Layer structure:**
```
layer.zip
└── opt/
    ├── lib/              # Libraries
    ├── bin/              # Binaries
    └── extensions/       # Lambda Extensions (executable files)
        └── datadog-extension  # The Datadog Lambda Extension binary
```

#### The Key Relationship: Layers Can Deliver Extensions

**This is the crucial point:** A Lambda Layer can **contain and deliver** a Lambda Extension.

When you add a Lambda Layer to your function:
1. AWS extracts the layer's contents to `/opt/`
2. If the layer contains an extension in `/opt/extensions/`, AWS automatically detects and runs it
3. The extension becomes active in your Lambda execution environment

**Example: Datadog Lambda Layer**
```
Datadog Lambda Layer (zip file)
└── opt/
    └── extensions/
        └── datadog-agent  ← This is the Datadog Lambda Extension
```

When you attach this layer to your Lambda function:
- Layer is extracted to `/opt/`
- Lambda runtime finds `/opt/extensions/datadog-agent`
- Lambda runtime automatically starts the Datadog Extension
- Your function now has Datadog monitoring

#### Two Ways to Deliver the Datadog Lambda Extension

Now we can understand the two methods:

**Method 1: Lambda Layer (for zip-based deployments)**

```
┌──────────────────────────────────────────────────┐
│  Deploy using Lambda Layer                       │
│                                                   │
│  1. AWS SAM CloudFormation macro adds layer      │
│  2. Layer contains Datadog Extension binary      │
│  3. Lambda extracts layer to /opt/extensions/    │
│  4. Extension runs alongside your function       │
│                                                   │
│  Package Type: Zip                               │
└──────────────────────────────────────────────────┘
```

**Method 2: Container Image (for container deployments)**

```
┌──────────────────────────────────────────────────┐
│  Deploy using Container Image                    │
│                                                   │
│  1. Dockerfile copies extension to /opt/         │
│  2. Extension is baked into container image      │
│  3. Lambda runs container with extension inside  │
│  4. Extension runs alongside your function       │
│                                                   │
│  Package Type: Image                             │
└──────────────────────────────────────────────────┘
```

**The Result: Same Extension, Different Delivery**

| Aspect | Lambda Layer Method | Container Image Method |
|--------|-------------------|------------------------|
| **What gets installed** | Datadog Lambda Extension | Datadog Lambda Extension |
| **Where it's installed** | `/opt/extensions/` | `/opt/extensions/` |
| **How it's delivered** | Via Lambda Layer (zip) | Via Docker `COPY` command |
| **When it's added** | At deployment (CloudFormation) | At build time (Dockerfile) |
| **Works with** | Zip-based packages | Container images |
| **Datadog component** | Same extension binary | Same extension binary |

### Why Container Image Instrumentation?

Since this application is deployed as a **container image** (not a zip package), we must use the **Container Image instrumentation method**. Here's why:

**Two Datadog Installation Methods:**

| Method | Extension Delivery Mechanism | Works With | Our Choice |
|--------|-------------------|------------|------------|
| **AWS SAM** | Lambda Layer | Zip-based packages | ❌ Not compatible |
| **Container Image** | Embedded in Docker image | Container images | ✅ Use this method |

**Key Distinction:**
- Both methods install the **same Datadog Lambda Extension**
- The difference is **HOW** it's delivered:
  - **Lambda Layers**: Extension delivered via layer attachment (zip packages only)
  - **Container Image**: Extension embedded directly in Docker image (container packages only)

**Why can't we use Lambda Layers with container images?**
- Lambda Layers only work with **zip-based function deployments**
- Container images use a different packaging model (Docker)
- Container images can't have layers attached - everything must be in the image
- AWS limitation, not Datadog limitation

### Complete Comparison: All Datadog Instrumentation Methods

Datadog provides **six different ways** to instrument AWS Lambda functions. Here's when to use each method:

#### Method Overview Table

| Method | Package Type | Use Case | Automation Level | Best For |
|--------|--------------|----------|------------------|----------|
| **Custom** | Zip | Manual layer ARN configuration | Manual | Full control, learning purposes |
| **Datadog CLI** | Zip | Quick setup, existing functions | Semi-automated | Fast prototyping, one-off setups |
| **Serverless Framework** | Zip | Serverless Framework users | Automated | Serverless Framework projects |
| **AWS SAM** | Zip | SAM template users | Automated | SAM/CloudFormation projects |
| **AWS CDK** | Zip | CDK infrastructure | Automated | CDK projects (TypeScript/Python/Go) |
| **Container Image** | Container | Container deployments | Manual | Container-based Lambda functions |

#### Method 1: Custom (Manual Layer ARNs)

**What it is:**
- Manually add Datadog Lambda Layer ARNs to your Lambda function configuration
- Two layers required:
  1. **Datadog Tracer Layer**: Language-specific APM tracer (e.g., `dd-trace-dotnet`)
  2. **Datadog Extension Layer**: The Lambda Extension for sending data to Datadog

**How it works:**
```yaml
# Example: Adding layers manually in SAM template
Resources:
  MyFunction:
    Type: AWS::Serverless::Function
    Properties:
      Layers:
        # .NET Tracer Layer (x86_64)
        - arn:aws:lambda:<AWS_REGION>:464622532012:layer:dd-trace-dotnet:20
        # Datadog Extension Layer (x86_64)
        - arn:aws:lambda:<AWS_REGION>:464622532012:layer:Datadog-Extension:86
      Environment:
        Variables:
          DD_SITE: datadoghq.com
          DD_API_KEY_SECRET_ARN: arn:aws:secretsmanager:...
```

**Architecture-specific ARNs:**
- **x86_64 (Intel)**: `arn:aws:lambda:<REGION>:464622532012:layer:dd-trace-dotnet:20`
- **ARM64 (Graviton)**: `arn:aws:lambda:<REGION>:464622532012:layer:dd-trace-dotnet-ARM:20`

**When to use:**
- ✅ You want full control over layer versions
- ✅ Learning how Datadog instrumentation works
- ✅ Infrastructure not using frameworks (raw CloudFormation)
- ✅ Testing specific layer versions

**Pros:**
- Complete control over versions
- No additional tools required
- Easy to understand what's happening
- Works with any deployment method

**Cons:**
- Manual version management (need to update ARNs)
- Must configure all environment variables manually
- More verbose configuration
- Error-prone (easy to use wrong ARN for wrong architecture)

**Example: .NET Lambda with manual layers**
```bash
# Update existing function
aws lambda update-function-configuration \
  --function-name my-function \
  --layers \
    arn:aws:lambda:us-east-1:464622532012:layer:dd-trace-dotnet:20 \
    arn:aws:lambda:us-east-1:464622532012:layer:Datadog-Extension:86 \
  --environment Variables="{
    DD_SITE=datadoghq.com,
    DD_API_KEY_SECRET_ARN=arn:aws:secretsmanager:us-east-1:123456789012:secret:datadog-api-key,
    DD_SERVICE=my-service,
    DD_ENV=production,
    DD_TRACE_ENABLED=true
  }"
```

#### Method 2: Datadog CLI

**What it is:**
- Command-line tool that **modifies existing Lambda functions** to add Datadog instrumentation
- Automatically adds layers and configures environment variables
- No redeployment of application code required

**How it works:**
```bash
# Install Datadog CLI
npm install -g @datadog/datadog-ci

# Instrument existing function
datadog-ci lambda instrument \
  --function my-function-name \
  --region us-east-1 \
  --environment production \
  --service my-service
```

**What it does automatically:**
1. Detects Lambda runtime and architecture
2. Adds appropriate Datadog Tracer layer
3. Adds Datadog Extension layer
4. Configures environment variables (DD_SITE, DD_SERVICE, DD_ENV, etc.)
5. Updates Lambda function configuration

**When to use:**
- ✅ Quick instrumentation of **existing** Lambda functions
- ✅ Prototyping and testing Datadog
- ✅ One-off instrumentations
- ✅ Functions deployed through various methods
- ✅ CI/CD pipelines (as a post-deployment step)

**Pros:**
- Fastest way to get started
- No code changes required
- Works with any deployment method
- Automatically selects correct layer versions
- Interactive mode for first-time users

**Cons:**
- Modifies existing function (not infrastructure-as-code)
- Requires AWS credentials with Lambda update permissions
- Not repeatable (manual process)
- Configuration drift (function state vs IaC)
- Need to re-run after each deployment

**Example workflow:**
```bash
# Step 1: Deploy your function normally
sam deploy

# Step 2: Instrument with Datadog CLI (interactive mode)
datadog-ci lambda instrument -i

# CLI prompts:
# → Select AWS region: us-east-1
# → Enter function name: my-function
# → Enter Datadog site: datadoghq.com
# → Enter service name: my-service
# → Enter environment: production
```

**Best practice:**
- Use for **testing/exploration** only
- For production, use infrastructure-as-code methods (SAM/CDK/Serverless)

#### Method 3: Serverless Framework Plugin

**What it is:**
- Plugin for the **Serverless Framework** that automatically configures Datadog
- Adds layers and environment variables during deployment
- Integrated into `serverless.yml` configuration

**How it works:**
```bash
# Install plugin
serverless plugin install --name serverless-plugin-datadog
```

```yaml
# serverless.yml
service: my-service

provider:
  name: aws
  runtime: dotnet8
  region: us-east-1

functions:
  myFunction:
    handler: MyHandler

plugins:
  - serverless-plugin-datadog

custom:
  datadog:
    site: datadoghq.com                    # Your Datadog site
    apiKeySecretArn: <DATADOG_API_KEY_SECRET_ARN>  # Secrets Manager ARN
    # Automatically adds layers and configures environment variables
```

**What it does automatically:**
1. Adds Datadog Tracer layer (runtime-specific)
2. Adds Datadog Extension layer
3. Sets DD_SITE, DD_SERVICE, DD_ENV environment variables
4. Configures log forwarding
5. Grants IAM permissions for Secrets Manager

**When to use:**
- ✅ You're using **Serverless Framework** for deployment
- ✅ Managing multiple functions with unified configuration
- ✅ CI/CD with Serverless Framework
- ✅ Need automatic version management

**Pros:**
- Seamlessly integrates with Serverless Framework
- Infrastructure-as-code (declared in serverless.yml)
- Automatic layer version updates
- Single source of truth
- Repeatable deployments
- Plugin handles all complexity

**Cons:**
- **Only works with Serverless Framework**
- Another dependency to manage
- Plugin version updates may introduce changes
- Less control over layer versions

**Example: .NET function with Serverless Framework**
```yaml
# serverless.yml
service: meter-reading-api

provider:
  name: aws
  runtime: dotnet8
  region: us-east-1
  architecture: arm64

functions:
  processMeterReading:
    handler: MeterReadingApi::MeterReadingApi.Function::ProcessReading
    events:
      - httpApi:
          path: /api/meter-readings
          method: POST

plugins:
  - serverless-plugin-datadog

custom:
  datadog:
    site: datadoghq.com
    apiKeySecretArn: ${env:DD_API_KEY_SECRET_ARN}
    service: meter-reading-api
    env: ${opt:stage, 'dev'}
    version: 1.0.0
    enableDDTracing: true
    enableDDLogs: true
```

**Deployment:**
```bash
serverless deploy --stage production
```

#### Method 4: AWS SAM (CloudFormation Macro)

**What it is:**
- AWS SAM CloudFormation **macro** that transforms your SAM template
- Automatically adds Datadog layers during stack deployment
- Works with SAM templates (YAML/JSON)

**How it works:**
```bash
# Step 1: Install Datadog CloudFormation macro (one-time per AWS account/region)
aws cloudformation create-stack \
  --stack-name datadog-serverless-macro \
  --template-url https://datadog-cloudformation-template.s3.amazonaws.com/aws/serverless-macro/latest.yml \
  --capabilities CAPABILITY_AUTO_EXPAND CAPABILITY_IAM
```

```yaml
# Step 2: Add transform to SAM template
Transform:
  - AWS::Serverless-2016-10-31
  - DatadogServerless  # ← Datadog macro

Resources:
  MyFunction:
    Type: AWS::Serverless::Function
    Properties:
      Handler: bootstrap
      Runtime: provided.al2023
      Environment:
        Variables:
          DD_SITE: datadoghq.com
          DD_API_KEY_SECRET_ARN: arn:aws:secretsmanager:...
```

**What the macro does:**
1. Scans your SAM template for Lambda functions
2. Adds Datadog Tracer and Extension layers
3. Configures required environment variables
4. Adds IAM permissions for Secrets Manager

**When to use:**
- ✅ You're using **AWS SAM** for deployment
- ✅ **Zip-based Lambda functions** (not containers)
- ✅ CloudFormation-based infrastructure
- ✅ Need automatic instrumentation across many functions

**Pros:**
- Infrastructure-as-code (SAM template)
- Automatic layer management
- Works seamlessly with SAM CLI
- Single source of truth
- Minimal template changes required

**Cons:**
- **Does NOT work with container images** (layers only)
- Requires macro installation in each AWS region
- Less explicit (magic happens via macro)
- Harder to debug transformation issues

**Why we can't use this for our project:**
```yaml
# ❌ This configuration won't work with AWS SAM macro
Resources:
  MeterReadingApi:
    Type: AWS::Serverless::Function
    Properties:
      PackageType: Image  # ← Container image = no layers allowed
      # SAM macro can't add layers to container images
```

**Container images vs Zip packages:**
- **Zip packages**: Macro adds layers ✅
- **Container images**: Layers not supported, must use Container Image method ❌

#### Method 5: AWS CDK Construct

**What it is:**
- AWS CDK construct library that adds Datadog instrumentation
- Available for **TypeScript, Python, and Go** CDK projects
- **NOT available for .NET/C# CDK projects** (as of now)

**How it works:**
```typescript
// TypeScript CDK example
import { Datadog } from "datadog-cdk-constructs-v2";

const datadog = new Datadog(this, "Datadog", {
  dotnetLayerVersion: 20,
  extensionLayerVersion: 86,
  site: "datadoghq.com",
});

// Instrument Lambda function
datadog.addLambdaFunctions([myLambdaFunction]);
```

**What it does:**
1. Adds Datadog Tracer and Extension layers to functions
2. Configures environment variables
3. Sets up IAM permissions
4. Handles architecture-specific layer ARNs

**When to use:**
- ✅ Using **AWS CDK** for infrastructure
- ✅ Writing CDK in **TypeScript, Python, or Go**
- ✅ Zip-based Lambda functions
- ✅ Want type-safe configuration

**Pros:**
- Native CDK integration
- Type-safe configuration (in TypeScript)
- Infrastructure-as-code
- Automatic layer management
- Reusable across multiple functions

**Cons:**
- **Only available for TypeScript, Python, Go** (not .NET/C#)
- **Does NOT work with container images**
- Requires CDK knowledge
- Another dependency to manage

**Why we can't use this for our project:**
1. ❌ Our project is **.NET/C#** (CDK construct not available for .NET)
2. ❌ Our deployment is **container-based** (construct only works with layers)

#### Method 6: Container Image (Our method for this project)

**What it is:**
- Manually embed Datadog Lambda Extension and .NET Tracer **into Docker image**
- Extension and tracer become part of the container image
- No layers used - everything is self-contained

**How it works:**
```dockerfile
# Copy Datadog Lambda Extension into container
COPY --from=public.ecr.aws/datadog/lambda-extension:86-arm64 /opt/extensions/ /opt/extensions/

# Download and install .NET APM tracer
RUN wget https://github.com/DataDog/dd-trace-dotnet/releases/download/v3.8.0/datadog-dotnet-apm-3.8.0-musl.tar.gz
RUN tar -C /opt/datadog -xzf datadog-dotnet-apm-3.8.0-musl.tar.gz
```

**When to use:**
- ✅ Lambda function deployed as **container image**
- ✅ Need full control over dependencies
- ✅ Using Native AOT or custom runtimes
- ✅ Want self-contained deployments

**Pros:**
- Works with container images
- Complete control over versions
- Self-contained (no external dependencies)
- Architecture-specific optimization (ARM64 native)
- No layer limits (Lambda has 5 layer maximum)

**Cons:**
- More complex setup (Dockerfile changes)
- Manual version management
- Larger image size
- Longer build times
- Must rebuild image for updates

**This is our method** because:
- ✅ We deploy as **PackageType: Image**
- ✅ We use **Native AOT** compilation
- ✅ We're on **ARM64 architecture** (Apple Silicon M4)

### Choosing the Right Method: Decision Tree

Use this decision tree to select the appropriate instrumentation method:

```
┌─────────────────────────────────────────────────────────┐
│  Is your Lambda function deployed as a container image? │
└─────────────────────────────────────────────────────────┘
                    │
        ┌───────────┴────────────┐
       YES                       NO
        │                         │
        ▼                         ▼
  ┌──────────────┐    ┌─────────────────────────────┐
  │ Container    │    │ Are you using a framework?  │
  │ Image Method │    └─────────────────────────────┘
  │              │                 │
  │ (This guide) │     ┌───────────┼───────────┐
  └──────────────┘     │           │           │
                       │           │           │
                  Serverless    AWS SAM    AWS CDK    None
                  Framework                 (TS/Py/Go)
                       │           │           │        │
                       ▼           ▼           ▼        ▼
               ┌───────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐
               │ Use       │ │ Use SAM │ │ Use CDK │ │ Custom  │
               │ Serverless│ │ Macro   │ │ Construct│ │ or      │
               │ Plugin    │ │         │ │         │ │ Datadog │
               │           │ │         │ │         │ │ CLI     │
               └───────────┘ └─────────┘ └─────────┘ └─────────┘
```

### Summary: When to Use Each Method

**Use Container Image when:**
- Deploying as container image (PackageType: Image)
- Using Native AOT, custom runtimes, or large dependencies
- Need complete control over versions

**Use AWS SAM macro when:**
- Using SAM templates for zip-based functions
- Want automatic instrumentation with minimal config
- Managing multiple functions in CloudFormation

**Use Serverless Framework plugin when:**
- Using Serverless Framework for infrastructure
- Want unified configuration in serverless.yml
- Need automatic version management

**Use AWS CDK construct when:**
- Using CDK (TypeScript, Python, or Go)
- Want type-safe infrastructure code
- Deploying zip-based functions

**Use Datadog CLI when:**
- Testing Datadog quickly
- Instrumenting existing functions
- Don't want to modify infrastructure code
- One-off setups or experimentation

**Use Custom (manual layers) when:**
- Learning how instrumentation works
- Need specific layer versions
- Using raw CloudFormation without frameworks
- Want explicit control

### Compatibility Matrix

| Method | .NET Support | Container Image | Zip Package | Architecture |
|--------|--------------|-----------------|-------------|--------------|
| **Custom** | ✅ | ❌ | ✅ | x86_64, ARM64 |
| **Datadog CLI** | ✅ | ❌ | ✅ | x86_64, ARM64 |
| **Serverless Framework** | ✅ | ❌ | ✅ | x86_64, ARM64 |
| **AWS SAM** | ✅ | ❌ | ✅ | x86_64, ARM64 |
| **AWS CDK** | ❌* | ❌ | ✅ | x86_64, ARM64 |
| **Container Image** | ✅ | ✅ | ❌ | x86_64, ARM64 |

*CDK construct only available for TypeScript, Python, Go (not .NET)

### Prerequisites

1. **Datadog Account**: Sign up at [https://www.datadoghq.com](https://www.datadoghq.com)
2. **Datadog API Key**: Get from Datadog UI → Organization Settings → API Keys
3. **Datadog Site**: Know your site (e.g., `datadoghq.com`, `datadoghq.eu`, `us3.datadoghq.com`)

### Step 1: Store Datadog API Key in AWS Secrets Manager

**Why Secrets Manager?**
- Secure storage (not hardcoded in code)
- Automatic rotation support
- IAM-controlled access
- Free for Lambda (no cross-region data transfer charges)

**Create the secret:**

```bash
# Set your Datadog API key
export DD_API_KEY="your-datadog-api-key-here"
export AWS_REGION="ap-southeast-1"

# Store in Secrets Manager
aws secretsmanager create-secret \
  --name datadog-api-key \
  --description "Datadog API Key for Lambda instrumentation" \
  --secret-string "{\"api_key\":\"${DD_API_KEY}\"}" \
  --region ${AWS_REGION}

# Verify it was created
aws secretsmanager describe-secret \
  --secret-id datadog-api-key \
  --region ${AWS_REGION}
```

**Alternative: Using AWS Systems Manager Parameter Store (Free Tier):**

```bash
# Store as SecureString parameter
aws ssm put-parameter \
  --name "/datadog/api-key" \
  --value "${DD_API_KEY}" \
  --type "SecureString" \
  --description "Datadog API Key for Lambda" \
  --region ${AWS_REGION}
```

### Step 2: Update Dockerfile with Datadog Lambda Extension

Modify your existing `Dockerfile` to include the Datadog Lambda Extension and .NET APM tracer:

```dockerfile
# Build stage with Native AOT
FROM public.ecr.aws/sam/build-dotnet8:latest AS build
WORKDIR /src

# Copy project files
COPY *.csproj ./
RUN dotnet restore

# Copy source code
COPY . ./

# Publish with Native AOT for ARM64
RUN dotnet publish -c Release -r linux-arm64 \
    --self-contained true \
    -o /app/publish \
    -p:PublishAot=true \
    -p:StripSymbols=true

# Set executable permissions in build stage
RUN chmod +x /app/publish/net8dot0__web__processmeterreading

# Runtime stage - Use Amazon Linux 2023 with Lambda Web Adapter
FROM public.ecr.aws/lambda/provided:al2023

# Install Lambda Web Adapter extension
COPY --from=public.ecr.aws/awsguru/aws-lambda-adapter:0.8.4 /lambda-adapter /opt/extensions/lambda-adapter

# ========================================
# DATADOG INSTRUMENTATION - START
# ========================================

# Install Datadog Lambda Extension (ARM64 version)
# Replace 86 with desired version from: https://gallery.ecr.aws/datadog/lambda-extension
COPY --from=public.ecr.aws/datadog/lambda-extension:86-arm64 /opt/extensions/ /opt/extensions/

# Install dependencies for downloading and extracting Datadog .NET APM tracer
RUN yum install -y tar gzip wget unzip

# Download and install Datadog .NET APM tracer
# Check latest version at: https://github.com/DataDog/dd-trace-dotnet/releases
RUN TRACER_VERSION=3.8.0 && \
    wget -q https://github.com/DataDog/dd-trace-dotnet/releases/download/v${TRACER_VERSION}/datadog-dotnet-apm-${TRACER_VERSION}-musl.tar.gz && \
    mkdir -p /opt/datadog && \
    tar -C /opt/datadog -xzf datadog-dotnet-apm-${TRACER_VERSION}-musl.tar.gz && \
    rm datadog-dotnet-apm-${TRACER_VERSION}-musl.tar.gz

# Set environment variables for Datadog .NET tracer
ENV CORECLR_ENABLE_PROFILING=1
ENV CORECLR_PROFILER={846F5F1C-F9AE-4B07-969E-05C26BC060D8}
ENV CORECLR_PROFILER_PATH=/opt/datadog/Datadog.Trace.ClrProfiler.Native.so
ENV DD_DOTNET_TRACER_HOME=/opt/datadog
ENV LD_PRELOAD=/opt/datadog/continuousprofiler/Datadog.Linux.ApiWrapper.x64.so

# ========================================
# DATADOG INSTRUMENTATION - END
# ========================================

# Copy published application with permissions already set
COPY --from=build /app/publish /var/task/

# Lambda environment configuration
ENV PORT=8080
ENV ASPNETCORE_URLS=http://+:8080

# Create bootstrap script that Lambda expects
RUN echo '#!/bin/sh' > /var/runtime/bootstrap && \
    echo 'cd /var/task' >> /var/runtime/bootstrap && \
    echo 'exec ./net8dot0__web__processmeterreading' >> /var/runtime/bootstrap && \
    chmod +x /var/runtime/bootstrap
```

**Key Changes Explained:**

1. **Datadog Lambda Extension**: Copied from `public.ecr.aws/datadog/lambda-extension:86-arm64`
   - Version `86` (replace with latest from [ECR Gallery](https://gallery.ecr.aws/datadog/lambda-extension))
   - Architecture `arm64` to match our Lambda function architecture

2. **Datadog .NET APM Tracer**: Downloaded from GitHub releases
   - Version `3.8.0` (check [latest releases](https://github.com/DataDog/dd-trace-dotnet/releases))
   - **MUSL variant** (`datadog-dotnet-apm-*-musl.tar.gz`) required for Alpine/Amazon Linux 2023
   - Installed to `/opt/datadog/`

3. **Environment Variables for .NET Profiler**:
   - `CORECLR_ENABLE_PROFILING=1`: Enables CLR profiling for tracing
   - `CORECLR_PROFILER`: GUID identifying the Datadog profiler
   - `CORECLR_PROFILER_PATH`: Path to native profiler library
   - `DD_DOTNET_TRACER_HOME`: Base directory for Datadog tracer
   - `LD_PRELOAD`: Preload continuous profiler library

### Step 3: Update SAM Template with Datadog Configuration

Update your `template.yaml` to configure Datadog environment variables and grant Secrets Manager access:

```yaml
AWSTemplateFormatVersion: '2010-09-09'
Transform: AWS::Serverless-2016-10-31
Description: Meter Reading Processing API on Lambda with Native AOT and Datadog

Globals:
  Function:
    Timeout: 30
    MemorySize: 512
    Environment:
      Variables:
        ASPNETCORE_ENVIRONMENT: Development
    Tags:
      Environment: development
      Project: meter-reading-api

Resources:
  MeterReadingApi:
    Type: AWS::Serverless::Function
    Properties:
      FunctionName: jek-meter-reading-api
      PackageType: Image
      ImageConfig:
        Command: ["./net8dot0__web__processmeterreading"]
      Architectures:
        - arm64
      Environment:
        Variables:
          # Datadog Configuration
          DD_SITE: "datadoghq.com"                    # Change to your Datadog site
          DD_API_KEY_SECRET_ARN: !Sub "arn:aws:secretsmanager:${AWS::Region}:${AWS::AccountId}:secret:datadog-api-key"
          DD_SERVICE: "meter-reading-api"             # Service name in Datadog
          DD_ENV: "development"                       # Environment tag
          DD_VERSION: "1.0.0"                         # Version tag for tracking deployments
          DD_LOGS_INJECTION: "true"                   # Inject trace IDs into logs
          DD_TRACE_ENABLED: "true"                    # Enable APM tracing
          DD_SERVERLESS_LOGS_ENABLED: "true"          # Enable log forwarding
          DD_CAPTURE_LAMBDA_PAYLOAD: "true"           # Capture request/response payloads
          DD_LAMBDA_HANDLER: "bootstrap"              # Lambda handler (for extension)

          # Optional: Enhanced Metrics
          DD_ENHANCED_METRICS: "true"                 # Enable enhanced Lambda metrics
          DD_MERGE_XRAY_TRACES: "false"               # Set true if using AWS X-Ray

          # .NET Specific Configuration
          DD_TRACE_DEBUG: "false"                     # Set true for debugging tracer issues
          DD_PROFILING_ENABLED: "false"               # Enable continuous profiler (optional)

      Events:
        ApiGateway:
          Type: HttpApi
          Properties:
            Path: /{proxy+}
            Method: ANY
            PayloadFormatVersion: "2.0"
      Policies:
        - CloudWatchLambdaInsightsExecutionRolePolicy
        # Grant permission to read Datadog API key from Secrets Manager
        - Version: '2012-10-17'
          Statement:
            - Effect: Allow
              Action:
                - secretsmanager:GetSecretValue
              Resource: !Sub "arn:aws:secretsmanager:${AWS::Region}:${AWS::AccountId}:secret:datadog-api-key*"
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

**Environment Variables Explained:**

| Variable | Purpose | Example Value |
|----------|---------|---------------|
| `DD_SITE` | Your Datadog site domain | `datadoghq.com` (US1), `datadoghq.eu` (EU), `us3.datadoghq.com` (US3) |
| `DD_API_KEY_SECRET_ARN` | ARN of secret containing API key | Auto-generated by CloudFormation |
| `DD_SERVICE` | Service name in Datadog APM | `meter-reading-api` |
| `DD_ENV` | Environment tag | `development`, `staging`, `production` |
| `DD_VERSION` | Version for deployment tracking | `1.0.0`, `2.1.3`, git SHA |
| `DD_LOGS_INJECTION` | Inject trace IDs into logs | `true` (recommended) |
| `DD_TRACE_ENABLED` | Enable distributed tracing | `true` |
| `DD_SERVERLESS_LOGS_ENABLED` | Forward logs to Datadog | `true` |
| `DD_CAPTURE_LAMBDA_PAYLOAD` | Capture request/response data | `true` (caution: sensitive data) |
| `DD_ENHANCED_METRICS` | Enhanced Lambda metrics | `true` (recommended) |

**Alternative: Using Parameter Store instead of Secrets Manager**

If you stored the API key in Parameter Store, update the template:

```yaml
Environment:
  Variables:
    DD_SITE: "datadoghq.com"
    DD_API_KEY_SSM_NAME: "/datadog/api-key"  # Use this instead of DD_API_KEY_SECRET_ARN
    # ... rest of variables

Policies:
  # Grant permission to read from Parameter Store
  - Version: '2012-10-17'
    Statement:
      - Effect: Allow
        Action:
          - ssm:GetParameter
        Resource: !Sub "arn:aws:ssm:${AWS::Region}:${AWS::AccountId}:parameter/datadog/api-key"
```

### Step 4: Deploy with Datadog Instrumentation

Now deploy the updated application with Datadog instrumentation:

```bash
# Set your AWS region
export AWS_REGION="ap-southeast-1"

# Navigate to project directory
cd net8dot0__web__processmeterreading

# Ensure Docker Desktop is running
docker info

# Build and deploy
sam build --use-container && \
sam deploy \
  --stack-name jek-meter-reading-api \
  --capabilities CAPABILITY_IAM \
  --region ${AWS_REGION} \
  --resolve-s3 \
  --resolve-image-repos \
  --no-confirm-changeset

# Get API endpoint URL
export API_URL=$(aws cloudformation describe-stacks \
  --stack-name jek-meter-reading-api \
  --query 'Stacks[0].Outputs[?OutputKey==`ApiUrl`].OutputValue' \
  --output text \
  --region ${AWS_REGION})

echo "API URL: ${API_URL}"
```

### Step 5: Test and Generate Traces

Generate some traffic to create traces in Datadog:

```bash
# Submit multiple meter readings to generate traces
for i in {1..20}; do
  echo "Request $i:"
  curl -X POST ${API_URL}/api/meter-readings \
    -H "Content-Type: application/json" \
    -d "{\"readingValue\": $((10000 + i))}"
  echo -e "\n---"
  sleep 1
done

# Retrieve all readings
curl ${API_URL}/api/meter-readings
```

### Step 6: View Data in Datadog

After generating traffic, you should see data in Datadog within 1-2 minutes:

#### 1. **APM (Application Performance Monitoring)**
   - Navigate to: **APM → Services** in Datadog UI
   - Find service: `meter-reading-api`
   - View:
     - Request traces with full distributed tracing
     - Latency metrics (p50, p75, p95, p99)
     - Error rates and status codes
     - Individual request traces with span details

#### 2. **Serverless View**
   - Navigate to: **Serverless → AWS Lambda**
   - Find function: `jek-meter-reading-api`
   - View:
     - Cold starts vs warm starts
     - Duration and memory usage
     - Invocation counts and error rates
     - Cost estimation

#### 3. **Logs**
   - Navigate to: **Logs → Search**
   - Filter by: `service:meter-reading-api`
   - View:
     - All Lambda logs (stdout/stderr)
     - Logs correlated with traces (trace ID injection)
     - Structured log parsing
     - Log patterns and anomalies

#### 4. **Infrastructure**
   - Navigate to: **Infrastructure → Serverless**
   - View:
     - Lambda function metrics
     - API Gateway metrics
     - CloudWatch metrics integration

#### 5. **Dashboards & Alerts**
   - Create custom dashboards combining:
     - Lambda invocation metrics
     - API Gateway request counts
     - Application-specific metrics (meter reading submissions)
     - Error rates and latency percentiles
   - Set up alerts for:
     - High error rates
     - Increased latency
     - Cold start frequency
     - Memory usage spikes

### Trace Correlation Example

With `DD_LOGS_INJECTION=true`, your logs will automatically include trace IDs:

**Before (without Datadog):**
```
info: Program[0] Processing meter reading submission: 12345
```

**After (with Datadog):**
```
info: Program[0] Processing meter reading submission: 12345 dd.trace_id=1234567890 dd.span_id=9876543210
```

This allows you to:
- Click a log line → jump to its trace
- Click a trace → see all related logs
- Full request context across distributed services

### Troubleshooting Datadog Integration

#### No Data in Datadog

**Check 1: Verify extension is loaded**
```bash
# Check Lambda logs for Datadog extension startup
aws logs tail /aws/lambda/jek-meter-reading-api --follow | grep -i datadog

# Look for:
# "DATADOG TRACER CONFIGURATION"
# "Datadog Lambda Extension started"
```

**Check 2: Verify API key access**
```bash
# Check if Lambda can read from Secrets Manager
aws lambda get-function-configuration \
  --function-name jek-meter-reading-api \
  --query 'Environment.Variables' \
  --region ${AWS_REGION}

# Ensure DD_API_KEY_SECRET_ARN is set correctly
```

**Check 3: Test secret access manually**
```bash
# Verify secret exists and is readable
aws secretsmanager get-secret-value \
  --secret-id datadog-api-key \
  --region ${AWS_REGION}
```

**Check 4: Verify Datadog site**
- Ensure `DD_SITE` matches your Datadog account region
- Common mistake: Using `datadoghq.com` when you're on `datadoghq.eu`

#### Traces Not Appearing

**Check tracer configuration:**
```bash
# Enable debug logging temporarily
aws lambda update-function-configuration \
  --function-name jek-meter-reading-api \
  --environment Variables="{DD_TRACE_DEBUG=true,...other vars...}" \
  --region ${AWS_REGION}

# Check logs for tracer debug output
aws logs tail /aws/lambda/jek-meter-reading-api --follow
```

**Verify .NET tracer is loaded:**
```bash
# Lambda logs should show:
# "CORECLR_ENABLE_PROFILING: 1"
# "Datadog .NET Tracer loaded successfully"
```

#### High Memory Usage

The Datadog extension adds ~30-50MB memory overhead:

```bash
# Increase memory if needed
aws lambda update-function-configuration \
  --function-name jek-meter-reading-api \
  --memory-size 768 \
  --region ${AWS_REGION}
```

#### Cold Start Impact

Datadog extension adds ~50-100ms to cold starts:
- **Without Datadog**: ~100-150ms cold start
- **With Datadog**: ~150-250ms cold start
- **Mitigation**: Use Lambda provisioned concurrency or SnapStart

### Cost Implications

**Lambda Costs:**
- Memory overhead: ~30-50MB additional memory
- Cold start overhead: ~50-100ms additional duration
- **Estimated additional cost**: $0.10-0.20 per 1M requests

**Datadog Costs:**
- **APM**: Charged per APM host (serverless = billed by invocations)
- **Logs**: Charged per GB ingested and indexed
- **Metrics**: Included with APM
- **Estimated cost**: ~$15-30/month for 1M requests (varies by retention)

**Free Tier:**
- Datadog offers a 14-day free trial
- Some usage included in base subscription

### Unified Service Tagging Best Practices

Datadog uses three key tags for service organization:

```yaml
DD_ENV: "production"           # Environment: production, staging, development
DD_SERVICE: "meter-reading-api" # Service name (use kebab-case)
DD_VERSION: "1.0.5"            # Version (use semantic versioning or git SHA)
```

**Benefits:**
- Correlate traces, logs, and metrics across services
- Compare versions side-by-side (before/after deployments)
- Filter by environment in Datadog UI
- Automated deployment tracking

**Version Tracking Strategy:**

Option 1: Semantic versioning
```bash
DD_VERSION: "1.2.3"
```

Option 2: Git commit SHA
```bash
DD_VERSION: $(git rev-parse --short HEAD)
```

Option 3: Build timestamp
```bash
DD_VERSION: "1.0.0-$(date +%Y%m%d-%H%M%S)"
```

### Alternative: Direct API Key (Not Recommended)

For testing only, you can pass the API key directly (not production-safe):

```yaml
Environment:
  Variables:
    DD_API_KEY: "your-api-key-here"  # ⚠️ NOT RECOMMENDED - exposes key
```

**Why this is bad:**
- API key visible in CloudFormation templates
- Stored in Lambda environment variables (plaintext)
- Visible to anyone with Lambda read permissions
- Cannot rotate without redeployment

### Next Steps

1. **Set Up Alerts**: Create monitors in Datadog for error rates, latency spikes
2. **Create Dashboards**: Build custom dashboards for business metrics
3. **Enable RUM (Real User Monitoring)**: If you have a frontend
4. **Continuous Profiler**: Enable `DD_PROFILING_ENABLED=true` for CPU/memory profiling
5. **Custom Metrics**: Add application-specific metrics using DogStatsD

## References

- [ASP.NET Core Minimal APIs](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/minimal-apis)
- [.NET 8 Documentation](https://learn.microsoft.com/en-us/dotnet/core/whats-new/dotnet-8)
- [.NET 8 Native AOT](https://learn.microsoft.com/en-us/dotnet/core/deploying/native-aot/)
- [JSON Source Generation](https://learn.microsoft.com/en-us/dotnet/standard/serialization/system-text-json/source-generation)
- [Native AOT Deployment](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/native-aot)
- [Logging in .NET](https://learn.microsoft.com/en-us/dotnet/core/extensions/logging)
- [AWS Lambda Web Adapter](https://github.com/awslabs/aws-lambda-web-adapter)
- [AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/what-is-sam.html)
- [AWS Lambda Container Images](https://docs.aws.amazon.com/lambda/latest/dg/images-create.html)
