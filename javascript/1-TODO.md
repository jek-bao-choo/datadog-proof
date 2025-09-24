## TASK:
* Background: The react19dot1__vite7dot1__sendmoney project is a React JS version 19.1 using Vite version 7.1 and the dependencies used are in package.json
* Update the project react19dot1__vite7dot1__sendmoney with the following requirements:
    * This project is a PoC for sending money. 
    * The landing page of the project is a mobile-responsive page and it would show two fields and one button
    * The first field is a phone number field with NO validation except allowing up to 8 digits.
    * The second field is an amount field with NO validation except allowing up to 4 digits.
    * The button shows "Send Money".
    * Upon clicking the "Send Money" button, it will trigger a REST HTTP POST to a temporary mock endpoint until I setup a proper backend app with another project. This project will not setup a backend app. The mock endpoint will randomly return a hardcoded HTTP 2XX success status or a hardcoded HTTP 4XX failure status.
    * The send money web app upon receiving the HTTP 200 success status will show a Success and a tick with a transaction id randomly generated. There will also be a button that shows "Return to home" which will take us back to the landing page.
    * The send money web app upon receiving the HTTP 4XX failure status will show a Failed and a cross with a transaction id randomly generated. There will also be a button that shows "Return to home" which will take us back to the landing page.


## USE CONTEXT7
- use library id /reactjs/react.dev?tokens=5000 to reference
- use library id /vitejs/vite?tokens=3000 
<!-- - use library id /vercel/next-learn
- use library id /vercel/next.js 
- use library id /skolaczk/next-starter
- use library id nextjs.org/docs
- use library id /microsoft/playwright the Playwright MCP to automate end-to-end testing through Claude Code browser interaction capabilities
- use library id /microsoft/playwright-mcp the Playwright MCP to automate end-to-end testing through Claude Code browser interaction capabilities
- use library id /shadcn-ui/ui
- use library id /tailwindlabs/tailwindcss.com -->


## Implementation should consider:
- **Documentation**: Include setup, deployment, verification, and cleanup steps in README.md
- **Git Ignore**: Create a .gitignore to avoid committing common Javascript files or output to Git repo if .gitignore doesn't exist
- **PII and Sensitive Data**: Do be mindful that I will be committing the Javascript project to a public Github repo so do NOT commit private key or secrets.
- **Simplicity**: Keep the Javascript project really simple

## OTHER CONSIDERATIONS:
- My computer is a Macbook
- My development tools are iTerm2, tmux, Claude Code, and Visual Studio Code
- Explain the steps you would take in clear, beginner-friendly language
- Write the research on performing the task
- Save the research to `2-RESEARCH.md`