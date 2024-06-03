FROM adoptopenjdk/openjdk17:alpine-slim

# Set the working directory in the container
WORKDIR /opt/app

# Copy the Quarkus Keycloak project build output to the container
COPY . /opt/app

# Expose the port
EXPOSE 8080

# Set the environment variable for MySQL host
ENV MYSQL_HOST=${MYSQL_HOST}

# Define the command to run the Quarkus Keycloak project
CMD ["./bin/standalone.sh", "-b", "0.0.0.0", "-Dquarkus.http.host=0.0.0.0", "-Dquarkus.datasource.jdbc.url=jdbc:mariadb://${MYSQL_HOST}:3306/keycloakDB"]
