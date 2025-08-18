"""Pydantic models for request/response schemas."""
from typing import Optional, Any, Dict
from pydantic import BaseModel, Field

class ChatRequest(BaseModel):
    """Request model for chat endpoint."""
    message: str = Field(..., description="User message to process", min_length=1, max_length=1000)
    session_id: Optional[str] = Field(None, description="Optional session ID for conversation continuity")

class ChatResponse(BaseModel):
    """Response model for chat endpoint."""
    response: str = Field(..., description="Agent's response to the user message")
    session_id: str = Field(..., description="Session ID for conversation continuity")
    success: bool = Field(..., description="Whether the request was processed successfully")
    
    class Config:
        json_schema_extra = {
            "example": {
                "response": "I found information about Python tutorials...",
                "session_id": "session_123",
                "success": True
            }
        }

class ErrorResponse(BaseModel):
    """Error response model."""
    error: str = Field(..., description="Error message")
    details: Optional[str] = Field(None, description="Additional error details")
    success: bool = Field(False, description="Always false for error responses")
    
    class Config:
        json_schema_extra = {
            "example": {
                "error": "Invalid API key",
                "details": "Please check your OPENAI_API_KEY configuration",
                "success": False
            }
        }

class HealthResponse(BaseModel):
    """Health check response model."""
    status: str = Field(..., description="Application status")
    message: str = Field(..., description="Health status message")
    
    class Config:
        json_schema_extra = {
            "example": {
                "status": "healthy",
                "message": "LangChain Tool Calling API is running"
            }
        }