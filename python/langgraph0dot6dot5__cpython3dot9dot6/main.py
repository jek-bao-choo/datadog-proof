"""Main FastAPI application entry point for LangGraph chat service."""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.api.chat import router as chat_router
from app.core.config import config
import logging
import uvicorn

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI application
app = FastAPI(
    title="LangGraph Chat API",
    description="A conversational AI service with tool calling capabilities using LangGraph",
    version="1.0.0",
    debug=config.DEBUG
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include chat router
app.include_router(chat_router, prefix="/api/v1", tags=["chat"])

@app.get("/")
async def root():
    """Root endpoint providing basic API information."""
    return {
        "message": "LangGraph Chat API",
        "version": "1.0.0",
        "status": "running",
        "endpoints": {
            "health": "/api/v1/health",
            "chat": "/api/v1/chat",
            "docs": "/docs"
        }
    }

@app.on_event("startup")
async def startup_event():
    """Application startup event handler."""
    logger.info("Starting LangGraph Chat API...")
    
    # Validate configuration
    if not config.validate_config():
        logger.error("Configuration validation failed")
        raise HTTPException(
            status_code=500,
            detail="Server configuration error: missing required API keys"
        )
    
    logger.info("LangGraph Chat API started successfully")

@app.on_event("shutdown")
async def shutdown_event():
    """Application shutdown event handler."""
    logger.info("Shutting down LangGraph Chat API...")

if __name__ == "__main__":
    # Run the application
    uvicorn.run(
        "main:app",
        host=config.HOST,
        port=config.PORT,
        reload=config.DEBUG,
        log_level="info"
    )