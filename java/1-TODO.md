## TASK:
* Create a Java 8 web app using Spring Boot with embedded Tomcat 
* Use OpenJDK 8u422 or similar
* Ensure versions compatibility across tech stack
* Use Gradle build tool integration
* Create executable JAR file deployment
* Contain 3 API endpoints:
* First endpoint GET that returns some dummy data with random number and writes to the log with every call
* Second endpoint POST that writes to the log with every call
* Third endpoint PUT that will return status code followed by writes to the log with every call
* Document instructions on testing these three endpoints using curl commands

## USE CONTEXT7
- use library /context7/gradle?tokens=5000
- use library /context7/spring_io-spring-boot
- use library /context7/tomcat_apache-tomcat-9.0-doc
- use library /openjdk/jdk?tokens=5000
- use playwright mcp library /microsoft/playwright-java for testing the java app

## Implementation should consider:
- **README.md**: Include setup, deployment, verification, and cleanup steps
- **Git Ignore**: Create a .gitignore to avoid committing common Python files or output to Git repo
- **Simplicity**: Keep the Python project really simple
- **PII and Sensitive Data**: Do be mindful that I will be committing the Python project to a public Github repo so do NOT commit private key or secrets.

## OTHER CONSIDERATIONS:
- My computer is a Macbook
- My development tools are iTerm2, tmux, Claude Code, and Visual Studio Code
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