#!/bin/bash

# Wait for api-gateway Server to become available
until curl -s http://api-gateway:9000 >/dev/null; do
  echo "Waiting for api-gateway Server to start..."
  sleep 5
done

echo "api-gateway Server is now available. Starting the services."

# Start the  services
exec "$@"