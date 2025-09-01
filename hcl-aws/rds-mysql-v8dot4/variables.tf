# AWS Region
variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "ap-southeast-1"
}

# MySQL Engine Version
variable "mysql_engine_version" {
  description = "MySQL engine version"
  type        = string
  default     = "8.4"
}

# Database Instance Class
variable "db_instance_class" {
  description = "RDS instance class"
  type        = string
  default     = "db.t3.large"
}

# Allocated Storage
variable "allocated_storage" {
  description = "Allocated storage in GB"
  type        = number
  default     = 50
}

# Storage Type
variable "storage_type" {
  description = "Storage type"
  type        = string
  default     = "gp2"
}

# Database Name
variable "database_name" {
  description = "Name of the database to create"
  type        = string
  default     = "testdb"
}

# Master Username
variable "master_username" {
  description = "Master username for the database"
  type        = string
  default     = "admin"
}

# Master Password (optional - if not provided, random password will be generated)
variable "master_password" {
  description = "Master password for the database (leave empty to generate random password)"
  type        = string
  default     = null
  sensitive   = true
}