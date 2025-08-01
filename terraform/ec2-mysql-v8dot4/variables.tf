variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "ap-southeast-1"
}

variable "availability_zone" {
  description = "AWS availability zone"
  type        = string
  default     = "ap-southeast-1a"
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.large"
}

variable "key_name" {
  description = "AWS EC2 Key Pair name"
  type        = string
  default     = "jek-macbook-pro-key"
}

variable "root_volume_size" {
  description = "Root volume size in GB"
  type        = number
  default     = 50
}

variable "project_name" {
  description = "Project name for resource naming"
  type        = string
  default     = "jek-mysql-replication"
}

variable "environment" {
  description = "Environment tag"
  type        = string
  default     = "test"
}

variable "owner" {
  description = "Owner tag"
  type        = string
  default     = "jek"
}