# Terraform Script Development

## About
This project is used to develop terraform scripts

## Project Directory
- Keep structure shallow, avoid deeply nested folders
- Naming convention: `[virtual machines product name such as ec2, azurevm and gce]-[operating system such as ubuntu, fedora]-v[version of the operating system]`
- Example: `ec2-ubuntu-v24`, `azurevm-ubuntu-v24`, `gce-ubuntu-v24`

## Workflow Process
1. **Research Phase**: Create high-level implementation plan in `2-RESEARCH.md`
2. **Review Phase**: Wait for user review and feedback on the `2-RESEARCH.md`
3. **Detailed Planning**: After user approval of `2-RESEARCH.md`, create a detailed implementation plan with detailed atomic stages in `3-PLAN.md`
4. **Implementation Phase**: Implement `3-PLAN.md` step-by-step on a new branch and mark steps as "(COMPLETED)" in `3-PLAN.md` after each item and each step are completed

## Guidelines
- Keep the terraform script as simple as possible (Hello World level)
- Keep explanations simple and assume no prior terraform knowledge
- Break down tasks into small, manageable atomic steps
- Run individual tests, not full test suites
- Verify functionality after code changes
- Wait for explicit user approval before moving to the next phase
- Each portion or segment of the script should be focused and independent