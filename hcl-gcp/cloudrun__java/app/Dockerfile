# Stage 1: Build the application
FROM maven:3.9-eclipse-temurin-17 AS builder

WORKDIR /app

# Copy pom.xml and download dependencies (cached layer)
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy source code and build
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Create runtime image (using Debian for Datadog compatibility)
FROM eclipse-temurin:17-jre

WORKDIR /app

# Copy JAR from builder stage
COPY --from=builder /app/target/cloudrun-demo-1.0.0.jar app.jar

# Download Datadog Java tracer
ADD 'https://github.com/DataDog/dd-trace-java/releases/download/v1.56.0/dd-java-agent-1.56.0.jar' /app/dd-java-agent.jar

# Set Datadog related Environment variables
# Verify DD_SITE is correct (already set in Dockerfile)
# DD_SITE=datadoghq.com (default)
# For EU: DD_SITE=datadoghq.eu
ENV DD_SITE=datadoghq.com \
  DD_SERVICE=jek-cloudrun-java \
  DD_ENV= testv3 \
  DD_SOURCE=java \
  DD_LOGS_ENABLED=true \
  DD_LOGS_INJECTION=true \
  DD_TRACE_ENABLED=true

# Cloud Run sets PORT environment variable
ENV PORT=8080

# Expose port (documentation only, Cloud Run manages this)
EXPOSE 8080

# Add Datadog agent
COPY --from=datadog/serverless-init:1.8.2 /datadog-init /app/datadog-init

# Run the application with Datadog wrapper and Java agent
ENTRYPOINT ["/app/datadog-init"]
CMD ["java", "-javaagent:/app/dd-java-agent.jar", "-jar", "app.jar"]
