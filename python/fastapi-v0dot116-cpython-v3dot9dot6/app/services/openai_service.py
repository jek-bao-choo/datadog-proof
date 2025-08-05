import logging
from openai import OpenAI
from typing import Dict, Any
from ..config import settings
from ..models import ChatRequest, ChatResponse, UsageInfo

logger = logging.getLogger(__name__)

class OpenAIService:
    def __init__(self):
        self.client = OpenAI(api_key=settings.openai_api_key)
        logger.info("OpenAI service initialized")

    async def send_chat_completion(self, request: ChatRequest) -> ChatResponse:
        try:
            logger.info(f"Sending chat completion request with model: {request.model}")
            logger.debug(f"Request details: {request.model_dump()}")
            
            response = self.client.chat.completions.create(
                model=request.model,
                messages=[
                    {"role": "user", "content": request.message}
                ],
                max_tokens=request.max_tokens,
                temperature=request.temperature
            )
            
            logger.info(f"Received response from OpenAI API")
            logger.debug(f"Response usage: {response.usage}")
            
            chat_response = ChatResponse(
                response=response.choices[0].message.content,
                model=response.model,
                usage=UsageInfo(
                    prompt_tokens=response.usage.prompt_tokens,
                    completion_tokens=response.usage.completion_tokens,
                    total_tokens=response.usage.total_tokens
                )
            )
            
            return chat_response
            
        except Exception as e:
            logger.error(f"Error calling OpenAI API: {str(e)}")
            raise Exception(f"OpenAI API error: {str(e)}")

openai_service = OpenAIService()