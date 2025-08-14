import pytest
from pydantic import ValidationError
from app.models import ChatRequest, ChatResponse, ErrorResponse, HealthResponse, UsageInfo

def test_chat_request_valid():
    request = ChatRequest(message="Hello, world!")
    assert request.message == "Hello, world!"
    assert request.model == "gpt-3.5-turbo"  # default
    assert request.max_tokens == 150  # default
    assert request.temperature == 0.7  # default

def test_chat_request_custom_values():
    request = ChatRequest(
        message="Custom message",
        model="gpt-4",
        max_tokens=200,
        temperature=0.5
    )
    assert request.message == "Custom message"
    assert request.model == "gpt-4"
    assert request.max_tokens == 200
    assert request.temperature == 0.5

def test_chat_request_invalid_temperature():
    with pytest.raises(ValidationError):
        ChatRequest(message="Test", temperature=3.0)  # Max is 2.0

def test_chat_request_missing_message():
    with pytest.raises(ValidationError):
        ChatRequest()  # message is required

def test_usage_info():
    usage = UsageInfo(
        prompt_tokens=10,
        completion_tokens=12,
        total_tokens=22
    )
    assert usage.prompt_tokens == 10
    assert usage.completion_tokens == 12
    assert usage.total_tokens == 22

def test_chat_response():
    usage = UsageInfo(prompt_tokens=10, completion_tokens=12, total_tokens=22)
    response = ChatResponse(
        response="Test response",
        model="gpt-3.5-turbo",
        usage=usage
    )
    assert response.response == "Test response"
    assert response.model == "gpt-3.5-turbo"
    assert response.usage == usage
    assert response.created_at is not None

def test_error_response():
    error = ErrorResponse(
        error="Test error",
        detail="Test detail",
        error_code="TEST_ERROR"
    )
    assert error.error == "Test error"
    assert error.detail == "Test detail"
    assert error.error_code == "TEST_ERROR"

def test_health_response():
    health = HealthResponse(
        status="healthy",
        version="1.0.0"
    )
    assert health.status == "healthy"
    assert health.version == "1.0.0"
    assert health.environment == "development"  # default
    assert health.timestamp is not None