# Datadog Agent Docker Setup

A simple Docker Compose setup for running the Datadog Agent with environment-based API key configuration.

## 📋 Prerequisites

Before you begin, make sure you have:

- **Docker**: [Install Docker](https://docs.docker.com/get-docker/)
- **Docker Compose**: Usually included with Docker Desktop
- **Datadog Account**: [Sign up for free](https://www.datadoghq.com/)
- **Python 3.8+**: For running the test script

## 🚀 Quick Setup

### Step 1: Get Your Datadog API Key

1. Log in to your [Datadog account](https://app.datadoghq.com/)
2. Go to **Organization Settings** → **API Keys**
3. Copy an existing API key or create a new one

### Step 2: Configure Environment

```bash
# Copy the environment template
cp .env.example .env

# Edit the .env file and replace with your actual API key
# .env should contain:
# DD_API_KEY=your_actual_api_key_here
```

### Step 3: Start the Datadog Agent

```bash
# Start the container in the background
docker-compose up -d

# Check if the container is running
docker-compose ps
```

## 🧪 Verification

### Check Container Status

```bash
# View container status
docker-compose ps

# Check container health
docker-compose logs datadog-agent
```

### Send Test Metrics

Run the included Python test script to verify metrics are being sent:

```bash
# Run the test script
python3 test-metrics-no-datadog-dep.py
```

**Expected Output:**
```
🔍 Testing Datadog Agent DogStatsD Connection
==================================================
✓ Connection test successful to localhost:8125

📊 Sending test metrics...

Counter Metric:
✓ Sent metric: test.counter:1|c|#environment:test,source:python_script

Gauge Metric:
✓ Sent metric: test.gauge:42|g|#environment:test,source:python_script

Histogram Metric:
✓ Sent metric: test.histogram:1.23|h|#environment:test,source:python_script

==================================================
📈 Results: 3/3 metrics sent successfully
```

### Verify in Datadog Dashboard

1. Go to your [Datadog Metrics Explorer](https://app.datadoghq.com/metric/explorer)
2. Search for metrics starting with `test.`
3. You should see: `test.counter`, `test.gauge`, `test.histogram`

**Note**: It may take 2-5 minutes for metrics to appear in Datadog.

## 🔧 Troubleshooting

### Container Won't Start

```bash
# Check container logs
docker-compose logs datadog-agent

# Common issues:
# - Invalid API key: Check your .env file
# - Port conflict: Another service using port 8125
# - Docker permissions: Try running with sudo (Linux)
```

### API Key Issues

- **Invalid Key Error**: Verify your API key in Datadog dashboard
- **Key Not Found**: Make sure `.env` file exists and contains `DD_API_KEY=your_key`
- **Permission Denied**: Check that your API key has proper permissions

### 🕵️ Network Troubleshooting (Advanced)

If metrics aren't appearing in Datadog, follow this systematic troubleshooting approach:

#### Step 1: Verify Container Health
```bash
# Check if container is running and healthy
docker-compose ps

# Should show: Up X minutes (healthy)
```

#### Step 2: Check DogStatsD Reception
```bash
# Get detailed agent status
docker-compose exec datadog-agent agent status

# Look for the "DogStatsD" section:
# =========
# DogStatsD
# =========
#   Metric Packets: 0     ← Should be > 0 after sending metrics
#   Udp Bytes: 0          ← Should be > 0 after sending metrics  
#   Udp Packets: 0        ← Should be > 0 after sending metrics
```

**If all values are 0**: DogStatsD isn't receiving your metrics!

#### Step 3: Test Network Connectivity
```bash
# Test if port 8125 is accessible from host
nc -u -v localhost 8125
# Should connect without errors

# Check if DogStatsD port is listening inside container
docker-compose exec datadog-agent netstat -tuln | grep 8125
# Should show: udp 0.0.0.0:8125
```

#### Step 4: Verify Docker Network Configuration
```bash
# Check Docker Compose configuration for conflicts
cat docker-compose.yml | grep -A5 -B5 "network_mode\|ports"

# Common issues:
# ❌ network_mode: host + ports mapping = CONFLICT!
# ✅ Either use network_mode: host OR ports mapping, not both
```

#### Step 5: Test Metric Sending
```bash
# Send test metrics and immediately check reception
uv run test-metrics.py

# Then quickly check agent status
docker-compose exec datadog-agent agent status | grep -A 15 "DogStatsD"
```

#### Step 6: Check Agent Logs for Errors
```bash
# Look for DogStatsD-related errors
docker-compose logs datadog-agent | grep -i dogstatsd

# Look for network binding issues
docker-compose logs datadog-agent | grep -i "bind\|port\|8125"
```

### Common Network Issues & Solutions

| Problem | Symptoms | Solution |
|---------|----------|----------|
| **Port mapping ignored** | `Udp Packets: 0` in status | Remove `network_mode: host` |
| **Port already in use** | Container fails to start | Change port or stop conflicting service |
| **Firewall blocking** | Connection timeout | Configure firewall rules |
| **Wrong host/port in script** | Connection refused | Verify `127.0.0.1:8125` in Python script |

### Network Configuration Examples

```yaml
# ✅ GOOD: Standard setup with port mapping
services:
  datadog-agent:
    ports:
      - "8125:8125/udp"
    # No network_mode specified = bridge mode

# ❌ BAD: Conflicting configuration  
services:
  datadog-agent:
    network_mode: host
    ports:
      - "8125:8125/udp"  # This is ignored!

# ✅ GOOD: Host networking (advanced use case)
services:
  datadog-agent:
    network_mode: host
    # No ports mapping needed
```

### Test Script Fails

```bash
# Connection refused: Make sure container is running
docker-compose ps

# Permission denied: Check Docker socket permissions
ls -la /var/run/docker.sock

# Python issues: Verify Python 3.8+ is installed
python3 --version

# Network issues: Follow network troubleshooting above
```

## 🧹 Cleanup

### Stop the Agent

```bash
# Stop the container
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### Complete Cleanup

```bash
# Remove container and image
docker-compose down --rmi all

# Remove any leftover volumes
docker system prune -f

# Verify cleanup
docker ps -a
docker images | grep datadog
```

## 📁 Project Structure

```
dogstatsd-v-datadogagent-v7dot68dot3/
├── .env.example                    # Environment template
├── .gitignore                     # Git ignore rules
├── docker-compose.yml             # Container configuration
├── test-metrics-no-datadog-dep.py # Verification script
└── README.md                      # This file
```

## 🔒 Security Notes

- The `.env` file is excluded from Git via `.gitignore`
- Never commit API keys to version control
- Docker volumes are mounted read-only where possible
- Only necessary ports are exposed (8125/udp)

## 📚 Additional Resources

- [Datadog Agent Documentation](https://docs.datadoghq.com/agent/)
- [DogStatsD Documentation](https://docs.datadoghq.com/developers/dogstatsd/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)

## 🆘 Getting Help

If you encounter issues:

1. Check the troubleshooting section above
2. Review container logs: `docker-compose logs datadog-agent`
3. Verify your API key in Datadog dashboard
4. Test network connectivity to localhost:8125