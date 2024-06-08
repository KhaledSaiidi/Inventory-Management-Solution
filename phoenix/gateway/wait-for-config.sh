#!/bin/bash

# Wait for Config Server to become available
until curl -s http://configserver:8888 >/dev/null; do
  echo "Waiting for Config Server to start..."
  sleep 5
done

echo "Config Server is now available. Starting the notification service."

# Start the notification service
exec "$@"
