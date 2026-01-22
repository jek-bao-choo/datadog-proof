# Java related environment setup

## Java version control setup

Use SDKMAN! CLI for Gradle, Maven, and Java version control and installation

```
java --version

sdk list java

# at least java 17

sdk install java 17.0.10-tem

sdk default java 17.0.10-tem

java --version

```

---

## JMX = The JVM's built-in metrics system

### How JVM Metrics Work

**JMX (Java Management Extensions)** is the standard Java technology for monitoring and managing applications. The JVM automatically exposes metrics about memory, threads, GC, and class loading via JMX MBeans.

**The Traditional Way (without Actuator):**
- JMX metrics are exposed on JMX ports (requires JMX clients like JConsole or VisualVM)
- Requires opening additional ports and network configuration
- Not HTTP-friendly, difficult to integrate with modern monitoring tools

**Why Spring Boot Actuator?**
Spring Boot Actuator simplifies this by:
1. **Reading JMX metrics** automatically from the JVM
2. **Converting them** to a standard format using Micrometer (metrics facade)
3. **Exposing them via HTTP REST endpoints** (easy to access with curl or monitoring tools)
4. **No additional ports** needed - uses the same port as your application

**In Simple Terms:**
- JMX = The JVM's built-in metrics system
- Actuator = Makes those metrics accessible via simple HTTP URLs
- Instead of needing special JMX tools, you can just `curl http://yourapp/actuator/metrics`

### Checking if JMX is Enabled

**Method 1: Check if JMX Port is Listening**
```bash
# While your Java app is running, check for JMX port (default 9010 or configured port)
netstat -an | grep 9010
# or
lsof -i :9010

# If you see output, JMX is enabled and listening
```

**Method 2: Check JVM Arguments**
```bash
# Look for JMX-related arguments in the running process
ps aux | grep java | grep "jmxremote"

# You'll see flags like:
# -Dcom.sun.management.jmxremote.port=9010
# -Dcom.sun.management.jmxremote.authenticate=false
# -Dcom.sun.management.jmxremote.ssl=false
```

**Method 3: Check Spring Boot Application Logs**
```bash
# Look for management endpoint initialization in logs
grep "management.endpoints" application.log

# Or check if Actuator endpoints are available
curl http://localhost:8080/actuator
```

### Enabling JMX Without Code Changes

**Option 1: Using JVM Arguments (Simplest)**

Add these JVM arguments when starting your application:

```bash
# For local testing
java -Dcom.sun.management.jmxremote \
     -Dcom.sun.management.jmxremote.port=9010 \
     -Dcom.sun.management.jmxremote.local.only=false \
     -Dcom.sun.management.jmxremote.authenticate=false \
     -Dcom.sun.management.jmxremote.ssl=false \
     -jar myapp.jar
```

**Option 2: Using Environment Variables**

Set environment variables:

```bash
# In your shell or Dockerfile ENV
export JAVA_TOOL_OPTIONS="-Dcom.sun.management.jmxremote -Dcom.sun.management.jmxremote.port=9010 -Dcom.sun.management.jmxremote.authenticate=false -Dcom.sun.management.jmxremote.ssl=false"
```

**Option 3: Using application.properties (Without Changing Java Code)**

Create or modify `application.properties` file:

```properties
# Enable JMX (usually enabled by default in Spring Boot)
spring.jmx.enabled=true

# Enable Actuator endpoints
management.endpoints.web.exposure.include=health,metrics,info
management.endpoint.health.show-details=always
management.metrics.enable.jvm=true
```

**Option 4: Using Command Line Properties**

```bash
# Pass properties when running the JAR
java -jar myapp.jar \
  --spring.jmx.enabled=true \
  --management.endpoints.web.exposure.include=health,metrics
```

**Important Note:**
- Traditional JMX (Options 1-2) requires opening JMX ports
- Spring Boot Actuator (Options 3-4) exposes metrics via HTTP - **recommended**
- JMX is enabled by default in Spring Boot, but not exposed remotely by default (security)

### Spring Boot Actuator Setup
Spring Boot Actuator provides production-ready features including metrics, health checks, and monitoring endpoints. For this project, we'll configure it to expose JVM metrics via HTTP endpoints.

**Configuration in `application.properties`:**
```properties
# Server port
server.port=${PORT:8080}

# Actuator endpoints configuration
management.endpoints.web.exposure.include=health,metrics
management.endpoint.health.show-details=always
management.metrics.enable.jvm=true
```

### JVM Metrics Exposed

#### 1. Memory Usage Metrics
- **jvm.memory.used**: Current memory usage (heap and non-heap)
- **jvm.memory.committed**: Memory guaranteed to be available
- **jvm.memory.max**: Maximum memory available
- **jvm.buffer.memory.used**: Buffer pool memory usage
- **jvm.buffer.count**: Number of buffers

**Why Important**: Monitor memory consumption, detect memory leaks, and optimize heap size settings.

#### 2. Garbage Collection Metrics
- **jvm.gc.pause**: GC pause duration and frequency
- **jvm.gc.memory.allocated**: Total memory allocated
- **jvm.gc.memory.promoted**: Memory promoted from young to old generation
- **jvm.gc.live.data.size**: Size of old generation after full GC

**Why Important**: Identify GC pressure, tune GC settings, and optimize application performance.

#### 3. Thread and Concurrency Metrics
- **jvm.threads.live**: Current number of live threads
- **jvm.threads.daemon**: Number of daemon threads
- **jvm.threads.peak**: Peak number of live threads
- **jvm.threads.states**: Thread count by state (runnable, blocked, waiting, etc.)

**Why Important**: Detect thread leaks, monitor thread pool usage, and identify concurrency issues.

