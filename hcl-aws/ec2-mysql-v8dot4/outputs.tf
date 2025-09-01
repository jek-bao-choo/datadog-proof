output "mysql_master_public_ip" {
  description = "Public IP address of MySQL master instance"
  value       = aws_instance.mysql_master.public_ip
}

output "mysql_slave_public_ip" {
  description = "Public IP address of MySQL slave instance"
  value       = aws_instance.mysql_slave.public_ip
}

output "mysql_master_private_ip" {
  description = "Private IP address of MySQL master instance"
  value       = aws_instance.mysql_master.private_ip
}

output "mysql_slave_private_ip" {
  description = "Private IP address of MySQL slave instance"
  value       = aws_instance.mysql_slave.private_ip
}

output "ssh_command_master" {
  description = "SSH command to connect to master instance"
  value       = "ssh -i ~/.ssh/id_ed25519 ubuntu@${aws_instance.mysql_master.public_ip}"
}

output "ssh_command_slave" {
  description = "SSH command to connect to slave instance"
  value       = "ssh -i ~/.ssh/id_ed25519 ubuntu@${aws_instance.mysql_slave.public_ip}"
}

output "vpc_id" {
  description = "ID of the VPC"
  value       = aws_vpc.mysql_vpc.id
}

output "subnet_id" {
  description = "ID of the public subnet"
  value       = aws_subnet.mysql_public_subnet.id
}

output "mysql_root_password" {
  description = "Generated MySQL root password"
  value       = random_password.mysql_root_password.result
  sensitive   = true
}

output "replication_password" {
  description = "Generated MySQL replication password"
  value       = random_password.replication_password.result
  sensitive   = true
}