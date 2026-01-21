## OVERACHING OBJECTIVES:
* Instrument my java app with dd-trace-java and datadog agent.
* Instrument my java app so that it will dynamically collect more error logs when there is an error.

## BACKGROUND:
* A folder named springboot3dot5dot9__tomcat10dot1__openjdk17dot0dot17__logback contains a Java 17 web app using Spring Boot version 3.5.9 with embedded Tomcat version 10.1 that uses openjdk 17.0.17 that uses Maven and SLF4J + Logback for logging implementation

## TASKS:
* Update the ./springboot3dot5dot9__tomcat10dot1__openjdk17dot0dot17__logback/README.md file to include a section call "Datadog dd-trace-java" on steps to add dd-trace-java to the running .jar java app in MacOS and Linux Ubuntu OS. 
* Add instructions to ./springboot3dot5dot9__tomcat10dot1__openjdk17dot0dot17__logback/README.md on log linking - by using the dd-trace-java SDK to inject trace_id and span_id into your logs, Datadog's backend can automatically surface all logs related to a specific error event.
* Add instructions to ./springboot3dot5dot9__tomcat10dot1__openjdk17dot0dot17__logback/README.md on Dynamic Instrumentation for Java using dd-trace-java SDK - by adding "Log Probes" to the running application without redeploying code. The conditions where a probe would turn up the volume of logging based on an error.
* Add instructions to ./springboot3dot5dot9__tomcat10dot1__openjdk17dot0dot17__logback/README.md on Datadog Agent level filtering by configuring the datadog.yaml and setting the Datadog Agent to send more of ERROR and CRITICAL logs. Also send more of "Info" logs during an incident.
* Add instructions to ./springboot3dot5dot9__tomcat10dot1__openjdk17dot0dot17__logback/README.md on manually trigger "more logs" when you catch an exception in Java, you can use the Datadog SDK dd-trace-java to add "Tags" or "Baggage" to the current span. This makes the "lesser" logs much more valuable during an error.
* Explain how Datadog can automatically prioritize the ingestion of logs that are part of an "Error Trace." in the ./springboot3dot5dot9__tomcat10dot1__openjdk17dot0dot17__logback/README.md
* Document instructions on testing these to ./springboot3dot5dot9__tomcat10dot1__openjdk17dot0dot17__logback/README.md
* When adding instructions, please make sure that the instructions are simple and short - don't bloat the instructions before over explaining.


## USE CONTEXT7
* use library /datadog/dd-trace-java for automatic instrumentation and dynamic instrumentation
<!-- * use library /datadog/datadog-api-client-java when prompts indicates that Datadog API Client Java is needed -->
* use library /datadog/datadog-agent when instructions are need for setting up Datadog Agent
<!-- * use library /open-telemetry/opentelemetry-java for reference to OpenTelemetry Java API for custom instrumentation -->


## Implementation should consider:
* **README.md**: Include setup, deployment, verification, and cleanup steps
* **Git Ignore**: Create a .gitignore to avoid committing common Java files or output to Git repo
* **Simplicity**: Keep the Java project really simple
* **PII and Sensitive Data**: Do be mindful that I will be committing the Java project to a public Github repo so do NOT commit private key or secrets.
* **Version compatability**: Ensure versions compatibility across tech stack

## OTHER CONSIDERATIONS:
* Run the project on MacOS bash terminal
* Explain the steps you would take in clear, beginner-friendly language
* Write the research on performing the task
* Keep the Datadog Instrumentation steps simple
* Save the research to `2-RESEARCH.md`