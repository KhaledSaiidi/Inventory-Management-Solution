# Stage 1: Build the Angular application
FROM node:16-alpine AS build

WORKDIR /app

COPY package*.json ./

# Increase npm timeout
ENV NPM_CONFIG_TIMEOUT=100000

RUN npm install

COPY . .


RUN npm run build -- --configuration production

# Stage 2: Serve the Angular application with Nginx
FROM nginx:alpine

COPY --from=build /app/dist/phoenixfront /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
