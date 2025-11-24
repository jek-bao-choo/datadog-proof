# Stage 1: Build the application
FROM maven:3.9-eclipse-temurin-17 AS builder

WORKDIR /app

# Copy pom.xml and download dependencies (cached layer)
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy source code and build
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Create runtime image
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copy JAR from builder stage
COPY --from=builder /app/target/cloudrun-demo-1.0.0.jar app.jar

# Cloud Run sets PORT environment variable
ENV PORT=8080

# Expose port (documentation only, Cloud Run manages this)
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
