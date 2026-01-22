# DatadogAgent Configuration Reference

This guide shows you how to discover all available configuration options for the DatadogAgent custom resource.

---

## Quick Reference: How to Explore Configuration Options

### Method 1: kubectl explain (Interactive Exploration)

This is the BEST way to explore available fields:

```bash
# Start at the top level
kubectl explain datadogagent

# Explore the spec
kubectl explain datadogagent.spec

# Explore global settings
kubectl explain datadogagent.spec.global

# Explore features
kubectl explain datadogagent.spec.features

# Drill down into specific features
kubectl explain datadogagent.spec.features.logCollection
kubectl explain datadogagent.spec.features.apm
kubectl explain datadogagent.spec.features.npm

# Explore credentials
kubectl explain datadogagent.spec.global.credentials

# Explore override options
kubectl explain datadogagent.spec.override
```

**Pro tip:** Use Tab completion to explore nested fields!


### Method 2: Official Datadog Documentation

The most comprehensive and up-to-date information comes from Datadog's official resources:


**When to use:** When you need official guidance on setting up and configuring the operator.

#### 💻 GitHub Configuration Examples
**URL**: https://github.com/DataDog/datadog-operator/tree/main/examples

**What you'll find:**
- Real-world configuration examples
- Example YAML files for different use cases:
  - `datadogagent_v2alpha1_basic.yaml` - Minimal setup
  - `datadogagent_v2alpha1_apm.yaml` - APM enabled
  - `datadogagent_v2alpha1_logs.yaml` - Log collection
  - `datadogagent_v2alpha1_npm.yaml` - Network monitoring
  - `datadogagent_v2alpha1_all_features.yaml` - Everything enabled
  - And many more specific scenarios

**When to use:** When you want to see working examples you can copy and modify.


#### 📖 API Reference Documentation
**URL**: https://github.com/DataDog/datadog-operator/blob/main/docs/configuration.v2alpha1.md

**What you'll find:**
- Complete field-by-field documentation
- Detailed descriptions of every configuration option
- Data types for each field
- Default values
- Required vs. optional fields
- Nested structure documentation

**When to use:** When you need detailed information about a specific field or option.


### View Your Current Configuration

See what's already configured:

```bash
# View your current DatadogAgent
kubectl get datadogagent datadog -o yaml

# View just the spec section
kubectl get datadogagent datadog -o jsonpath='{.spec}' | jq

# Compare with default values
kubectl explain datadogagent.spec.global --recursive
```

---

## Quick Start Examples

### Minimal Configuration (What You Have)

```yaml
kind: "DatadogAgent"
apiVersion: "datadoghq.com/v2alpha1"
metadata:
  name: "datadog"
spec:
  global:
    site: "datadoghq.com"
    credentials:
      apiSecret:
        secretName: "datadog-secret"
        keyName: "api-key"
    clusterName: "jek-ddoperator-gke1dot32-standard"
    registry: "gcr.io/datadoghq"
    tags:
      - "env:dev"
      - "version:1.1.99"
  features:
    logCollection:
      enabled: true
      containerCollectAll: true
```

### Production Configuration (More Features)

```yaml
kind: "DatadogAgent"
apiVersion: "datadoghq.com/v2alpha1"
metadata:
  name: "datadog"
spec:
  global:
    site: "datadoghq.com"
    credentials:
      apiSecret:
        secretName: "datadog-secret"
        keyName: "api-key"
      appSecret:
        secretName: "datadog-secret"
        keyName: "app-key"
    clusterName: "production-gke-cluster"
    registry: "gcr.io/datadoghq"
    tags:
      - "env:production"
      - "region:us-west-2"
      - "team:platform"
    logLevel: "info"
    # Convert Kubernetes labels to Datadog tags
    podLabelsAsTags:
      app: "kube_app"
      version: "kube_version"
    nodeLabelsAsTags:
      kubernetes.io/arch: "kube_arch"
      topology.kubernetes.io/zone: "kube_zone"

  features:
    # Log Collection
    logCollection:
      enabled: true
      containerCollectAll: true
      autoMultiLineDetection: true

    # APM (Application Performance Monitoring)
    apm:
      enabled: true
      hostPortEnabled: true
      unixDomainSocketEnabled: true

    # NPM (Network Performance Monitoring)
    npm:
      enabled: true
      enableConntrack: true

    # USM (Universal Service Monitoring)
    usm:
      enabled: true

    # Live Process Collection
    liveProcessCollection:
      enabled: true
      scrubProcessArguments: true

    # Live Container Collection
    liveContainerCollection:
      enabled: true

    # Orchestrator Explorer (Kubernetes resources)
    orchestratorExplorer:
      enabled: true
      scrubContainers: true

    # Kubernetes State Metrics Core
    kubeStateMetricsCore:
      enabled: true
      clusterCheck: true

    # Cluster Checks
    clusterChecks:
      enabled: true
      useClusterChecksRunners: true

    # DogStatsD for custom metrics
    dogstatsd:
      enabled: true
      hostPortConfig:
        enabled: true
        port: 8125

    # Prometheus Scraping
    prometheusScrape:
      enabled: true
      enableServiceEndpoints: true

    # Event Collection
    eventCollection:
      unbundleEvents: true

  # Override default settings
  override:
    nodeAgent:
      # Resource limits for agent pods
      resources:
        requests:
          cpu: 200m
          memory: 256Mi
        limits:
          cpu: 500m
          memory: 512Mi

    clusterAgent:
      replicas: 2
      resources:
        requests:
          cpu: 100m
          memory: 128Mi
        limits:
          cpu: 200m
          memory: 256Mi
```

### Enterprise Configuration (All Features)

