import pytest
from unittest.mock import patch, AsyncMock
from fastapi import status

def test_health_check(client):
    response = client.get("/health")
    assert response.status_code == status.HTTP_200_OK
    
    data = response.json()
    assert data["status"] == "healthy"
    assert data["version"] == "1.0.0"
    assert "timestamp" in data
    assert data["environment"] == "development"

def test_chat_completion_success(client, mock_openai_response):
    request_data = {
        "message": "Hello, world!",
        "model": "gpt-3.5-turbo",
        "max_tokens": 150,
        "temperature": 0.7
    }
    
    with patch('app.services.openai_service.openai_service.send_chat_completion') as mock_service:
        from app.models import ChatResponse, UsageInfo
        mock_service.return_value = ChatResponse(
            response="This is a test response",
            model="gpt-3.5-turbo",
            usage=UsageInfo(prompt_tokens=10, completion_tokens=12, total_tokens=22)
        )
        
        response = client.post("/chat", json=request_data)
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["response"] == "This is a test response"
        assert data["model"] == "gpt-3.5-turbo"
        assert data["usage"]["total_tokens"] == 22

def test_chat_completion_invalid_request(client):
    request_data = {
        "model": "gpt-3.5-turbo"
        # Missing required "message" field
    }
    
    response = client.post("/chat", json=request_data)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

def test_chat_completion_openai_error(client):
    request_data = {
        "message": "Hello, world!",
        "model": "gpt-3.5-turbo"
    }
    
    with patch('app.services.openai_service.openai_service.send_chat_completion') as mock_service:
        mock_service.side_effect = Exception("OpenAI API error")
        
        response = client.post("/chat", json=request_data)
        assert response.status_code == status.HTTP_500_INTERNAL_SERVER_ERROR

def test_chat_completion_validation_error(client):
    request_data = {
        "message": "Hello, world!",
        "temperature": 3.0  # Invalid: max is 2.0
    }
    
    response = client.post("/chat", json=request_data)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

def test_invalid_endpoint(client):
    response = client.get("/nonexistent")
    assert response.status_code == status.HTTP_404_NOT_FOUND

def test_chat_completion_minimal_request(client):
    request_data = {
        "message": "Hello"
    }
    
    with patch('app.services.openai_service.openai_service.send_chat_completion') as mock_service:
        from app.models import ChatResponse, UsageInfo
        mock_service.return_value = ChatResponse(
            response="Hi there!",
            model="gpt-3.5-turbo",
            usage=UsageInfo(prompt_tokens=5, completion_tokens=3, total_tokens=8)
        )
        
        response = client.post("/chat", json=request_data)
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["response"] == "Hi there!"