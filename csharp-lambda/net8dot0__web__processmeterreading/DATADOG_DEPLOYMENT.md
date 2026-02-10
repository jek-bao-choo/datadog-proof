# Datadog Instrumentation - Quick Deployment Guide

This guide provides step-by-step instructions to deploy the Meter Reading API with Datadog observability.

## Prerequisites

1. **Datadog Account**: Sign up at https://www.datadoghq.com/
2. **Datadog API Key**: Get your API key from Datadog → Organization Settings → API Keys
3. **AWS CLI**: Installed and configured
4. **AWS SAM CLI**: Installed (version 1.53.0 or later)
5. **Docker**: Running and accessible to SAM CLI

## Quick Start (For Testing/POC)

### Step 1: Build the Application

```bash
sam build
```

This will:
- Build the .NET 8 application with Native AOT
- Install Datadog Lambda Extension (version 88)
- Install Datadog .NET APM Tracer (version 3.8.0)
- Configure all environment variables for tracing

### Step 2: Deploy with Datadog API Key


**Non-Interactive Deployment**

```bash
export AWS_REGION="ap-southeast-1"

# Navigate to project directory
cd net8dot0__web__processmeterreading

# Build and deploy in one command
sam build --use-container && \
sam deploy \
  --stack-name jek-meter-reading-api \
  --parameter-overrides DatadogApiKey=YOUR_DATADOG_API_KEY_HERE \
  --capabilities CAPABILITY_IAM \
  --region ${AWS_REGION} \
  --resolve-s3 \
  --resolve-image-repos \
  --no-confirm-changeset
```

Replace `YOUR_DATADOG_API_KEY_HERE` with your actual Datadog API key.

### Step 3: Testing the Deployed Lambda API

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

### Step 4: View Traces in Datadog

1. Log in to your Datadog account
2. Navigate to **APM → Traces**
3. Look for service name: `meter-reading-api`
4. You should see:
   - HTTP requests to your Lambda function
   - Response times and latencies
   - Error rates (if any)
   - Lambda cold starts
   - Distributed traces showing the full request flow

## What's Being Monitored

The Datadog instrumentation captures:

### 🔍 Traces (APM)
- HTTP request/response details
- Lambda function invocations
- Cold start detection
- Error traces with stack traces

### 📊 Metrics
- Lambda invocation count
- Duration (execution time)
- Memory usage
- Cold starts
- Error rates
- Custom application metrics

### 📝 Logs
- Lambda function logs with trace correlation
- Application logs from ASP.NET Core
- Datadog Extension logs

## Configuration Details

### Dockerfile Configuration

The Dockerfile now includes:
- **Datadog Lambda Extension v88**: Collects traces, logs, and metrics
- **Datadog .NET APM Tracer v3.8.0**: Automatic instrumentation via CLR profiling
- **CLR Profiler Settings**: Enables automatic tracing without code changes

### SAM Template Configuration

Key environment variables set in `template.yaml`:

```yaml
DD_API_KEY: !Ref DatadogApiKey          # Your Datadog API key
DD_SITE: datadoghq.com                   # Datadog site (change if using EU/US3)
DD_CAPTURE_LAMBDA_PAYLOAD: true          # Captures request/response for debugging
DD_LOGS_INJECTION: true                  # Correlates logs with traces
DD_TRACE_ENABLED: true                   # Enables APM tracing
DD_SERVICE: jek-meter-reading-api            # Service name in Datadog
DD_ENV: development                      # Environment tag
DD_VERSION: 1.0.0                        # Version tag
```

## Production Deployment (Using Secrets Manager)

⚠️ **WARNING**: The current setup uses environment variables for the API key, which is **NOT recommended for production**.

For production deployments:

### Step 1: Store API Key in AWS Secrets Manager

```bash
aws secretsmanager create-secret \
  --name datadog/api_key \
  --description "Datadog API Key" \
  --secret-string "YOUR_DATADOG_API_KEY_HERE"
```

### Step 2: Update template.yaml

1. Remove the `Parameters` section
2. Replace `DD_API_KEY: !Ref DatadogApiKey` with:
   ```yaml
   DD_API_KEY_SECRET_ARN: !Sub 'arn:aws:secretsmanager:${AWS::Region}:${AWS::AccountId}:secret:datadog/api_key'
   ```
3. Uncomment the Secrets Manager IAM policy in the `Policies` section

### Step 3: Deploy

```bash
sam build
sam deploy --guided
```

No need to provide `DatadogApiKey` parameter anymore - it will be fetched from Secrets Manager at runtime.

## Troubleshooting

### No traces appearing in Datadog

1. **Check Lambda logs in CloudWatch**:
   ```bash
   sam logs --stack-name meter-reading-api --tail
   ```

2. **Verify Datadog Extension is loaded**:
   Look for logs like:
   ```
   DATADOG TRACER CONFIGURATION - TRACER VERSION: 3.8.0
   ```

3. **Verify API key is correct**:
   Check Lambda environment variables in AWS Console

4. **Check Datadog site setting**:
   Ensure `DD_SITE` matches your Datadog account region

### Lambda timing out

If Lambda times out after adding Datadog:
- Increase Lambda timeout in `template.yaml` (currently 30 seconds)
- Increase memory size (more memory = faster cold starts)

### Permission errors

If you see permission errors related to Secrets Manager:
- Ensure the IAM policy in `template.yaml` is uncommented
- Verify the secret ARN is correct

## Version Updates

### Updating Datadog Lambda Extension

Check for latest version: https://gallery.ecr.aws/datadog/lambda-extension

Update in `Dockerfile`:
```dockerfile
COPY --from=public.ecr.aws/datadog/lambda-extension:88 /opt/extensions/ /opt/extensions/
#                                                      ^^
#                                                   Change this version number
```

### Updating Datadog .NET APM Tracer

Check for latest version: https://github.com/DataDog/dd-trace-dotnet/releases

Update in `Dockerfile`:
```dockerfile
RUN TRACER_VERSION=3.33.0 && \
#                  ^^^^^
#             Change this version number
```

## Additional Resources

- [Datadog Lambda Extension Documentation](https://docs.datadoghq.com/serverless/libraries_integrations/extension/)
- [Datadog .NET APM Documentation](https://docs.datadoghq.com/tracing/setup_overview/setup/dotnet-core/)
- [AWS Lambda with Datadog](https://docs.datadoghq.com/serverless/aws_lambda/)
- [Project README.md](README.md) - Complete instrumentation comparison and details

## Cost Considerations

- **Datadog**: Free trial available, pricing based on ingested spans and hosts
- **AWS Lambda**: Standard Lambda pricing applies
- **Datadog Extension**: No additional Lambda charges (runs as part of Lambda execution)
- **Cold starts**: Slightly longer with Datadog (~200-500ms additional on cold starts)

## Support

For issues:
1. Check CloudWatch Logs for error messages
2. Review Datadog Lambda Extension logs in CloudWatch
3. Consult [README.md](README.md) for detailed instrumentation information
4. Visit [Datadog Support](https://docs.datadoghq.com/help/)
