#!/bin/bash

# MySQL Master Configuration Script
# Run this script on the master MySQL server

set -e

# Configuration
LOG_FILE="/var/log/mysql-master-setup.log"

# Function to log messages
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | sudo tee -a $LOG_FILE
}

log "Starting MySQL Master configuration..."

# Check if MySQL is running
if ! systemctl is-active --quiet mysql; then
    log "MySQL is not running. Starting MySQL..."
    sudo systemctl start mysql
fi

# Prompt for MySQL root password
echo "Enter MySQL root password:"
read -s MYSQL_ROOT_PASSWORD

# Test MySQL connection
log "Testing MySQL connection..."
if ! mysql -u root -p"$MYSQL_ROOT_PASSWORD" -e "SELECT 1;" > /dev/null 2>&1; then
    log "ERROR: Cannot connect to MySQL with provided password"
    exit 1
fi

log "MySQL connection successful!"

# Configure master server settings
log "Configuring master server settings..."

# Update MySQL configuration for master (server-id should already be 1 from install script)
sudo cat > /etc/mysql/mysql.conf.d/master-replication.cnf << EOF
[mysqld]
# Master configuration
server-id = 1
log-bin = mysql-bin
binlog-format = ROW
binlog-do-db = replication_test

# Binary log settings
binlog_expire_logs_seconds = 604800
max_binlog_size = 100M

# Replication settings
sync_binlog = 1
innodb_flush_log_at_trx_commit = 1

# Network settings
bind-address = 0.0.0.0
EOF

# Restart MySQL to apply configuration
log "Restarting MySQL to apply master configuration..."
sudo systemctl restart mysql

# Wait for MySQL to be ready
log "Waiting for MySQL to be ready..."
for i in {1..30}; do
    if mysqladmin ping -u root -p"$MYSQL_ROOT_PASSWORD" --silent; then
        log "MySQL is ready!"
        break
    fi
    if [ $i -eq 30 ]; then
        log "ERROR: MySQL failed to restart properly"
        exit 1
    fi
    sleep 2
done

# Create replication user with a known password (from Terraform)
log "Creating replication user..."
# Use the replication password from Terraform deployment
REPLICATION_PASSWORD="RU)#3r==!@+4xGqK"

mysql -u root -p"$MYSQL_ROOT_PASSWORD" << EOF
CREATE USER IF NOT EXISTS 'replication_user'@'%' IDENTIFIED BY '$REPLICATION_PASSWORD';
GRANT REPLICATION SLAVE ON *.* TO 'replication_user'@'%';
FLUSH PRIVILEGES;
EOF

log "Replication user created successfully!"

# Create test database for replication
log "Creating test database..."
mysql -u root -p"$MYSQL_ROOT_PASSWORD" << EOF
CREATE DATABASE IF NOT EXISTS replication_test;
USE replication_test;
CREATE TABLE IF NOT EXISTS test_table (
    id INT AUTO_INCREMENT PRIMARY KEY,
    data VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO test_table (data) VALUES ('Initial master data');
EOF

# Get master status using MySQL 8.4 syntax
log "Getting master status..."
mysql -u root -p"$MYSQL_ROOT_PASSWORD" -e "SHOW BINARY LOG STATUS;" > /tmp/master-status.txt

# Display master status
log "Master status:"
cat /tmp/master-status.txt | tee -a $LOG_FILE

# Save replication credentials to file
cat > /tmp/replication-info.txt << EOF
Replication User: replication_user
Replication Password: $REPLICATION_PASSWORD

Master Status (use these values for slave configuration):
$(cat /tmp/master-status.txt)

To configure slave, use these values in the CHANGE REPLICATION SOURCE TO command.
EOF

log "Master configuration completed!"
log "Replication information saved to /tmp/replication-info.txt"
log "Please copy this information to configure the slave server."

# Display the information
echo ""
echo "==============================================="
echo "MASTER CONFIGURATION COMPLETED"
echo "==============================================="
echo "Replication User: replication_user"
echo "Replication Password: $REPLICATION_PASSWORD"
echo ""
echo "Master Status (for slave configuration):"
cat /tmp/master-status.txt
echo ""
echo "Save this information to configure the slave!"
echo "==============================================="