# Super App Development

## About
Multi-service super app (Transport, Banking, Payments) with Grab/Uber/GoJek-style UI. 
Reference: mobile-app-ui-reference.jpg

## Architecture
- **iOS/Android Shell**: Native container with navigation
- **Service Web Apps**: Separate web apps via WebView
- **Backend**: Independent microservices per service

## Tech Stack
- **Web**: Next.js, Angular, React
- **Backend**: Java, PHP, Node.js, Go
- **Infrastructure**: Docker/Ubuntu/AIX/IBM i
- **Database**: PostgreSQL, MySQL, OracleDB
- **IaC**: Terraform when applicable

## Structure
- Shallow directories, avoid deep nesting
- Naming: `[service]-[framework]-v[version]`
- Example: `banking-nextjs-v14`

## Workflow
1. **Research**: Create `2-RESEARCH.md` implementation plan
2. **Review**: Wait for user approval
3. **Plan**: Create detailed `3-PLAN.md` with atomic steps
4. **Implement**: Execute step-by-step, mark "(COMPLETED)"

## Guidelines
- Keep simple (Hello World level)
- Assume no prior dev knowledge
- Small, atomic steps
- Individual tests only
- Wait for explicit approval between phases
- Independent services