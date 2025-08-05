variable "region" {
  description = "AWS region for resources"
  type        = string
  default     = "ap-southeast-1"
}

variable "availability_zone" {
  description = "Availability zone for the subnet"
  type        = string
  default     = "ap-southeast-1a"
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.large"
}

variable "key_name" {
  description = "AWS key pair name for SSH access"
  type        = string
  default     = "jek-macbook-pro-key"
}

variable "storage_size" {
  description = "Root volume size in GB"
  type        = number
  default     = 50
}

variable "name_prefix" {
  description = "Prefix for resource names"
  type        = string
  default     = "jek"
}

variable "owner_tag" {
  description = "Owner tag for resources"
  type        = string
  default     = "jek"
}

variable "env_tag" {
  description = "Environment tag for resources"
  type        = string
  default     = "test"
}