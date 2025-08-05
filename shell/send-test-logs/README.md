# Send Test Logs to Datadog

This simple bash script sends test logs to Datadog's HTTP intake API using curl.

## Setup

1. **Add your Datadog API key to the `.env` file:**
   - Open the `.env` file in this folder
   - Replace `YOUR_API_KEY_HERE` with your actual Datadog API key
   - The file should look like: `DATADOG_API_KEY=your_actual_api_key_here`

2. **Make sure the script is executable (already done):**
   ```bash
   chmod +x send-logs.sh
   ```

## Usage

Run the script from this directory:

```bash
./send-logs.sh
```

## What the script does

The script:
- Loads your API key from the `.env` file
- Validates that the API key is properly set
- Sends a test log message to Datadog with these details:
  - **Source**: `jek-local-machine`
  - **Message**: `jek-test-log-v1`
  - **Tags**: `env:test,team:dd`
  - **Service**: `jek-test-log`
  - **Hostname**: `jek-localhost`
  - **Level**: `info`
- Shows success or error messages

## Expected output

**Success:**
```
✅ Success! Log sent to Datadog successfully
HTTP Status: 200
```

**Error (missing API key):**
```
❌ Error! DATADOG_API_KEY is not set or still has placeholder value!
Please update your .env file with a valid Datadog API key
```

## Security

- Your API key is stored securely in the `.env` file
- The `.env` file is ignored by git and won't be committed to version control