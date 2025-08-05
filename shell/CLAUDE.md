# Shell Script Development

## About
This project is used to develop shell scripts

## Project Directory
- Keep structure shallow, avoid deeply nested folders
- Naming convention: `[verb such as send, post, etc...]-[purpose such as test logs, custom metrics, etc...]`
- Example: `send-test-logs`, `send-test-spans`, `send-custom-metrics`

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