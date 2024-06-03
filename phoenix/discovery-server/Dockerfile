# Use an official OpenJDK 17 runtime as a parent image
FROM openjdk:17-jdk-slim

# Set the working directory in the container
WORKDIR /app

# Copy the built jar file
COPY target/discovery-server-*.jar /app/discovery-server.jar

# Define environment variables
ENV CONFIG_HOST=${CONFIG_HOST}

# Expose the port on which the app runs
EXPOSE 8761

# Run the jar file
ENTRYPOINT ["java", "-jar", "/app/discovery-server.jar"]
