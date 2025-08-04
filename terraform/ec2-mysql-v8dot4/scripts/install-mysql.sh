#!/bin/bash

# MySQL 8.4 LTS Installation Script for Ubuntu 22.04
# This script is executed via EC2 user data

set -e

# Variables
MYSQL_ROOT_PASSWORD="${mysql_root_password}"
LOG_FILE="/var/log/mysql-install.log"

# Function to log messages
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | sudo tee -a $LOG_FILE
}

log "Starting MySQL 8.4 LTS installation..."

# Update system packages
log "Updating system packages..."
apt-get update -y

# Install necessary packages
log "Installing required packages..."
apt-get install -y wget curl gnupg2 software-properties-common

# Download and add MySQL APT repository
log "Adding MySQL APT repository..."
wget https://dev.mysql.com/get/mysql-apt-config_0.8.30-1_all.deb
export DEBIAN_FRONTEND=noninteractive
dpkg -i mysql-apt-config_0.8.30-1_all.deb

# Update package list with MySQL repository
log "Updating package list..."
apt-get update -y

# Install MySQL 8.4 LTS (without pre-setting password as it's deprecated)
log "Installing MySQL 8.4 LTS..."
DEBIAN_FRONTEND=noninteractive apt-get install -y mysql-server=8.4.* mysql-client=8.4.*

# Hold MySQL packages to prevent unwanted upgrades
apt-mark hold mysql-server mysql-client

# Start and enable MySQL service
log "Starting and enabling MySQL service..."
systemctl start mysql
systemctl enable mysql

# Wait for MySQL to be ready
log "Waiting for MySQL to be ready..."
for i in {1..30}; do
    if mysqladmin ping --silent; then
        log "MySQL is ready!"
        break
    fi
    if [ $i -eq 30 ]; then
        log "ERROR: MySQL failed to start properly"
        exit 1
    fi
    sleep 2
done

# Configure root user to use socket authentication (no password needed)
log "Configuring MySQL root user for socket authentication..."
mysql -u root << EOF
ALTER USER 'root'@'localhost' IDENTIFIED WITH auth_socket;
FLUSH PRIVILEGES;
EOF

# Basic security configuration
log "Configuring MySQL security..."
mysql -u root << EOF
DELETE FROM mysql.user WHERE User='';
DELETE FROM mysql.user WHERE User='root' AND Host NOT IN ('localhost', '127.0.0.1', '::1');
DROP DATABASE IF EXISTS test;
DELETE FROM mysql.db WHERE Db='test' OR Db='test_%';
FLUSH PRIVILEGES;
EOF

# Create MySQL configuration directory if it doesn't exist
mkdir -p /etc/mysql/mysql.conf.d/

# Create a basic configuration file for replication (MySQL 8.4 compatible)
log "Creating MySQL replication configuration..."
cat > /etc/mysql/mysql.conf.d/replication.cnf << EOF
[mysqld]
# Basic settings
bind-address = 0.0.0.0

# Replication settings - will be customized per server
server-id = 1
log-bin = mysql-bin
binlog-format = ROW
binlog-do-db = replication_test

# InnoDB settings
innodb_flush_log_at_trx_commit = 1
sync_binlog = 1

# General settings
max_connections = 200
innodb_buffer_pool_size = 128M
EOF

# Restart MySQL to apply configuration
log "Restarting MySQL to apply configuration..."
systemctl restart mysql

# Wait for MySQL to be ready again
log "Waiting for MySQL to be ready after restart..."
for i in {1..30}; do
    if mysqladmin ping --silent; then
        log "MySQL is ready after restart!"
        break
    fi
    if [ $i -eq 30 ]; then
        log "ERROR: MySQL failed to restart properly"
        exit 1
    fi
    sleep 2
done

# Create a status file to indicate installation completion
log "MySQL 8.4 LTS installation completed successfully!"
echo "MySQL 8.4 LTS installed on $(date)" > /var/log/mysql-install-complete

# Display MySQL version using socket authentication
sudo mysql -u root -e "SELECT VERSION();" 2>/dev/null | tee -a $LOG_FILE

log "MySQL installation script finished. Check $LOG_FILE for details."