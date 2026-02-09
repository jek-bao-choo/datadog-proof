# Plan: Payload to Custom Span Tags

## Steps

### Step 1: Modify `pom.xml` — Add OpenTelemetry dependencies (COMPLETED)
- Add `<dependencyManagement>` section with `opentelemetry-bom` version `1.59.0`
- Add `opentelemetry-api` to `<dependencies>`

### Step 2: Create `PayloadToSpanTagsController.java` (COMPLETED)
- Path: `src/main/java/com/jekbao/springboot4dot0dot2__openjdk21__payload2customtags/PayloadToSpanTagsController.java`
- GET `/payload-to-spantags` accepting `@RequestBody Map<String, String>`
- Get current span via `Span.current()`
- Loop through payload entries, call `span.setAttribute(key, value)`
- Return 200 with JSON response on success
- Return 400 if payload is null/empty
- Return 500 on unexpected error

### Step 3: Update `README.md` (COMPLETED)
- Add endpoint documentation section
- Add curl test examples (with and without Datadog agent)

### Step 4: Build and verify (COMPLETED)
- Run `./mvnw clean package` to confirm compilation — BUILD SUCCESS
- Run app and test with curl — 200 OK with 3 tags, 400 on empty payload

### Step 5: Verify `.gitignore` covers build artifacts (COMPLETED)
- `target/`, IDE files, etc. all covered
