#!/bin/bash

# Wait for Keycloak Server to become available
until curl -s http://keycloak:8181 >/dev/null; do
  echo "Waiting for keycloak Server to start..."
  sleep 5
done

echo "keycloak Server is now available. Starting the  services."

# Start the services
exec "$@"
