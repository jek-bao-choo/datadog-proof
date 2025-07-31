terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  required_version = ">= 1.0"
}

provider "aws" {
  region = var.region
}

data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"]

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

data "http" "myip" {
  url = "http://ipv4.icanhazip.com"
}

data "aws_availability_zones" "available" {
  state = "available"
}

resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name  = "${var.name_prefix}-vpc"
    Owner = var.owner_tag
    Env   = var.env_tag
  }
}

resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name  = "${var.name_prefix}-igw"
    Owner = var.owner_tag
    Env   = var.env_tag
  }
}

resource "aws_subnet" "public" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = var.availability_zone
  map_public_ip_on_launch = true

  tags = {
    Name  = "${var.name_prefix}-public-subnet"
    Owner = var.owner_tag
    Env   = var.env_tag
  }
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }

  tags = {
    Name  = "${var.name_prefix}-public-rt"
    Owner = var.owner_tag
    Env   = var.env_tag
  }
}

resource "aws_route_table_association" "public" {
  subnet_id      = aws_subnet.public.id
  route_table_id = aws_route_table.public.id
}

resource "aws_security_group" "ec2" {
  name_prefix = "${var.name_prefix}-ec2-sg"
  vpc_id      = aws_vpc.main.id

  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["${chomp(data.http.myip.response_body)}/32"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name  = "${var.name_prefix}-ec2-sg"
    Owner = var.owner_tag
    Env   = var.env_tag
  }
}

data "aws_key_pair" "main" {
  key_name = var.key_name
}

resource "aws_instance" "main" {
  ami                    = data.aws_ami.ubuntu.id
  instance_type          = var.instance_type
  key_name               = data.aws_key_pair.main.key_name
  vpc_security_group_ids = [aws_security_group.ec2.id]
  subnet_id              = aws_subnet.public.id

  root_block_device {
    volume_type = "gp3"
    volume_size = var.storage_size
    encrypted   = true

    tags = {
      Name  = "${var.name_prefix}-root-volume"
      Owner = var.owner_tag
      Env   = var.env_tag
    }
  }

  tags = {
    Name  = "${var.name_prefix}-ec2-instance"
    Owner = var.owner_tag
    Env   = var.env_tag
  }
}