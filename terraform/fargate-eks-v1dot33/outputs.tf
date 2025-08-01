# VPC Outputs
output "vpc_id" {
  description = "ID of the VPC"
  value       = module.vpc.vpc_id
}

output "private_subnets" {
  description = "List of IDs of private subnets"
  value       = module.vpc.private_subnets
}

output "public_subnets" {
  description = "List of IDs of public subnets"
  value       = module.vpc.public_subnets
}

# EKS Cluster Outputs
output "cluster_name" {
  description = "Name of the EKS cluster"
  value       = module.eks.cluster_name
}

output "cluster_endpoint" {
  description = "Endpoint for EKS control plane"
  value       = module.eks.cluster_endpoint
}

output "cluster_security_group_id" {
  description = "Security group ID attached to the EKS cluster"
  value       = module.eks.cluster_security_group_id
}

output "cluster_certificate_authority_data" {
  description = "Base64 encoded certificate data required to communicate with the cluster"
  value       = module.eks.cluster_certificate_authority_data
}

output "cluster_version" {
  description = "The Kubernetes version for the EKS cluster"
  value       = module.eks.cluster_version
}

# Fargate Profile Outputs
output "fargate_profiles" {
  description = "Map of Fargate profiles"
  value       = module.eks.fargate_profiles
}

# kubectl Configuration Instructions
output "kubectl_config_command" {
  description = "Command to configure kubectl"
  value       = "aws eks --region ${var.aws_region} update-kubeconfig --name ${module.eks.cluster_name}"
}

# Cost Estimation Reminder
output "cost_estimation_reminder" {
  description = "Monthly cost estimation reminder"
  value = <<-EOT
    COST ESTIMATION REMINDER:
    - EKS Control Plane: ~$73/month
    - NAT Gateway (2x): ~$90/month
    - Fargate: Pay per vCPU/memory used by pods
    - Total estimated baseline: ~$163/month + Fargate usage
    
    Remember to run 'terraform destroy' to clean up resources when done!
  EOT
}

# Security Information
output "security_notes" {
  description = "Security configuration notes"
  value = <<-EOT
    SECURITY CONFIGURATION:
    - Pods run in private subnets only
    - No SSH access required (Fargate managed)
    - EKS cluster uses IAM authentication
    - VPC endpoints recommended for production use
  EOT
}