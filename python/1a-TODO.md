## TASK:
- Create an new project using latest Langchain framework with tool calling capabilities
- First tool is online search
- Second tool is get some metric data from Datadog API from app.datadoghq.com
- It will be using OpenAI API
- Reference the code in /langgraph0dot6dot5__cpython3dot9dot6
- The credentials will be saved in .env
- The .env must NOT be committed to Github public repo
- Use `MemorySaver` (in-memory) for simple Hello World implementation
- Each conversation gets a unique `thread_id` for state management
- FastAPI will expose REST endpoints that trigger Langchain workflows
- I will be using Python 3.9.6
- Keep simple (Hello World level)
- Think hard

## USE CONTEXT7
<!-- - use library /llmstxt/langchain-ai_github_io-langgraph-llms.txt
- use library /context7/playwright_dev-python
- use library /microsoft/playwright-python for end-to-end testing
- use library /context7/fastapi_tiangolo
- use library /context7/platform_openai
- use library /context7/python_langchain-langgraph
- use library /context7/python_langchain
- use library /datadog/datadog-api-client-python -->
- use library /llmstxt/python_langchain_llms_txt?tokens=5000

## IMPLEMENTATION CONSIDERATION:
- **README.md**: Include setup, start up, deployment, verification, and cleanup steps
- **Git Ignore**: Create a .gitignore to avoid committing common Python files or output to Git repo
- **Simplicity**: Keep the Python project really simple
- **PII and Sensitive Data**: Do be mindful that I will be committing the Python project to a public Github repo so do NOT commit private key or secrets.

## OTHER CONSIDERATIONS:
- My computer is a Macbook
- My development tools are iTerm2, tmux, Claude Code, and Visual Studio Code
- Explain the steps you would take in clear, beginner-friendly language
- Write the research on performing the task
- Save the research to `2-RESEARCH.md`