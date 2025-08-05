import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
import os

os.environ["OPENAI_API_KEY"] = "test-key"
os.environ["DEBUG"] = "true"
os.environ["LOG_LEVEL"] = "DEBUG"

@pytest.fixture(scope="session")
def test_env():
    pass

@pytest.fixture
def client(test_env):
    from app.main import app
    return TestClient(app)

@pytest.fixture
def mock_openai_response():
    mock_response = MagicMock()
    mock_response.choices = [MagicMock()]
    mock_response.choices[0].message.content = "This is a test response from OpenAI"
    mock_response.model = "gpt-3.5-turbo"
    mock_response.usage = MagicMock()
    mock_response.usage.prompt_tokens = 10
    mock_response.usage.completion_tokens = 12
    mock_response.usage.total_tokens = 22
    return mock_response