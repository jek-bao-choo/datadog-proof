"""Online search tool using Tavily API."""
from langchain_core.tools import tool
from tavily import TavilyClient
from typing import Dict, Any
import os

# Initialize Tavily client with API key from environment
tavily_client = TavilyClient(api_key=os.getenv("TAVILY_API_KEY", ""))

@tool
def search_tool(query: str) -> Dict[str, Any]:
    """
    Search the internet for information using Tavily API.
    
    Args:
        query (str): The search query to execute
        
    Returns:
        Dict[str, Any]: Search results including snippets and sources
    """
    try:
        if not os.getenv("TAVILY_API_KEY"):
            return {
                "error": "Tavily API key not configured",
                "query": query,
                "results": []
            }
        
        # Execute search using Tavily
        response = tavily_client.search(
            query=query,
            search_depth="basic",
            max_results=5
        )
        
        # Format results for better readability
        formatted_results = []
        for result in response.get("results", []):
            formatted_results.append({
                "title": result.get("title", "No title"),
                "content": result.get("content", "No content"),
                "url": result.get("url", "No URL")
            })
        
        return {
            "query": query,
            "results": formatted_results,
            "total_results": len(formatted_results)
        }
        
    except Exception as e:
        return {
            "error": f"Search failed: {str(e)}",
            "query": query,
            "results": []
        }