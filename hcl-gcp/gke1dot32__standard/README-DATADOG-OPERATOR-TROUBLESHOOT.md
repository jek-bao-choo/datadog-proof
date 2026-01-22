# Datadog Operator Troubleshooting Guide

This guide helps you diagnose and fix common issues with Datadog operator and agent deployment.

---

## Quick Health Check Commands

Run these commands to get a quick overview of your Datadog setup:

```bash
# 1. Check operator pods
kubectl get pods -n default | grep datadog-operator

# 2. Check if DatadogAgent resource exists
kubectl get datadogagent --all-namespaces

# 3. Check agent DaemonSet
kubectl get daemonset | grep datadog

# 4. Check cluster agent deployment
kubectl get deployment | grep datadog

# 5. Check all Datadog-related pods
kubectl get pods --all-namespaces | grep datadog
```

---

## Understanding Operator Replicas

### How Many Operator Replicas Do I Need?

**Key principle:** Operator replicas are about **reliability**, NOT **performance** or cluster size!

```
❌ WRONG: Cluster size determines operator replicas
✅ CORRECT: Environment and uptime requirements determine replicas
```

### Why More Than 1 Replica?

**With ONLY 1 replica, these problems occur:**

1. **During Operator Updates/Restarts:**
   - Operator pod terminates
   - 30-60 seconds until new pod starts
   - During this gap, the operator CANNOT:
     - Create new agent pods if you add nodes
     - Reconcile configuration changes to your DatadogAgent
     - Update DaemonSets or Deployments
     - Respond to any cluster changes

2. **If Operator Crashes:**
   - Kubernetes must detect the crash (5-10 seconds)
   - Schedule a new pod (5-15 seconds)
   - Pull image if not cached (10-30 seconds)
   - Start the container (5-10 seconds)
   - Total downtime: 30-60+ seconds

3. **What Keeps Working:**
   - ✅ Existing agent pods continue monitoring
   - ✅ Metrics/logs continue flowing to Datadog
   - ❌ New configuration changes are NOT applied
   - ❌ New nodes don't get agent pods automatically
   - ❌ Scaling operations are delayed

**With 2+ replicas:**
- Second operator instantly takes over (1-2 seconds)
- Zero downtime during updates (rolling restart)
- Continuous reconciliation of cluster state

### When You MUST Have More Than 1 Replica

**Critical scenarios requiring 2+ replicas:**

- **Frequent cluster scaling:** Adding/removing nodes regularly
- **Dynamic environments:** Frequent DatadogAgent config changes
- **Zero-tolerance monitoring:** Cannot miss any metrics/logs
- **Compliance requirements:** SLAs require continuous operation
- **Production systems:** Where any gap is unacceptable

**When 1 replica is acceptable:**
- Static clusters (nodes rarely change)
- Development/testing (downtime is okay)
- Cost-constrained environments
- Non-critical monitoring

### Common Patterns

#### 1 Replica (Single Instance)
**When to use:**
- Development environments
- Personal/test clusters
- Cost-sensitive deployments
- Non-critical workloads
- Static clusters with rare changes

**Trade-offs:**
- ✅ Uses less resources
- ✅ Simpler (no leader election)
- ❌ 30-60 second gap when operator crashes
- ❌ Configuration changes delayed during restarts
- ❌ New nodes won't get agents during operator downtime
- ❌ Downtime during operator updates

**Example:**
```bash
# Both small and large dev clusters typically use 1 replica
Dev cluster with 3 nodes → replicas: 1
Dev cluster with 100 nodes → replicas: 1  # Still just 1!
```

#### 2 Replicas (High Availability) - RECOMMENDED
**When to use:**
- Production environments
- Critical monitoring (you need metrics 24/7)
- When you can't afford any monitoring gaps
- **This is the industry standard**

**Trade-offs:**
- ✅ Zero downtime during updates
- ✅ Automatic failover if one crashes
- ✅ Still lightweight (operators use minimal CPU/memory)
- ❌ Slightly more resource usage (negligible)

**Example:**
```bash
# Cluster size doesn't matter for replicas
Prod cluster with 5 nodes → replicas: 2
Prod cluster with 500 nodes → replicas: 2  # Still just 2!
```

#### 3+ Replicas (Enterprise/Multi-Zone)
**When to use:**
- Multi-zone clusters (1 replica per availability zone)
- Extremely high availability requirements
- Regulatory/compliance needs
- Large enterprises with strict SLAs

**Example:**
```bash
# 3-zone production cluster
replicas: 3  # One per availability zone
```

### Why Cluster Size Doesn't Matter

**The operator's job:**
- Watch for changes to DatadogAgent resources
- Create/update DaemonSets, Deployments, ConfigMaps
- This is very lightweight work!

