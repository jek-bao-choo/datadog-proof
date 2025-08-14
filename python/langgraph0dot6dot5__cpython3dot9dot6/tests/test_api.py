"""Test suite for LangGraph Chat API endpoints."""
import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
import os

# Import the FastAPI app
from main import app

# Create test client
client = TestClient(app)

class TestChatAPI:
    """Test cases for Chat API endpoints."""
    
    def test_root_endpoint(self):
        """Test the root endpoint returns expected information."""
        response = client.get("/")
        assert response.status_code == 200
        
        data = response.json()
        assert data["message"] == "LangGraph Chat API"
        assert data["version"] == "1.0.0"
        assert data["status"] == "running"
        assert "endpoints" in data
    
    @patch.dict(os.environ, {
        "OPENAI_API_KEY": "test-openai-key",
        "DATADOG_API_KEY": "test-datadog-key",
        "DATADOG_APP_KEY": "test-datadog-app-key"
    })
    def test_health_endpoint_healthy(self):
        """Test health endpoint returns healthy status with valid config."""
        response = client.get("/api/v1/health")
        assert response.status_code == 200
        
        data = response.json()
        assert data["status"] == "healthy"
        assert data["version"] == "1.0.0"
        assert "timestamp" in data
    
    @patch('app.api.chat.config.validate_config', return_value=False)
    def test_health_endpoint_unhealthy(self, mock_validate_config):
        """Test health endpoint returns unhealthy status with invalid config."""
        response = client.get("/api/v1/health")
        assert response.status_code == 200
        
        data = response.json()
        assert data["status"] == "unhealthy"
        assert data["version"] == "1.0.0"
    
    @patch('app.core.graph.process_message')
    @patch('app.api.chat.config.validate_config', return_value=True)
    def test_chat_endpoint_success(self, mock_validate_config, mock_process_message):
        """Test successful chat message processing."""
        # Mock successful response
        mock_process_message.return_value = {
            "response": "Hello! How can I help you today?",
            "thread_id": "test-thread-123",
            "success": True
        }
        
        # Make request
        response = client.post(
            "/api/v1/chat",
            json={
                "message": "Hello",
                "thread_id": "test-thread-123"
            }
        )
        
        assert response.status_code == 200
        
        data = response.json()
        assert data["response"] == "Hello! How can I help you today?"
        assert data["thread_id"] == "test-thread-123"
        assert "timestamp" in data
        
        # Verify mock was called correctly
        mock_process_message.assert_called_once_with(
            message="Hello",
            thread_id="test-thread-123"
        )
    
    @patch('app.core.graph.process_message')
    @patch('app.api.chat.config.validate_config', return_value=True)
    def test_chat_endpoint_without_thread_id(self, mock_validate_config, mock_process_message):
        """Test chat message processing without thread_id."""
        # Mock successful response
        mock_process_message.return_value = {
            "response": "Hello! How can I help you today?",
            "thread_id": "auto-generated-thread-456",
            "success": True
        }
        
        # Make request without thread_id
        response = client.post(
            "/api/v1/chat",
            json={
                "message": "Hello"
            }
        )
        
        assert response.status_code == 200
        
        data = response.json()
        assert data["response"] == "Hello! How can I help you today?"
        assert data["thread_id"] == "auto-generated-thread-456"
        
        # Verify mock was called with None thread_id
        mock_process_message.assert_called_once_with(
            message="Hello",
            thread_id=None
        )
    
    @patch('app.api.chat.config.validate_config', return_value=False)
    def test_chat_endpoint_missing_config(self, mock_validate_config):
        """Test chat endpoint fails with missing configuration."""
        response = client.post(
            "/api/v1/chat",
            json={
                "message": "Hello"
            }
        )
        
        assert response.status_code == 500
        assert "configuration error" in response.json()["detail"]
    
    @patch.dict(os.environ, {
        "OPENAI_API_KEY": "test-openai-key",
        "DATADOG_API_KEY": "test-datadog-key",
        "DATADOG_APP_KEY": "test-datadog-app-key"
    })
    @patch('app.core.graph.process_message')
    def test_chat_endpoint_processing_failure(self, mock_process_message):
        """Test chat endpoint handles processing failures."""
        # Mock failed response
        mock_process_message.return_value = {
            "response": "Error occurred",
            "thread_id": "test-thread-123",
            "success": False,
            "error": "OpenAI API error"
        }
        
        response = client.post(
            "/api/v1/chat",
            json={
                "message": "Hello",
                "thread_id": "test-thread-123"
            }
        )
        
        assert response.status_code == 500
        assert "Failed to process message" in response.json()["detail"]
    
    def test_chat_endpoint_invalid_request(self):
        """Test chat endpoint validates request data."""
        # Missing required message field
        response = client.post(
            "/api/v1/chat",
            json={
                "thread_id": "test-thread-123"
            }
        )
        
        assert response.status_code == 422  # Validation error

if __name__ == "__main__":
    # Run tests
    pytest.main([__file__, "-v"])