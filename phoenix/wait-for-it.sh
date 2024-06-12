#!/bin/bash

# Wait for zookeeper Server to become available
until nc -z zookeeper 2181; do
  echo "Waiting for zookeeper Server to start..."
  sleep 5
done

echo "zookeeper Server is now available. Starting the  kafka."

# Start the services
exec "$@"
