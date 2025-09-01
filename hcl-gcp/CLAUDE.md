# IaC Terraform .hcl Script Development

## About
IaC Terraform .hcl script developments for Google Cloud Platform

## Structure
- Shallow directories, avoid deep nesting
- Naming: `<technology><version if exists>__<variant><version if exists>`
- Example: `gke1dot32__standard`, `gce__ubuntu22`, `gke1dot32__autopilot`, `gce-rhel9`, `cloudsql-postgres15`

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