#### 4. Class Loading Metrics
- **jvm.classes.loaded**: Number of classes currently loaded
- **jvm.classes.unloaded**: Total number of classes unloaded since JVM start


### Sample Metrics Output Format

**Example: Memory Usage Metric**
```json
{
  "name": "jvm.memory.used",
  "description": "The amount of used memory",
  "baseUnit": "bytes",
  "measurements": [
    {
      "statistic": "VALUE",
      "value": 125829120
    }
  ],
  "availableTags": [
    {
      "tag": "area",
      "values": ["heap", "nonheap"]
    },
    {
      "tag": "id",
      "values": ["G1 Eden Space", "G1 Old Gen", "G1 Survivor Space"]
    }
  ]
}
```

**Example: Thread Count Metric**
```json
{
  "name": "jvm.threads.live",
  "description": "The current number of live threads",
  "baseUnit": "threads",
  "measurements": [
    {
      "statistic": "VALUE",
      "value": 23
    }
  ],
  "availableTags": []
}
```

**Example: GC Pause Metric**
```json
{
  "name": "jvm.gc.pause",
  "description": "Time spent in GC pause",
  "baseUnit": "seconds",
  "measurements": [
    {
      "statistic": "COUNT",
      "value": 12
    },
    {
      "statistic": "TOTAL_TIME",
      "value": 0.034
    },
    {
      "statistic": "MAX",
      "value": 0.005
    }
  ],
  "availableTags": [
    {
      "tag": "action",
      "values": ["end of minor GC", "end of major GC"]
    },
    {
      "tag": "cause",
      "values": ["Allocation Failure", "Metadata GC Threshold"]
    }
  ]
}
```


## JVM Logging: SLF4J vs Logback vs Log4j2

### What They Are

* **SLF4J**
  A *logging API/abstraction*. Your code depends on it, but it does not perform actual logging.

* **Logback**
  A *logging implementation* designed to work natively with SLF4J. Simple, reliable, and the default in many frameworks (e.g., Spring Boot).

* **Log4j2**
  A *logging implementation* (successor to Log4j 1.x) with high throughput and advanced features. Can also be used via SLF4J.



### Key Distinction

* **SLF4J** = Logging API (what you code against)
* **Logback** / **Log4j2** = Logging implementations (what writes the logs)

> Always code against SLF4J and choose your logging implementation at runtime.


### When to Use Which

#### SLF4J

* Always use as your logging API.
* Decouples code from the logging backend.
* Allows implementation swaps without code changes.



#### Logback (Recommended Default)

**Use when:**

* You want a simple, reliable logger.
* Using Spring Boot or moderate logging needs.
* You prefer easy configuration.

**Use cases**

* Most microservices
* Standard app logging
* Structured logs (JSON or text)



#### Log4j2 (Advanced / High Performance)

**Use when:**

* Logging performance and throughput matter.
* You need advanced routing or async behavior.
* Operational complexity is acceptable.

**Use cases**

* High-volume services
* Latency-sensitive systems
* Complex routing/filtering


### Practical Rules

* Application code → **SLF4J API**
* Implementation choice → **Logback** or **Log4j2**
* Do *not* mix multiple logging implementations
* Validate async behavior under load if used



### Decision Guide

* Default service → **SLF4J + Logback**
* High throughput / advanced features → **SLF4J + Log4j2**
* Shared library → **SLF4J only**




---




## Use Spring Initializr for Springboot app

Creating a Java 17 web application with Spring Boot 3.5.x is a modern, streamlined process. Spring Boot 3.x is designed to work with Java 17 as a minimum requirement and utilizes Jakarta EE 10, which includes **Tomcat 10.1** by default.


### 1. Initialize the Project

The easiest way to start is via [Spring Initializr](https://start.spring.io/). Use the following settings:

* **Project:** Maven or Gradle (Maven is used for this example)
* **Language:** Java
* **Spring Boot:** 3.5.x (Choose the latest 3.5.x version available)
* **Java:** 17
* **Dependencies:** Spring Web

Once generated, download the ZIP, extract it, and open it in your IDE (IntelliJ, VS Code, or Eclipse).


### 2. Configure the `pom.xml` (Maven)

Spring Boot manages dependencies via its "Parent" POM. This ensures that when you specify Spring Boot 3.5.9, the compatible version of Tomcat (10.1.x) is pulled in automatically.

```xml
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>3.5.9</version> <relativePath/>
</parent>

<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
</dependencies>

<properties>
    <java.version>17</java.version>
</properties>

```


### 3. Understand the Architecture

Spring Boot's "fat JAR" approach means the web server (Tomcat) is packaged inside your application, not the other way around.

### 4. Create a Simple REST Controller

To verify the app is working, create a controller class in your base package (e.g., `com.example.demo.HelloController`).

```java
package com.example.demo;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {

    @GetMapping("/")
    public String index() {
        return "Spring Boot 3.5.9 is running on Tomcat 10.1 with Java 17!";
    }
}

```


### 5. Run the Application

You can run the application directly from your IDE or via the terminal:

```bash
./mvnw spring-boot:run

```

**Verification:**

* Check the console logs. You should see a line similar to:
`o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat initialized with port(s): 8080 (http)`
* Open your browser and navigate to `http://localhost:8080`.


### Key Compatibility Notes

| Component | Version Requirement |
| --- | --- |
| **Jakarta EE** | Spring Boot 3 uses **Jakarta EE 10** (Namespace `jakarta.*` instead of `javax.*`). |
| **Tomcat 10.1** | This version is the first to support Jakarta EE 10 and is the default for Spring Boot 3. |
| **Java 17** | This is the baseline. You cannot run Spring Boot 3 on Java 8 or 11. |

---
