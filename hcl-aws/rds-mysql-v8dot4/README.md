# Amazon RDS MySQL 8.4 with Read Replica

This Terraform configuration creates an Amazon RDS MySQL 8.4 setup with a primary instance and read replica in the ap-southeast-1 region.

## Architecture

- **Primary MySQL Instance**: MySQL 8.4 LTS in ap-southeast-1a
- **Read Replica**: Automatically replicates from primary in ap-southeast-1b  
- **VPC**: Custom VPC with public subnets for testing
- **Security**: Security group allowing MySQL access (port 3306)

## Prerequisites

- AWS CLI configured with appropriate credentials
- Terraform >= 1.0 installed
- AWS account with necessary permissions for RDS, VPC, and EC2

## Step-by-Step Commands

### 2. Configure AWS Credentials (if not already done)

```bash
# Option 1: Use AWS CLI configure
aws configure

# Option 2: Set environment variables
export AWS_ACCESS_KEY_ID="your-access-key"
export AWS_SECRET_ACCESS_KEY="your-secret-key"
export AWS_DEFAULT_REGION="ap-southeast-1"
```

### 3. Initialize Terraform

```bash
# Download required providers (AWS and Random)
terraform init
```

### 4. Review the Deployment Plan

```bash
# See what resources will be created
terraform plan
```

**Expected output**: Shows creation of VPC, subnets, security groups, primary DB, and read replica.

### 5. Deploy the Infrastructure

```bash
# Deploy all resources
terraform apply
```

When prompted `Do you want to perform these actions?`, type **`yes`** and press Enter.

**⏱️ Deployment time**: 10-15 minutes (RDS instances take time to provision).

### 6. Get Connection Information

```bash
# View all connection details
terraform output

# Get specific values
terraform output -raw primary_endpoint
terraform output -raw replica_endpoint
terraform output -raw master_password
```

### 7. Connect to Databases

**Copy the password to clipboard** (macOS):
```bash
terraform output -raw master_password | pbcopy
```

**Connect to Primary Database (Read/Write)**:
```bash
mysql -h $(terraform output -raw primary_endpoint) -P 3306 -u admin -p
# Paste the password when prompted
```

**Connect to Read Replica (Read/Only)**:
```bash
mysql -h $(terraform output -raw replica_endpoint) -P 3306 -u admin -p
# Use the same password
```

### 8. Test the Setup (Optional)

**On Primary Database**:
```sql
-- Create test data
CREATE DATABASE replication_test;
USE replication_test;
CREATE TABLE test_table (id INT AUTO_INCREMENT PRIMARY KEY, message VARCHAR(255));
INSERT INTO test_table (message) VALUES ('Hello from primary!');
SELECT * FROM test_table;
```

**On Read Replica**:
```sql
-- Verify replication
USE replication_test;
SELECT * FROM test_table;
-- Should show the same data

-- Try to write (this should fail)
INSERT INTO test_table (message) VALUES ('This will fail');
```

## Testing Replication

### 1. Create Test Data on Primary

```sql
-- Connect to primary instance
CREATE DATABASE replication_test;
USE replication_test;

CREATE TABLE test_table (
    id INT AUTO_INCREMENT PRIMARY KEY,
    message VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO test_table (message) VALUES ('Hello from primary!');
INSERT INTO test_table (message) VALUES ('Replication test data');
```

### 2. Verify Data on Read Replica

```sql
-- Connect to read replica instance
USE replication_test;
SELECT * FROM test_table;
```

The data should appear on the read replica within seconds.

### 3. Test Read-Only Nature

Try to insert data on the read replica (this should fail):
```sql
-- This should fail with read-only error
INSERT INTO test_table (message) VALUES ('This should fail');
```

## Configuration Details

| Component | Configuration |
|-----------|---------------|
| **MySQL Version** | 8.4 (LTS) |
| **Instance Class** | db.t3.large |
| **Storage** | 50 GB gp2 |
| **Backup Retention** | 7 days |
| **Multi-AZ** | Primary in 1a, Replica in 1b |
| **Public Access** | Enabled (for testing) |

## Cost Estimate

| Resource | Monthly Cost (Approx.) |
|----------|------------------------|
| Primary Instance (db.t3.large) | ~$75-100 |
| Read Replica (db.t3.large) | ~$75-100 |
| Storage (50GB each) | ~$10-15 |
| **Total** | **~$160-215/month** |

> Costs vary by region and usage. Stop instances when not needed.

## Security Notes

⚠️ **Important**: This configuration is for testing purposes only.

- RDS instances are publicly accessible
- Security group allows access from anywhere (0.0.0.0/0)
- No encryption at rest configured

For production use:
- Enable encryption at rest
- Use private subnets
- Restrict security group to specific IP ranges
- Enable automated backups
- Configure monitoring

