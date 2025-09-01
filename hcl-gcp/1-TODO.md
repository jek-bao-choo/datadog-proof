## TASK:
- Create a terraform project in the folder gke1dot32__standard to setup a GKE version 1.32 cluster on standard mode.
- set it up in Asia Southeast region
- Create a Nginx deployment for testing that it works
- Keep it simple
- Think hard


<!-- ### Access & Authentication:
- **SSH Key**: key name in cloud provider, it is called jek-macbook-pro-key in cloud provider
- **SSH Locally**: when ssh use ~/.ssh/id_ed25519
- **IP Addresses**: [current IP of the EC2 for SSH access, do auto-detection such as curl to an address to get it] -->

<!-- ## EXAMPLES:
- [List any example files in the examples folders and explain how they should be used if any] -->

<!-- ## DOCUMENTATION: -->

## USE CONTEXT7
- - use library id /googlecloudplatform/terraformer
- use library id /hashicorp/terraform 
- use library id /hashicorp/hcl
- use library id /terraform-docs/terraform-docs 
- use library id /hashicorp/terraform-mcp-server 


## Implementation should consider:
- **Naming Convention**: All resources use "jek-" prefix with tags: owner="jek", env="test"
- **Resource naming**: [prefix-resourcename, e.g., "jek-"]
- **Tagging**: [required tags, e.g., owner="jek", env="test"]
- **README.md**: Include setup, deployment, verification, and teardown steps
- **Git Ignore**: Create a .gitignore to avoid committing sensitive terraform files or output to Git repo
- **Simplicity**: Keep the terraform script really simple
- **Teardown**: Document the steps to run the terraform script to README.md including tear down steps
- **PII and Sensitive Data**: Do be mindful that I will be committing the script to a public Github repo

## OTHER CONSIDERATIONS:
- My computer is a Macbook
- I'm running Claude Code through the terminal
- Explain the steps you would take in clear, beginner-friendly language
- Write the research on performing the task
- Save the research to `2-RESEARCH.md`


