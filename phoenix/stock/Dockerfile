# Use an official OpenJDK 17 runtime as a parent image
FROM openjdk:17-jdk-slim

# Install curl
RUN apt-get update && apt-get install -y curl

# Set the working directory in the container
WORKDIR /app

# Copy the built jar file
COPY target/*.jar /app/stock.jar

# Copy the wait-for scripts
COPY wait-for-eureka.sh /usr/local/bin/wait-for-eureka.sh
COPY wait-for-keycloak.sh /usr/local/bin/wait-for-keycloak.sh
COPY wait-for-config.sh /usr/local/bin/wait-for-config.sh
COPY wait-for-gateway.sh /usr/local/bin/wait-for-gateway.sh

# Make the scripts executable
RUN chmod +x /usr/local/bin/wait-for-eureka.sh
RUN chmod +x /usr/local/bin/wait-for-keycloak.sh
RUN chmod +x /usr/local/bin/wait-for-config.sh
RUN chmod +x /usr/local/bin/wait-for-gateway.sh


# Run the jar file
ENTRYPOINT ["sh", "-c", "/usr/local/bin/wait-for-eureka.sh && /usr/local/bin/wait-for-keycloak.sh && /usr/local/bin/wait-for-config.sh && /usr/local/bin/wait-for-gateway.sh && exec java -jar /app/stock.jar"]