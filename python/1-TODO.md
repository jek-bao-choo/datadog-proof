## TASK:
- Walk me through creating a FastAPI version 0.116.1
- I will be using Python 3.9.6
- The server will be using Gunicorn with Uvicorn workers
- The FastAPI is a API gateway which will send a prompt to an OpenAI API
- The OpenAI API key would be saved in .env
- The .env must NOT be committed to Github public repo
- Use pydantic for data validation
- Explain how this application could be containerised


<!-- ## EXAMPLES:
- [List any example files in the examples folders and explain how they should be used if any] -->

## DOCUMENTATION:
- **FastAPI**: https://github.com/fastapi/fastapi

## Implementation should consider:
- **README.md**: Include setup, deployment, verification, and cleanup steps
- **Git Ignore**: Create a .gitignore to avoid committing common Python files or output to Git repo
- **Simplicity**: Keep the Python project really simple
- **PII and Sensitive Data**: Do be mindful that I will be committing the Python project to a public Github repo so do NOT commit private key or secrets.

## OTHER CONSIDERATIONS:
- My computer is a Macbook
- My development tools are iTerm2, tmux, Claude Code, and Visual Studio Code
- Explain the steps you would take in clear, beginner-friendly language
- Write the research on performing the task
- Save the research to `2-RESEARCH.md`