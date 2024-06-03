# Use an official OpenJDK 17 runtime as a parent image
FROM openjdk:17-jdk-slim

# Set the working directory in the container
WORKDIR /app

# Copy the built jar file
COPY target/config-server-*.jar /app/config-server.jar

# Define environment variables
ENV EUREKA_INSTANCE_HOSTNAME=${eureka.instance.hostname}
ENV KEYCLOAK_ISSUER=${KEYCLOAK_ISSUER}
ENV KAFKA_HOST=${KAFKA_HOST}
ENV MYSQL_HOST=${MYSQL_HOST}

# Expose the port on which the app runs
EXPOSE 8888

# Run the jar file
ENTRYPOINT ["java", "-jar", "/app/config-server.jar"]