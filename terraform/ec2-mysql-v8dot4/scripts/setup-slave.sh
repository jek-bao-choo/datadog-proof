#!/bin/bash

# MySQL Slave Configuration Script
# Run this script on the slave MySQL server

set -e

# Configuration
LOG_FILE="/var/log/mysql-slave-setup.log"

# Function to log messages
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | sudo tee -a $LOG_FILE
}

log "Starting MySQL Slave configuration..."

# Check if MySQL is running
if ! systemctl is-active --quiet mysql; then
    log "MySQL is not running. Starting MySQL..."
    sudo systemctl start mysql
fi

# Test MySQL connection using socket authentication
log "Testing MySQL connection using socket authentication..."
if ! sudo mysql -u root -e "SELECT 1;" > /dev/null 2>&1; then
    log "ERROR: Cannot connect to MySQL using socket authentication"
    exit 1
fi

log "MySQL connection successful!"

# Prompt for master server information
echo ""
echo "Enter Master Server Information:"
echo "Master IP address (private IP, e.g., 10.0.1.164):"
read MASTER_IP
echo "Replication user (default: replication_user):"
read REPLICATION_USER
REPLICATION_USER=${REPLICATION_USER:-replication_user}
echo "Replication password (default from Terraform: RU)#3r==!@+4xGqK):"
read -s REPLICATION_PASSWORD
REPLICATION_PASSWORD=${REPLICATION_PASSWORD:-"RU)#3r==!@+4xGqK"}
echo "Master log file (e.g., mysql-bin.000002):"
read MASTER_LOG_FILE
echo "Master log position (e.g., 156):"
read MASTER_LOG_POSITION

# Configure slave server settings
log "Configuring slave server settings..."

# Update MySQL configuration for slave (ensure server-id is 2)
sudo cat > /etc/mysql/mysql.conf.d/slave-replication.cnf << EOF
[mysqld]
# Slave configuration
server-id = 2
relay-log = relay-bin
log-bin = mysql-bin
binlog-format = ROW

# Read-only mode (optional - can be enabled for read-only slaves)
# read_only = 1

# Relay log settings
relay_log_recovery = 1
relay_log_purge = 1

# Network settings
bind-address = 0.0.0.0
EOF

# Restart MySQL to apply configuration
log "Restarting MySQL to apply slave configuration..."
sudo systemctl restart mysql

# Wait for MySQL to be ready and reset password
log "Waiting for MySQL to be ready..."
for i in {1..30}; do
    if mysqladmin ping --silent; then
        log "MySQL is ready!"
        break
    fi
    if [ $i -eq 30 ]; then
        log "ERROR: MySQL failed to restart properly"
        exit 1
    fi
    sleep 2
done

# Configure slave replication using MySQL 8.4 syntax
log "Configuring slave replication..."
sudo mysql -u root << EOF
STOP REPLICA;
RESET REPLICA ALL;

CHANGE REPLICATION SOURCE TO
    SOURCE_HOST='$MASTER_IP',
    SOURCE_USER='$REPLICATION_USER',
    SOURCE_PASSWORD='$REPLICATION_PASSWORD',
    SOURCE_LOG_FILE='$MASTER_LOG_FILE',
    SOURCE_LOG_POS=$MASTER_LOG_POSITION,
    SOURCE_SSL=1;

START REPLICA;
EOF

# Wait a moment for replica to start
sleep 5

# Check replica status using MySQL 8.4 syntax
log "Checking replica status..."
sudo mysql -u root -e "SHOW REPLICA STATUS\G" > /tmp/replica-status.txt

# Check for common issues
if grep -q "Replica_IO_Running: Yes" /tmp/replica-status.txt && grep -q "Replica_SQL_Running: Yes" /tmp/replica-status.txt; then
    log "SUCCESS: Replica is running correctly!"
    REPLICA_STATUS="SUCCESS"
else
    log "WARNING: Replica may have issues. Check the status below."
    REPLICA_STATUS="WARNING"
fi

# Display replica status
log "Replica status:"
cat /tmp/replica-status.txt | tee -a $LOG_FILE

# Create test database to verify replication
log "Creating replica-side database structure..."
sudo mysql -u root << EOF
CREATE DATABASE IF NOT EXISTS replication_test;
EOF

log "Slave configuration completed!"

# Display summary
echo ""
echo "==============================================="
echo "REPLICA CONFIGURATION COMPLETED - $REPLICA_STATUS"
echo "==============================================="
echo "Master IP: $MASTER_IP"
echo "Replication User: $REPLICATION_USER"
echo "Master Log File: $MASTER_LOG_FILE"
echo "Master Log Position: $MASTER_LOG_POSITION"
echo ""
echo "Replica Status Summary:"
if grep -q "Replica_IO_Running: Yes" /tmp/replica-status.txt; then
    echo "✓ Replica IO Thread: Running"
else
    echo "✗ Replica IO Thread: Not Running"
fi

if grep -q "Replica_SQL_Running: Yes" /tmp/replica-status.txt; then
    echo "✓ Replica SQL Thread: Running"
else
    echo "✗ Replica SQL Thread: Not Running"
fi

echo ""
echo "Full replica status saved to /tmp/replica-status.txt"
echo "==============================================="