```yaml
kind: "DatadogAgent"
apiVersion: "datadoghq.com/v2alpha1"
metadata:
  name: "datadog"
spec:
  global:
    site: "datadoghq.com"
    credentials:
      apiSecret:
        secretName: "datadog-secret"
        keyName: "api-key"
      appSecret:
        secretName: "datadog-secret"
        keyName: "app-key"
    clusterName: "enterprise-prod-cluster"
    registry: "gcr.io/datadoghq"
    tags:
      - "env:production"
      - "compliance:pci"
      - "criticality:high"
    logLevel: "info"
    kubelet:
      tlsVerify: true

  features:
    # All monitoring features
    logCollection:
      enabled: true
      containerCollectAll: true
    apm:
      enabled: true
      hostPortEnabled: true
    npm:
      enabled: true
    usm:
      enabled: true
    liveProcessCollection:
      enabled: true
    liveContainerCollection:
      enabled: true
    orchestratorExplorer:
      enabled: true

    # Security features
    cspm:
      enabled: true
      hostBenchmarks:
        enabled: true
    cws:
      enabled: true
      syscallMonitor:
        enabled: true
    asm:
      enabled: true
      threats:
        enabled: true

    # Advanced features
    admissionController:
      enabled: true
      mutateUnlabelled: true
    clusterChecks:
      enabled: true
    prometheusScrape:
      enabled: true
    otlp:
      receiver:
        protocols:
          grpc:
            enabled: true
          http:
            enabled: true
```

---

## Field Discovery Command Reference

### Explore Structure

```bash
# Top level
kubectl explain datadogagent

# Main sections
kubectl explain datadogagent.spec
kubectl explain datadogagent.spec.global
kubectl explain datadogagent.spec.features
kubectl explain datadogagent.spec.override

# Recursive view (shows all nested fields)
kubectl explain datadogagent.spec --recursive
```

### Explore Specific Features

```bash
# Log Collection
kubectl explain datadogagent.spec.features.logCollection

# APM
kubectl explain datadogagent.spec.features.apm

# NPM
kubectl explain datadogagent.spec.features.npm

# Security
kubectl explain datadogagent.spec.features.cspm
kubectl explain datadogagent.spec.features.cws
kubectl explain datadogagent.spec.features.asm

# Kubernetes Monitoring
kubectl explain datadogagent.spec.features.orchestratorExplorer
kubectl explain datadogagent.spec.features.kubeStateMetricsCore

# Custom Metrics
kubectl explain datadogagent.spec.features.dogstatsd
kubectl explain datadogagent.spec.features.prometheusScrape
```

### Explore Credentials

```bash
# Credentials structure
kubectl explain datadogagent.spec.global.credentials

# API Secret
kubectl explain datadogagent.spec.global.credentials.apiSecret

# App Secret
kubectl explain datadogagent.spec.global.credentials.appSecret
```

### Explore Overrides

```bash
# Node Agent overrides
kubectl explain datadogagent.spec.override.nodeAgent

# Cluster Agent overrides
kubectl explain datadogagent.spec.override.clusterAgent

# Resources
kubectl explain datadogagent.spec.override.nodeAgent.resources
```

---

## Common Configuration Patterns

### Enable Debug Logging

```yaml
spec:
  global:
    logLevel: "debug"
```

### Add Custom Tags

```yaml
spec:
  global:
    tags:
      - "env:production"
      - "team:platform"
      - "cost-center:engineering"
```

### Change Container Registry

```yaml
spec:
  global:
    # Options: gcr.io/datadoghq, public.ecr.aws/datadog, docker.io/datadog
    registry: "public.ecr.aws/datadog"
```

### Set Resource Limits

```yaml
spec:
  override:
    nodeAgent:
      resources:
        requests:
          cpu: 200m
          memory: 256Mi
        limits:
          cpu: 500m
          memory: 512Mi
```

### Tolerate Specific Nodes

```yaml
spec:
  override:
    nodeAgent:
      tolerations:
        - key: "node-role.kubernetes.io/master"
          effect: "NoSchedule"
```

### Run Only on Specific Nodes

```yaml
spec:
  override:
    nodeAgent:
      nodeSelector:
        monitoring: "enabled"
```

---

## Validation and Testing

### Validate Your Configuration

```bash
# Dry-run to check syntax
kubectl apply -f datadog-operator-agent.yaml --dry-run=client

# Apply and watch for errors
kubectl apply -f datadog-operator-agent.yaml

# Check status
kubectl describe datadogagent datadog

# Check operator logs for any issues
kubectl logs -l app.kubernetes.io/name=datadog-operator --tail=50
```

### Compare Configurations

```bash
# Export current config
kubectl get datadogagent datadog -o yaml > current-config.yaml

# Compare with your file
diff datadog-operator-agent.yaml current-config.yaml
```

---

## Getting More Help

### In-Cluster Documentation

```bash
# Get all available CRDs
kubectl get crd | grep datadog

# Explore each CRD
kubectl explain datadogagent
kubectl explain datadogmetric
kubectl explain datadogmonitor
```
---

## Summary

**To discover all configuration options, use:**

```bash
# Interactive exploration
kubectl explain datadogagent --recursive

# Full CRD schema
kubectl get crd datadogagents.datadoghq.com -o yaml

# Your current config
kubectl get datadogagent datadog -o yaml
```

**Main configuration areas:**
- `spec.global` - Cluster-wide settings (credentials, tags, registry)
- `spec.features` - Enable/disable Datadog features (logs, APM, NPM, etc.)
- `spec.override` - Customize agent deployments (resources, tolerations, etc.)

Start with what you have and add features incrementally! 🚀


  Check Official Documentation

  - GitHub examples: https://github.com/DataDog/datadog-operator/tree/main/examples
  - API reference: https://github.com/DataDog/datadog-operator/blob/main/docs/configuration.v2alpha1.md