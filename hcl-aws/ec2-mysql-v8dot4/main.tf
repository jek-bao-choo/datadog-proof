# Get current IP address for security group
data "http" "current_ip" {
  url = "https://ifconfig.me/ip"
}

# Generate random passwords
resource "random_password" "mysql_root_password" {
  length  = 16
  special = true
}

resource "random_password" "replication_password" {
  length  = 16
  special = true
}

# VPC
resource "aws_vpc" "mysql_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name        = "${var.project_name}-vpc"
    Environment = var.environment
    Owner       = var.owner
  }
}

# Internet Gateway
resource "aws_internet_gateway" "mysql_igw" {
  vpc_id = aws_vpc.mysql_vpc.id

  tags = {
    Name        = "${var.project_name}-igw"
    Environment = var.environment
    Owner       = var.owner
  }
}

# Public Subnet
resource "aws_subnet" "mysql_public_subnet" {
  vpc_id                  = aws_vpc.mysql_vpc.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = var.availability_zone
  map_public_ip_on_launch = true

  tags = {
    Name        = "${var.project_name}-public-subnet"
    Environment = var.environment
    Owner       = var.owner
  }
}

# Route Table
resource "aws_route_table" "mysql_public_rt" {
  vpc_id = aws_vpc.mysql_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.mysql_igw.id
  }

  tags = {
    Name        = "${var.project_name}-public-rt"
    Environment = var.environment
    Owner       = var.owner
  }
}

# Route Table Association
resource "aws_route_table_association" "mysql_public_rta" {
  subnet_id      = aws_subnet.mysql_public_subnet.id
  route_table_id = aws_route_table.mysql_public_rt.id
}

# Security Group for SSH access
resource "aws_security_group" "mysql_ssh_sg" {
  name        = "${var.project_name}-ssh-sg"
  description = "Security group for SSH access"
  vpc_id      = aws_vpc.mysql_vpc.id

  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["${chomp(data.http.current_ip.response_body)}/32"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "${var.project_name}-ssh-sg"
    Environment = var.environment
    Owner       = var.owner
  }
}

# Security Group for MySQL replication
resource "aws_security_group" "mysql_replication_sg" {
  name        = "${var.project_name}-mysql-sg"
  description = "Security group for MySQL replication"
  vpc_id      = aws_vpc.mysql_vpc.id

  ingress {
    description = "MySQL"
    from_port   = 3306
    to_port     = 3306
    protocol    = "tcp"
    self        = true
  }

  tags = {
    Name        = "${var.project_name}-mysql-sg"
    Environment = var.environment
    Owner       = var.owner
  }
}

# Get Ubuntu 24.04 LTS AMI
data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # Canonical

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

# User data script for MySQL installation
locals {
  mysql_install_script = base64encode(templatefile("${path.module}/scripts/install-mysql.sh", {
    mysql_root_password = random_password.mysql_root_password.result
  }))
}

# MySQL Master Instance
resource "aws_instance" "mysql_master" {
  ami                    = data.aws_ami.ubuntu.id
  instance_type          = var.instance_type
  key_name               = var.key_name
  subnet_id              = aws_subnet.mysql_public_subnet.id
  vpc_security_group_ids = [aws_security_group.mysql_ssh_sg.id, aws_security_group.mysql_replication_sg.id]

  root_block_device {
    volume_type = "gp3"
    volume_size = var.root_volume_size
    encrypted   = true
  }

  user_data = local.mysql_install_script

  tags = {
    Name        = "${var.project_name}-master"
    Environment = var.environment
    Owner       = var.owner
    Role        = "mysql-master"
  }
}

# MySQL Slave Instance
resource "aws_instance" "mysql_slave" {
  ami                    = data.aws_ami.ubuntu.id
  instance_type          = var.instance_type
  key_name               = var.key_name
  subnet_id              = aws_subnet.mysql_public_subnet.id
  vpc_security_group_ids = [aws_security_group.mysql_ssh_sg.id, aws_security_group.mysql_replication_sg.id]

  root_block_device {
    volume_type = "gp3"
    volume_size = var.root_volume_size
    encrypted   = true
  }

  user_data = local.mysql_install_script

  tags = {
    Name        = "${var.project_name}-slave"
    Environment = var.environment
    Owner       = var.owner
    Role        = "mysql-slave"
  }
}