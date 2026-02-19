---
name: Scality Zenko CloudServer Setup using Kubernetes
description: This document explains (and proves out) how to setup Scality Zenko CloudServer using K8s for a simple PoC grade log storage 
---

![](proof1.png)

Create pods
```bash
kubectl apply -f scality-zenkocloudserver-pvc.yaml
kubectl apply -f scality-zenkocloudserver-deployment.yaml
kubectl apply -f scality-zenkocloudserver-service.yaml
```

Option 1: Generate dummy logs using k8s job
```bash
kubectl apply -f log-generator-job.yaml
```

Option 2: Generate dummy logs using temp interactive pod commandline
```bash
# Spin up a temporary pod, create a log, upload it, and list the bucket — pod auto-deletes on exit
# Note: --command overrides the image's entrypoint (amazon/aws-cli defaults to `aws`, not `sh`)
kubectl run s3-tester --rm -i --restart=Never --image=amazon/aws-cli \
  --env="AWS_ACCESS_KEY_ID=myAccessKey" \
  --env="AWS_SECRET_ACCESS_KEY=mySuperSecretKey123" \
  --command -- sh -c 'echo "This is an extremely basic log entry Jek option 2 v2." > basic.log && aws s3 cp basic.log s3://k8s-logs/basic.log --endpoint-url http://scality-zenkocloudserver-svc:8000 && aws s3 ls s3://k8s-logs/ --endpoint-url http://scality-zenkocloudserver-svc:8000'

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