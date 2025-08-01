# Data source to get availability zones
data "aws_availability_zones" "available" {
  state = "available"
}

# Data source for current AWS caller identity
data "aws_caller_identity" "current" {}

# Local variables
locals {
  # Extract role ARN from assumed role ARN for EKS access entry
  # Converts: arn:aws:sts::account:assumed-role/role-name/session-name
  # To: arn:aws:iam::account:role/role-name
  role_arn = replace(
    replace(data.aws_caller_identity.current.arn, "sts", "iam"),
    "assumed-role", "role"
  )
  # Remove the session name part (everything after the last slash)
  principal_arn = regex("^(.*)/[^/]+$", local.role_arn)[0]
}

# VPC Module
module "vpc" {
  source = "terraform-aws-modules/vpc/aws"
  version = "~> 6.0"

  name = "jek-vpc"
  cidr = var.vpc_cidr

  # Use first 2 availability zones in the region
  azs = slice(data.aws_availability_zones.available.names, 0, 2)

  # Public subnets for load balancers
  public_subnets = ["10.0.1.0/24", "10.0.2.0/24"]
  
  # Private subnets for Fargate pods
  private_subnets = ["10.0.101.0/24", "10.0.102.0/24"]

  # Internet Gateway for public subnets
  create_igw = true

  # NAT Gateway for private subnet outbound access
  enable_nat_gateway = true
  single_nat_gateway = false  # HA setup with NAT gateway per AZ
  
  # DNS settings
  enable_dns_hostnames = true
  enable_dns_support   = true

  # Map public IP on launch for public subnets
  map_public_ip_on_launch = true

  # Tags for EKS
  tags = {
    Name = "jek-vpc"
    "kubernetes.io/cluster/${var.cluster_name}" = "shared"
  }

  # Public subnet tags
  public_subnet_tags = {
    Name = "jek-public-subnet"
    "kubernetes.io/role/elb" = "1"
  }

  # Private subnet tags
  private_subnet_tags = {
    Name = "jek-private-subnet"
    "kubernetes.io/role/internal-elb" = "1"
  }

  # Completely disable flow logs
  enable_flow_log = false
}

# EKS Cluster
module "eks" {
  source = "terraform-aws-modules/eks/aws"
  version = "~> 21.0"

  name               = var.cluster_name
  kubernetes_version = var.kubernetes_version

  # Cluster endpoint access
  endpoint_private_access = true
  endpoint_public_access  = true

  # VPC configuration
  vpc_id                          = module.vpc.vpc_id
  subnet_ids                      = module.vpc.private_subnets
  control_plane_subnet_ids        = module.vpc.private_subnets

  # Authentication mode
  authentication_mode = "API"

  # Enable cluster creator admin permissions
  enable_cluster_creator_admin_permissions = true

  # EKS Managed Add-ons
  addons = {
    coredns = {
      most_recent = true
      configuration_values = jsonencode({
        computeType = "Fargate"
      })
    }
    kube-proxy = {
      most_recent = true
    }
    vpc-cni = {
      most_recent = true
    }
  }

  # Fargate profiles
  fargate_profiles = {
    # CoreDNS Fargate profile - required for DNS resolution
    coredns = {
      name = "jek-coredns-fargate-profile"
      selectors = [
        {
          namespace = "kube-system"
          labels = {
            k8s-app = "kube-dns"
          }
        }
      ]
      subnet_ids = module.vpc.private_subnets
      
      tags = {
        Name = "jek-coredns-fargate-profile"
        component = "fargate-profile"
      }
    }

    # Default namespace Fargate profile
    default = {
      name = "jek-default-fargate-profile"
      selectors = [
        {
          namespace = "default"
        }
      ]
      subnet_ids = module.vpc.private_subnets
      
      tags = {
        Name = "jek-default-fargate-profile"
        component = "fargate-profile"
      }
    }
  }

  # Cluster tags
  tags = {
    Name = var.cluster_name
  }
}