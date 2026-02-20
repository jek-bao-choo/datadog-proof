# Zalando PostgreSQL 17 on OpenShift

Helm installs the [Zalando postgres-operator](https://github.com/zalando/postgres-operator), which manages PostgreSQL clusters via `postgresql` custom resources. Data is stored on local disk (host path) for on-premise PoC use.

## Pinned versions

| Component | Version |
|-----------|---------|
| Helm Chart | 1.15.1 |
| Zalando Postgres Operator | v1.15.1 |
| PostgreSQL | 17.5 |
| Spilo | 4.0-p3 |
| Patroni | 4.0.4 |

## Prerequisites

- `oc` CLI logged into your OpenShift cluster
- `helm` v3 installed

## Step 1 — Install the operator

```bash
helm repo add postgres-operator-charts \
  https://opensource.zalando.com/postgres-operator/charts/postgres-operator
helm repo update

helm install postgres-operator postgres-operator-charts/postgres-operator \
  -n zalando-postgres --create-namespace \
  -f values-openshift-pg17.yaml

oc wait deployment/postgres-operator -n zalando-postgres \
  --for=condition=Available --timeout=120s
```

## Step 2 — Patch ClusterRole for OpenShift

Without this, Patroni leader election fails and the cluster hangs in `Creating` status.

```bash
oc apply -f patch-clusterrole.yaml
```

## Step 3 — Set up local storage

Edit `local-storage.yaml` and replace the node names under `nodeAffinity` with your worker nodes:

```bash
oc get nodes -l node-role.kubernetes.io/worker -o name
```

Create data directories on those nodes:

```bash
oc debug node/<worker-node-1> -- chroot /host mkdir -p /var/lib/postgresql/pgdata-0
oc debug node/<worker-node-2> -- chroot /host mkdir -p /var/lib/postgresql/pgdata-1
```

Apply:

```bash
oc apply -f local-storage.yaml
```

## Step 4 — Deploy the PostgreSQL cluster

```bash
oc new-project zalando-cluster
oc apply -f postgresql-cluster.yaml

oc wait pod/acid-pg17-cluster-0 -n zalando-cluster --for=condition=Ready --timeout=180s
oc wait pod/acid-pg17-cluster-1 -n zalando-cluster --for=condition=Ready --timeout=180s
```

## Step 5 — Verify

```bash
oc get postgresql -n zalando-cluster
oc exec acid-pg17-cluster-0 -n zalando-cluster -- patronictl list
```

Expected: CR status is `Running`, Patroni shows Leader + Replica streaming.

## Connecting

- **Primary (read/write):** `acid-pg17-cluster.zalando-cluster.svc:5432`
- **Replica (read-only):** `acid-pg17-cluster-repl.zalando-cluster.svc:5432`

Retrieve a user's password:

```bash
oc get secret app-owner.acid-pg17-cluster.credentials.postgresql.acid.zalan.do \
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
oc delete pv pgdata-local-0 pgdata-local-1
oc delete storageclass local-storage
```