**One operator can easily manage:**
- 3 nodes ✅
- 100 nodes ✅
- 1000 nodes ✅

**Important:** The **agents** (DaemonSet pods) scale with cluster size, but the **operator** does not!

### Decision Framework

Ask yourself these questions:

**Q1: Is this production?**
- No → 1 replica
- Yes → Go to Q2

**Q2: Can you tolerate 30-60 seconds of operator downtime?**
- Yes → 1 replica is fine
- No → 2 replicas

**Q3: Multi-zone cluster?**
- No → 2 replicas
- Yes → Consider 3 replicas (1 per zone)

### Industry Standards

Common operator replica counts:
- **Datadog Operator (default):** 2 replicas
- **Prometheus Operator:** 1 replica
- **Cert-Manager:** 1 replica
- **Istio Operator:** 1 replica
- **ArgoCD:** 1 replica

Most start with 1-2 replicas, rarely more.

### Resource Impact

Each operator replica uses minimal resources:
```bash
# Check your operator resource usage
kubectl top pod | grep datadog-operator

# Typical usage per pod:
# CPU: 1-5 millicores (0.001-0.005 of a CPU core)
# Memory: 15-50 MB
```

**Example output:**
```
NAME                                CPU(cores)   MEMORY(bytes)
datadog-operator-68dd5c4869-6fnzp   3m          28Mi
datadog-operator-68dd5c4869-82mm6   1m          15Mi
```

Both operators combined: Less than 1% of one CPU core and ~43MB RAM total!

### How to Change Replica Count

**Scale to 1 replica (dev/testing):**
```bash
kubectl scale deployment datadog-operator --replicas=1
```

**Scale to 2 replicas (production - recommended):**
```bash
kubectl scale deployment datadog-operator --replicas=2
```

**Scale to 3 replicas (multi-zone production):**
```bash
kubectl scale deployment datadog-operator --replicas=3
```

**Check current replica count:**
```bash
kubectl get deployment datadog-operator
```

### Leader Election

Only ONE operator is active at a time:
- One pod is the "leader" (actively managing resources)
- Other pods are on "standby" (ready to take over)
- Automatic failover if leader crashes

**View leader election:**
```bash
kubectl logs -l app.kubernetes.io/name=datadog-operator | grep leader
```

### Summary Table

| Cluster Size | Environment | Recommended Replicas | Reason |
|--------------|-------------|---------------------|---------|
| 3 nodes | Dev/Test | 1 | Save resources |
| 3 nodes | Production | 2 | High availability |
| 100 nodes | Dev/Test | 1 | Still just 1 operator needed |
| 100 nodes | Production | 2 | HA, cluster size irrelevant |
| Any size | Multi-zone Prod | 3 | One per zone |

**Bottom line:** For production, use **2 replicas** regardless of cluster size. For dev/testing, **1 replica** is sufficient.

---

## Problem 1: Operator Pods Not Running

### Symptoms
```bash
kubectl get pods | grep datadog-operator
# Shows: CrashLoopBackOff, Error, or Pending
```

### Diagnosis Steps

**Step 1: Check operator pod status**
```bash
kubectl get pods -n default | grep datadog-operator
```

**Step 2: View operator logs**
```bash
# Get pod name first
kubectl get pods | grep datadog-operator

# View logs (replace POD_NAME)
kubectl logs <POD_NAME>

# View previous crashed container logs
kubectl logs <POD_NAME> --previous
```

**Step 3: Check pod events**
```bash
kubectl describe pod <POD_NAME>
```

### Common Causes & Fixes

**Issue: ImagePullBackOff**
```
Error: Failed to pull image "gcr.io/datadoghq/operator:latest"
```
Fix:
```bash
# Check if GKE has permission to pull from GCR
kubectl get events | grep "pull"

# Ensure your cluster has internet access
kubectl run test-nginx --image=nginx --rm -it --restart=Never -- curl google.com
```

**Issue: Insufficient CPU/Memory**
```
Warning: Insufficient cpu, memory
```
Fix:
```bash
# Check node resources
kubectl top nodes

# Check resource limits
kubectl describe pod <OPERATOR_POD> | grep -A 5 "Limits"
```

---

## Problem 2: DatadogAgent Resource Not Creating DaemonSet

### Symptoms
```bash
kubectl get datadogagent
# Shows: Your DatadogAgent exists

kubectl get daemonset | grep datadog
# Shows: Nothing or no datadog daemonset
```

### Diagnosis Steps

**Step 1: Check DatadogAgent status**
```bash
kubectl describe datadogagent datadog
```
Look for the "Status" section at the bottom - it will show errors!

