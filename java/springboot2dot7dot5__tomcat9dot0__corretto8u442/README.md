# Spring Boot Java 8 Web Application

## Overview
A simple Spring Boot 2.7.5 web application with embedded Tomcat 9.0, built with Maven and Java 8.

## Features
- REST API with 3 endpoints (GET, POST, PUT)
- Comprehensive logging
- Executable JAR deployment
- cURL testing examples

## Prerequisites
- OpenJDK 8u422 or compatible Java 8 JDK
- Maven 3.6.x or higher

## Quick Start

### 1. Clone/Download Project
```bash
cd springboot2dot7dot5__tomcat9dot0__corretto8u442
```

### 2. Build Application
```bash
mvn clean package
```

### 3. Run Application
```bash
java -jar target/springboot2dot7dot5__tomcat9dot0__corretto8u442-0.0.1-SNAPSHOT.jar
```

### 4. Test Endpoints
The application will start on http://localhost:8080

## API Endpoints

### GET /api/data
Returns dummy data with random number
```bash
curl -X GET http://localhost:8080/api/data -H "Content-Type: application/json" -v
```

### POST /api/submit  
Accepts JSON payload
```bash
curl -X POST http://localhost:8080/api/submit \
  -H "Content-Type: application/json" \
  -d '{"data": "test payload"}' -v
```

### PUT /api/status
Returns status information
```bash
curl -X PUT http://localhost:8080/api/status -H "Content-Type: application/json" -v
```

## Testing
Run the provided test script:
```bash
./test-endpoints.sh
```

## Logging
- Console logs: Visible during application startup and runtime
- Log file: `app.log` (optional)
- View logs: `tail -f app.log` (MacOS/Linux)

## Build Commands
- `mvn spring-boot:run` - Run application directly
- `mvn clean package` - Build executable JAR
- `mvn clean` - Clean build artifacts
- `mvn test` - Run tests

## Stopping Application
- Press Ctrl+C in terminal
- Or send SIGTERM signal: `kill <process_id>`

## Datadog's dd-trace-java
To download the latest build of a specific major version, use the https://dtdg.co/java-tracer-vX link instead, where X is the desired major version. For example, use https://dtdg.co/java-tracer-v1 for the latest version 1 build. Minor version numbers must not be included. Alternatively, see Datadog’s Maven repository https://repo1.maven.org/maven2/com/datadoghq/dd-java-agent/ for any specific version.