#!/bin/bash

# Tag the images with the new repository names
docker tag phoenix-frontapp khaledunistock/universal-frontapp:latest
docker tag phoenix-stock-service khaledunistock/universal-stock-service:latest
docker tag phoenix-notification-service khaledunistock/universal-notification-service:latest
docker tag phoenix-keycloakuser-service khaledunistock/universal-keycloakuser-service:latest
docker tag phoenix-api-gateway khaledunistock/universal-api-gateway:latest
docker tag phoenix-configserver khaledunistock/universal-configserver:latest
docker tag phoenix-server-discovery khaledunistock/universal-server-discovery:latest

# Log in to Docker Hub

# Push the tagged images to Docker Hub
docker push khaledunistock/universal-frontapp:latest
docker push khaledunistock/universal-stock-service:latest
docker push khaledunistock/universal-notification-service:latest
docker push khaledunistock/universal-keycloakuser-service:latest
docker push khaledunistock/universal-api-gateway:latest
docker push khaledunistock/universal-configserver:latest
docker push khaledunistock/universal-server-discovery:latest

