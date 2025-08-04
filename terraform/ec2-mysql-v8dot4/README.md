# MySQL 8.4 LTS Master-Slave Replication on EC2

This Terraform script sets up MySQL 8.4 LTS master-slave replication on two EC2 instances in AWS ap-southeast-1 region.

## Overview

- **Purpose**: Create a simple MySQL replication setup for learning and testing
- **Infrastructure**: 2 EC2 instances (master & slave) with public IPs
- **MySQL Version**: 8.4.6 LTS (Long Term Support)
- **OS**: Ubuntu 22.04 LTS (MySQL 8.4 compatible)
- **Region**: ap-southeast-1 (Singapore)
- **Setup**: Simple public subnet configuration (no bastion hosts)

## Prerequisites

### Required Software
- **Terraform**: >= 1.0 (Install from [terraform.io](https://terraform.io))
- **AWS CLI**: Configured with appropriate credentials

### AWS Permissions
Your AWS credentials need permissions for:
- EC2 instances, VPC, subnets, security groups
- Key pair access for SSH


## Quick Start

### 1. Deploy Infrastructure

```bash
# Navigate to the project directory
cd ec2-mysql-v8dot4

# Initialize Terraform
terraform init

# Review the deployment plan
terraform plan

# Deploy the infrastructure
terraform apply
```

**Note**: The deployment will:
- Create VPC, subnet, security groups, and 2 EC2 instances
- Automatically install MySQL 8.4 LTS on both instances
- Generate random passwords for MySQL root and replication user
- Take about 5-10 minutes to complete

### 2. Get Connection Information

After deployment, Terraform will output:
```bash
# View outputs
terraform output

# Get SSH commands
terraform output ssh_command_master
terraform output ssh_command_slave

# Get passwords (marked as sensitive)
terraform output mysql_root_password
terraform output replication_password
```

Save these passwords - you'll need them for configuration!

### 3. Wait for MySQL Installation

The EC2 instances automatically install MySQL via user data scripts. **Wait 3-5 minutes** after deployment, then verify:

```bash
# SSH into master
ssh -i ~/.ssh/id_ed25519 ubuntu@<MASTER_IP>

# Check if MySQL installation is complete
ls -la /var/log/mysql-install-complete
# Should show the completion file

# Check MySQL service
sudo systemctl status mysql

# Test MySQL connection using socket authentication (no password needed)
sudo mysql -u root
```

### 4. Configure Master Server

On the **master** instance:

```bash
# Copy the setup script from your local machine
scp -i ~/.ssh/id_ed25519 scripts/setup-master.sh ubuntu@<MASTER_IP>:/tmp/

# SSH into master
ssh -i ~/.ssh/id_ed25519 ubuntu@<MASTER_IP>

# Run master setup script
chmod +x /tmp/setup-master.sh
sudo /tmp/setup-master.sh
# Enter the MySQL root password when prompted
```

**Important**: The script will display master status information. **Save this information:**
- File: mysql-bin.000XXX
- Position: XXXX

### 5. Configure Slave Server

On the **slave** instance:

```bash
# Copy the setup script from your local machine
scp -i ~/.ssh/id_ed25519 scripts/setup-slave.sh ubuntu@<SLAVE_IP>:/tmp/

# SSH into slave
ssh -i ~/.ssh/id_ed25519 ubuntu@<SLAVE_IP>

# Run slave setup script
chmod +x /tmp/setup-slave.sh
sudo /tmp/setup-slave.sh
```

The script will prompt for:
- MySQL root password (from terraform output)
- Master IP address (use the **private IP** from terraform output)
- Replication username (default: replication_user)
- Replication password (default from terraform: `RU)#3r==!@+4xGqK`)
- Master log file (from master setup output)
- Master log position (from master setup output)

### 6. Verify Replication is Working

**Check on slave:**
```bash
sudo mysql -u root -e "SHOW REPLICA STATUS\G" | grep -E "(Replica_IO_Running|Replica_SQL_Running|Seconds_Behind_Source)"
```

You should see:
- `Replica_IO_Running: Yes`
- `Replica_SQL_Running: Yes`
- `Seconds_Behind_Source: 0`

### 7. Test Replication

**Method 1: Quick Test**
```bash
# First, create database and table on master (IMPORTANT: Do this AFTER replication is set up)
sudo mysql -u root -e "CREATE DATABASE IF NOT EXISTS replication_test;"
sudo mysql -u root -e "USE replication_test; CREATE TABLE IF NOT EXISTS test_table (id INT AUTO_INCREMENT PRIMARY KEY, data VARCHAR(255));"

# Check replication status on slave (MySQL 8.0.22+ uses REPLICA instead of SLAVE)
sudo mysql -u root -e "SHOW REPLICA STATUS\G"

# If you see replication errors (Last_SQL_Errno: 1146), skip the problematic transaction on slave:
sudo mysql -u root -e "STOP REPLICA; SET GLOBAL sql_slave_skip_counter = 1; START REPLICA;"

# Verify replication is working
sudo mysql -u root -e "SHOW REPLICA STATUS\G" | grep -E "(Replica_IO_Running|Replica_SQL_Running)"

# Test data replication
# On master - insert test data
sudo mysql -u root -e "USE replication_test; INSERT INTO test_table (data) VALUES ('Test replication'); SELECT * FROM test_table;"

# On slave - verify data replicated
sudo mysql -u root -e "USE replication_test; SELECT * FROM test_table;"
```

**Method 2: Comprehensive Test Script**
```bash
# Copy test script to master
scp -i ~/.ssh/id_ed25519 scripts/test-replication.sh ubuntu@<MASTER_IP>:/tmp/

# SSH into master and run test
ssh -i ~/.ssh/id_ed25519 ubuntu@<MASTER_IP>
chmod +x /tmp/test-replication.sh
/tmp/test-replication.sh
```

## File Structure

```
ec2-mysql-v8dot4/
├── main.tf                 # Core infrastructure resources
├── variables.tf            # Input variables
├── outputs.tf              # Output values
├── versions.tf             # Terraform and provider versions
├── scripts/
│   ├── install-mysql.sh    # Automated MySQL installation (updated for 8.4)
│   ├── setup-master.sh     # Master server configuration (updated syntax)
│   ├── setup-slave.sh      # Slave server configuration (updated syntax)
│   └── test-replication.sh # Replication testing (updated syntax)
├── .gitignore              # Git ignore rules
└── README.md               # This file
```

## Important MySQL 8.4 Changes

This setup accounts for MySQL 8.4 changes:
- Uses `SHOW BINARY LOG STATUS` instead of `SHOW MASTER STATUS`
- Uses `SHOW REPLICA STATUS` instead of `SHOW SLAVE STATUS`
- Uses `CHANGE REPLICATION SOURCE TO` instead of `CHANGE MASTER TO`
- **Uses socket authentication** instead of password authentication for root user
- Removed deprecated `default-authentication-plugin` option

## MySQL Authentication Method

**Important**: This setup uses **socket authentication** for the MySQL root user, which means:
- **No password required** when connecting as root from the same server
- Use `sudo mysql -u root` instead of `mysql -u root -p`
- More secure than password authentication for local connections
- Only works when logged in as the `ubuntu` user (or root) on the same server

This eliminates password-related connection issues and provides better security for local administration.

## Manual Verification

### Check Replication Status (MySQL 8.4 syntax)

**On Slave Server:**
```sql
sudo mysql -u root
SHOW REPLICA STATUS\G
```

Look for:
- `Replica_IO_Running: Yes`
- `Replica_SQL_Running: Yes`
- `Seconds_Behind_Source: 0` (or low number)

### Test Data Synchronization

**On Master:**
```sql
sudo mysql -u root
USE replication_test;
INSERT INTO test_table (data) VALUES ('Manual test');
SELECT * FROM test_table ORDER BY id DESC LIMIT 5;
```

**On Slave:**
```sql
sudo mysql -u root
USE replication_test;
SELECT * FROM test_table ORDER BY id DESC LIMIT 5;
```

The data should match between master and slave.

## Troubleshooting

### Common Issues

1. **MySQL not responding after deployment**
   - Wait 3-5 minutes for installation to complete
   - Check: `sudo systemctl status mysql`
   - View logs: `sudo tail -f /var/log/mysql-install.log`

2. **Cannot connect to MySQL**
   - Use the exact password from `terraform output mysql_root_password`
   - Check if MySQL is running: `sudo systemctl status mysql`
   - Look for errors in: `sudo tail -f /var/log/mysql/error.log`

3. **Replication not working**
   - Check replica status: `SHOW REPLICA STATUS\G`
   - Verify master and slave have different server-ids (master=1, slave=2)
   - Ensure security group allows MySQL traffic between instances
   - Use private IP addresses for replication configuration

4. **SSH connection refused**
   - Verify your current IP is correct in security group
   - Check SSH key path: `~/.ssh/id_ed25519`

5. **Authentication issues**
   - MySQL 8.4 uses `caching_sha2_password` by default
   - Ensure SSL is enabled for replication (automatically configured)

### Useful Commands

```bash
# Check MySQL service status
sudo systemctl status mysql

# View MySQL error logs
sudo tail -f /var/log/mysql/error.log

# Test MySQL connection
mysqladmin ping -u root -p

# Check replication lag (MySQL 8.4 syntax)
sudo mysql -u root -e "SHOW REPLICA STATUS\G" | grep Seconds_Behind_Source

# Reset replication if needed
sudo mysql -u root -e "STOP REPLICA; RESET REPLICA ALL;"
```

## Security Notes

- **Public Access**: Instances have public IPs for simplicity
- **SSH Access**: Limited to your current IP address only
- **MySQL Access**: Only between the two instances (private network)
- **Passwords**: Generated randomly and stored securely in Terraform state
- **Encryption**: EBS volumes are encrypted, SSL enabled for replication

## Cleanup

To destroy all resources and stop billing:

```bash
# Destroy infrastructure
terraform destroy

# Confirm with 'yes' when prompted
```

**Warning**: This will permanently delete all instances and data!

## Advanced Configuration

### Enable Read-Only Slave

To make the slave read-only:
```bash
sudo sudo mysql -u root -e "SET GLOBAL read_only = 1;"
```

### Monitor Replication Lag

Create a monitoring script:
```bash
#!/bin/bash
sudo mysql -u root -e "SHOW REPLICA STATUS\G" | grep Seconds_Behind_Source
```

### Backup Strategy

For production use, consider:
- Regular MySQL dumps with `mysqldump`
- Binary log backups
- EBS snapshots
- Point-in-time recovery setup

## Deployment from Fresh State

This updated configuration ensures smooth deployment from a completely fresh state:

1. **Run `terraform apply`** - Infrastructure and MySQL installation will complete automatically
2. **Wait 3-5 minutes** for MySQL installation to finish
3. **Run master setup script** on the master instance
4. **Run slave setup script** on the slave instance with master information
5. **Verify replication** is working
6. **Test with sample data**

All scripts have been updated for MySQL 8.4 compatibility and proper error handling.

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review Terraform and MySQL logs
3. Ensure all prerequisites are met
4. Verify network connectivity between instances

---

**Note**: This setup is designed for learning and testing MySQL replication concepts. For production use, consider additional security measures, monitoring, backup strategies, and high availability configurations.