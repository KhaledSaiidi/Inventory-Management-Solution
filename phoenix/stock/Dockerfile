# Use an official OpenJDK 17 runtime as a parent image
FROM openjdk:17-jdk-slim

# Set the working directory in the container
WORKDIR /app

# Copy the built jar file
COPY target/stock-*.jar /app/stock.jar

# Define environment variables
ENV CONFIG_HOST=${CONFIG_HOST}

# Run the jar file
ENTRYPOINT ["java", "-jar", "/app/stock.jar"]