**Step 2: Check operator logs**
```bash
# Operator should show what it's trying to do
kubectl logs -l app.kubernetes.io/name=datadog-operator --tail=100
```

**Step 3: Verify CRDs are installed**
```bash
kubectl get crd | grep datadog
# Should show: datadogagents.datadoghq.com
```

### Common Causes & Fixes

**Issue: API Key Secret Not Found**
```
Error: Secret "datadog-secret" not found
```
Fix:
```bash
# Check if secret exists
kubectl get secret datadog-secret

# If missing, create it
kubectl create secret generic datadog-secret \
  --from-literal=api-key=YOUR_API_KEY_HERE

# Verify it was created
kubectl get secret datadog-secret -o yaml
```

**Issue: Invalid Configuration**
```
Error: spec.global.site: Invalid value
```
Fix:
```bash
# Edit your DatadogAgent configuration
kubectl edit datadogagent datadog

# Or delete and reapply with corrected YAML
kubectl delete datadogagent datadog
kubectl apply -f datadog-operator-agent.yaml
```

**Issue: Operator Not Watching Namespace**
```
Status: No conditions reported
```
Fix:
```bash
# Check operator configuration
kubectl describe deployment datadog-operator

# Restart operator pods
kubectl rollout restart deployment datadog-operator
```

---

## Problem 3: DaemonSet Created But No Agent Pods Running

### Symptoms
```bash
kubectl get daemonset
# Shows: datadog-agent    3    0    0    ...
#        DESIRED=3 but READY=0
```

### Diagnosis Steps

**Step 1: Check DaemonSet status**
```bash
kubectl describe daemonset datadog-agent
```

**Step 2: Check if pods were created**
```bash
kubectl get pods | grep datadog-agent
```

**Step 3: If pods exist, check their status**
```bash
kubectl describe pod <AGENT_POD_NAME>
```

### Common Causes & Fixes

**Issue: Image Pull Error**
```
Error: ErrImagePull, ImagePullBackOff
```
Fix:
```bash
# Check registry configuration in your DatadogAgent
kubectl get datadogagent datadog -o yaml | grep registry

# Try using different registry
kubectl edit datadogagent datadog
# Change: registry: "gcr.io/datadoghq"
# To: registry: "public.ecr.aws/datadog"
```

**Issue: Node Selector Mismatch**
```
Warning: 0/3 nodes are available: 3 node(s) didn't match node selector
```
Fix:
```bash
# Check node labels
kubectl get nodes --show-labels

# Check DaemonSet node selector
kubectl get daemonset datadog-agent -o yaml | grep -A 5 nodeSelector

# Update DatadogAgent if needed
kubectl edit datadogagent datadog
```

**Issue: Resource Limits Too High**
```
Warning: Insufficient memory/cpu
```
Fix:
```bash
# Check node capacity
kubectl describe nodes | grep -A 5 "Allocatable"

# Reduce agent resource requests in DatadogAgent
kubectl edit datadogagent datadog
```

---

## Problem 4: Agent Pods Running But Not Sending Data

### Symptoms
- Pods show "Running" status
- No data appearing in Datadog UI
- No metrics, logs, or traces

### Diagnosis Steps

**Step 1: Check agent logs**
```bash
# Get an agent pod name
kubectl get pods | grep datadog-agent

# View logs
kubectl logs <AGENT_POD_NAME>

# Look for errors like:
# - "API key invalid"
# - "Connection refused"
# - "Failed to send payload"
```

**Step 2: Verify API key**
```bash
# Check secret exists and has data
kubectl get secret datadog-secret -o jsonpath='{.data.api-key}' | base64 -d
echo  # Add newline

# Should show your actual API key (not base64 encoded garbage)
```

**Step 3: Test connectivity to Datadog**
```bash
# Exec into agent pod
kubectl exec -it <AGENT_POD_NAME> -- /bin/sh

# Test connection (inside pod)
curl -v https://api.datadoghq.com/api/v1/validate
exit
```

### Common Causes & Fixes

**Issue: Wrong API Key**
```
Error: 403 Forbidden - API key invalid
```
Fix:
```bash
# Delete old secret
kubectl delete secret datadog-secret

# Create with correct API key
kubectl create secret generic datadog-secret \
  --from-literal=api-key=YOUR_CORRECT_API_KEY

# Restart agent pods to pick up new secret
kubectl rollout restart daemonset datadog-agent
```

**Issue: Wrong Datadog Site**
```
Error: Connection timeout
```
Fix:
```bash
# Check your Datadog site (datadoghq.com, datadoghq.eu, us3.datadoghq.com, etc.)
kubectl edit datadogagent datadog

# Update spec.global.site to match your Datadog account region
# Example: site: "us5.datadoghq.com"
```

