---
name: Setup PostgreSQL in K8s to prepare for setup of Datadog CloudPrem
description: This document explains how I setup PostgreSQL in preparation for setting up on CloudPrem because PostgreSQL is required for CloudPrem to store metadata.
---

![](proof1.png)

Setup postgresql
```bash
# Delete anything that exist
kubectl delete -f postgres-statefulset.yaml

# Apply the new StatefulSet configuration
kubectl apply -f postgres-statefulset.yaml
```

verify postgresql setup
```bash
# You should see a pod named 'postgres-0'
kubectl get pods -l app=postgres -w

# You should see a PVC automatically created, named 'postgres-storage-postgres-0'
kubectl get pvc
```

option 1: connect to db with pod exec
```bash
# interactive PostgreSQL session inside your running pod
kubectl exec -it <the postgres pod> -- psql -U postgres
```

option 2: connect to db with connection string 
```bash
kubectl run psql-client \
  --rm -it \
  --image=bitnami/postgresql:latest \
  --restart=Never \
  --command -- psql "host=postgres-service port=5432 dbname=postgres user=postgres password=supersecretpassword"
```

add test data
```sql
CREATE TABLE test_users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50)
);

INSERT INTO test_users (name) VALUES ('Alicev1'), ('Bobv1'), ('Charliev1');
```

view test data
```sql
SELECT * FROM test_users;
```

leave the PostgreSQL prompt and return to your regular terminal
```sql
\q
```

verify statefulset by deleting the postgres pod
```bash
# delete it
kubectl delete pod <the postgres pod name>

# watch it Come Back
kubectl get pods -w

# connect to it
kubectl run psql-client \
  --rm -it \
  --image=bitnami/postgresql:latest \
  --restart=Never \
  --command -- psql "host=postgres-service port=5432 dbname=postgres user=postgres password=supersecretpassword"
```

test it
```sql
SELECT * FROM test_users;
```

---

tl;dr;
```bash
# i'll need this connection string for cloudprem setup 
kubectl run psql-client \
  --rm -it \
  --image=bitnami/postgresql:latest \
  --restart=Never \
  --command -- psql "host=postgres-service port=5432 dbname=postgres user=postgres password=supersecretpassword"
```