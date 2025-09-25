## TASK:
* Background: The vue3dot5__vite7dot1__tradestocks project is a Vue JS version 3.5.X using Vite version 7.1.X and the dependencies used are in package.json
* Update the project vue3dot5__vite7dot1__tradestocks with the following requirements:
    * This project is a PoC for trading stocks. 
    * The landing page of the project is a mobile-responsive page and it would show two fields and one button
    * The first field is a dropdown list with these values:
        * DDOG | NASDAQ.NMS | 136.44
        * GOOG | NASDAQ.NMS | 248.50
        * MSFT | NASDAQ.NMS | 510.63
        * META | NASDAQ.NMS | 761.80
        * CSPX | LSEETF     | 710.60
        * VUAA | LSEETF     | 127.44
        * VWRA | LSEETF     | 163.54
        * FWRA | LSEETF     | 8.05
        * AGED | LSEETF     | 33.10
    * Below the first field it would have a small text says prices last updated on 25 Sep 2025
    * The second field is a quantity field starting with 100 and can go up to 9000 only.
    * The button shows "Buy Stocks / ETFs".
    * Upon clicking the "Buy Stocks / ETFs" button, it will trigger a REST HTTP POST to a temporary mock endpoint until I setup a proper backend app with another project. This project will not setup a backend app. The mock endpoint will randomly return a hardcoded HTTP 2XX success status or a hardcoded HTTP 4XX failure status.
    * The trade stocks web app upon receiving the HTTP 200 success status will show a Success and a tick with a transaction id randomly generated. There will also be a button that shows "Return to home" which will take us back to the landing page.
    * The trade stocks web app upon receiving the HTTP 4XX failure status will show a Failed and a cross with a transaction id randomly generated. There will also be a button that shows "Return to home" which will take us back to the landing page.
    * The colour theme of this web app will have some gold colour as it is trading stocks so giving a getting rich vibe.


## USE CONTEXT7
<!-- - use library id /reactjs/react.dev?tokens=5000 to reference -->
- use library id /websites/vuejs_guide to reference for best practices
- use library id /vitejs/vite?tokens=3000  to reference for best practices
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