"""LangChain agent implementation with tool calling capabilities."""
import uuid
import logging
from typing import Dict, Any, Optional
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_openai import ChatOpenAI
from langchain.agents import AgentExecutor, create_tool_calling_agent
from app.tools import AVAILABLE_TOOLS
from app.core.config import config

# Configure logging
logger = logging.getLogger(__name__)

class LangChainAgent:
    """LangChain agent with tool calling capabilities."""
    
    def __init__(self):
        """Initialize the agent with tools and configuration."""
        self.llm = None
        self.agent_executor = None
        self._initialize_agent()
    
    def _initialize_agent(self):
        """Initialize the LangChain agent with OpenAI and tools."""
        try:
            # Validate configuration
            config.validate_required_config()
            
            # Initialize OpenAI LLM
            self.llm = ChatOpenAI(
                model="gpt-4o-mini",
                api_key=config.OPENAI_API_KEY,
                temperature=0.7,
                verbose=config.VERBOSE_LOGGING
            )
            
            # Create prompt template
            prompt = ChatPromptTemplate.from_messages([
                ("system", self._get_system_message()),
                ("human", "{input}"),
                MessagesPlaceholder(variable_name="agent_scratchpad"),
            ])
            
            # Create agent
            agent = create_tool_calling_agent(self.llm, AVAILABLE_TOOLS, prompt)
            
            # Create agent executor
            self.agent_executor = AgentExecutor(
                agent=agent,
                tools=AVAILABLE_TOOLS,
                verbose=config.VERBOSE_LOGGING,
                handle_parsing_errors=True,
                max_iterations=5  # Limit iterations to prevent infinite loops
            )
            
            logger.info("LangChain agent initialized successfully")
            
        except Exception as e:
            logger.error(f"Failed to initialize agent: {str(e)}")
            raise
    
    def _get_system_message(self) -> str:
        """Get the system message for the agent."""
        datadog_status = "✅ Available" if config.is_datadog_configured() else "❌ Not configured"
        
        return f"""You are a helpful AI assistant that can:

1. **Search Tool**: Search the internet for information using DuckDuckGo
   - Use this for current events, general knowledge, tutorials, documentation
   - Example queries: "Python tutorials", "latest AI news", "how to use FastAPI"

2. **Datadog Metrics Tool**: Retrieve metrics from Datadog ({datadog_status})
   - Use this for system metrics, application performance data
   - Example queries: "system.cpu.user", "avg:docker.cpu.usage"
   - Time periods: "1h", "24h", "7d", "10d"

**Tool Selection Guidelines:**
- Use search_tool for: information lookup, tutorials, current events, general questions
- Use datadog_metrics_tool for: system metrics, performance monitoring, infrastructure data

**Response Guidelines:**
- Always use tools when they can provide better/current information
- Provide clear, helpful responses based on tool results
- If a tool fails, explain what went wrong and suggest alternatives
- Keep responses concise but informative

Choose the appropriate tool based on the user's query and provide helpful responses."""

    def process_message(self, message: str, session_id: Optional[str] = None) -> Dict[str, Any]:
        """
        Process a user message through the agent.
        
        Args:
            message: User's input message
            session_id: Optional session ID for conversation continuity
            
        Returns:
            Dictionary containing response and metadata
        """
        if not session_id:
            session_id = str(uuid.uuid4())
        
        try:
            if not self.agent_executor:
                raise RuntimeError("Agent not properly initialized")
            
            if not message or not message.strip():
                return {
                    "response": "Please provide a message for me to help you with.",
                    "session_id": session_id,
                    "success": False,
                    "error": "Empty message provided"
                }
            
            logger.info(f"Processing message for session {session_id}: {message[:100]}...")
            
            # Process through agent executor
            result = self.agent_executor.invoke({"input": message.strip()})
            
            # Extract response
            response_content = result.get("output", "I apologize, but I couldn't generate a proper response.")
            
            logger.info(f"Agent response generated for session {session_id}")
            
            return {
                "response": response_content,
                "session_id": session_id,
                "success": True
            }
            
        except Exception as e:
            logger.error(f"Error processing message: {str(e)}", exc_info=True)
            
            # Handle specific error cases
            error_message = str(e)
            if "api key" in error_message.lower():
                response = "I'm having trouble with my API configuration. Please check that the OpenAI API key is properly configured."
            elif "rate limit" in error_message.lower():
                response = "I'm currently experiencing rate limiting. Please try again in a moment."
            else:
                response = f"I encountered an error while processing your request: {error_message}"
            
            return {
                "response": response,
                "session_id": session_id,
                "success": False,
                "error": error_message
            }

# Global agent instance
_agent_instance = None

def get_agent() -> LangChainAgent:
    """Get the global agent instance (singleton pattern)."""
    global _agent_instance
    if _agent_instance is None:
        _agent_instance = LangChainAgent()
    return _agent_instance

def reset_agent():
    """Reset the global agent instance (useful for testing)."""
    global _agent_instance
    _agent_instance = None