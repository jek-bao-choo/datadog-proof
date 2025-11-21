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

## DO
- Keep it simple like Hello World level
- Keep the code short and concise
- Assume no prior Terraform knowledge
- Provide small, atomic steps
- Provide individual tests
- Wait for explicit approval between phases