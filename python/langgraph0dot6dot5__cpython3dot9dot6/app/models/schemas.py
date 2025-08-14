"""Data schemas and models for the LangGraph application."""
from typing import List, Optional, Any, Dict, Union
from pydantic import BaseModel, Field
from datetime import datetime

# Request/Response schemas for FastAPI
class ChatRequest(BaseModel):
    """Request schema for chat endpoint."""
    message: str = Field(..., description="User message to process")
    thread_id: Optional[str] = Field(None, description="Thread ID for conversation continuity")

class ChatResponse(BaseModel):
    """Response schema for chat endpoint."""
    response: str = Field(..., description="AI assistant response")
    thread_id: str = Field(..., description="Thread ID for conversation continuity")
    timestamp: datetime = Field(default_factory=datetime.now, description="Response timestamp")

class HealthResponse(BaseModel):
    """Response schema for health check endpoint."""
    status: str = Field(..., description="Application status")
    timestamp: datetime = Field(default_factory=datetime.now, description="Health check timestamp")
    version: str = Field(default="1.0.0", description="Application version")

# LangGraph State schema
class GraphState(BaseModel):
    """State schema for LangGraph workflow."""
    messages: List[Dict[str, Any]] = Field(default_factory=list, description="Conversation messages")
    thread_id: str = Field(..., description="Thread identifier")
    next_action: Optional[str] = Field(None, description="Next action to take")
    tool_results: Optional[Dict[str, Any]] = Field(None, description="Results from tool execution")

# Tool schemas
class SearchResult(BaseModel):
    """Schema for search tool results."""
    query: str = Field(..., description="Search query")
    results: List[Dict[str, str]] = Field(default_factory=list, description="Search results")
    timestamp: datetime = Field(default_factory=datetime.now, description="Search timestamp")

class DatadogMetric(BaseModel):
    """Schema for Datadog metric results."""
    metric_name: str = Field(..., description="Metric name")
    query: str = Field(..., description="Datadog query")
    values: List[Dict[str, Union[float, int, str]]] = Field(default_factory=list, description="Metric values")
    timestamp: datetime = Field(default_factory=datetime.now, description="Query timestamp")