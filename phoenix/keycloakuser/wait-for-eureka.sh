#!/bin/bash

# Wait for Eureka Server to become available
until curl -s http://server-discovery:8761 >/dev/null; do
  echo "Waiting for Eureka Server to start..."
  sleep 5
done

echo "Eureka Server is now available. Starting the  services."

# Start the  services
exec "$@"