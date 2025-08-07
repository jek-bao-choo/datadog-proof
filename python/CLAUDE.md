# Python App Development

## About
Multiple Python server applications

## Structure
- Shallow directories, avoid deep nesting
- Naming: `[framework]-v[version]-[implementation]-v[python-version]`
- Example: `fastapi-v0dot116-cpython-v3dot9dot6`

## Preference
- Use uv https://github.com/astral-sh/uv
- Quick start:
```bash
uv init -p 3.9.6 fastapi-v0dot116-cpython-v3dot9dot6
cd fastapi-v0dot116-cpython-v3dot9dot6
uv venv .venv
source .venv/bin/activate
uv add "fastapi=0.116.1"
deactivate  # cleanup
```
- Document steps in README.md

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