# EKS Cluster on EC2 with Terraform

This Terraform configuration creates an Amazon EKS (Elastic Kubernetes Service) cluster on EC2 instances in the ap-southeast-1 region. The setup includes a complete VPC infrastructure, security groups, IAM roles, and a managed node group with 2 worker nodes.

## Architecture Overview

- **EKS Cluster**: `jek-eks-cluster` with Kubernetes v1.30
- **Worker Nodes**: 2 x t3.medium EC2 instances in a managed node group
- **Networking**: VPC with 2 public subnets across 2 availability zones (ap-southeast-1a & ap-southeast-1b)
- **Access**: SSH access restricted to your IP, kubectl access via public endpoint
- **Security**: Proper IAM roles and security groups for cluster communication

## Prerequisites

Before deploying this EKS cluster, ensure you have:

1. **AWS CLI** installed and configured with valid credentials
   ```bash
   aws configure
   # Enter your Access Key ID, Secret Access Key, region (ap-southeast-1), and output format
   ```

2. **Terraform** >= 1.0 installed
   ```bash
   # macOS (using Homebrew)
   brew install terraform
   
   # Verify installation
   terraform version
   ```

3. **kubectl** installed for cluster management
   ```bash
   # macOS (using Homebrew)
   brew install kubectl
   
   # Verify installation
   kubectl version --client
   ```

4. **SSH Key Pair** named `jek-macbook-pro-key` must exist in AWS ap-southeast-1 region
   - If not exists, create it in AWS Console: EC2 → Key Pairs → Create Key Pair

## Deployment Steps

### Step 1: Initialize Terraform
```bash
terraform init
```

### Step 2: Review the Plan
```bash
terraform plan -out=tfplan
```
Review the output to understand what resources will be created. Expected resources:
- 1 VPC with internet gateway and 2 public subnets (across 2 AZs)
- 2 security groups (cluster and nodes)
- 2 IAM roles with policy attachments
- 1 EKS cluster and 1 node group spanning both subnets

### Step 3: Deploy the Infrastructure
```bash
terraform apply tfplan
```
**Note**: EKS cluster creation takes approximately 10-15 minutes. Please be patient.

### Step 4: Configure kubectl
After successful deployment, configure kubectl to access your cluster:
```bash
aws eks update-kubeconfig --region ap-southeast-1 --name jek-eks-cluster
```

## Verification

### Check Cluster Status
```bash
# Verify cluster is active
aws eks describe-cluster --name jek-eks-cluster --region ap-southeast-1 --query 'cluster.status'

# Should return: "ACTIVE"
```

### Verify Node Connectivity
```bash
# Check nodes are ready
kubectl get nodes

# Expected output: 2 nodes in Ready status
# NAME                                               STATUS   ROLES    AGE   VERSION
# ip-10-0-1-xxx.ap-southeast-1.compute.internal     Ready    <none>   5m    v1.30.x
# ip-10-0-1-yyy.ap-southeast-1.compute.internal     Ready    <none>   5m    v1.30.x
```

### Test Basic Functionality
```bash
# Deploy a test application
kubectl create deployment nginx --image=nginx
kubectl expose deployment nginx --type=LoadBalancer --port=80

# Check deployment
kubectl get pods
kubectl get services

# Clean up test resources
kubectl delete service nginx
kubectl delete deployment nginx
```

### SSH Access to Worker Nodes
```bash
# Get worker node public IPs
aws ec2 describe-instances --region ap-southeast-1 \
  --filters "Name=tag:kubernetes.io/cluster/jek-eks-cluster,Values=owned" \
  --query 'Reservations[].Instances[].PublicIpAddress' --output table

# SSH to a worker node (replace with actual IP)
ssh -i ~/.ssh/id_ed25519 ec2-user@<node-public-ip>
```


## Teardown Instructions

### Standard Teardown
```bash
# Plan destruction (optional but recommended)
terraform plan -destroy

# Destroy all resources
terraform destroy

# Type 'yes' when prompted to confirm
```

### Emergency Cleanup
If `terraform destroy` fails, use AWS CLI:

```bash
# Delete node group first
aws eks delete-nodegroup --cluster-name jek-eks-cluster --nodegroup-name jek-eks-nodes --region ap-southeast-1

# Wait for node group deletion (check status)
aws eks describe-nodegroup --cluster-name jek-eks-cluster --nodegroup-name jek-eks-nodes --region ap-southeast-1

# Delete cluster after node group is deleted
aws eks delete-cluster --name jek-eks-cluster --region ap-southeast-1

# Clean up remaining resources manually via AWS Console if needed
```

## Troubleshooting

### Common Issues

1. **AWS Credentials Error**
   ```
   Error: validating provider credentials
   ```
   **Solution**: Ensure AWS CLI is configured with valid credentials:
   ```bash
   aws configure
   aws sts get-caller-identity
   ```

2. **SSH Key Not Found**
   ```
   Error: InvalidKeyPair.NotFound
   ```
   **Solution**: Create the SSH key pair in AWS Console:
   - Go to EC2 → Key Pairs → Create Key Pair
   - Name: `jek-macbook-pro-key`
   - Region: ap-southeast-1

3. **Cluster Creation Timeout**
   ```
   Error: timeout while waiting for cluster to become active
   ```
   **Solution**: EKS clusters can take 10-15 minutes. If it fails, check AWS CloudTrail logs or try again.

4. **EKS Multi-AZ Requirement Error**
   ```
   Error: Subnets specified must be in at least two different AZs
   ```
   **Solution**: This configuration now uses 2 subnets across different AZs (ap-southeast-1a & ap-southeast-1b). Error is already resolved.

5. **CIDR Block Conflict Error**
   ```
   Error: InvalidSubnet.Conflict: The CIDR '10.0.x.0/24' conflicts with another subnet
   ```
   **Solution**: This configuration uses non-overlapping CIDR blocks (10.0.3.0/24 and 10.0.4.0/24). Error is already resolved.

6. **Node Group Creation Failed**
   ```
   Error: node group creation failed
   ```
   **Solution**: Check that the instance type `t3.medium` is available in both AZs, or modify the variable.

### Debugging Commands

```bash
# Check Terraform state
terraform show

# List all resources
terraform state list

# Get detailed resource information
terraform state show aws_eks_cluster.main

# View Terraform logs
export TF_LOG=DEBUG
terraform plan

# Check AWS resource status
aws eks list-clusters --region ap-southeast-1
aws eks describe-cluster --name jek-eks-cluster --region ap-southeast-1
```

## Security Considerations

- SSH access is restricted to your current public IP
- EKS cluster endpoint is public but secured with AWS IAM
- Worker nodes are in public subnets across 2 AZs for high availability (not recommended for production)
- Security groups follow principle of least privilege
- IAM roles use AWS managed policies
