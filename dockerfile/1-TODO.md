## TASK:
- I want to run this command:
```bash
docker run -d --cgroupns host \
              --pid host \
              -v /var/run/docker.sock:/var/run/docker.sock:ro \
              -v /proc/:/host/proc/:ro \
              -v /sys/fs/cgroup/:/host/sys/fs/cgroup:ro \
              -e DD_API_KEY=<DATADOG_API_KEY> \
              -e DD_DOGSTATSD_NON_LOCAL_TRAFFIC="true" \
              -p 8125:8125/udp \
              gcr.io/datadoghq/agent:7.68.3
```
- But I want the <DATADOG_API_KEY> to be read from .env
- The .env must not be committed to Github

## Verification Strategy
1. Start Datadog Agent container
2. Run Python application sending test metrics
3. Verify metrics appear in Datadog dashboard
4. Test teardown and cleanup procedures

## Security Considerations
- `.env` file contains sensitive API key
- Proper `.gitignore` configuration prevents accidental commits
- Docker volumes provide read-only access to system resources
- Network exposure limited to necessary ports only

<!-- ## EXAMPLES:
- [List any example files in the examples folders and explain how they should be used if any] -->

## DOCUMENTATION:
- https://docs.datadoghq.com/developers/dogstatsd/?tab=containeragent

## Implementation should consider:
- **README.md**: Include setup, deployment, verification, and teardown steps
- **Git Ignore**: Create a .gitignore to avoid committing sensitive information to Git repo
- **Simplicity**: Keep the Dockerfile really simple
- **Teardown**: Document the steps to clean up the processes or containers in the README.md
- **PII and Sensitive Data**: Do be mindful that I will be committing the Dockerfile folders to a public Github repo

## OTHER CONSIDERATIONS:
- My computer is a Macbook Pro M4 chip
- I'm running Claude Code through the terminal and Visual Studio Code
- Explain the steps you would take in clear, beginner-friendly language
- Write the research on performing the task
- Save the research to `2-RESEARCH.md`


