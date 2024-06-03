# Stage 1: Build the Angular application
FROM node:16-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ARG KEYCLOAK_HOSTNAME
ARG API_HOSTNAME
RUN npm run build -- --configuration production

# Stage 2: Serve the Angular application with Nginx
FROM nginx:alpine

COPY --from=build /app/dist/phoenixfront /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
