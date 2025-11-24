# Cloud Run Java Spring Boot Demo with JVM Metrics

A simple Java Spring Boot application deployed to Google Cloud Run using Terraform. This demo exposes JVM metrics via Spring Boot Actuator endpoints for monitoring memory, garbage collection, threads, and class loading.

## What This Demo Does

- Deploys a Java Spring Boot application to Google Cloud Run
- Exposes REST API endpoints (/, /info)
- Provides health checks via Spring Boot Actuator
- Exposes JVM metrics (Memory, GC, Threads, Classes) via HTTP endpoints
- Runs in a fully managed serverless environment

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│  Google Cloud Run (asia-southeast1)                     │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Spring Boot App (Port 8080)                      │  │
│  │  - REST API Endpoints: /, /info                   │  │
│  │  - Health Checks: /actuator/health                │  │
│  │  - Metrics: /actuator/metrics/*                   │  │
│  └───────────────────────────────────────────────────┘  │
│                                                          │
│  Service Account: jek-cloudrun-sa                       │
│  Permissions: logging.logWriter, monitoring.metricWriter│
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│  Artifact Registry                                       │
│  Repository: jek-java-apps                              │
│  Image: cloudrun-java-demo:latest                       │
└─────────────────────────────────────────────────────────┘
```

## Prerequisites

- Google Cloud account with project access
- `gcloud` CLI authenticated
- `terraform` >= 1.0
- `docker` installed
- `maven` 3.9+ (for local builds)
- Java 17+ (for local development)

## Project Structure

```
cloudrun__java/
├── app/
│   ├── pom.xml                          # Maven dependencies
│   ├── Dockerfile                       # Multi-stage Docker build
│   └── src/main/
│       ├── java/com/example/demo/
│       │   └── DemoApplication.java    # Main application with REST endpoints
│       └── resources/
│           └── application.properties  # Spring Boot configuration
├── versions.tf                          # Terraform provider configuration
├── variables.tf                         # Input variable definitions
├── terraform.tfvars                     # Project-specific values
├── main.tf                              # Main infrastructure resources
├── outputs.tf                           # Output values and test commands
└── README.md                            # This file
```

## Quick Start

### 1. Update Configuration

Edit `terraform.tfvars`:
```hcl
project_id = "your-gcp-project-id"
region     = "asia-southeast1"
```

### 2. Initialize Terraform

```bash
cd cloudrun__java
terraform init
```

### 3. Build and Push Docker Image

```bash
# Configure Docker authentication
gcloud auth configure-docker asia-southeast1-docker.pkg.dev

# Build the Docker image (use --platform for M1/M2 Macs)
docker build --platform linux/amd64 \
  -t asia-southeast1-docker.pkg.dev/your-gcp-project-id/jek-java-apps/cloudrun-java-demo:latest \
  app/

# Push to Artifact Registry
docker push asia-southeast1-docker.pkg.dev/your-gcp-project-id/jek-java-apps/cloudrun-java-demo:latest
```

### 4. Deploy Infrastructure

```bash
# Deploy all resources
export OTEL_TRACES_EXPORTER=""  # Workaround for telemetry error
terraform apply
```

This will create:
- Enable required GCP APIs (Cloud Run, Artifact Registry, Cloud Build)
- Artifact Registry repository for Docker images
- IAM service account with logging and metrics permissions
- Cloud Run service with health probes
- Public access policy (allUsers can invoke)

### 5. Test the Application

After deployment, Terraform outputs the service URL. Test all endpoints:

```bash
# Get the service URL
export SERVICE_URL=$(terraform output -raw service_url)

# Test main endpoint
curl $SERVICE_URL/

# Test info endpoint (shows memory usage)
curl $SERVICE_URL/info

# Test health endpoint
curl $SERVICE_URL/actuator/health

# List all available metrics
curl $SERVICE_URL/actuator/metrics
```

## Available Endpoints

### Application Endpoints

| Endpoint | Description | Example Response |
|----------|-------------|------------------|
| `GET /` | Main endpoint | `{"message": "Hello from Cloud Run!", "service": "cloudrun-java-demo", "version": "1.0.0"}` |
| `GET /info` | Application info with memory stats | `{"application": "Cloud Run Java Demo", "javaVersion": "17.0.17", "memory": {...}}` |

### Health Check Endpoints

| Endpoint | Description | Use Case |
|----------|-------------|----------|
| `GET /actuator/health` | Overall health status | Kubernetes probes, monitoring |
| `GET /actuator/health/liveness` | Liveness probe | Check if app is running |
| `GET /actuator/health/readiness` | Readiness probe | Check if app can serve traffic |

### JVM Metrics Endpoints

| Endpoint | Metric | Description |
|----------|--------|-------------|
| `GET /actuator/metrics` | All metrics list | Returns array of 50+ available metrics |
| `GET /actuator/metrics/jvm.memory.used` | Memory usage | Heap and non-heap memory consumption |
| `GET /actuator/metrics/jvm.memory.max` | Max memory | Maximum available memory |
| `GET /actuator/metrics/jvm.gc.pause` | GC pauses | Garbage collection timing and count |
| `GET /actuator/metrics/jvm.gc.memory.allocated` | GC allocation | Memory allocated since app start |
| `GET /actuator/metrics/jvm.threads.live` | Live threads | Current thread count |
| `GET /actuator/metrics/jvm.threads.daemon` | Daemon threads | Background thread count |
| `GET /actuator/metrics/jvm.threads.peak` | Peak threads | Maximum thread count reached |
| `GET /actuator/metrics/jvm.classes.loaded` | Loaded classes | Number of classes currently loaded |
| `GET /actuator/metrics/jvm.classes.unloaded` | Unloaded classes | Number of classes unloaded |

### Example: JVM Memory Metrics

```bash
curl $SERVICE_URL/actuator/metrics/jvm.memory.used
```

Response:
```json
{
  "name": "jvm.memory.used",
  "description": "The amount of used memory",
  "baseUnit": "bytes",
  "measurements": [
    {
      "statistic": "VALUE",
      "value": 71508040
    }
  ],
  "availableTags": [
    {
      "tag": "area",
      "values": ["heap", "nonheap"]
    },
    {
      "tag": "id",
      "values": [
        "CodeHeap 'profiled nmethods'",
        "Eden Space",
        "Survivor Space",
        "Tenured Gen",
        "Metaspace"
      ]
    }
  ]
}
```

### Example: Garbage Collection Metrics

```bash
curl $SERVICE_URL/actuator/metrics/jvm.gc.pause
```

Response:
```json
{
  "name": "jvm.gc.pause",
  "description": "Time spent in GC pause",
  "baseUnit": "seconds",
  "measurements": [
    {
      "statistic": "COUNT",
      "value": 3.0
    },
    {
      "statistic": "TOTAL_TIME",
      "value": 0.142
    },
    {
      "statistic": "MAX",
      "value": 0.09
    }
  ]
}
```

### Cloud Run Service

- **Region**: asia-southeast1 (Singapore)
- **CPU**: 1 vCPU
- **Memory**: 512 Mi
- **Min Instances**: 0 (scale to zero)
- **Max Instances**: 10
- **Container Port**: 8080

### Health Probes

**Startup Probe** (gives app time to initialize):
- Path: `/actuator/health`
- Initial delay: 10 seconds
- Period: 10 seconds
- Timeout: 3 seconds
- Failure threshold: 3 attempts

**Liveness Probe** (checks if app is running):
- Path: `/actuator/health`
- Initial delay: 30 seconds
- Period: 30 seconds
- Timeout: 3 seconds
- Failure threshold: 3 attempts

## Cleanup

To delete all resources and avoid charges:

```bash
# Destroy all Terraform resources
terraform destroy

# Optionally delete the Docker image from Artifact Registry
gcloud artifacts docker images delete \
  asia-southeast1-docker.pkg.dev/your-gcp-project-id/jek-java-apps/cloudrun-java-demo:latest
```

## Cost Considerations

- Cloud Run charges only when requests are being handled
- With min_instances = 0, service scales to zero when not in use
- Artifact Registry storage is minimal for one image
- Expected cost: < $5/month for light testing usage

## Troubleshooting

### Issue: Terraform telemetry error

```
Error: Could not initialize telemetry: invalid OTLP protocol
```

**Solution**: Set environment variable before running terraform commands:
```bash
export OTEL_TRACES_EXPORTER=""
```

### Issue: Docker push permission denied

```
Error: unauthorized: authentication failed
```

**Solution**: Re-authenticate Docker:
```bash
gcloud auth configure-docker asia-southeast1-docker.pkg.dev
```

### Issue: Cloud Run service not starting

**Check logs**:
```bash
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=jek-cloudrun-java-api" --limit 50 --format json
```

**Common causes**:
- Image doesn't exist in Artifact Registry
- Application not listening on PORT environment variable
- Health check failing

### Issue: 503 Service Unavailable

**Cause**: Service is scaling from zero (cold start)

**Solution**: Wait 10-15 seconds and retry. Consider increasing min_instances in variables.tf if faster response is needed:
```hcl
variable "min_instances" {
  default     = 1  # Changed from 0
}
```

## Next Steps

- Add custom business logic to `DemoApplication.java`
- Integrate with Datadog APM for distributed tracing
- Add database connectivity (Cloud SQL)
- Set up CI/CD pipeline (Cloud Build)
- Add authentication (Cloud Identity-Aware Proxy)
- Monitor metrics in Cloud Monitoring

## Resources

- [Spring Boot Actuator Documentation](https://docs.spring.io/spring-boot/docs/current/reference/html/actuator.html)
- [Google Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Terraform Google Provider](https://registry.terraform.io/providers/hashicorp/google/latest/docs)
- [Spring Boot Metrics](https://docs.spring.io/spring-boot/docs/current/reference/html/actuator.html#actuator.metrics)
