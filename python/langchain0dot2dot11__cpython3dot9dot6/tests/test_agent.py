"""Integration tests for LangChain agent."""
import pytest
from unittest.mock import patch, MagicMock
import os
from app.core.agent import LangChainAgent, get_agent, reset_agent


class TestLangChainAgent:
    """Test cases for LangChain agent."""
    
    def setup_method(self):
        """Set up test environment."""
        # Reset agent instance
        reset_agent()
        
        # Set test environment variables
        os.environ['OPENAI_API_KEY'] = 'test-openai-key'
    
    def teardown_method(self):
        """Clean up after tests."""
        reset_agent()
    
    @patch('app.core.config.config.validate_required_config')
    def test_agent_initialization_without_api_key(self, mock_validate):
        """Test agent initialization without API key."""
        # Mock validation to raise ValueError for missing API key
        mock_validate.side_effect = ValueError("OPENAI_API_KEY environment variable is required")
        
        with pytest.raises(ValueError, match="OPENAI_API_KEY"):
            LangChainAgent()
    
    @patch('app.core.config.config.validate_required_config')
    @patch('app.core.agent.ChatOpenAI')
    @patch('app.core.agent.create_tool_calling_agent')
    @patch('app.core.agent.AgentExecutor')
    def test_agent_initialization_success(self, mock_executor, mock_create_agent, mock_llm, mock_validate):
        """Test successful agent initialization."""
        # Mock successful validation
        mock_validate.return_value = None
        
        # Mock components
        mock_llm.return_value = MagicMock()
        mock_create_agent.return_value = MagicMock()
        mock_executor.return_value = MagicMock()
        
        agent = LangChainAgent()
        
        assert agent.llm is not None
        assert agent.agent_executor is not None
        mock_validate.assert_called_once()
        mock_llm.assert_called_once()
        mock_create_agent.assert_called_once()
        mock_executor.assert_called_once()
    
    @patch('app.core.config.config.validate_required_config')
    @patch('app.core.agent.ChatOpenAI')
    @patch('app.core.agent.create_tool_calling_agent')
    @patch('app.core.agent.AgentExecutor')
    def test_process_message_success(self, mock_executor, mock_create_agent, mock_llm, mock_validate):
        """Test successful message processing."""
        # Mock successful validation
        mock_validate.return_value = None
        
        # Mock components
        mock_llm.return_value = MagicMock()
        mock_create_agent.return_value = MagicMock()
        
        # Mock agent executor response
        mock_agent_executor = MagicMock()
        mock_agent_executor.invoke.return_value = {"output": "Test response"}
        mock_executor.return_value = mock_agent_executor
        
        agent = LangChainAgent()
        result = agent.process_message("Hello world")
        
        assert result["success"] is True
        assert result["response"] == "Test response"
        assert "session_id" in result
    
    @patch('app.core.config.config.validate_required_config')
    @patch('app.core.agent.ChatOpenAI')
    @patch('app.core.agent.create_tool_calling_agent')
    @patch('app.core.agent.AgentExecutor')
    def test_process_message_empty(self, mock_executor, mock_create_agent, mock_llm, mock_validate):
        """Test processing empty message."""
        # Mock successful validation
        mock_validate.return_value = None
        
        # Mock components
        mock_llm.return_value = MagicMock()
        mock_create_agent.return_value = MagicMock()
        mock_executor.return_value = MagicMock()
        
        agent = LangChainAgent()
        result = agent.process_message("")
        
        assert result["success"] is False
        assert "Empty message" in result["error"]
    
    @patch('app.core.config.config.validate_required_config')
    @patch('app.core.agent.ChatOpenAI')
    @patch('app.core.agent.create_tool_calling_agent')
    @patch('app.core.agent.AgentExecutor')
    def test_process_message_with_session_id(self, mock_executor, mock_create_agent, mock_llm, mock_validate):
        """Test message processing with custom session ID."""
        # Mock successful validation
        mock_validate.return_value = None
        
        # Mock components
        mock_llm.return_value = MagicMock()
        mock_create_agent.return_value = MagicMock()
        
        # Mock agent executor response
        mock_agent_executor = MagicMock()
        mock_agent_executor.invoke.return_value = {"output": "Test response"}
        mock_executor.return_value = mock_agent_executor
        
        agent = LangChainAgent()
        result = agent.process_message("Hello", session_id="test-session-123")
        
        assert result["success"] is True
        assert result["session_id"] == "test-session-123"
    
    @patch('app.core.config.config.validate_required_config')
    @patch('app.core.agent.ChatOpenAI')
    @patch('app.core.agent.create_tool_calling_agent')
    @patch('app.core.agent.AgentExecutor')
    def test_process_message_agent_error(self, mock_executor, mock_create_agent, mock_llm, mock_validate):
        """Test message processing when agent fails."""
        # Mock successful validation
        mock_validate.return_value = None
        
        # Mock components
        mock_llm.return_value = MagicMock()
        mock_create_agent.return_value = MagicMock()
        
        # Mock agent executor to raise an exception
        mock_agent_executor = MagicMock()
        mock_agent_executor.invoke.side_effect = Exception("Agent processing error")
        mock_executor.return_value = mock_agent_executor
        
        agent = LangChainAgent()
        result = agent.process_message("Hello world")
        
        assert result["success"] is False
        assert "Agent processing error" in result["error"]
    
    @patch('app.core.agent.LangChainAgent')
    def test_get_agent_singleton(self, mock_agent_class):
        """Test that get_agent returns singleton instance."""
        mock_instance = MagicMock()
        mock_agent_class.return_value = mock_instance
        
        # First call
        agent1 = get_agent()
        
        # Second call
        agent2 = get_agent()
        
        # Should be the same instance
        assert agent1 is agent2
        
        # Agent should only be instantiated once
        mock_agent_class.assert_called_once()
    
    def test_reset_agent(self):
        """Test agent reset functionality."""
        # This test doesn't require mocking since we're testing the reset function
        reset_agent()
        
        # After reset, the next get_agent call should create a new instance
        # This is implicitly tested by the setup/teardown methods