"""Online search tool using Tavily API with DuckDuckGo fallback."""
from langchain_core.tools import tool
from typing import Dict, Any
import os
import logging

logger = logging.getLogger(__name__)

# Try to import Tavily
try:
    from tavily import TavilyClient
    tavily_client = TavilyClient(api_key=os.getenv("TAVILY_API_KEY", ""))
    TAVILY_AVAILABLE = bool(os.getenv("TAVILY_API_KEY"))
except ImportError:
    TAVILY_AVAILABLE = False
    tavily_client = None

# Import DuckDuckGo as fallback
try:
    from duckduckgo_search import DDGS
    DUCKDUCKGO_AVAILABLE = True
except ImportError:
    DUCKDUCKGO_AVAILABLE = False

def search_with_tavily(query: str) -> Dict[str, Any]:
    """Search using Tavily API."""
    try:
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
            "total_results": len(formatted_results),
            "search_engine": "Tavily"
        }
    except Exception as e:
        logger.error(f"Tavily search failed: {str(e)}")
        raise

def search_with_duckduckgo(query: str) -> Dict[str, Any]:
    """Search using DuckDuckGo with retry logic."""
    import time
    import random
    
    for attempt in range(3):  # Try up to 3 times
        try:
            logger.info(f"DuckDuckGo search attempt {attempt + 1}")
            
            # Add random delay to avoid rate limiting
            if attempt > 0:
                delay = random.uniform(1, 3)
                logger.info(f"Waiting {delay:.1f}s before retry")
                time.sleep(delay)
            
            # Use simpler search parameters to avoid detection
            with DDGS() as ddgs:
                results = list(ddgs.text(
                    query, 
                    max_results=3,  # Fewer results to avoid rate limiting
                    region='wt-wt',
                    safesearch='moderate'
                ))
            
            if not results:
                logger.warning(f"No results found for query: {query}")
                continue
            
            formatted_results = []
            for result in results:
                formatted_results.append({
                    "title": result.get("title", "No title"),
                    "content": result.get("body", "No content"),
                    "url": result.get("href", "No URL")
                })
            
            return {
                "query": query,
                "results": formatted_results,
                "total_results": len(formatted_results),
                "search_engine": "DuckDuckGo",
                "attempts": attempt + 1
            }
            
        except Exception as e:
            error_msg = str(e).lower()
            if "ratelimit" in error_msg or "429" in error_msg or "202" in error_msg:
                logger.warning(f"Rate limited on attempt {attempt + 1}: {str(e)}")
                if attempt == 2:  # Last attempt
                    # Return a helpful message instead of failing completely
                    return {
                        "query": query,
                        "results": [{
                            "title": "Search temporarily unavailable",
                            "content": f"Online search for '{query}' is temporarily rate-limited. You can search manually at: https://duckduckgo.com/?q={query.replace(' ', '+')}",
                            "url": f"https://duckduckgo.com/?q={query.replace(' ', '+')}"
                        }],
                        "total_results": 1,
                        "search_engine": "DuckDuckGo (Rate Limited)",
                        "note": "Search was rate-limited, providing manual search link"
                    }
            else:
                logger.error(f"DuckDuckGo search failed on attempt {attempt + 1}: {str(e)}")
                if attempt == 2:
                    raise
    
    # This shouldn't be reached, but just in case
    raise Exception("All attempts failed")

@tool
def search_tool(query: str) -> Dict[str, Any]:
    """
    Search the internet for information using available search engines.
    Tries Tavily first (if configured), then falls back to DuckDuckGo.
    
    Args:
        query (str): The search query to execute
        
    Returns:
        Dict[str, Any]: Search results including snippets and sources
    """
    logger.info(f"Executing search query: {query}")
    
    # Try Tavily first if available
    if TAVILY_AVAILABLE:
        try:
            logger.info("Using Tavily search")
            return search_with_tavily(query)
        except Exception as e:
            logger.warning(f"Tavily search failed: {str(e)}, trying fallback")
    
    # Try DuckDuckGo as fallback
    if DUCKDUCKGO_AVAILABLE:
        try:
            logger.info("Using DuckDuckGo search")
            return search_with_duckduckgo(query)
        except Exception as e:
            logger.error(f"DuckDuckGo search failed: {str(e)}")
            return {
                "error": f"All search engines failed. DuckDuckGo error: {str(e)}",
                "query": query,
                "results": []
            }
    
    # No search engines available
    return {
        "error": "No search engines available. Please configure TAVILY_API_KEY or ensure duckduckgo-search is installed.",
        "query": query,
        "results": []
    }