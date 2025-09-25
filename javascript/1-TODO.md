## TASK:
* Background: The next15dot5__react19dot1__planholiday project is a Next JS version 15.5.X using React version 19.1.X and the dependencies used are in package.json
* Update the project next15dot5__react19dot1__planholiday with the following requirements:
    * This project is a PoC for planning holiday.
    * The project is like a chatbot. 
    * The landing page of the project is a mobile-responsive page and it would show a list of up to 5 recommended holiday prompt ideas with background images in each of it (I will upload the images later), one textarea field, and a button besides the field.
    * It would look like the Claude chat UI or the ChatGPT UI.
    * The list of recommended prompts with clickable icons when upon clicked it will fill out the textarea field with the template prompts. There are up to 5 template prompts:
        * Skiing in the Japanese Alps
        * Diving in the Indonesian Islands
        * Meditating in the Thai Forests
        * Hiking in the Chinese Mountains
        * Exploring the Singapore Gardens
    * The one textarea field is a textarea field allowing users to type in their prompts for holiday destination or ideas just like Claude UI or ChatGPT Ui.
    * The button shows a send icon.
    * The button is used to send the textarea prompt to a mock backend.
        * Upon clicking the send button, it will trigger a REST HTTP POST to a temporary mock endpoint until I setup a proper backend app with another project. This project will not setup a backend app. The mock endpoint will randomly return text in the HTTP request body with lorem ipsum and a HTTP 2XX success status. The end goal is to interact with OpenAI API endpoint or Claude API endpoint.
    * The colour theme of this web app will have holiday feel.



## USE CONTEXT7
<!-- - use library id /reactjs/react.dev?tokens=5000 to reference -->
<!-- - use library id /websites/vuejs_guide for best practices reference -->
<!-- - use library id /vitejs/vite?tokens=3000 for best practices reference -->
- use library id /vercel/next-learn for best practices reference
- use library id /vercel/next.js for best practices reference
<!-- - use library id /skolaczk/next-starter for best practices reference -->
- use library id /nextjs.org/docs for best practices reference
<!-- - use library id /microsoft/playwright the Playwright MCP to automate end-to-end testing through Claude Code browser interaction capabilities -->
<!-- - use library id /microsoft/playwright-mcp the Playwright MCP to automate end-to-end testing through Claude Code browser interaction capabilities -->
<!-- - use library id /shadcn-ui/ui -->
<!-- - use library id /tailwindlabs/tailwindcss.com -->


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