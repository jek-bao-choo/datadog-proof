# Datadog Agent Docker Setup

![](proof1.png)

## 🚀 Setup Instructions

### Step 1: Start CloudPrem

```bash
docker --version

docker pull datadog/cloudprem:edge

# cloudprem:edge is the latest image
# To pull the latest stable release, use cloudprem:latest
docker run  \
  --name cloudprem \
  -v $(pwd)/qwdata:/quickwit/qwdata \
  -e CP_ENABLE_REVERSE_CONNECTION=false \
  -e QW_ENABLE_CORS_DEBUG=true \
  -p 127.0.0.1:7280:7280 \
  datadog/cloudprem:edge run
```

Visit http://localhost:7280/logs/ to see it running

### Step 2: Configure Environment

```bash
# Copy the environment template
cp .env.example .env
```

**Important: Do you need a real API key?**

Since logs are sent to **CloudPrem locally** (not Datadog cloud), you have two options:

**Dummy API Key**
```bash
# .env file
DD_API_KEY=0000000000000000000000000000000
```
- ✅ Works fine for local CloudPrem log collection
- ✅ No need for a Datadog account
- ⚠️ Metrics will fail to send to Datadog cloud (but logs work perfectly)


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

## 📡 CloudPrem Configuration (Local Log Indexer)

The agent is configured to send logs to a local CloudPrem indexer instead of Datadog's cloud.

### Quick Summary

✅ **Logs are sent to**: `http://host.docker.internal:7280` (your local CloudPrem)
✅ **Custom attributes work**: Use JSON log format
✅ **Docker labels collected**: `owner` and `env` labels are collected as tags
✅ **Result**: Custom attributes appear in the "FIELDS & ATTRIBUTES" section in CloudPrem
✅ **API Key**: A dummy key (e.g., `0000000000000000000000000000000`) works fine for local CloudPrem-only setup

### Current Configuration

In `docker-compose.yml`, the following environment variables are set:

```yaml
environment:
  - DD_LOGS_CONFIG_USE_HTTP=true              # Use HTTP transport
  - DD_LOGS_CONFIG_LOGS_NO_SSL=true           # Disable SSL
  - DD_LOGS_CONFIG_LOGS_DD_URL=http://host.docker.internal:7280
```

The `DD_DOCKER_LABELS_AS_TAGS` configuration tells the agent to collect specific Docker labels (like `owner` and `env`) and add them as searchable attributes to your logs.

### Security Settings Explained

The Datadog agent requires elevated permissions to monitor your system and containers:

```yaml
# Security context
cap_add:
  - SYS_PTRACE
security_opt:
  - apparmor:unconfined
```

**Why these are needed:**

**`SYS_PTRACE` capability:**
- Allows the agent to trace and monitor running processes on the host
- Required for:
  - Live process monitoring (CPU, memory usage per process)
  - Container process monitoring
  - System-level metrics collection
- Without it: The agent cannot see detailed process information

**`apparmor:unconfined` security option:**
- Disables AppArmor security restrictions for the agent container
- Required for:
  - Reading system files from `/proc`, `/sys`, and `/var/lib/docker`
  - Accessing Docker socket for container monitoring
  - Collecting comprehensive system metrics
- Without it: AppArmor would block access to many system resources

**Is this safe?**
- ✅ Yes, for local development and testing
- ✅ The volumes are mounted as read-only (`:ro`) where possible
- ⚠️ In production, review your security requirements
- 📌 The agent only monitors - it doesn't modify system files

These permissions allow the Datadog agent to act as a monitoring tool with visibility into your system, similar to how tools like `htop` or `docker stats` work.

### Other Important Settings

**`pid: host` and `cgroup: host`:**
```yaml
pid: host      # Share the host's process namespace
cgroup: host   # Share the host's cgroup namespace
```

- Allows the agent to see ALL processes on the host (not just container processes)
- Enables accurate CPU and memory metrics for the entire system
- Required for comprehensive infrastructure monitoring

**Volume mounts:**
```yaml
volumes:
  - /var/run/docker.sock:/var/run/docker.sock:ro          # Docker API access
  - /proc/:/host/proc/:ro                                  # Host process info
  - /sys/fs/cgroup/:/host/sys/fs/cgroup:ro                # Cgroup metrics
  - /var/lib/docker/containers:/var/lib/docker/containers:ro  # Container logs
```

- All mounted as **read-only (`:ro`)** for security
- Gives agent access to system and container information without modification rights

### Why `host.docker.internal`?

**Key Concept**: When the Datadog agent runs inside a Docker container, `localhost` refers to the container itself, NOT your host machine.

- **Wrong**: `http://localhost:7280` - Points to the container, not your host
- **Correct**: `http://host.docker.internal:7280` - Points to your host machine

`host.docker.internal` is a special DNS name that Docker provides (on macOS and Windows) to access services running on the host machine from inside containers.

### Verify Logs Are Being Sent

```bash
# Check agent logs for successful connection
docker-compose logs datadog-agent | grep "HTTP connectivity"

# You should see:
# HTTP connectivity successful

```

## Use the Helper Script to generate test logs

```bash
# Run the interactive log generator
./generate-logs.sh

# Choose from:
# 1. Continuous JSON logs (every second) - with owner=jek, env=test
# 2. 10 quick JSON test entries - with owner=jek, env=test
# 3. Multi-level JSON logs (INFO, WARN, ERROR) - with owner=jek, env=test
# 4. Stop all generators
```

All logs are generated in **JSON format** with custom attributes embedded in the log message: **owner=jek** and **env=test**

## 🔧 Troubleshooting

### No Logs Appearing in CloudPrem

If logs aren't showing up in CloudPrem Log Explorer:

```bash
# 1. Check agent logs for connection errors
docker-compose logs datadog-agent | grep -i "error\|refused\|failed"

# 2. Common error: "connection refused"
# This means the agent can't reach CloudPrem on the host

# 3. Verify CloudPrem is running
docker ps | grep cloudprem

# 4. Check the logs URL configuration
docker-compose exec datadog-agent env | grep LOGS_DD_URL
# Should show: DD_LOGS_CONFIG_LOGS_DD_URL=http://host.docker.internal:7280
```

**Fix**: Make sure `docker-compose.yml` uses `host.docker.internal:7280` NOT `localhost:7280`

### Container Won't Start

```bash
# Check container logs
docker-compose logs datadog-agent

# Common issues:
# - Invalid API key: Check your .env file
# - Port conflict: Another service using port 8126
# - Docker permissions: Try running with sudo (Linux)
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

## Cleanup

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
cloudprem__datadogagent7dot74/
├── .env.example                    # Environment template
├── .gitignore                      # Git ignore rules
├── docker-compose.yml              # Container configuration
├── generate-logs.sh                # Log generation helper script
└── README.md                       # This file
```

## 🔒 Security Notes

- The `.env` file is excluded from Git via `.gitignore`
- Never commit API keys to version control
- Docker volumes are mounted read-only where possible