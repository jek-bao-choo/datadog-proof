"""FastAPI chat endpoints for LangGraph integration."""
from fastapi import APIRouter, HTTPException
from app.models.schemas import ChatRequest, ChatResponse, HealthResponse
from app.core.graph import process_message
from app.core.config import config
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create router instance
router = APIRouter()

@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest) -> ChatResponse:
    """
    Process a chat message through the LangGraph workflow.
    
    Args:
        request: Chat request containing message and optional thread_id
        
    Returns:
        ChatResponse with AI response and thread_id
        
    Raises:
        HTTPException: If processing fails or configuration is invalid
    """
    # Validate configuration
    if not config.validate_config():
        logger.error("Invalid configuration: missing required API keys")
        raise HTTPException(
            status_code=500,
            detail="Server configuration error: missing required API keys"
        )
    
    try:
        logger.info(f"Processing message: {request.message[:50]}...")
        
        # Process message through LangGraph
        result = process_message(
            message=request.message,
            thread_id=request.thread_id
        )
        
        if not result.get("success", False):
            logger.error(f"Graph processing failed: {result.get('error', 'Unknown error')}")
            raise HTTPException(
                status_code=500,
                detail=f"Failed to process message: {result.get('error', 'Unknown error')}"
            )
        
        logger.info(f"Message processed successfully for thread: {result['thread_id']}")
        
        return ChatResponse(
            response=result["response"],
            thread_id=result["thread_id"]
        )
        
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        logger.error(f"Unexpected error in chat endpoint: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )

@router.get("/health", response_model=HealthResponse)
async def health_check() -> HealthResponse:
    """
    Health check endpoint to verify service status.
    
    Returns:
        HealthResponse indicating service status
    """
    try:
        # Check if configuration is valid
        config_valid = config.validate_config()
        
        status = "healthy" if config_valid else "unhealthy"
        
        logger.info(f"Health check performed: {status}")
        
        return HealthResponse(
            status=status,
            version="1.0.0"
        )
        
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        return HealthResponse(
            status="unhealthy",
            version="1.0.0"
        )