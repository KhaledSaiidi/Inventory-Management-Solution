FROM quay.io/keycloak/keycloak:21.1.1

# Set the working directory in the container
WORKDIR /opt/keycloak

# Copy the Quarkus Keycloak project build output to the container
COPY . /opt/keycloak
COPY bin/kc.sh /opt/app/bin/kc.sh

# Expose the port
EXPOSE 8080

# Set the environment variable for MySQL host
ENV MYSQL_HOST=${MYSQL_HOST}

# Define the command to run the Quarkus Keycloak project
CMD ["/opt/keycloak/bin/kc.sh", "-b", "0.0.0.0", "-Dquarkus.http.host=0.0.0.0", "-Dquarkus.datasource.jdbc.url=jdbc:mariadb://${MYSQL_HOST}:3306/keycloakDB"]
