## TASK:
- Create a folder call "send-test-logs"
- Create a .env to save my Datadog API Key
- Create a simple bash script to send logs to Datadog API:
```
curl -X POST 'https://http-intake.logs.datadoghq.com/v1/input/<api_key> \
--header 'Content-Type: application/json' \
--data-raw '{
    "ddsource": "jek-local-machine",
    "message": "jek-test-log-v1",
    "ddtags":"env:test,team:dd",
    "service": "jek-test-log",
    "hostname": "jek-localhost",
    "level": "info"
}'
```
- The API key should be read from my .env file.
- The .env must NOT be committed to Git.
- Think hard

<!-- ## EXAMPLES:
- [List any example files in the examples folders and explain how they should be used if any] -->

<!-- ## DOCUMENTATION:
- https://docs.datadoghq.com/api/latest/logs/?code-lang=curl -->

## USE CONTEXT7
- use library /tiangolo/fastapi

## OTHER CONSIDERATIONS:
- My computer is a Macbook
- I'm running Claude Code through the terminal
- Explain the steps you would take in clear, beginner-friendly language
- Write the research on performing the task
- Save the research to `2-RESEARCH.md`