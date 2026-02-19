---
name: Scality Zenko CloudServer Setup using Kubernetes
description: This document explains (and proves out) how to setup Scality Zenko CloudServer using K8s for a simple PoC grade log storage 
---

# This README.md explains (and proves out) how to setup Scality Zenko CloudServer using K8s for a simple PoC grade log storage 

Create pods
```bash
kubectl apply -f scality-zenkocloudserver-pvc.yaml
kubectl apply -f scality-zenkocloudserver-deployment.yaml
kubectl apply -f scality-zenkocloudserver-service.yaml
```

Generate dummy logs
```bash
kubectl apply -f log-generator-job.yaml
```