"""API tests for FastAPI endpoints."""
import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
import os
from main import app


class TestAPI:
    """Test cases for FastAPI endpoints."""
    
    def setup_method(self):
        """Set up test environment."""
        # Set test environment variables
        os.environ['OPENAI_API_KEY'] = 'test-openai-key'
        os.environ['DATADOG_API_KEY'] = 'test-datadog-key'
        os.environ['DATADOG_APP_KEY'] = 'test-datadog-app-key'
        self.client = TestClient(app)
    
    def test_health_check(self):
        """Test health check endpoint."""
        response = self.client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert "LangChain Tool Calling API" in data["message"]
    
    def test_simple_health(self):
        """Test simple health endpoint."""
        response = self.client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "ok"
    
    @patch('app.api.chat.get_agent')
    def test_chat_status(self, mock_get_agent):
        """Test chat status endpoint."""
        # Mock agent to avoid initialization issues
        mock_get_agent.return_value = MagicMock()
        
        response = self.client.get("/api/v1/chat/status")
        assert response.status_code == 200
        data = response.json()
        assert "status" in data
        assert "openai_configured" in data
        assert "available_tools" in data
        assert "tools" in data
    
    @patch('app.api.chat.get_agent')
    def test_chat_endpoint_success(self, mock_get_agent):
        """Test successful chat endpoint."""
        # Mock agent response
        mock_agent = MagicMock()
        mock_agent.process_message.return_value = {
            "response": "Hello! How can I help you?",
            "session_id": "test-session",
            "success": True
        }
        mock_get_agent.return_value = mock_agent
        
        response = self.client.post(
            "/api/v1/chat",
            json={"message": "Hello"}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["response"] == "Hello! How can I help you?"
        assert data["session_id"] == "test-session"
    
    @patch('app.api.chat.get_agent')
    def test_chat_endpoint_with_session_id(self, mock_get_agent):
        """Test chat endpoint with custom session ID."""
        # Mock agent response
        mock_agent = MagicMock()
        mock_agent.process_message.return_value = {
            "response": "Continuing conversation",
            "session_id": "custom-session-123",
            "success": True
        }
        mock_get_agent.return_value = mock_agent
        
        response = self.client.post(
            "/api/v1/chat",
            json={
                "message": "Continue our chat",
                "session_id": "custom-session-123"
            }
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["session_id"] == "custom-session-123"
    
    def test_chat_endpoint_empty_message(self):
        """Test chat endpoint with empty message."""
        response = self.client.post(
            "/api/v1/chat",
            json={"message": ""}
        )
        
        # Should return validation error
        assert response.status_code == 422
    
    def test_chat_endpoint_missing_message(self):
        """Test chat endpoint without message field."""
        response = self.client.post(
            "/api/v1/chat",
            json={}
        )
        
        # Should return validation error
        assert response.status_code == 422
    
    def test_chat_endpoint_invalid_json(self):
        """Test chat endpoint with invalid JSON."""
        response = self.client.post(
            "/api/v1/chat",
            data="invalid json"
        )
        
        # Should return validation error
        assert response.status_code == 422
    
    @patch('app.api.chat.get_agent')
    def test_chat_endpoint_agent_error(self, mock_get_agent):
        """Test chat endpoint when agent returns error."""
        # Mock agent error response
        mock_agent = MagicMock()
        mock_agent.process_message.return_value = {
            "response": "Error occurred",
            "session_id": "test-session",
            "success": False,
            "error": "Agent processing failed"
        }
        mock_get_agent.return_value = mock_agent
        
        response = self.client.post(
            "/api/v1/chat",
            json={"message": "Hello"}
        )
        
        assert response.status_code == 500
        data = response.json()
        assert "Agent processing failed" in str(data)
    
    @patch('app.api.chat.get_agent')
    def test_chat_endpoint_exception(self, mock_get_agent):
        """Test chat endpoint when agent raises exception."""
        # Mock agent to raise exception
        mock_get_agent.side_effect = Exception("Agent initialization failed")
        
        response = self.client.post(
            "/api/v1/chat",
            json={"message": "Hello"}
        )
        
        assert response.status_code == 500
        data = response.json()
        assert "Agent initialization failed" in str(data)
    
    def test_chat_endpoint_long_message(self):
        """Test chat endpoint with very long message."""
        long_message = "x" * 1001  # Exceeds 1000 character limit
        
        response = self.client.post(
            "/api/v1/chat",
            json={"message": long_message}
        )
        
        # Should return validation error
        assert response.status_code == 422
    
    def test_openapi_docs(self):
        """Test that OpenAPI docs are accessible."""
        response = self.client.get("/docs")
        assert response.status_code == 200
    
    def test_openapi_json(self):
        """Test that OpenAPI JSON is accessible."""
        response = self.client.get("/openapi.json")
        assert response.status_code == 200
        data = response.json()
        assert "openapi" in data
        assert data["info"]["title"] == "LangChain Tool Calling API"