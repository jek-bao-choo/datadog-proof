"""FastAPI application for LangChain tool calling."""
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.api.chat import router as chat_router
from app.core.config import config
from app.models.schemas import HealthResponse, ErrorResponse

# Configure logging
logging.basicConfig(
    level=logging.INFO if config.VERBOSE_LOGGING else logging.WARNING,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan handler."""
    # Startup
    logger.info("Starting LangChain Tool Calling API...")
    
    # Validate configuration
    try:
        config.validate_required_config()
        logger.info("✅ Configuration validated")
    except Exception as e:
        logger.error(f"❌ Configuration validation failed: {str(e)}")
        # Continue anyway for development purposes
    
    # Initialize agent (lazy loading)
    logger.info("🤖 Agent will be initialized on first request")
    
    logger.info("🚀 LangChain Tool Calling API started successfully")
    
    yield
    
    # Shutdown
    logger.info("Shutting down LangChain Tool Calling API...")

# Create FastAPI app
app = FastAPI(
    title=config.APP_TITLE,
    description=config.APP_DESCRIPTION,
    version=config.APP_VERSION,
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(chat_router)

@app.get("/", response_model=HealthResponse)
async def health_check():
    """Health check endpoint."""
    try:
        return HealthResponse(
            status="healthy",
            message=f"{config.APP_TITLE} is running"
        )
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=ErrorResponse(
                error="Health check failed",
                details=str(e)
            ).model_dump()
        )

@app.get("/health")
async def simple_health():
    """Simple health endpoint for load balancers."""
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
