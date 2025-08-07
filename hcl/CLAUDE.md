# Terraform Script Development

## About
Terraform scripts development project

## Structure
- Shallow directories, avoid deep nesting
- Naming: `[vm-product]-[os]-v[os-version]`
- Example: `ec2-ubuntu-v24`, `azurevm-fedora-v40`, `gce-ubuntu-v24`

## Workflow
1. **Research**: Create `2-RESEARCH.md` implementation plan
2. **Review**: Wait for user approval
3. **Plan**: Create detailed `3-PLAN.md` with atomic steps
4. **Implement**: Execute step-by-step, mark "(COMPLETED)"

## Guidelines
- Keep simple (Hello World level)
- Assume no prior Terraform knowledge
- Small, atomic steps
- Individual tests only
- Wait for explicit approval between phases
- Focus and independence per script segment