## Troubleshooting

### Common Issues and Solutions

#### 1. "Error: ExpiredToken" during terraform plan/apply
**Problem**: AWS credentials expired
**Solution**: 
```bash
aws configure
# Or refresh your AWS SSO session
aws sso login
```

#### 2. "Error: creating RDS DB Instance" - read replica fails
**Problem**: Primary instance not ready or password issue
**Solution**: 
```bash
# Wait for primary to be fully available, then retry
terraform apply
```

#### 3. Cannot connect to MySQL database
**Problem**: Security group or network issue
**Solutions**:
```bash
# Check if instances are running
aws rds describe-db-instances --region ap-southeast-1

# Verify security group allows MySQL (port 3306)
aws ec2 describe-security-groups --region ap-southeast-1 --group-names jek-mysql-sg

# Test connection with telnet
telnet $(terraform output -raw primary_endpoint) 3306
```

#### 4. "Access denied" when connecting to MySQL
**Problem**: Wrong password or username
**Solution**:
```bash
# Double-check the password
terraform output -raw master_password

# Ensure using correct username: admin
mysql -h $(terraform output -raw primary_endpoint) -P 3306 -u admin -p
```

#### 5. Terraform state issues
**Problem**: State file corruption or conflicts
**Solution**:
```bash
# Refresh state from AWS
terraform refresh

# If corrupted, you may need to import resources
terraform import aws_db_instance.mysql_primary your-db-identifier
```

### Connection Verification

#### Check Database Status
```bash
# Primary instance status
aws rds describe-db-instances --db-instance-identifier jek-mysql-primary --region ap-southeast-1

# Replica instance status  
aws rds describe-db-instances --db-instance-identifier jek-mysql-replica --region ap-southeast-1
```

#### Test Network Connectivity
```bash
# Test if port 3306 is accessible
nc -zv $(terraform output -raw primary_endpoint) 3306
nc -zv $(terraform output -raw replica_endpoint) 3306
```

### Replication Monitoring
```sql
-- On replica, check replication status
SHOW SLAVE STATUS\G

-- Look for:
-- Slave_IO_Running: Yes
-- Slave_SQL_Running: Yes  
-- Seconds_Behind_Master: should be low (0-5)
```

### Password Information
- **Secure random password** is automatically generated
- **Username**: `admin`
- **Get password**: `terraform output -raw master_password`
- **Custom password**: Use `terraform apply -var="master_password=YourSecurePassword"`

### Security Features
✅ **No hardcoded passwords** in code  
✅ **Random password generation** using Terraform  
✅ **Sensitive outputs** - password not shown in logs  
✅ **Safe for public repositories**
✅ **Improved security group handling** - uses separate rule resources for reliability

## Teardown Commands

### Complete Cleanup (Destroy Everything)

```bash
# Review what will be destroyed
terraform plan -destroy

# Destroy all resources
terraform destroy
```

When prompted `Do you really want to destroy all resources?`, type **`yes`** and press Enter.

**⏱️ Teardown time**: 5-10 minutes

**⚠️ Warning**: This will permanently delete:
- Both MySQL instances (primary and replica)
- All database data
- VPC and networking components
- Security groups

### Verify Cleanup

```bash
# Check that no resources remain
terraform show

# Should show: "No state."
```

### Optional: Clean Up Terraform Files

```bash
# Remove state files (optional - be careful!)
rm -f terraform.tfstate*
rm -rf .terraform/
```

> **Note**: Only remove state files if you're completely done and want to start fresh.

## Files Structure

```
rds-mysql-v8dot4/
├── main.tf          # Main Terraform configuration
├── variables.tf     # Input variables
├── outputs.tf       # Output values
├── .gitignore       # Git ignore patterns
└── README.md        # This documentation
```

## Quick Command Reference

### Essential Commands
```bash
# Deploy
terraform init
terraform plan
terraform apply

# Get connection info
terraform output -raw master_password
terraform output -raw primary_endpoint
terraform output -raw replica_endpoint

# Connect to databases
mysql -h $(terraform output -raw primary_endpoint) -P 3306 -u admin -p
mysql -h $(terraform output -raw replica_endpoint) -P 3306 -u admin -p

# Cleanup
terraform destroy
```

### Useful AWS CLI Commands
```bash
# Check RDS instances
aws rds describe-db-instances --region ap-southeast-1

# Check specific instance
aws rds describe-db-instances --db-instance-identifier jek-mysql-primary --region ap-southeast-1

# View CloudWatch logs
aws logs describe-log-groups --region ap-southeast-1 --log-group-name-prefix /aws/rds
```

## Support

For issues:
1. Check the **Troubleshooting** section above
2. Review AWS Console for resource status
3. Check Terraform plan/apply output
4. Verify AWS credentials and permissions
5. Monitor AWS CloudWatch logs