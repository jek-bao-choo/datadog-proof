# Primary Database Outputs
output "primary_endpoint" {
  description = "Primary MySQL database endpoint (hostname only)"
  value       = split(":", aws_db_instance.mysql_primary.endpoint)[0]
}

output "primary_port" {
  description = "Primary MySQL database port"
  value       = aws_db_instance.mysql_primary.port
}

# Read Replica Outputs
output "replica_endpoint" {
  description = "Read replica MySQL database endpoint (hostname only)"
  value       = split(":", aws_db_instance.mysql_replica.endpoint)[0]
}

output "replica_port" {
  description = "Read replica MySQL database port"
  value       = aws_db_instance.mysql_replica.port
}

# Connection Information
output "database_name" {
  description = "Name of the database"
  value       = aws_db_instance.mysql_primary.db_name
}

output "master_username" {
  description = "Master username for the database"
  value       = aws_db_instance.mysql_primary.username
}

output "master_password" {
  description = "Master password for the database (randomly generated)"
  value       = local.master_password
  sensitive   = true
}

# Connection Strings
output "primary_connection_info" {
  description = "Primary database connection information"
  value = {
    host     = split(":", aws_db_instance.mysql_primary.endpoint)[0]
    port     = aws_db_instance.mysql_primary.port
    database = aws_db_instance.mysql_primary.db_name
    username = aws_db_instance.mysql_primary.username
  }
}

output "replica_connection_info" {
  description = "Read replica database connection information"
  value = {
    host     = split(":", aws_db_instance.mysql_replica.endpoint)[0] 
    port     = aws_db_instance.mysql_replica.port
    database = aws_db_instance.mysql_primary.db_name
    username = aws_db_instance.mysql_primary.username
  }
}