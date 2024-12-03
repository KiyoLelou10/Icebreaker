# Stage 1: Build Stage
FROM quay.io/keycloak/keycloak:latest as builder

# Enable health and metrics support
ENV KC_HEALTH_ENABLED=true
ENV KC_METRICS_ENABLED=true

# Configure a database vendor
ENV KC_DB=postgres

# Set working directory
WORKDIR /opt/keycloak

# Generate a self-signed certificate (for development only)
RUN keytool -genkeypair \
    -storepass password \
    -storetype PKCS12 \
    -keyalg RSA \
    -keysize 2048 \
    -dname "CN=server" \
    -alias server \
    -ext "SAN:c=DNS:localhost,IP:127.0.0.1" \
    -keystore conf/server.keystore

# Build the Keycloak server
RUN /opt/keycloak/bin/kc.sh build

# Stage 2: Runtime Stage
FROM quay.io/keycloak/keycloak:latest

# Copy the built Keycloak from the build stage
COPY --from=builder /opt/keycloak/ /opt/keycloak/

# Database configuration (replace with your values)
ENV KC_DB=postgres
ENV KC_DB_URL=jdbc:postgresql://postgres:5432/IcebreakerDb
ENV KC_DB_USERNAME=postgresuser
ENV KC_DB_PASSWORD=root
ENV KC_HOSTNAME=localhost

# Entrypoint for Keycloak server
ENTRYPOINT ["/opt/keycloak/bin/kc.sh"]

# Command to run Keycloak in development mode
CMD ["start-dev"]