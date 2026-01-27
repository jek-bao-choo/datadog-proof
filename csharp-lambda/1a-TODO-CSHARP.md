## TASK:
* Background: The lambda__globalcli__net8dot0__processmeterreading project is a .net lambda empty function (for .NET 8+). This project is a PoC for Processing Meter Reading of a Utility company.
* Update the project lambda__globalcli__net8dot0__processmeterreading with the following requirements:
    * This is a backend web api project lambda__globalcli__net8dot0__processmeterreading which has two HTTP API endpoints
    * The first HTTP endpoint is to accept a HTTP POST request and process the submitted meter reading number and stamp it with the current date and time in datetime ISO format. This HTTP endpoint method will have a random chance of 50% successful and 25% unsuccessful with 4XX error and 25% unsuccessful with 5XX error. If the submitted meter reading is successful, this HTTP POST endpoint will return a HTTP status code 200 together with a JSON array of all the meter reading records. If the submitted meter reading is unsuccessful, this HTTP POST endpoint will return a HTTP status of 4XX or 5XX. For the unsuccessful, you will decide what 4XX status or 5XX status accordingly, simulate the error message in the response body when it is unsuccessful.
    * The second HTTP endpoint is to accept a HTTP GET request to get all past submitted meter reading history. It will return an array of submitted meter reading as a JSON response back to the frontend web app. Each item in the submitted meter reading array will contain the submitted meter reading and the date time stamp in ISO format. To begin it would have a dummy meter reading record item in the array.
        * A meter reading digit ranges from 1 to 999999. For the dummy meter reading record item keep the number to for example randomly generate random number in 4 digits of low thousand.
* Think hard
* Ask any questions you want to clarify before doing the research.
* It should past these tests
**1. Get Initial Meter Readings (with dummy data):**

```bash
export API_URL="< THE LAMBDA ENDPOINT >"
curl $API_URL
```

**2. Submit a Valid Meter Reading:**
```bash
curl -X POST $API_URL \
  -H "Content-Type: application/json" \
  -d '{"readingValue": 12345}'
```

**3. Test Multiple Submissions (observe random responses):**
```bash
for i in {1..10}; do
  curl -X POST $API_URL \
    -H "Content-Type: application/json" \
    -d "{\"readingValue\": $((10000 + i))}"
  echo ""
done
```

## USE CONTEXT7
- use library id /aws/aws-lambda-dotnet
<!-- - use library id /websites/learn_microsoft_en-us_dotnet_framework when it comes to building .NET Framework app -->
<!-- - use library id /dotnet/dotnet-docker to reference setting up docker of dotnet app -->


## Implementation should consider:
- **Documentation**: Include setup, deployment, verification, and cleanup steps in README.md
- **Git Ignore**: Create a .gitignore to avoid committing common .NET files or output to Git repo if .gitignore doesn't exist
- **PII and Sensitive Data**: Do be mindful that I will be committing the .NET project to a public Github repo so do NOT commit private key or secrets.
- **Simplicity**: Keep the .NET project really simple

## OTHER CONSIDERATIONS:
- My computer is a Macbook ARM64 M4 chip so your instructions need to relevant to my machine if necessary
- Explain the steps you would take in clear, beginner-friendly language
- Write the research on performing the task
- Save the research to `2-RESEARCH.md`