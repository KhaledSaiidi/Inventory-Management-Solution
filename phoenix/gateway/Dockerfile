# Use an official OpenJDK 17 runtime as a parent image
FROM openjdk:17-jdk-slim

# Set the working directory in the container
WORKDIR /app

# Copy the built jar file
COPY target/gateway-*.jar /app/gateway.jar

# Define environment variables
ENV CONFIG_HOST=${CONFIG_HOST}

# Expose the port on which the app runs
EXPOSE 9000

# Run the jar file
ENTRYPOINT ["java", "-jar", "/app/gateway.jar"]