**Issue: Network Policy Blocking**
```
Error: Connection refused to api.datadoghq.com
```
Fix:
```bash
# Check if NetworkPolicies exist
kubectl get networkpolicies --all-namespaces

# Check firewall rules (GKE)
gcloud compute firewall-rules list

# Agent needs outbound access to:
# - api.datadoghq.com (or your site)
# - Port 443 (HTTPS)
```

---

## Problem 5: Cluster Agent Not Running

### Symptoms
```bash
kubectl get deployment | grep cluster-agent
# Shows: 0/1 ready or deployment doesn't exist
```

### Diagnosis Steps

**Step 1: Check if cluster agent is enabled**
```bash
kubectl get datadogagent datadog -o yaml | grep -A 5 clusterAgent
```

**Step 2: Check cluster agent pods**
```bash
kubectl get pods | grep cluster-agent
```

**Step 3: Check cluster agent logs**
```bash
kubectl logs -l app=datadog-cluster-agent
```

### Common Causes & Fixes

**Issue: Cluster Agent Not Enabled**
```yaml
# No clusterAgent section in config
```
Fix:
```bash
kubectl edit datadogagent datadog

# Add this section:
spec:
  features:
    clusterChecks:
      enabled: true
  override:
    clusterAgent:
      replicas: 1
```

**Issue: RBAC Permissions Missing**
```
Error: forbidden: User "system:serviceaccount:default:datadog-cluster-agent" cannot list resource
```
Fix:
```bash
# Operator should create RBAC automatically
# Check if ClusterRole exists
kubectl get clusterrole | grep datadog

# If missing, restart operator
kubectl rollout restart deployment datadog-operator
```

---

## Useful Debugging Commands

### View Everything Datadog-Related
```bash
# All resources
kubectl get all --all-namespaces | grep datadog

# All configurations
kubectl get datadogagent,daemonset,deployment,service,configmap,secret | grep datadog
```

### Watch Resources in Real-Time
```bash
# Watch DatadogAgent status
kubectl get datadogagent datadog --watch

# Watch pods
kubectl get pods --watch | grep datadog

# Watch events
kubectl get events --watch | grep datadog
```

### Export Current Configuration
```bash
# Save your current DatadogAgent config
kubectl get datadogagent datadog -o yaml > backup-config.yaml

# Save operator deployment
kubectl get deployment datadog-operator -o yaml > operator-backup.yaml
```

### Complete Cleanup (Nuclear Option)
```bash
# WARNING: This removes everything Datadog-related!

# Delete DatadogAgent (this deletes agents and cluster-agent)
kubectl delete datadogagent datadog

# Delete operator
kubectl delete deployment datadog-operator

# Delete secrets
kubectl delete secret datadog-secret

# Verify all gone
kubectl get all --all-namespaces | grep datadog
```

---

## Getting Help

### Collect Debug Information
Before asking for help, collect this information:

```bash
# 1. Operator logs
kubectl logs -l app.kubernetes.io/name=datadog-operator > operator-logs.txt

# 2. Agent logs (from one pod)
kubectl logs <AGENT_POD_NAME> > agent-logs.txt

# 3. DatadogAgent configuration
kubectl get datadogagent datadog -o yaml > datadogagent-config.yaml

# 4. Events
kubectl get events --sort-by='.lastTimestamp' > events.txt

# 5. All Datadog resources
kubectl get all --all-namespaces | grep datadog > datadog-resources.txt
```

### Datadog Support Resources
- **Documentation**: https://docs.datadoghq.com/containers/kubernetes/
- **Operator GitHub**: https://github.com/DataDog/datadog-operator
- **Community Slack**: https://chat.datadoghq.com/

### Enable Debug Logging

For more detailed logs:
```bash
kubectl edit datadogagent datadog

# Add to spec.global:
global:
  logLevel: debug
```

---

## Common Success Patterns

**Healthy Operator:**
```
NAME                                READY   STATUS    RESTARTS   AGE
datadog-operator-xxxxxxxxxx-xxxxx   1/1     Running   0          5m
datadog-operator-xxxxxxxxxx-xxxxx   1/1     Running   0          5m
```

**Healthy DaemonSet:**
```
NAME            DESIRED   CURRENT   READY   UP-TO-DATE   AVAILABLE
datadog-agent   3         3         3       3            3
```

**Healthy Agent Logs:**
```
INFO | (pkg/collector/runner/runner.go:339) | Running check my_check
INFO | (pkg/forwarder/forwarder.go:402) | Successfully posted payload to "https://api.datadoghq.com/api/v1/series"
```
