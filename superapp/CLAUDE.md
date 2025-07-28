# Super App Development

## About
A super app with multiple services (Transport, Banking, Mobile Payment, etc.) that looks like the UI of Grab, Uber, or GoJek. Refer to image as mockup: ![image mobile-app-ui-reference.jpg](mobile-app-ui-reference.jpg).

## Architecture
- **iOS or Android Shell**: Native app container with navigation
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

## Workflow Process
1. **Research Phase**: Create high-level implementation plan in `2-RESEARCH.md`
2. **Review Phase**: Wait for user review and feedback on the `2-RESEARCH.md`
3. **Detailed Planning**: After user approval of `2-RESEARCH.md`, create a detailed implementation plan with detailed atomic stages in `3-PLAN.md`
4. **Implementation Phase**: Implement `3-PLAN.md` step-by-step on a new branch and mark steps as "(COMPLETED)" in `3-PLAN.md` after each item and each step are completed

## Guidelines
- Keep everything simple (Hello World level) - iOS app, web apps, and backends
- Keep explanations simple and assume no prior development knowledge
- Break down tasks into small, manageable atomic steps
- Run individual tests, not full test suites
- Verify functionality after code changes
- Wait for explicit user approval before moving to the next phase
- Each service should be focused and independent