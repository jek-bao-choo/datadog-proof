import pytest
from unittest.mock import patch, MagicMock, AsyncMock
from app.services.openai_service import OpenAIService
from app.models import ChatRequest

@pytest.fixture
def openai_service():
    with patch('app.services.openai_service.settings') as mock_settings:
        mock_settings.openai_api_key = "test-key"
        return OpenAIService()

@pytest.mark.asyncio
async def test_send_chat_completion_success(openai_service, mock_openai_response):
    request = ChatRequest(message="Hello, world!")
    
    with patch.object(openai_service.client.chat.completions, 'create', return_value=mock_openai_response):
        response = await openai_service.send_chat_completion(request)
        
        assert response.response == "This is a test response from OpenAI"
        assert response.model == "gpt-3.5-turbo"
        assert response.usage.prompt_tokens == 10
        assert response.usage.completion_tokens == 12
        assert response.usage.total_tokens == 22

@pytest.mark.asyncio
async def test_send_chat_completion_api_error(openai_service):
    request = ChatRequest(message="Hello, world!")
    
    with patch.object(openai_service.client.chat.completions, 'create', side_effect=Exception("API Error")):
        with pytest.raises(Exception, match="OpenAI API error: API Error"):
            await openai_service.send_chat_completion(request)

@pytest.mark.asyncio
async def test_send_chat_completion_with_custom_parameters(openai_service, mock_openai_response):
    request = ChatRequest(
        message="Custom message",
        model="gpt-4",
        max_tokens=200,
        temperature=0.5
    )
    
    with patch.object(openai_service.client.chat.completions, 'create', return_value=mock_openai_response) as mock_create:
        response = await openai_service.send_chat_completion(request)
        
        mock_create.assert_called_once_with(
            model="gpt-4",
            messages=[{"role": "user", "content": "Custom message"}],
            max_tokens=200,
            temperature=0.5
        )
        
        assert response.response == "This is a test response from OpenAI"