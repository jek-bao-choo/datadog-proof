# LangGraph Chat API

A conversational AI service built with LangGraph and FastAPI that provides tool calling capabilities for online search and Datadog metrics retrieval.

## Features

- **LangGraph Integration**: State-based conversation management with MemorySaver
- **Tool Calling**: Two integrated tools:
  - Online search using Tavily API
  - Datadog metrics retrieval
- **FastAPI REST API**: Clean endpoints for chat interactions
- **Thread Management**: Conversation continuity with unique thread IDs
- **Environment Security**: API keys managed via `.env` file

## Quick Start

### Prerequisites

- Python 3.9.6
- uv package manager

### Installation

1. **Clone and navigate to the project:**
```bash
cd langgraph0dot6dot5__cpython3dot9dot6
```

2. **Activate virtual environment:**
```bash
source .venv/bin/activate
```

3. **Configure environment variables:**
```bash
cp .env .env.local
# Edit .env.local with your API keys:
# OPENAI_API_KEY=your_openai_api_key
# DATADOG_API_KEY=your_datadog_api_key  
# DATADOG_APP_KEY=your_datadog_app_key
# TAVILY_API_KEY=your_tavily_api_key (optional for search)
```

4. **Run the application:**
```bash
uv run main.py
```

The API will be available at `http://localhost:8000`

## API Endpoints

### Health Check
```http
GET http://localhost:8000/api/v1/health
```

### Chat
```http
POST http://localhost:8000/api/v1/chat
Content-Type: application/json

{
  "message": "Search for recent AI developments",
  "thread_id": "optional-thread-id"
}
```

### Testing the API

You can test the endpoints using curl, Postman, or any HTTP client:

#### 1. Test General Knowledge Query
```bash
curl -X POST "http://localhost:8000/api/v1/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Why is the sky blue?",
    "thread_id": "test-knowledge"
  }'
```

#### 2. Test Datadog Metrics Tool
```bash
curl -X POST "http://localhost:8000/api/v1/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Get the system.uptime metric for all host from Datadog in the past 1 month?",
    "thread_id": "test-metrics-debug"
  }'
```

#### 3. Test Online Search Tool
```bash
curl -X POST "http://localhost:8000/api/v1/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Do an online search for What is Azure",
    "thread_id": "test-search"
  }'
```

#### Using Python requests:
```python
import requests

# Test general knowledge
response = requests.post("http://localhost:8000/api/v1/chat", 
    json={"message": "Why is the sky blue?", "thread_id": "test-knowledge"})
print(response.json())

# Test Datadog metrics
response = requests.post("http://localhost:8000/api/v1/chat", 
    json={"message": "Get some metrics from Datadog", "thread_id": "test-metrics"})
print(response.json())

# Test online search
response = requests.post("http://localhost:8000/api/v1/chat", 
    json={"message": "Do an online search for What is Azure", "thread_id": "test-search"})
print(response.json())
```

### Interactive Documentation
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Tool Usage Examples

### Online Search
```json
{
  "message": "Search for the latest news about artificial intelligence",
  "thread_id": "search-demo"
}
```

### Datadog Metrics
```json
{
  "message": "Get system CPU metrics from the last hour",
  "thread_id": "metrics-demo"
}
```

## Instrument Datadog dd-trace-py
```bash
source .venv/bin/activate

uv add ddtrace

ddtrace-run uv run main.py
# a Tracer (a wrapper) and a Runner (a context setter). The Tracer must wrap the Runner.
# ddtrace-run is a wrapper script. Its only job is to set up a special environment that can trace a Python process and then execute whatever command comes after it.
# Starts First: It hijacks the environment.
# Injects Tracing: It modifies environment variables and hooks into Python's module system so that any subsequent Python script it runs will be automatically instrumented.
# Executes Its Arguments: It then takes the rest of the command (uv run main.py in this case) and runs it as a new child process.
```



## Project Structure

```
langgraph0dot6dot5__cpython3dot9dot6/
├── app/
│   ├── api/          # FastAPI routes
│   ├── core/         # Core logic (config, graph)
│   ├── models/       # Data schemas
│   └── tools/        # Tool implementations
├── tests/            # Test suite
├── main.py           # Application entry point
├── .env              # Environment configuration
└── README.md         # This file
```

## Testing

Run the test suite:
```bash
# Activate virtual environment
source .venv/bin/activate

# Run tests
pytest tests/ -v
```

## Configuration

The application uses the following environment variables:

- `OPENAI_API_KEY`: Required for LLM functionality
- `DATADOG_API_KEY`: Required for Datadog metrics
- `DATADOG_APP_KEY`: Required for Datadog metrics  
- `TAVILY_API_KEY`: Optional for online search
- `ENVIRONMENT`: Application environment (default: development)

## Architecture

### LangGraph Workflow
- **Agent Node**: Processes messages using OpenAI GPT-4
- **Tools Node**: Executes search and Datadog tools concurrently
- **Conditional Routing**: Determines whether to use tools or end conversation
- **MemorySaver**: In-memory state persistence for conversation threads

### Tool Integration
- Tools are defined using `@tool` decorator from langchain_core
- Error handling for missing API keys
- Structured responses for consistent data format

## Development

### Adding New Tools
1. Create tool in `app/tools/`
2. Add to `app/tools/__init__.py`
3. Tool will be automatically available in LangGraph workflow

### Running in Development Mode
```bash
# With auto-reload
uv run main.py
# or
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## Production Deployment

1. Set `ENVIRONMENT=production` in `.env`
2. Configure CORS origins in `main.py`
3. Use production ASGI server like Gunicorn:
```bash
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker
```

## Troubleshooting

### Common Issues

1. **Missing API keys**: Check `.env` file configuration
2. **Import errors**: Ensure virtual environment is activated
3. **Tool failures**: Verify API keys have proper permissions

### Logs
Application logs are written to stdout with INFO level by default.

## License

This project is for demonstration purposes.