# Dockerfile Development

## About
Dockerfile development for containerizing applications

## Structure
- Shallow directories, avoid deep nesting
- Naming: `<primaryTechStack><techStackVersion>__<secondaryTechStack><techStackVersion>`
- Example: `dogstatsd__datadogagent7dot68dot3`

## Workflow
1. **Research**: Create `2-RESEARCH.md` implementation plan
2. **Review**: Wait for user approval
3. **Plan**: Create detailed `3-PLAN.md` with atomic steps
4. **Implement**: Execute step-by-step, mark "(COMPLETED)"

## Guidelines
- Keep simple (Hello World level)
- Assume no prior Docker knowledge
- Small, atomic steps
- Individual tests only
- Wait for explicit approval between phases