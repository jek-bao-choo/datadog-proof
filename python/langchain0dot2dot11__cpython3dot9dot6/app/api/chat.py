"""FastAPI chat endpoints for LangChain agent."""
import logging
from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from app.models.schemas import ChatRequest, ChatResponse, ErrorResponse
from app.core.agent import get_agent

# Configure logging
logger = logging.getLogger(__name__)

# Create router
router = APIRouter(prefix="/api/v1", tags=["Chat"])

@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    """
    Chat with the LangChain agent.
    
    The agent can:
    - Search the internet using DuckDuckGo
    - Retrieve Datadog metrics (if configured)
    
    Example requests:
    - {"message": "Search for Python tutorials"}
    - {"message": "What are the latest AI developments?"}
    - {"message": "Get system CPU metrics for the last hour", "session_id": "session123"}
    """
    try:
        logger.info(f"Chat request received: {request.message[:100]}...")
        
        # Get agent instance
        agent = get_agent()
        
        # Process message
        result = agent.process_message(
            message=request.message,
            session_id=request.session_id
        )
        
        if result["success"]:
            logger.info(f"Chat response generated for session: {result['session_id']}")
            return ChatResponse(**result)
        else:
            logger.warning(f"Chat processing failed: {result.get('error', 'Unknown error')}")
            raise HTTPException(
                status_code=500,
                detail=ErrorResponse(
                    error=result.get("error", "Unknown error occurred"),
                    details="The agent encountered an error while processing your request"
                ).model_dump()
            )
    
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        logger.error(f"Unexpected error in chat endpoint: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=ErrorResponse(
                error="Internal server error",
                details=str(e)
            ).model_dump()
        )

@router.get("/chat/status")
async def chat_status():
    """
    Get the status of the chat agent and available tools.
    """
    try:
        from app.core.config import config
        from app.tools import AVAILABLE_TOOLS, TOOL_DESCRIPTIONS
        
        # Check agent initialization
        agent_status = "healthy"
        try:
            get_agent()
        except Exception as e:
            agent_status = f"error: {str(e)}"
        
        return JSONResponse(content={
            "status": "healthy" if agent_status == "healthy" else "degraded",
            "agent_status": agent_status,
            "openai_configured": bool(config.OPENAI_API_KEY),
            "datadog_configured": config.is_datadog_configured(),
            "available_tools": len(AVAILABLE_TOOLS),
            "tools": TOOL_DESCRIPTIONS,
            "message": "Chat API is operational"
        })
        
    except Exception as e:
        logger.error(f"Error getting chat status: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={
                "status": "error",
                "message": f"Failed to get status: {str(e)}"
            }
        )