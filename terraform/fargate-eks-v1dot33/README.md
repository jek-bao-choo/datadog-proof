# AWS EKS Fargate with Kubernetes v1.33

This Terraform configuration creates an AWS EKS Fargate cluster with Kubernetes v1.33 in the ap-southeast-1 region. All resources follow the "jek-" naming convention and include proper tags.

## Architecture Overview

- **VPC**: Custom VPC with public and private subnets across 2 availability zones
- **EKS Cluster**: Kubernetes v1.33 with Fargate compute
- **Fargate Profiles**: CoreDNS (kube-system) and default namespace
- **Networking**: Private subnets for pods, public subnets for load balancers
- **Security**: IAM-based authentication, no SSH access required

## Prerequisites

Before deploying this infrastructure, ensure you have:

### Required Tools
- **AWS CLI** (latest version) - [Installation Guide](https://aws.amazon.com/cli/)
- **Terraform** (>= 1.0) - [Installation Guide](https://developer.hashicorp.com/terraform/downloads)
- **kubectl** (compatible with K8s 1.33) - [Installation Guide](https://kubernetes.io/docs/tasks/tools/)

### AWS Setup
1. **AWS Account** with appropriate permissions
2. **AWS CLI configured** with your credentials:
   ```bash
   aws configure
   ```
3. **Required IAM permissions** for your AWS user/role:
   - EKS full access (AmazonEKSClusterPolicy)
   - EC2 full access (for VPC management)
   - IAM permissions for role creation
   - VPC and subnet management permissions

## File Structure

```
fargate-eks-v1dot33/
├── main.tf                    # Main Terraform configuration
├── variables.tf               # Input variables
├── outputs.tf                 # Output values
├── versions.tf                # Provider requirements
├── terraform.tfvars.example  # Example variables file
├── .gitignore                 # Git ignore for sensitive files
└── README.md                  # This documentation
```

## Quick Start Guide

### Step 1: Clone and Setup
```bash
# Navigate to the project directory
cd fargate-eks-v1dot33/

# Copy the example variables file
cp terraform.tfvars.example terraform.tfvars

# (Optional) Edit terraform.tfvars with your preferred values
# The defaults will work for most use cases
```

### Step 2: Deploy Infrastructure
```bash
# Initialize Terraform (download modules and providers)
terraform init

# Validate the configuration
terraform validate

# Review the deployment plan
terraform plan

# Deploy the infrastructure (will take 15-20 minutes)
terraform apply
```

### Step 3: Configure kubectl
After successful deployment, configure kubectl to access your cluster:

```bash
# The exact command will be shown in the terraform output
aws eks --region ap-southeast-1 update-kubeconfig --name jek-fargate-eks-cluster

# Verify access
kubectl cluster-info
kubectl get nodes
```

## Configuration Options

### Variables (terraform.tfvars)
You can customize the deployment by editing `terraform.tfvars`:

```hcl
# AWS region where resources will be created
aws_region = "ap-southeast-1"

# Name of the EKS cluster - must be unique in your AWS account
cluster_name = "jek-fargate-eks-cluster"

# Kubernetes version - use latest supported version
kubernetes_version = "1.33"

# VPC CIDR block - adjust if conflicts with existing networks
vpc_cidr = "10.0.0.0/16"

# Resource tagging - customize as needed
owner_tag = "jek"
environment_tag = "test"
```

### Network Configuration
- **VPC CIDR**: 10.0.0.0/16
- **Public Subnets**: 10.0.1.0/24, 10.0.2.0/24
- **Private Subnets**: 10.0.101.0/24, 10.0.102.0/24
- **Availability Zones**: First 2 AZs in ap-southeast-1

## Verification Steps

### 1. Cluster Status
```bash
# Check cluster information
kubectl cluster-info

# List nodes (Fargate nodes appear as needed)
kubectl get nodes

# Check system pods
kubectl get pods -n kube-system
```

### 2. Test Pod Deployment
```bash
# Create a test deployment
kubectl create deployment nginx-test --image=nginx

# Check pod status (should show running on Fargate)
kubectl get pods -o wide

# Clean up test deployment
kubectl delete deployment nginx-test
```

### 3. Fargate Profile Verification
```bash
# List Fargate profiles
aws eks describe-fargate-profile --cluster-name jek-fargate-eks-cluster --fargate-profile-name jek-coredns-fargate-profile --region ap-southeast-1
aws eks describe-fargate-profile --cluster-name jek-fargate-eks-cluster --fargate-profile-name jek-default-fargate-profile --region ap-southeast-1
```

## Resource Overview

### Created Resources
- **1 VPC** with DNS support
- **2 Public Subnets** (for load balancers)
- **2 Private Subnets** (for Fargate pods)
- **1 Internet Gateway**
- **2 NAT Gateways** (high availability)
- **1 EKS Cluster** (control plane)
- **2 Fargate Profiles** (CoreDNS + default)
- **IAM Roles** (cluster service role, pod execution role)
- **Security Groups** (cluster and node communication)

### Resource Naming Convention
All resources follow the "jek-" prefix convention:
- VPC: `jek-vpc`
- Cluster: `jek-fargate-eks-cluster`
- Fargate Profiles: `jek-coredns-fargate-profile`, `jek-default-fargate-profile`

### Resource Tags
All resources include:
- `owner = "jek"`
- `env = "test"`

## Cost Estimation

## Security Considerations

### Network Security
- **Private Subnets**: All pods run in private subnets with no direct internet access
- **NAT Gateways**: Provide outbound internet access for pods
- **Security Groups**: Automatically configured for cluster communication

### Access Control
- **IAM Authentication**: EKS uses AWS IAM for authentication
- **No SSH Access**: Fargate is fully managed, no SSH required
- **API Access**: Cluster endpoint accessible from public internet (can be restricted)

### Best Practices Implemented
- Private subnet deployment for pods
- Proper IAM roles with least privilege
- Resource tagging for governance
- Version pinning for stability

## Troubleshooting

### Common Issues

1. **AWS Credentials Expired**
   ```
   Error: ExpiredToken: The security token included in the request is expired
   ```
   **Solution**: Refresh your AWS credentials: `aws configure` or renew your session

2. **Insufficient Permissions**
   ```
   Error: AccessDenied
   ```
   **Solution**: Ensure your AWS user/role has EKS, EC2, and IAM permissions

3. **Region Availability**
   ```
   Error: UnsupportedAvailabilityZoneException
   ```
   **Solution**: Some AZs may not support EKS. The configuration uses the first 2 available AZs

4. **kubectl Connection Issues**
   ```
   Error: connection refused
   ```
   **Solution**: 
   - Ensure you ran the update-kubeconfig command
   - Check your AWS credentials are valid
   - Verify the cluster is in "Active" state

### Useful Commands
```bash
# Check Terraform state
terraform show

# View all outputs
terraform output

# Check AWS EKS cluster status
aws eks describe-cluster --name jek-fargate-eks-cluster --region ap-southeast-1

# View kubectl configuration
kubectl config view

# Check pod resource usage
kubectl top pods --all-namespaces
```

## Cleanup (Teardown)

### ⚠️ Important: Cost Management
To avoid ongoing charges, always clean up resources when done testing:

### Step 1: Remove Kubernetes Resources
```bash
# Delete any deployments/services you created
kubectl delete all --all --all-namespaces

# Wait for resources to be cleaned up (2-3 minutes)
kubectl get pods --all-namespaces
```

### Step 2: Destroy Infrastructure
```bash
# Destroy all Terraform-managed resources
terraform destroy

# Confirm when prompted by typing: yes
```

### Step 3: Verify Cleanup
```bash
# Check no resources remain (should show empty)
aws eks list-clusters --region ap-southeast-1
aws ec2 describe-vpcs --filters "Name=tag:Name,Values=jek-vpc" --region ap-southeast-1
```

### Manual Cleanup (if needed)
If `terraform destroy` fails, manually delete:
1. EKS cluster from AWS console
2. VPC and associated resources
3. IAM roles starting with "jek-"

## Advanced Configuration

### Adding More Namespaces to Fargate
To run pods in additional namespaces on Fargate, add more selectors to the Fargate profiles in `main.tf`:

```hcl
# Example: Add 'my-app' namespace to default Fargate profile
selectors = [
  {
    namespace = "default"
  },
  {
    namespace = "my-app"
  }
]
```

### Scaling Considerations
- **Fargate Auto-scaling**: Pods scale automatically based on demand
- **Control Plane**: Managed by AWS, scales automatically
- **Costs**: Scale with usage - monitor with AWS Cost Explorer

### Production Recommendations
- Enable VPC Flow Logs for network monitoring
- Use private endpoint access only
- Implement Pod Security Standards
- Add monitoring with CloudWatch Container Insights
- Use AWS Load Balancer Controller for ingress

## Support and Documentation

### Official Documentation
- [AWS EKS Documentation](https://docs.aws.amazon.com/eks/)
- [AWS Fargate Documentation](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/AWS_Fargate.html)
- [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)

### Module Documentation
- [terraform-aws-modules/eks](https://registry.terraform.io/modules/terraform-aws-modules/eks/aws/latest)
- [terraform-aws-modules/vpc](https://registry.terraform.io/modules/terraform-aws-modules/vpc/aws/latest)

---

**Created with**: Terraform + AWS EKS + Fargate
**Kubernetes Version**: v1.33
**Region**: ap-southeast-1 (Singapore)
**Last Updated**: 2025