# Stage 1: Build the Angular application
FROM node:16-alpine AS build

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Increase npm timeout and install dependencies
ENV NPM_CONFIG_TIMEOUT=100000
RUN npm install

# Copy the rest of the application source code
COPY . .

# Build the Angular application
RUN npm run build -- --configuration production

# Stage 2: Serve the Angular application with Nginx
FROM nginx:alpine

# Remove default Nginx configuration
## RUN rm /etc/nginx/conf.d/default.conf

# Copy custom Nginx configuration
COPY default.conf /etc/nginx/conf.d/default.conf

# Copy built Angular application from the build stage to Nginx
COPY --from=build /app/dist/phoenixfront /usr/share/nginx/html


# Copy the env.template.js file and replace placeholders with environment variable values
COPY env.template.js /usr/share/nginx/html/env.template.js
RUN sh -c "envsubst < /usr/share/nginx/html/env.template.js > /usr/share/nginx/html/env.js"

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
