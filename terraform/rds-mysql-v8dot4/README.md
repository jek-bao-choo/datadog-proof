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

## Quick Start

### 1. Deploy Infrastructure

```bash
# Initialize Terraform
terraform init

# Review the planned changes
terraform plan

# Deploy the infrastructure
terraform apply
```

When prompted, type `yes` to confirm the deployment.

### 2. Get Connection Information

After deployment, Terraform will output the connection endpoints:

```bash
# View all outputs
terraform output

# Get specific endpoints
terraform output primary_endpoint
terraform output replica_endpoint
```

### 3. Connect to Database

**Connect to Primary (Read/Write)**:
```bash
mysql -h $(terraform output -raw primary_endpoint) -P 3306 -u admin -p
```

**Connect to Read Replica (Read-Only)**:
```bash
mysql -h $(terraform output -raw replica_endpoint) -P 3306 -u admin -p
```

> **Note**: The password is managed by AWS. Retrieve it from AWS Secrets Manager in the AWS Console.

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

### Connection Issues
- Verify security group allows port 3306
- Check that instances are in "available" state
- Ensure AWS credentials are configured

### Replication Lag
- Check replica status: `SHOW SLAVE STATUS\G`
- Monitor CloudWatch metrics for lag

### Password Retrieval
1. Go to AWS Secrets Manager console
2. Find the secret named like `rds-db-credentials/...`
3. Retrieve the password value

## Teardown

To destroy all resources:

```bash
terraform destroy
```

Type `yes` when prompted. This will:
- Delete both RDS instances
- Remove all networking components
- Clean up security groups
- **Warning**: All data will be permanently lost!

## Files Structure

```
rds-mysql-v8dot4/
├── main.tf          # Main Terraform configuration
├── variables.tf     # Input variables
├── outputs.tf       # Output values
├── .gitignore       # Git ignore patterns
└── README.md        # This documentation
```

## Support

For issues:
1. Check AWS Console for resource status
2. Review Terraform plan/apply output
3. Check AWS CloudWatch logs
4. Verify AWS credentials and permissions