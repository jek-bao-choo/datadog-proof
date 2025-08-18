"""Tools registry for LangChain agents."""
from typing import List
from langchain_core.tools import BaseTool

from .search import search_tool
from .datadog import datadog_metrics_tool

# Available tools for the agent
AVAILABLE_TOOLS: List[BaseTool] = [
    search_tool,
    datadog_metrics_tool,
]

# Tool descriptions for documentation
TOOL_DESCRIPTIONS = {
    "search_tool": "Search the internet for information using DuckDuckGo",
    "datadog_metrics_tool": "Retrieve metrics from Datadog using metric queries",
}

__all__ = ["AVAILABLE_TOOLS", "TOOL_DESCRIPTIONS", "search_tool", "datadog_metrics_tool"]