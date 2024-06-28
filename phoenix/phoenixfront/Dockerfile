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

# Build the Angular application
RUN npm run build -- --configuration production

# Stage 2: Serve the Angular application with Nginx
FROM nginx:alpine

# Copy built Angular application from the build stage to Nginx
COPY --from=build /app/dist/phoenixfront /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the custom script
COPY replace-env.sh /usr/share/nginx/html/replace-env.sh

# Ensure the script is executable
RUN chmod +x /usr/share/nginx/html/replace-env.sh

# Set the script as the entrypoint
ENTRYPOINT ["/usr/share/nginx/html/replace-env.sh"]
