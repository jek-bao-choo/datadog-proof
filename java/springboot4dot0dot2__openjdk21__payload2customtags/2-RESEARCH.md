# Research: Payload to Custom Span Tags (OpenTelemetry API)

## Objective

Create a GET endpoint `/payload-to-spantags` in the existing Spring Boot 4.0.2 / OpenJDK 21 app that:
1. Accepts a JSON key-value payload
2. Adds each key-value pair as a custom span tag using the OpenTelemetry API
3. Returns HTTP 200 on success, error status on failure

## Tech Stack Compatibility

| Component | Version | Notes |
|---|---|---|
| Spring Boot | 4.0.2 | Released Jan 22, 2026. Requires Java 17+, supports up to Java 25 |
| OpenJDK | 21 | Fully compatible with Spring Boot 4.0.2 |
| Spring Framework | 7.0.3 | Shipped with Spring Boot 4.0.2 |
| OpenTelemetry API | 1.59.0 (latest BOM) | Only the API artifact is needed (NOT the SDK) |
| dd-trace-java | latest | Provides the OTel SDK implementation at runtime |

**Sources:**
- [Spring Boot 4.0.2 release](https://spring.io/blog/2026/01/22/spring-boot-4-0-2-available-now/)
- [OpenTelemetry BOM on Maven Central](https://mvnrepository.com/artifact/io.opentelemetry/opentelemetry-bom)

---

## How It Works

### Architecture

```
Client (curl/browser)
  |
  | GET /payload-to-spantags  (JSON body: {"key1":"val1","key2":"val2"})
  v
Spring Boot Controller
  |
  | 1. Parse JSON payload into Map<String, String>
  | 2. Get current span via Span.current()
  | 3. For each key-value pair, call span.setAttribute(key, value)
  | 4. Return 200 OK with confirmation
  v
Datadog dd-trace-java agent (with dd.trace.otel.enabled=true)
  |
  | Captures span with custom tags
  v
Datadog APM UI (shows custom tags on the span)
```

### Key Concept: dd-trace-java + OpenTelemetry API

When running with `dd-java-agent.jar` and `-Ddd.trace.otel.enabled=true`:
- The Datadog agent **provides the OpenTelemetry SDK implementation** at runtime
- Your code only needs the **OpenTelemetry API** dependency (compile-time)
- `Span.current()` returns the active span created by dd-trace-java's auto-instrumentation
- `span.setAttribute("key", "value")` adds the tag to the Datadog span

**Sources:**
- [Datadog: Java Custom Instrumentation using the OpenTelemetry API](https://docs.datadoghq.com/opentelemetry/instrument/api_support/java/)
- [Datadog: Tracing Java Applications](https://docs.datadoghq.com/tracing/trace_collection/dd_libraries/java/)

---

## Maven Dependency Changes

Only one new dependency block is needed. We do NOT add the OpenTelemetry SDK (dd-trace-java provides it).

```xml
<!-- Add to <dependencyManagement> (new section) -->
<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>io.opentelemetry</groupId>
            <artifactId>opentelemetry-bom</artifactId>
            <version>1.59.0</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>

<!-- Add to <dependencies> -->
<dependency>
    <groupId>io.opentelemetry</groupId>
    <artifactId>opentelemetry-api</artifactId>
</dependency>
```

---

## Controller Code Pattern

```java
import io.opentelemetry.api.trace.Span;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
public class PayloadToSpanTagsController {

    @GetMapping("/payload-to-spantags")
    public ResponseEntity<Map<String, Object>> addSpanTags(
            @RequestBody Map<String, String> payload) {

        Span span = Span.current();

        for (Map.Entry<String, String> entry : payload.entrySet()) {
            span.setAttribute(entry.getKey(), entry.getValue());
        }

        return ResponseEntity.ok(Map.of(
            "status", "success",
            "tagsAdded", payload.size(),
            "tags", payload
        ));
    }
}
```

---

## Design Decisions

### GET with request body
The task specifies a GET endpoint that accepts a JSON payload. While unconventional (GET typically uses query params), Spring Boot supports `@RequestBody` on GET methods. This works with `curl -X GET -d '{"key":"val"}' -H "Content-Type: application/json"`.

### Error handling
- If the payload is null/empty: return 400 Bad Request
- If `Span.current()` returns a no-op span (no agent running): still succeed but note it in the response
- If an unexpected error occurs: return 500 Internal Server Error

### No-op safety
When the app runs WITHOUT the Datadog agent, `Span.current()` returns a no-op span. Calling `setAttribute()` on a no-op span is safe (does nothing). The endpoint will still work; it just won't produce tags in Datadog.

---

## Files to Create/Modify

| File | Action | Description |
|---|---|---|
| `pom.xml` | MODIFY | Add OpenTelemetry BOM + API dependency |
| `PayloadToSpanTagsController.java` | CREATE | New REST controller |
| `README.md` | MODIFY | Add endpoint docs, curl examples |
| `.gitignore` | CHECK | Already exists, verify coverage |

---

## Testing with curl

```bash
# Basic test (app running locally without Datadog agent)
curl -X GET http://localhost:8080/payload-to-spantags \
  -H "Content-Type: application/json" \
  -d '{"customer.name":"John Doe","order.id":"12345","priority":"high"}'

# Expected response:
# {"status":"success","tagsAdded":3,"tags":{"customer.name":"John Doe","order.id":"12345","priority":"high"}}
```

```bash
# When running with Datadog agent:
java -javaagent:dd-java-agent.jar \
  -Ddd.service=jek-springboot-payload-to-customtag \
  -Ddd.env=jek-sandbox-v1 \
  -Ddd.version=0.0.1 \
  -Ddd.trace.otel.enabled=true \
  -jar target/springboot4dot0dot2__openjdk21__payload2customtags-0.0.1-SNAPSHOT.jar
```

After hitting the endpoint, the custom tags (`customer.name`, `order.id`, `priority`) will appear on the span in the Datadog APM Trace Explorer.
