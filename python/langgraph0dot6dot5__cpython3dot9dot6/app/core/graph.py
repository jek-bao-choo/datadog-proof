"""LangGraph workflow implementation with tool calling and routing."""
from typing import Dict, Any, Literal
from langchain_core.messages import HumanMessage, AIMessage, ToolMessage
from langchain_openai import ChatOpenAI
from langgraph.graph import StateGraph, MessagesState
from langgraph.prebuilt import ToolNode
from langgraph.checkpoint.memory import MemorySaver
from app.tools import AVAILABLE_TOOLS
from app.core.config import config
import uuid

# Use MessagesState directly instead of extending it
GraphState = MessagesState

# Initialize OpenAI LLM with tools
llm = ChatOpenAI(
    model="gpt-4o-mini",
    api_key=config.OPENAI_API_KEY,
    temperature=0.7
).bind_tools(AVAILABLE_TOOLS)

# Initialize tool node for executing tools
tool_node = ToolNode(AVAILABLE_TOOLS)

def route_tools(state: GraphState) -> Literal["tools", "__end__"]:
    """
    Route to tools if the last message has tool calls, otherwise end.
    
    Args:
        state: Current graph state
        
    Returns:
        Next node to execute ("tools" or "__end__")
    """
    messages = state["messages"]
    if not messages:
        return "__end__"
    
    last_message = messages[-1]
    
    # Check if the last message is an AI message with tool calls
    if isinstance(last_message, AIMessage) and hasattr(last_message, "tool_calls") and last_message.tool_calls:
        return "tools"
    
    return "__end__"

def call_model(state: GraphState) -> Dict[str, Any]:
    """
    Call the language model with the current state.
    
    Args:
        state: Current graph state containing messages
        
    Returns:
        Updated state with new AI message
    """
    messages = state["messages"]
    
    # Add system message for better context
    system_message = HumanMessage(content="""You are a helpful AI assistant that can:
1. Search the internet for information using the search tool
2. Retrieve metrics from Datadog using the datadog_metrics tool

When users ask questions that require current information or specific metrics, use the appropriate tools.
Always provide clear, helpful responses based on the tool results.""")
    
    # Prepend system message if this is the first interaction
    if not any(isinstance(msg, HumanMessage) and "helpful AI assistant" in msg.content for msg in messages):
        messages = [system_message] + messages
    
    # Call the model
    response = llm.invoke(messages)
    
    return {"messages": [response]}

def create_workflow() -> StateGraph:
    """
    Create and configure the LangGraph workflow.
    
    Returns:
        Compiled StateGraph workflow
    """
    # Create workflow builder
    workflow = StateGraph(GraphState)
    
    # Add nodes
    workflow.add_node("agent", call_model)
    workflow.add_node("tools", tool_node)
    
    # Set entry point
    workflow.set_entry_point("agent")
    
    # Add conditional edges
    workflow.add_conditional_edges(
        "agent",
        route_tools,
        {"tools": "tools", "__end__": "__end__"}
    )
    
    # Add edge from tools back to agent
    workflow.add_edge("tools", "agent")
    
    # Initialize memory saver for checkpointing
    memory = MemorySaver()
    
    # Compile the graph
    app = workflow.compile(checkpointer=memory)
    
    return app

# Create global workflow instance
workflow_app = create_workflow()

def process_message(message: str, thread_id: str = None) -> Dict[str, Any]:
    """
    Process a user message through the LangGraph workflow.
    
    Args:
        message: User's input message
        thread_id: Optional thread ID for conversation continuity
        
    Returns:
        Dictionary containing response and thread_id
    """
    if not thread_id:
        thread_id = str(uuid.uuid4())
    
    # Create thread configuration
    thread_config = {"configurable": {"thread_id": thread_id}}
    
    # Create initial state
    initial_state = {"messages": [HumanMessage(content=message)]}
    
    try:
        # Process through workflow
        result = workflow_app.invoke(initial_state, thread_config)
        
        # Extract the final AI response
        final_message = result["messages"][-1]
        
        if isinstance(final_message, AIMessage):
            response_content = final_message.content
        else:
            response_content = "I apologize, but I couldn't generate a proper response."
        
        return {
            "response": response_content,
            "thread_id": thread_id,
            "success": True
        }
        
    except Exception as e:
        return {
            "response": f"An error occurred while processing your request: {str(e)}",
            "thread_id": thread_id,
            "success": False,
            "error": str(e)
        }