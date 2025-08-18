"""Online search tool using DuckDuckGo."""
from langchain_core.tools import tool
from typing import Dict, Any
import logging
from duckduckgo_search import DDGS
import time
import random

# Configure logging
logger = logging.getLogger(__name__)

def search_with_duckduckgo(query: str) -> Dict[str, Any]:
    """Search using DuckDuckGo with retry logic."""
    for attempt in range(3):  # Try up to 3 times
        try:
            logger.info(f"DuckDuckGo search attempt {attempt + 1} for query: {query}")
            
            # Add random delay to avoid rate limiting
            if attempt > 0:
                delay = random.uniform(1, 3)
                logger.info(f"Waiting {delay:.1f}s before retry")
                time.sleep(delay)
            
            # Use simpler search parameters to avoid detection
            with DDGS() as ddgs:
                results = list(ddgs.text(
                    query, 
                    max_results=5,  # Limit results to avoid rate limiting
                    region='wt-wt',
                    safesearch='moderate'
                ))
            
            if not results:
                logger.warning(f"No results found for query: {query}")
                if attempt == 2:  # Last attempt
                    return {
                        "query": query,
                        "results": [{
                            "title": "No results found",
                            "content": f"No search results found for '{query}'. Please try a different query.",
                            "url": ""
                        }],
                        "total_results": 0,
                        "search_engine": "DuckDuckGo",
                        "note": "No results found"
                    }
                continue
            
            # Format results for better readability
            formatted_results = []
            for result in results:
                formatted_results.append({
                    "title": result.get("title", "No title"),
                    "content": result.get("body", "No content")[:500] + "..." if len(result.get("body", "")) > 500 else result.get("body", "No content"),
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
                    return {
                        "error": f"Search failed after {attempt + 1} attempts: {str(e)}",
                        "query": query,
                        "results": [{
                            "title": "Search Error",
                            "content": f"Unable to search for '{query}' due to technical issues. Please try again later.",
                            "url": ""
                        }],
                        "total_results": 0
                    }
    
    # This shouldn't be reached, but just in case
    return {
        "error": "All search attempts failed",
        "query": query,
        "results": []
    }

@tool
def search_tool(query: str) -> Dict[str, Any]:
    """
    Search the internet for information using DuckDuckGo.
    
    Args:
        query (str): The search query to execute
        
    Returns:
        Dict[str, Any]: Search results including snippets and sources
    """
    logger.info(f"Executing search query: {query}")
    
    if not query or not query.strip():
        return {
            "error": "Empty search query provided",
            "query": query,
            "results": []
        }
    
    try:
        return search_with_duckduckgo(query.strip())
    except Exception as e:
        logger.error(f"Unexpected error in search_tool: {str(e)}")
        return {
            "error": f"Unexpected error: {str(e)}",
            "query": query,
            "results": []
        }