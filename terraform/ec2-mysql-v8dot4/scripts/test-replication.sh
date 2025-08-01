#!/bin/bash

# MySQL Replication Testing Script
# Run this script on the MASTER server to test replication

set -e

# Configuration
LOG_FILE="/var/log/mysql-replication-test.log"

# Function to log messages
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | sudo tee -a $LOG_FILE 2>/dev/null || echo "$(date '+%Y-%m-%d %H:%M:%S') - $1"
}

log "Starting MySQL Replication test..."

# Prompt for MySQL root password
echo "Enter MySQL root password for MASTER server:"
read -s MYSQL_ROOT_PASSWORD

# Test MySQL connection
log "Testing MySQL connection on master..."
if ! mysql -u root -p"$MYSQL_ROOT_PASSWORD" -e "SELECT 1;" > /dev/null 2>&1; then
    log "ERROR: Cannot connect to MySQL with provided password"
    exit 1
fi

log "MySQL connection successful!"

# Prompt for slave server IP for verification
echo "Enter SLAVE server IP address (for verification instructions):"
read SLAVE_IP

# Create test database and table (if not exists)
log "Setting up test database and table..."
mysql -u root -p"$MYSQL_ROOT_PASSWORD" << EOF
CREATE DATABASE IF NOT EXISTS replication_test;
USE replication_test;

CREATE TABLE IF NOT EXISTS test_table (
    id INT AUTO_INCREMENT PRIMARY KEY,
    data VARCHAR(255),
    test_type VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS replication_status (
    id INT AUTO_INCREMENT PRIMARY KEY,
    test_name VARCHAR(100),
    test_data VARCHAR(255),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
EOF

log "Test database and tables created successfully!"

# Insert initial test data
log "Inserting initial test data..."
mysql -u root -p"$MYSQL_ROOT_PASSWORD" << EOF
USE replication_test;
INSERT INTO test_table (data, test_type) VALUES 
    ('Master test data 1', 'initial'),
    ('Master test data 2', 'initial'),
    ('Master test data 3', 'initial');

INSERT INTO replication_status (test_name, test_data) VALUES 
    ('initial_test', 'Replication test started');
EOF

# Wait for replication
log "Waiting 5 seconds for replication to sync..."
sleep 5

# Insert more test data with timestamps
log "Inserting timestamped test data..."
for i in {1..5}; do
    CURRENT_TIME=$(date '+%Y-%m-%d %H:%M:%S')
    mysql -u root -p"$MYSQL_ROOT_PASSWORD" << EOF
USE replication_test;
INSERT INTO test_table (data, test_type) VALUES 
    ('Test batch $i - $CURRENT_TIME', 'timestamped');
INSERT INTO replication_status (test_name, test_data) VALUES 
    ('batch_test_$i', 'Batch $i inserted at $CURRENT_TIME');
EOF
    log "Inserted test batch $i"
    sleep 2
done

# Show current master status using MySQL 8.4 syntax
log "Current master status:"
mysql -u root -p"$MYSQL_ROOT_PASSWORD" -e "SHOW BINARY LOG STATUS;" 2>/dev/null | tee -a $LOG_FILE || echo "Could not get binary log status"

# Show data in master
log "Data in master database:"
mysql -u root -p"$MYSQL_ROOT_PASSWORD" << EOF
USE replication_test;
SELECT 'test_table' as table_name, COUNT(*) as record_count FROM test_table
UNION ALL
SELECT 'replication_status' as table_name, COUNT(*) as record_count FROM replication_status;

SELECT 'Latest test_table records:' as info;
SELECT id, data, test_type, created_at FROM test_table ORDER BY id DESC LIMIT 5;

SELECT 'Latest replication_status records:' as info;
SELECT id, test_name, test_data, timestamp FROM replication_status ORDER BY id DESC LIMIT 5;
EOF

# Create verification script for slave using MySQL 8.4 syntax
cat > /tmp/verify-slave-replication.sh << 'EOF'
#!/bin/bash

# Slave Verification Script for MySQL 8.4
echo "Enter MySQL root password for SLAVE server:"
read -s MYSQL_ROOT_PASSWORD

echo "Checking replication status on slave..."
mysql -u root -p"$MYSQL_ROOT_PASSWORD" -e "SHOW REPLICA STATUS\G" 2>/dev/null | grep -E "(Replica_IO_Running|Replica_SQL_Running|Seconds_Behind_Source|Last_Error)" || {
    echo "Could not get replica status. Trying legacy syntax..."
    mysql -u root -p"$MYSQL_ROOT_PASSWORD" -e "SHOW SLAVE STATUS\G" 2>/dev/null | grep -E "(Slave_IO_Running|Slave_SQL_Running|Seconds_Behind_Master|Last_Error)"
}

echo ""
echo "Data verification on slave:"
mysql -u root -p"$MYSQL_ROOT_PASSWORD" << EOSQL
USE replication_test;
SELECT 'test_table' as table_name, COUNT(*) as record_count FROM test_table
UNION ALL
SELECT 'replication_status' as table_name, COUNT(*) as record_count FROM replication_status;

SELECT 'Latest test_table records:' as info;
SELECT id, data, test_type, created_at FROM test_table ORDER BY id DESC LIMIT 5;

SELECT 'Latest replication_status records:' as info;
SELECT id, test_name, test_data, timestamp FROM replication_status ORDER BY id DESC LIMIT 5;
EOSQL
EOF

chmod +x /tmp/verify-slave-replication.sh

log "Replication test completed on master!"

# Display summary and next steps
echo ""
echo "==============================================="
echo "REPLICATION TEST COMPLETED ON MASTER"
echo "==============================================="
echo "✓ Test database 'replication_test' created"
echo "✓ Test data inserted into multiple tables"
echo "✓ Multiple batches of timestamped data added"
echo ""
echo "NEXT STEPS:"
echo "1. Copy the verification script to the slave server:"
echo "   scp -i ~/.ssh/id_ed25519 /tmp/verify-slave-replication.sh ubuntu@$SLAVE_IP:/tmp/"
echo ""
echo "2. SSH into the slave server:"
echo "   ssh -i ~/.ssh/id_ed25519 ubuntu@$SLAVE_IP"
echo ""
echo "3. Run the verification script on the slave:"
echo "   chmod +x /tmp/verify-slave-replication.sh"
echo "   /tmp/verify-slave-replication.sh"
echo ""
echo "4. Compare the record counts and data between master and slave"
echo "   They should match if replication is working correctly"
echo ""
echo "MANUAL VERIFICATION:"
echo "You can also manually check by running this on the slave:"
echo "mysql -u root -p -e 'USE replication_test; SELECT COUNT(*) FROM test_table;'"
echo "mysql -u root -p -e 'USE replication_test; SELECT COUNT(*) FROM replication_status;'"
echo ""
echo "QUICK TEST:"
echo "Add more data on master and check slave immediately:"
echo "mysql -u root -p -e \"USE replication_test; INSERT INTO test_table (data, test_type) VALUES ('Live test', 'manual');\""
echo "==============================================="

log "Test completed. Check the slave server to verify replication is working."