---
name: Scality Zenko CloudServer Setup using Kubernetes
description: This document explains (and proves out) how to setup Scality Zenko CloudServer using K8s for a simple PoC grade log storage
scality_zenko_cloudserver_version: 9.3.0
busybox_version: latest
aws_cli_version: latest
kubernetes_version: v1.32.9
openshift_version: 4.19.20
oc_client_version: 4.20.10
platform: Azure Red Hat OpenShift (ARO)
s3_backend: file
date_tested: 2026-02-20
---

![](proof1.png)

Tested versions
| Component | Version |
|---|---|
| Scality Zenko CloudServer | 9.3.0 (`ghcr.io/scality/cloudserver:9.3.0`) |
| Init container (busybox) | latest (`docker.io/library/busybox:latest`) |
| AWS CLI (log generator / verification) | latest (`docker.io/amazon/aws-cli:latest`) |
| Kubernetes | v1.32.9 |
| OpenShift | 4.19.20 (OC client 4.20.10) |
| Platform | Azure Red Hat OpenShift (ARO) |

Prerequisites (OpenShift / ARO only)
```bash
# The Scality CloudServer entrypoint needs to write to /usr/src/app/config.json.tmp,
# which fails under OpenShift's default restricted-v2 SCC (random non-root UID).
# Grant the anyuid SCC so the container can run as its expected user:
oc adm policy add-scc-to-user anyuid -z default -n <namespace>
```

Create pods
```bash
kubectl apply -f scality-zenkocloudserver-pvc.yaml
kubectl apply -f scality-zenkocloudserver-deployment.yaml
kubectl apply -f scality-zenkocloudserver-service.yaml

# Wait for the CloudServer pod to be ready before proceeding
kubectl rollout status deployment/scality-zenkocloudserver --timeout=120s
```

Option 1: Generate dummy logs using k8s job
```bash
# delete if any exists
kubectl delete job log-generator

kubectl apply -f log-generator-job.yaml
```

Option 2: Generate dummy logs using temp interactive pod commandline
```bash
# Spin up a temporary pod, create a log, upload it, and list the bucket — pod auto-deletes on exit
# Note: --command overrides the image's entrypoint (amazon/aws-cli defaults to `aws`, not `sh`)
# Note: This creates the bucket first (unlike Option 1's job, which handles it internally),
#       so this option can be run standalone without Option 1.
kubectl run s3-tester --rm -i --restart=Never --image=amazon/aws-cli \
  --env="AWS_ACCESS_KEY_ID=myAccessKey" \
  --env="AWS_SECRET_ACCESS_KEY=mySuperSecretKey123" \
  --command -- sh -c 'aws s3api create-bucket --bucket k8s-logs --endpoint-url http://scality-zenkocloudserver-svc:8000 2>/dev/null; echo "This is an extremely basic log entry Jek option 2 v2." > basic.log && aws s3 cp basic.log s3://k8s-logs/basic.log --endpoint-url http://scality-zenkocloudserver-svc:8000 && aws s3 ls s3://k8s-logs/ --endpoint-url http://scality-zenkocloudserver-svc:8000'

# Explanation: `kubectl run --rm -it` spins up a disposable pod that runs a command and deletes itself on exit. We use the `amazon/aws-cli` image because Zenko CloudServer is S3-compatible, so the standard AWS CLI works out of the box — just point it at the service with `--endpoint-url`.
```

---

Option 1: Verify stored logs via S3 API
```bash
# List objects in the bucket
kubectl run s3-check --rm -it --restart=Never --image=amazon/aws-cli:latest \
  --env="AWS_ACCESS_KEY_ID=myAccessKey" \
  --env="AWS_SECRET_ACCESS_KEY=mySuperSecretKey123" \
  -- s3 ls s3://k8s-logs/ --endpoint-url http://scality-zenkocloudserver-svc:8000

# Download and view a specific log
kubectl run s3-check --rm -it --restart=Never --image=amazon/aws-cli:latest \
  --env="AWS_ACCESS_KEY_ID=myAccessKey" \
  --env="AWS_SECRET_ACCESS_KEY=mySuperSecretKey123" \
  -- s3 cp s3://k8s-logs/<log-filename> - --endpoint-url http://scality-zenkocloudserver-svc:8000
```

Option 2: Verify on filesystem (`S3BACKEND=file` stores objects on the PVC)
```bash
kubectl exec <cloudserver-pod> -- ls /data/metadata/

# Find and read the actual stored file (Zenko stores objects as hashed files under /data/objects/<shard>/<hash>)
kubectl exec <cloudserver-pod> -- find /data/objects -type f
kubectl exec <cloudserver-pod> -- cat /data/objects/<shard>/<hash>
```

---

Cleanup
```bash
kubectl delete job log-generator --ignore-not-found
kubectl delete svc scality-zenkocloudserver-svc
kubectl delete deployment scality-zenkocloudserver
kubectl delete pvc scality-zenkocloudserver-pvc
```