output "instance_public_ip" {
  description = "Public IP address of the EC2 instance"
  value       = aws_instance.main.public_ip
}

output "instance_private_ip" {
  description = "Private IP address of the EC2 instance"
  value       = aws_instance.main.private_ip
}

output "instance_id" {
  description = "ID of the EC2 instance"
  value       = aws_instance.main.id
}

output "vpc_id" {
  description = "ID of the VPC"
  value       = aws_vpc.main.id
}

output "subnet_id" {
  description = "ID of the public subnet"
  value       = aws_subnet.public.id
}

output "security_group_id" {
  description = "ID of the security group"
  value       = aws_security_group.ec2.id
}

output "ssh_connection_command" {
  description = "Command to connect to the instance via SSH"
  value       = "ssh -i ~/.ssh/id_ed25519 ubuntu@${aws_instance.main.public_ip}"
}

output "instance_dns" {
  description = "Public DNS name of the EC2 instance"
  value       = aws_instance.main.public_dns
}