import pytest
import os
from unittest.mock import patch
from app.config import Settings

def test_settings_with_valid_api_key():
    with patch.dict(os.environ, {
        'OPENAI_API_KEY': 'test-api-key',
        'APP_NAME': 'Test App',
        'DEBUG': 'true'
    }):
        settings = Settings()
        assert settings.openai_api_key == 'test-api-key'
        assert settings.app_name == 'Test App'
        assert settings.debug is True

def test_settings_without_api_key():
    with patch.dict(os.environ, {}, clear=True):
        with pytest.raises(ValueError, match="OPENAI_API_KEY environment variable is required"):
            Settings()

def test_settings_with_placeholder_api_key():
    with patch.dict(os.environ, {'OPENAI_API_KEY': 'your_openai_api_key_here'}):
        with pytest.raises(ValueError, match="OPENAI_API_KEY environment variable is required"):
            Settings()

def test_settings_defaults():
    with patch.dict(os.environ, {'OPENAI_API_KEY': 'test-key'}, clear=True):
        # Create settings with no env file to test defaults
        settings = Settings(_env_file=None)
        assert settings.app_name == "FastAPI OpenAI Gateway"
        assert settings.app_version == "1.0.0"
        assert settings.debug is False
        assert settings.host == "127.0.0.1"
        assert settings.port == 8000
        assert settings.log_level == "INFO"