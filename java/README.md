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
