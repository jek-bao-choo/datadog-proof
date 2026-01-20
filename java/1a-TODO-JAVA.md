## TASKS:
* A folder named springboot3dot5dot9__tomcat10dot1__openjdk17dot0dot17__logback contains a Java 17 web app using Spring Boot version 3.5.9 with embedded Tomcat version 10.1 that uses openjdk 17.0.17 that uses Maven
* Use SLF4J + Logback for logging implementation
* Create 3 API endpoints:
* First endpoint GET that returns some dummy data with 5 digits random number and writes to the log with every call. It logs to the console.
* Second endpoint POST that writes to the log with every call. It logs to the SyslogAppender.
* Third endpoint PUT that will return status code followed by writes to the log with every call. It logs to the FileAppender.
* Every endpoint will have a 30% chance of returning 2XX status code, 40% chance of returning a 4XX status code, and 30% chance of returning a 5XX status code. 
* Use Playwright Java MCP to test the Java app whenever viable.
* Document instructions on testing these three endpoints using curl commands to README.md
* Document instructions on running the app to README.md
* Document instructions on packaging the executable JAR file deployment as well as running it in a Linux Ubuntu machine details to README.md


## USE CONTEXT7
- use library /context7/gradle?tokens=5000
- use library /context7/spring_io-spring-boot
- use library /context7/tomcat_apache_tomcat-10_1-doc
- use library /openjdk/jdk?tokens=5000
- use library /microsoft/playwright-java for testing the java app


## Implementation should consider:
- **README.md**: Include setup, deployment, verification, and cleanup steps
- **Git Ignore**: Create a .gitignore to avoid committing common Java files or output to Git repo
- **Simplicity**: Keep the Java project really simple
- **PII and Sensitive Data**: Do be mindful that I will be committing the Java project to a public Github repo so do NOT commit private key or secrets.
- **Version compatability**: Ensure versions compatibility across tech stack

## OTHER CONSIDERATIONS:
- Run the project on MacOS bash terminal
- Explain the steps you would take in clear, beginner-friendly language
- Write the research on performing the task
- Save the research to `2-RESEARCH.md`

<!-- #### Alternatives to Apache Tomcat (as traditional deployment):
1. **Embedded Servers (with Spring Boot)**:
   - Jetty (lightweight, embeddable)
   - Undertow (high-performance, non-blocking)

2. **Standalone Servers**:
   - Apache Tomcat (traditional deployment)
   - Eclipse Jetty
   - WildFly (full Java EE)
   - GlassFish (Oracle's Java EE reference)
   - Oracle WebLogic
   - Red Hat JBoss Enterprise Application Platform
   - IBM WebSphere

3. **Container/Cloud Deployment**:
   - Docker containers
   - Kubernetes deployments
   - Cloud platforms (AWS, Azure, Google Cloud) -->