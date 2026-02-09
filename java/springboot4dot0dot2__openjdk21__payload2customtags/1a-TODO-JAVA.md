## TASKS:
* Create an endpoint called /payload-to-spantags of this Java Springboot app, enable GET request by accepting a payload. 
* The payload is a JSON key value pair.
* After which, add the payload key value pair as custom spans tag using the OpenTelemetry API for Java https://docs.datadoghq.com/opentelemetry/instrument/dd_sdks/api_support/?platform=traces&prog_lang=java 
* Return 200 HTTP status if the operation is successful otherwise return error status.
* Use Playwright Java MCP to test the Java app whenever viable.


## USE CONTEXT7
- use library /context7/gradle?tokens=5000
- use library /context7/spring_io-spring-boot
<!-- - use library /context7/tomcat_apache_tomcat-10_1-doc -->
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