## TASK:
- Create a Windows Server 2022 using Bicep in Azure (Asia Pacific) Southeast Asia region
- It should have relevant Resource Group, VPC, Subnet, amd Security Group pointing to My IP.
- After the creation of Windows Server 2022, create a .NET Framework v4.8.1 app running on IIS server in the Windows Server 2022.
- Keep simple (Hello World level)
- Explain the steps to test the .NET Framework v4.8.1 application in the README.md
- Think hard

## USE CONTEXT7
- use library /azure/azure-quickstart-templates
- use library /microsoft/referencesource

## IMPLEMENTATION CONSIDERATION: 
- **Resource naming**: [prefix-resourcename, e.g., "jek-"]
- **Tagging**: [required tags owner="jek", env="test", "criticality"="low"]
- **README.md**: Include setup, start up, deployment, verification, and cleanup steps
- **Git Ignore**: Create a .gitignore to avoid committing common Bicep files or output to Git repo
- **Simplicity**: Keep each Bicep project really simple
- **PII and Sensitive Data**: Do be mindful that I will be committing the Bicep project to a public Github repo so do NOT commit private key or secrets.

## OTHER CONSIDERATIONS:
- My development tools are iTerm and Visual Studio Code
- Explain the steps you would take in clear, beginner-friendly language
- Write the research on performing the task
- Save the research to `2-RESEARCH.md`