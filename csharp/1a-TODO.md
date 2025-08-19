## TASK:
- Create a simple .NET 6 application
- Keep simple (Hello World level)
- Answer my questions: 
    - What do I need to have as pre-requisites for running this application on a Macbook?
    - What server should I run it on?
- Think hard

## USE CONTEXT7
- use library /websites/learn_microsoft-en-us-dotnet
- use library /websites/learn_microsoft-en-us-dotnet-csharp?tokens=5000
- use library /websites/playwright_dev-dotnet?tokens=5000

## DOTNET VERSION MANAGER
- Use asdf for dotnet version manager
- An example of how it is used
```
asdf list all dotnet         # see available SDKs
asdf install dotnet 8.0.401  # example: latest 8.0 feature SDK
asdf global dotnet 8.0.401
dotnet --info

dotnet new globaljson --sdk-version 8.0.401 --force
# or create manually:
# {
#   "sdk": { "version": "8.0.401", "rollForward": "latestFeature" }
# }
```


## IMPLEMENTATION CONSIDERATION:
- **README.md**: Include setup, start up, deployment, verification, and cleanup steps
- **Git Ignore**: Create a .gitignore to avoid committing common C# files or output to Git repo
- **Simplicity**: Keep the C# project really simple
- **PII and Sensitive Data**: Do be mindful that I will be committing the C# project to a public Github repo so do NOT commit private key or secrets.

## OTHER CONSIDERATIONS:
- My development tools are Macbook terminal and Visual Studio Code
- Explain the steps you would take in clear, beginner-friendly language
- Write the research on performing the task
- Save the research to `2-RESEARCH.md`