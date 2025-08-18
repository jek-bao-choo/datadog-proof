"""Datadog metrics retrieval tool."""
from langchain_core.tools import tool
from datadog_api_client import ApiClient, Configuration
from datadog_api_client.v1.api.metrics_api import MetricsApi
from datadog_api_client.v1.model.metrics_query_response import MetricsQueryResponse
from typing import Dict, Any
import logging
from datetime import datetime, timedelta
from app.core.config import config

# Configure logging
logger = logging.getLogger(__name__)

def get_datadog_client():
    """Initialize and return Datadog API client."""
    configuration = Configuration()
    configuration.api_key["apiKeyAuth"] = config.DATADOG_API_KEY
    configuration.api_key["appKeyAuth"] = config.DATADOG_APP_KEY
    return ApiClient(configuration)

@tool
def datadog_metrics_tool(metric_query: str, time_period: str = "1h") -> Dict[str, Any]:
    """
    Retrieve metrics from Datadog using a query.
    
    Args:
        metric_query (str): Datadog metric query (e.g., "avg:system.cpu.idle{*}" or "system.cpu.system")
        time_period (str): Time period to query (e.g., "1h", "24h", "7d", "10d") (default: "1h")
        
    Returns:
        Dict[str, Any]: Metric data including values and metadata
    """
    try:
        # Check for required API keys
        if not config.is_datadog_configured():
            return {
                "error": "Datadog API keys not configured. Please set DATADOG_API_KEY and DATADOG_APP_KEY environment variables.",
                "metric_query": metric_query,
                "values": [],
                "success": False
            }
        
        if not metric_query or not metric_query.strip():
            return {
                "error": "Empty metric query provided",
                "metric_query": metric_query,
                "values": [],
                "success": False
            }
        
        # Parse time period and calculate time range
        end_time = datetime.now()
        
        # Parse time_period string (e.g., "1h", "24h", "7d", "10d")
        try:
            if time_period.endswith('h'):
                hours = int(time_period[:-1])
                start_time = end_time - timedelta(hours=hours)
            elif time_period.endswith('d'):
                days = int(time_period[:-1])
                start_time = end_time - timedelta(days=days)
            else:
                # Default to 1 hour if format not recognized
                logger.warning(f"Unrecognized time period format: {time_period}, defaulting to 1h")
                start_time = end_time - timedelta(hours=1)
        except ValueError:
            logger.warning(f"Invalid time period: {time_period}, defaulting to 1h")
            start_time = end_time - timedelta(hours=1)
        
        # Convert to Unix timestamps
        start_timestamp = int(start_time.timestamp())
        end_timestamp = int(end_time.timestamp())
        
        # Normalize metric query format
        query = metric_query.strip()
        if not query.startswith(('avg:', 'sum:', 'min:', 'max:')):
            # Add default aggregation if not specified
            if '{' not in query:
                query = f"avg:{query}{{*}}"
            else:
                query = f"avg:{query}"
        
        logger.info(f"Executing Datadog query: {query} from {start_time} to {end_time}")
        
        # Initialize Datadog client
        with get_datadog_client() as api_client:
            api_instance = MetricsApi(api_client)
            
            # Execute metrics query
            response: MetricsQueryResponse = api_instance.query_metrics(
                _from=start_timestamp,
                to=end_timestamp,
                query=query
            )
            
            logger.info(f"Datadog API response received for query: {query}")
            
            # Format response data
            formatted_values = []
            if response.series:
                for series in response.series:
                    series_data = {
                        "metric": getattr(series, 'metric', 'Unknown'),
                        "display_name": getattr(series, 'display_name', 'Unknown'),
                        "scope": getattr(series, 'scope', '*'),
                        "tags": getattr(series, 'tag_set', []),
                        "unit": getattr(series, 'unit', [None, None]),
                        "points": [],
                        "total_points": 0
                    }
                    
                    if hasattr(series, 'pointlist') and series.pointlist:
                        # Limit points to avoid overwhelming response
                        points_to_include = series.pointlist[-20:] if len(series.pointlist) > 20 else series.pointlist
                        for point in points_to_include:
                            try:
                                # Point can be either a list or a Point object
                                if hasattr(point, '__len__') and len(point) >= 2:
                                    timestamp = datetime.fromtimestamp(point[0] / 1000).isoformat()
                                    value = point[1]
                                elif hasattr(point, '__getitem__'):
                                    timestamp = datetime.fromtimestamp(point[0] / 1000).isoformat()
                                    value = point[1]
                                else:
                                    # Skip this point if we can't process it
                                    continue
                                    
                                series_data["points"].append({
                                    "timestamp": timestamp,
                                    "value": value
                                })
                            except (IndexError, TypeError, AttributeError) as e:
                                logger.warning(f"Skipping point due to error: {e}")
                                continue
                        series_data["total_points"] = len(series.pointlist)
                    
                    formatted_values.append(series_data)
            
            return {
                "metric_query": query,
                "original_query": metric_query,
                "time_range": {
                    "start": start_time.isoformat(),
                    "end": end_time.isoformat(),
                    "time_period": time_period
                },
                "values": formatted_values,
                "total_series": len(formatted_values),
                "success": True
            }
            
    except Exception as e:
        logger.error(f"Datadog query failed: {str(e)}", exc_info=True)
        return {
            "error": f"Datadog query failed: {str(e)}",
            "metric_query": metric_query,
            "values": [],
            "success": False
        }