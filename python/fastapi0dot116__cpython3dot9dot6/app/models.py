from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from datetime import datetime

class ChatRequest(BaseModel):
    message: str = Field(..., description="The user's message to send to OpenAI")
    model: str = Field(default="gpt-3.5-turbo", description="OpenAI model to use")
    max_tokens: Optional[int] = Field(default=150, description="Maximum tokens in response")
    temperature: Optional[float] = Field(default=0.7, ge=0, le=2, description="Response creativity (0-2)")

    model_config = {
        "json_schema_extra": {
            "example": {
                "message": "Hello, how are you?",
                "model": "gpt-3.5-turbo",
                "max_tokens": 150,
                "temperature": 0.7
            }
        }
    }

class UsageInfo(BaseModel):
    prompt_tokens: int
    completion_tokens: int
    total_tokens: int

class ChatResponse(BaseModel):
    response: str = Field(..., description="OpenAI's response message")
    model: str = Field(..., description="Model used for the response")
    usage: UsageInfo = Field(..., description="Token usage information")
    created_at: datetime = Field(default_factory=datetime.now, description="Response timestamp")

    model_config = {
        "json_schema_extra": {
            "example": {
                "response": "I'm doing well, thank you for asking!",
                "model": "gpt-3.5-turbo",
                "usage": {
                    "prompt_tokens": 10,
                    "completion_tokens": 12,
                    "total_tokens": 22
                },
                "created_at": "2023-01-01T12:00:00Z"
            }
        }
    }

class ErrorResponse(BaseModel):
    error: str = Field(..., description="Error message")
    detail: Optional[str] = Field(None, description="Additional error details")
    error_code: Optional[str] = Field(None, description="Error code for programmatic handling")

    model_config = {
        "json_schema_extra": {
            "example": {
                "error": "Invalid request",
                "detail": "The message field is required",
                "error_code": "VALIDATION_ERROR"
            }
        }
    }

class HealthResponse(BaseModel):
    status: str = Field(..., description="Service health status")
    timestamp: datetime = Field(default_factory=datetime.now, description="Health check timestamp")
    version: str = Field(..., description="Application version")
    environment: str = Field(default="development", description="Current environment")

    model_config = {
        "json_schema_extra": {
            "example": {
                "status": "healthy",
                "timestamp": "2023-01-01T12:00:00Z",
                "version": "1.0.0",
                "environment": "development"
            }
        }
    }