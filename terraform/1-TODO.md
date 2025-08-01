## TASK:
- Create a terraform script in the folder rds-mysql-v8dot4 to setup Amazon RDS for MySQL
- Use MySQL Long-Term Support (LTS) major versions i.e. MySQL 8.4
- set it up in ap-southeast-1
- I need two Amazon RDS for MySQL instances
- I need it to prototype replication of master and slave replication. 
    - Is this needed for Amazon RDS for MySQL or is replication offered by Amazon RDS for MySQL out of the box?
<!-- - It should have all the VPC, Subnet, Security Group pointing to My IP, and private key sign in -->

<!-- ### Access & Authentication:
- **SSH Key**: [key name in cloud provider]
- **Private Key Path**: [local path, e.g., ~/.ssh/id_ed25519]
- **IP Restriction**: [current IP for SSH access] -->

<!-- ## EXAMPLES:
- [List any example files in the examples folders and explain how they should be used if any] -->

<!-- ## DOCUMENTATION: -->

## Implementation should consider:
- **Naming Convention**: All resources use "jek-" prefix with tags: owner="jek", env="test"
- **Resource naming**: [prefix-resourcename, e.g., "jek-"]
- **Tagging**: [required tags, e.g., owner="jek", env="test"]
- **README.md**: Include setup, deployment, verification, and teardown steps
- **Git Ignore**: Create a .gitignore to avoid committing sensitive terraform files or output to Git repo
- **Simplicity**: Keep the terraform script really simple
- **Teardown**: Document the steps to run the terraform script to README.md including tear down steps

## OTHER CONSIDERATIONS:
- My computer is a Macbook
- I'm running Claude Code through the terminal
- Explain the steps you would take in clear, beginner-friendly language
- Write the research on performing the task
- Save the research to `2-RESEARCH.md`


