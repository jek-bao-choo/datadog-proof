## TASK:
- Create a terraform script in the folder ec2-mysql-v8dot4 to setup my self-managed MySQL on EC2
- Use MySQL Long-Term Support (LTS) major versions i.e. MySQL 8.4
- set it up in ap-southeast-1
- I need two MySQL instances
- I need it to help me prototype replication of master and slave replication. 
- Keep the setup simple without using private subnet or bastion hosts to ssh
- It should have relevant VPC, Subnet, Security Group pointing to My IP, and private key to ssh
- Also include steps to setup MySQL Databases on the master and slave servers and test the replication (could be a bash script)
- If needed explain the steps to copy the bash file from my local Macbook machine to the EC2 before giving me the command to SSH
- Try to automate as much as possible 
- Less is more so please keep it simple
- Think hard


### Access & Authentication:
- **SSH Key**: key name in cloud provider, it is called jek-macbook-pro-key in cloud provider
- **SSH Locally**: when ssh use ~/.ssh/id_ed25519
- **IP Addresses**: [current IP of the EC2 for SSH access, do auto-detection such as curl to an address to get it]

<!-- ## EXAMPLES:
- [List any example files in the examples folders and explain how they should be used if any] -->

<!-- ## DOCUMENTATION: -->

## USE CONTEXT7
- use library /hashicorp/terraform 
- use library /terraform-docs/terraform-docs /hashicorp/terraform-mcp-server /hashicorp/terraform-provider-aws /petoju/terraform-provider-mysql /terraform-aws-modules/terraform-aws-rds /terraform-aws-modules/terraform-aws-ecs /terraform-provider-datadog /terraform/docs 

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


