---
name: Datadog CloudPrem using Scality's Zenko CloudServer for Object Storage on Azure Redhat Openshift (ARO)
description: This document explains how I validate CloudPrem works with Scality's Zenko CloudServer on ARO. The specific version of the ARO is version 4.19.20 with kubernetes version 1.32.9. Please take note of the pre-requisites mentioned below.
---

Referencing [Datadog's guide](https://docs.datadoghq.com/cloudprem/install/custom_k8s.md) on Install CloudPrem on Custom Kubernetes but adapting it to use Scality's Zenko CloudServer instead of MinIO

The pre-requisites steps (in order):
1. Setup Azure Redhat Openshift following this guide datadog-proof/yaml-kubernetes/aro4dot19dot20__k8s1dot32dot9__ddoperator1dot22__ddot
2. Setup Scality's Zenko CloudServer following this guide datadog-proof/yaml-kubernetes/scality__zenkocloudserver9dot3dot0__k8s
3. Setup PostgreSQL database as StatefulSet following this guide datadog-proof/yaml-kubernetes/postgresql__statefulset__k8s
4. Follow through this guide at datadog-proof/yaml-kubernetes/cloudprem__scalityzenkocloudserver__postgresql__aro


