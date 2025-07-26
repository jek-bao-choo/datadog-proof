# Super App Development

## About
A super app with multiple services (Transport, Banking, Mobile Payment, etc.) that looks like the UI of Grab, Uber, or GoJek. Refer to image as mockup: ![image mobile-app-ui-reference.jpg](mobile-app-ui-reference.jpg).

## Architecture
- **iOS Shell**: Native app container with navigation
- **Service Web Apps**: Each service is a separate web app rendered via WebView
- **Backend**: Independent microservices for each service

## Tech Stack
- **Web Apps**: Next.js, Angular, React, or similar
- **Backend**: Java, PHP, Node.js, Go, or other frameworks
- **Infrastructure**: Docker containers or Ubuntu/AIX/IBM i systems
- **Databases**: PostgreSQL, MySQL, OracleDB, or other databases
- Recommend the use of Terraform scripts whenever it makes sense to automate
- Specific technologies and versions defined per user prompt

## Project Directory
- Keep structure shallow, avoid deeply nested folders
- Naming convention: `[service-name]-[framework]-v[version]`
- Example: `banking-nextjs-v14`, `transport-spring-v3`

## Guidelines
- Keep everything simple (as simple as Hello World examples) - iOS app, web apps, and backends
- Run individual tests, not full test suites
- Verify functionality after code changes
- Each service should be focused and independent

## Workflow Process
1. **Planning Phase**: Create high-level implementation plan in `PLAN.md`
2. **Review Phase**: Wait for user review and feedback on the plan
3. **Detailed Planning**: After approval, create detailed implementation plan with atomic stages
4. **Implementation Phase**: Implement the plan step-by-step on a new branch (when user is ready)

## Guidelines
- Keep explanations simple and assume no prior iOS development knowledge
- Break down tasks into small, manageable atomic steps
- Wait for explicit user approval before moving to the next phase
- Focus on creating a working "Hello World" iOS app as simply as possible