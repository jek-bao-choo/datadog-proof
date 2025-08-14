"""Core configuration module for LangGraph application."""
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv(override=True)

class Config:
    """Configuration settings for the application."""
    
    # API Keys
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
    DATADOG_API_KEY = os.getenv("DATADOG_API_KEY")
    DATADOG_APP_KEY = os.getenv("DATADOG_APP_KEY")
    
    # Application settings
    ENVIRONMENT = os.getenv("ENVIRONMENT", "development")
    
    # LangGraph settings
    THREAD_TIMEOUT = 300  # 5 minutes
    MAX_ITERATIONS = 10
    
    # FastAPI settings
    HOST = "0.0.0.0"
    PORT = 8000
    DEBUG = ENVIRONMENT == "development"
    
    @classmethod
    def validate_config(cls) -> bool:
        """Validate that all required configuration is present."""
        required_keys = [
            cls.OPENAI_API_KEY,
            cls.DATADOG_API_KEY,
            cls.DATADOG_APP_KEY,
        ]
        
        missing_keys = [key for key in required_keys if not key]
        
        if missing_keys:
            print(f"Missing required configuration: {missing_keys}")
            return False
        
        return True

# Global config instance
config = Config()