# AWS Provider Configuration
terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.1"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# Random password generation
resource "random_password" "master_password" {
  count   = var.master_password == null ? 1 : 0
  length  = 16
  special = true
}

# Local values for naming convention
locals {
  name_prefix = "jek"
  common_tags = {
    owner = "jek"
    env   = "test"
  }
  master_password = var.master_password != null ? var.master_password : random_password.master_password[0].result
}

# VPC
resource "aws_vpc" "mysql_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-mysql-vpc"
  })
}

# Internet Gateway
resource "aws_internet_gateway" "mysql_igw" {
  vpc_id = aws_vpc.mysql_vpc.id

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-mysql-igw"
  })
}

# Subnets
resource "aws_subnet" "mysql_subnet_1" {
  vpc_id                  = aws_vpc.mysql_vpc.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "${var.aws_region}a"
  map_public_ip_on_launch = true

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-mysql-subnet-1"
  })
}

resource "aws_subnet" "mysql_subnet_2" {
  vpc_id                  = aws_vpc.mysql_vpc.id
  cidr_block              = "10.0.2.0/24"
  availability_zone       = "${var.aws_region}b"
  map_public_ip_on_launch = true

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-mysql-subnet-2"
  })
}

# Route Table
resource "aws_route_table" "mysql_rt" {
  vpc_id = aws_vpc.mysql_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.mysql_igw.id
  }

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-mysql-rt"
  })
}

# Route Table Associations
resource "aws_route_table_association" "mysql_rta_1" {
  subnet_id      = aws_subnet.mysql_subnet_1.id
  route_table_id = aws_route_table.mysql_rt.id
}

resource "aws_route_table_association" "mysql_rta_2" {
  subnet_id      = aws_subnet.mysql_subnet_2.id
  route_table_id = aws_route_table.mysql_rt.id
}

# DB Subnet Group
resource "aws_db_subnet_group" "mysql_subnet_group" {
  name       = "${local.name_prefix}-mysql-subnet-group"
  subnet_ids = [aws_subnet.mysql_subnet_1.id, aws_subnet.mysql_subnet_2.id]

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-mysql-subnet-group"
  })
}

# Security Group for RDS (base)
resource "aws_security_group" "mysql_sg" {
  name        = "${local.name_prefix}-mysql-sg"
  description = "Security group for MySQL RDS instances"
  vpc_id      = aws_vpc.mysql_vpc.id

  # Prevent accidental deletion while RDS instances are attached
  lifecycle {
    create_before_destroy = true
  }

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-mysql-sg"
  })
}

# Security Group Rule - MySQL Ingress
resource "aws_security_group_rule" "mysql_ingress" {
  type              = "ingress"
  from_port         = 3306
  to_port           = 3306
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]
  description       = "MySQL access from anywhere"
  security_group_id = aws_security_group.mysql_sg.id
}

# Security Group Rule - All Egress
resource "aws_security_group_rule" "mysql_egress" {
  type              = "egress"
  from_port         = 0
  to_port           = 0
  protocol          = "-1"
  cidr_blocks       = ["0.0.0.0/0"]
  description       = "All outbound traffic"
  security_group_id = aws_security_group.mysql_sg.id
}

# Primary MySQL RDS Instance
resource "aws_db_instance" "mysql_primary" {
  identifier             = "${local.name_prefix}-mysql-primary"
  engine                 = "mysql"
  engine_version         = var.mysql_engine_version
  instance_class         = var.db_instance_class
  allocated_storage      = var.allocated_storage
  storage_type           = var.storage_type
  
  db_name  = var.database_name
  username = var.master_username
  password = local.master_password
  
  vpc_security_group_ids = [aws_security_group.mysql_sg.id]
  db_subnet_group_name   = aws_db_subnet_group.mysql_subnet_group.name
  
  depends_on = [
    aws_security_group_rule.mysql_ingress,
    aws_security_group_rule.mysql_egress
  ]
  
  publicly_accessible = true
  skip_final_snapshot = true
  
  backup_retention_period = 7
  backup_window          = "03:00-04:00"
  maintenance_window     = "sun:04:00-sun:05:00"

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-mysql-primary"
  })
}

# Read Replica MySQL RDS Instance
resource "aws_db_instance" "mysql_replica" {
  identifier              = "${local.name_prefix}-mysql-replica"
  replicate_source_db     = aws_db_instance.mysql_primary.identifier
  instance_class          = var.db_instance_class
  availability_zone       = "${var.aws_region}b"
  
  publicly_accessible     = true
  skip_final_snapshot     = true
  
  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-mysql-replica"
  })
}