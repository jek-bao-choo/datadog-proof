# .NET App Development

## About
- This folder contains multiple standalone .NET applications such .NET Framework 4.6.1, .NET Core 2.1, .NET 5

## Structure
- Shallow directories, avoid deep nesting
- Naming: `<framework><version>__<targetIdentifier>`
- Example: `net8dot0__kestrel__linux`, `net9dot0__maui__ios`, `netfw4dot8dot1__winforms`, `net8dot0__wpf__win__x64`, `netstandard2-1__library`

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