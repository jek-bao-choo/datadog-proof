---
name: Setup PostgreSQL using CloudNativePG (CNPG) on K8s to prepare for setup of Datadog CloudPrem
description: This document explains how I setup PostgreSQL using CloudNativePG (CNPG) while using Local Storage on preparation for setting up on CloudPrem because PostgreSQL is required for CloudPrem to store metadata.
---

# CNPG on OpenShift / ARO - Not Compatible

CNPG does not work on OpenShift / ARO. The init container (UID 65532) copies a binary to an emptyDir with `0750` permissions, but the PostgreSQL container runs as a different UID assigned by OpenShift's SCC and cannot execute it (`Permission denied`). The `podSecurityContext` field in the Cluster spec is ignored when SCCs are detected. Both manifest and OLM installs have this issue.

- https://github.com/cloudnative-pg/charts/issues/446
- https://github.com/cloudnative-pg/cloudnative-pg/issues/2821

# Alternatives
- Other alternatives to CloudNativePG (CNPG) that are also recommended are Zalando Postgres Operator, Crunchy Data (PGO), and StackGres.

