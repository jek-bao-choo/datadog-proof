"""Configuration module for LangChain tool calling application."""
import os
from typing import Optional
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Config:
    """Configuration class for application settings."""
    
    # OpenAI Configuration (Required)
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    
    # Datadog Configuration (Required for Datadog metrics)
    DATADOG_API_KEY: str = os.getenv("DATADOG_API_KEY", "")
    DATADOG_APP_KEY: str = os.getenv("DATADOG_APP_KEY", "")
    
    # Application Configuration
    VERBOSE_LOGGING: bool = os.getenv("VERBOSE_LOGGING", "False").lower() == "true"
    
    # FastAPI Configuration
    APP_TITLE: str = "LangChain Tool Calling API"
    APP_DESCRIPTION: str = "A simple API for LangChain agents with search and Datadog tools"
    APP_VERSION: str = "0.1.0"
    
    def validate_required_config(self) -> None:
        """Validate that required configuration is present."""
        if not self.OPENAI_API_KEY:
            raise ValueError("OPENAI_API_KEY environment variable is required")
        
        # Datadog keys are validated when the tool is used
        # This allows the app to start even without Datadog configuration
    
    def is_datadog_configured(self) -> bool:
        """Check if Datadog configuration is available."""
        return bool(self.DATADOG_API_KEY and self.DATADOG_APP_KEY)

# Global configuration instance
config = Config()