---
name: Setup PostgreSQL using CloudNativePG (CNPG) on K8s to prepare for setup of Datadog CloudPrem
description: This document explains how I setup PostgreSQL using CloudNativePG (CNPG) while using Local Storage on preparation for setting up on CloudPrem because PostgreSQL is required for CloudPrem to store metadata. 
---

# Notes
- Other alternatives to CloudNativePG (CNPG) that are also recommended are Zalando Postgres Operator, Crunchy Data (PGO), and StackGres.
- We will use the local disks attached directly to our Kubernetes worker nodes.

# Install CloudNativePG
On OpenShift or Azure Redhat Openshift (ARO), the CNPG controller pod fails to start because it runs as UID 10001, which is outside the allowed range set by the default Security Context Constraint (SCC). Grant the `nonroot-v2` SCC to the CNPG service account:
```bash
oc adm policy add-scc-to-user nonroot-v2 -z cnpg-manager -n cnpg-system
```

install the latest operator manifest for this minor release as follows https://cloudnative-pg.io/docs/devel/installation_upgrade/ 
```bash
# Delete any previously stuck installation
kubectl delete -f \
  https://raw.githubusercontent.com/cloudnative-pg/cloudnative-pg/release-1.28/releases/cnpg-1.28.1.yaml \
  --ignore-not-found

# Verify cleanup
kubectl get all -n cnpg-system

# Install using the manifest
kubectl apply --server-side -f \
  https://raw.githubusercontent.com/cloudnative-pg/cloudnative-pg/release-1.28/releases/cnpg-1.28.1.yaml

# Then restart the deployment if need to
# kubectl rollout restart deployment cnpg-controller-manager -n cnpg-system
```

Verify that with:
```bash
kubectl rollout status deployment \
  -n cnpg-system cnpg-controller-manager
```

# Deploy a PostgreSQL cluster

