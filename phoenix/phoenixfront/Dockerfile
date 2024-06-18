# Stage 1: Build the Angular application
FROM node:current-alpine as build

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Increase npm timeout and install dependencies
## ENV NPM_CONFIG_TIMEOUT=100000
RUN npm install

# Copy the rest of the application source code
COPY . .

# Replace environment variables in the environment.prod.ts file
## ARG API_GATEWAY
## ARG KEYCLOAK

## RUN sed -i "s|API_GATEWAY_PLACEHOLDER|${API_GATEWAY}|g" src/environments/environment.prod.ts && \
   ##  sed -i "s|KEYCLOAK_PLACEHOLDER|${KEYCLOAK}|g" src/environments/environment.prod.ts && \
    ## sed -i "s|API_GATEWAY_PLACEHOLDER|${API_GATEWAY}|g" src/environments/environment.ts && \
    ## sed -i "s|KEYCLOAK_PLACEHOLDER|${KEYCLOAK}|g" src/environments/environment.ts

# Build the Angular application
RUN npm run build -- --configuration production

# Stage 2: Serve the Angular application with Nginx
FROM nginx:alpine

# Copy built Angular application from the build stage to Nginx
COPY --from=build /app/dist/phoenixfront /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf
