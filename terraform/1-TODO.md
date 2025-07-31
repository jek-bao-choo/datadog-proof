## TASK:
- Create a terraform script in the folder ec2-eks-v1dot3 
- spin up an EKS cluster based on EC2 in ap-southeast-1
- It should have all the VPC, Subnet, Security Group pointing to My IP, and private key sign in
- Document the steps to run the terraform script to README.md including tear down steps

## Implementation should consider:
- **Naming Convention**: All resources use "jek-" prefix with tags: owner="jek", env="test"
- **Resource naming**: [prefix-resourcename, e.g., "jek-"]
- **Tagging**: [required tags, e.g., owner="jek", env="test"]
- **README.md**: Include setup, deployment, verification, and teardown steps
- **Git Ignore**: Create a .gitignore to avoid committing sensitive terraform files or output to Git repo

<!-- ### Access & Authentication:
- **SSH Key**: [key name in cloud provider]
- **Private Key Path**: [local path, e.g., ~/.ssh/id_ed25519]
- **IP Restriction**: [current IP for SSH access] -->

<!-- ## EXAMPLES:
- [List any example files in the examples folders and explain how they should be used if any] -->

<!-- ## DOCUMENTATION: -->


## OTHER CONSIDERATIONS:
- My computer is a Macbook
- I'm running Claude Code through the terminal
- Explain the steps you would take in clear, beginner-friendly language
- Write the research on performing the task
- Save the research to `2-RESEARCH.md`


