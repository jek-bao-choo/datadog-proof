# Zalando PostgreSQL 17 on OpenShift

Helm is used to install the [Zalando postgres-operator](https://github.com/zalando/postgres-operator) onto the cluster. The operator then manages PostgreSQL clusters via `postgresql` custom resources.

## Pinned versions

| Component | Version | Image |
|-----------|---------|-------|
| Helm Chart | 1.15.1 | — |
| Zalando Postgres Operator | v1.15.1 | `ghcr.io/zalando/postgres-operator:v1.15.1` |
| PostgreSQL | 17.5 | — |
| Spilo | 4.0-p3 | `ghcr.io/zalando/spilo-17:4.0-p3` |
| Patroni | 4.0.4 | — |

## Prerequisites

- `oc` CLI logged into your OpenShift cluster
- `helm` v3 installed

## Step 1 — Add Helm repo

```bash
helm repo add postgres-operator-charts \
  https://opensource.zalando.com/postgres-operator/charts/postgres-operator
helm repo update
```

## Step 2 — Install the operator

```bash
helm install postgres-operator postgres-operator-charts/postgres-operator \
  -n zalando-postgres \
  --create-namespace \
  -f values-openshift-pg17.yaml
```

Wait for the operator pod to be ready:

```bash
oc wait deployment/postgres-operator -n zalando-postgres \
  --for=condition=Available --timeout=120s
```

## Step 3 — Patch ClusterRole for OpenShift

OpenShift requires `endpoints/restricted` permission for Patroni leader election. Without this patch, no leader will be elected and the cluster will hang in `Creating` status.

```bash
oc apply -f patch-clusterrole.yaml
```

## Step 4 — Deploy the PostgreSQL cluster

```bash
oc new-project zalando-cluster
oc apply -f postgresql-cluster.yaml
```

Wait for pods to be ready:

```bash
oc wait pod/acid-pg17-cluster-0 -n zalando-cluster --for=condition=Ready --timeout=180s
oc wait pod/acid-pg17-cluster-1 -n zalando-cluster --for=condition=Ready --timeout=180s
```

## Step 5 — Verify

```bash
# Cluster status (should show "Running")
oc get postgresql -n zalando-cluster

# Patroni status (should show Leader + Replica streaming)
oc exec acid-pg17-cluster-0 -n zalando-cluster -- patronictl list

# PostgreSQL version
oc exec acid-pg17-cluster-0 -n zalando-cluster -- psql -U postgres -c "SELECT version();"

# List databases (should include "myappdb")
oc exec acid-pg17-cluster-0 -n zalando-cluster -- psql -U postgres -c "\l"
```

## Connecting to the database

Services created by the operator:

| Service | Purpose | Address |
|---------|---------|---------|
| `acid-pg17-cluster` | Primary (read/write) | `acid-pg17-cluster.zalando-cluster.svc:5432` |
| `acid-pg17-cluster-repl` | Replica (read-only) | `acid-pg17-cluster-repl.zalando-cluster.svc:5432` |

Retrieve credentials:

```bash
# List all credential secrets
oc get secrets -n zalando-cluster | grep credentials

# Get app_owner password
oc get secret app-owner.acid-pg17-cluster.credentials.postgresql.acid.zalan.do \
  -n zalando-cluster -o jsonpath='{.data.password}' | base64 -d

# Get app_user password
oc get secret app-user.acid-pg17-cluster.credentials.postgresql.acid.zalan.do \
  -n zalando-cluster -o jsonpath='{.data.password}' | base64 -d
```

## Cleanup

```bash
oc delete postgresql acid-pg17-cluster -n zalando-cluster
oc delete project zalando-cluster
helm uninstall postgres-operator -n zalando-postgres
oc delete namespace zalando-postgres
oc delete clusterrole postgres-pod
oc delete priorityclass postgres-operator-pod
```
