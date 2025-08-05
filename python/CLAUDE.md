# Python App Development

## About
This folder is used to develop multiple python server applications

## Project Directory
- Keep structure shallow, avoid deeply nested folders
- Naming convention: `[framework name]-v[framework version]-[python implementation]-v[python version]` for example `fastapi-v0dot116-cpython-v3dot9dot6`, `flask-v3dot1-graalpy-v3dot8dot5`, and `django-v5dot2-pypy-v3dot11dot13`

## Preference
- Use uv https://github.com/astral-sh/uv whenever relevant 
- Get started example:
```bash
# For example to init
uv init -p 3.9.6 fastapi-v0dot116-cpython-v3dot9dot6
cd fastapi-v0dot116-cpython-v3dot9dot6

# Create a virtual environment with Python 3.9.6
uv venv .venv

# Activate it to work in the project
source .venv/bin/activate

# Check the python version and python implementation
(venv) $ python -c "import platform, sys; print(f'Implementation:\t{platform.python_implementation()}'); print(f'Version:\t{platform.python_version()}'); print(f'CPU Architecture:\t{platform.machine()} ({platform.architecture()[0]})'); print(f'Compiler:\t{platform.python_compiler()}');"

# For example use uv add 
(venv) $ uv add "fastapi=0.116.1"

# On clean up
(venv) $ deactivate
```
- Document the steps that I need to run the application in README.md, explain the steps clearly

## Workflow Process
1. **Research Phase**: Create high-level implementation plan in `2-RESEARCH.md`
2. **Review Phase**: Wait for user review and feedback on the `2-RESEARCH.md`
3. **Detailed Planning**: After user approval of `2-RESEARCH.md`, create a detailed implementation plan with detailed atomic stages in `3-PLAN.md`
4. **Implementation Phase**: Implement `3-PLAN.md` step-by-step on a new branch and mark steps as "(COMPLETED)" in `3-PLAN.md` after each item and each step are completed

## Guidelines
- Keep everything simple (Hello World level)
- Keep explanations simple and assume no prior development knowledge
- Break down tasks into small, manageable atomic steps
- Run individual tests, not full test suites
- Verify functionality after code changes
- Wait for explicit user approval before moving to the next phase
- Each service should be focused and independent