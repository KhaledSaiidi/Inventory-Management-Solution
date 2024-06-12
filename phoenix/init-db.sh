#!/bin/bash
set -e

echo "Starting script..."


# Wait for the MySQL server to be available
while ! mysqladmin ping -h"localhost" --silent; do
    echo "Waiting for MySQL server to start..."
    sleep 2
done

## Wait for the keycloakdb.sql file to be available
## while [ ! -f /docker-entrypoint-initdb.d/keycloakdb.sql ]; do
##    echo "Waiting for keycloakdb.sql to be available..."
##     sleep 2
## done

# Create the databases
mysql -uroot -p"$MYSQL_ROOT_PASSWORD" <<-EOSQL
    CREATE DATABASE IF NOT EXISTS keycloakdb;
    CREATE DATABASE IF NOT EXISTS notificationdb;
    CREATE DATABASE IF NOT EXISTS stockdb;
EOSQL

# Import the keycloakdb.sql file
## mysql -uroot -p"$MYSQL_ROOT_PASSWORD" keycloakdb < /docker-entrypoint-initdb.d/keycloakdb.sql

echo "Script completed."