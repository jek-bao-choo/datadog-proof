# Bicep IaC Script Development

## About
- This folder contains multiple standalone Bicep IaC scripting projects

## Structure
- Shallow directories, avoid deep nesting
- Naming: `<os>__<feature-or-runtime>`
- Example: `ws2016-base`, `ubuntu2204-base`, `ws2022-dotnetfx48`

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
- Focus and independence per app