#!/bin/sh

# Replace placeholder with actual environment variable value
sed -i "s|__KEYCLOAK_URL__|${KEYCLOAK_URL}|g" /usr/share/nginx/html/main.*.js

# Start Nginx
nginx -g 'daemon off;'
