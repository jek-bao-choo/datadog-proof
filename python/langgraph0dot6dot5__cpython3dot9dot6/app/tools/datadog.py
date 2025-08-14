"""Datadog metrics retrieval tool."""
from langchain_core.tools import tool
from datadog_api_client import ApiClient, Configuration
from datadog_api_client.v1.api.metrics_api import MetricsApi
from datadog_api_client.v1.model.metrics_query_response import MetricsQueryResponse
from typing import Dict, Any
import os
from datetime import datetime, timedelta

# Configure Datadog API client
def get_datadog_client():
    """Initialize and return Datadog API client."""
    configuration = Configuration()
    configuration.api_key["apiKeyAuth"] = os.getenv("DATADOG_API_KEY")
    configuration.api_key["appKeyAuth"] = os.getenv("DATADOG_APP_KEY")
    return ApiClient(configuration)

@tool
def datadog_metrics_tool(metric_query: str, hours_back: int = 1) -> Dict[str, Any]:
    """
    Retrieve metrics from Datadog using a query.
    
    Args:
        metric_query (str): Datadog metric query (e.g., "avg:system.cpu.idle{*}")
        hours_back (int): How many hours back to query (default: 1)
        
    Returns:
        Dict[str, Any]: Metric data including values and metadata
    """
    try:
        # Check for required API keys
        if not os.getenv("DATADOG_API_KEY") or not os.getenv("DATADOG_APP_KEY"):
            return {
                "error": "Datadog API keys not configured",
                "metric_query": metric_query,
                "values": []
            }
        
        # Calculate time range
        end_time = datetime.now()
        start_time = end_time - timedelta(hours=hours_back)
        
        # Convert to Unix timestamps
        start_timestamp = int(start_time.timestamp())
        end_timestamp = int(end_time.timestamp())
        
        # Initialize Datadog client
        with get_datadog_client() as api_client:
            api_instance = MetricsApi(api_client)
            
            # Execute metrics query
            response: MetricsQueryResponse = api_instance.query_metrics(
                _from=start_timestamp,
                to=end_timestamp,
                query=metric_query
            )
            
            # Format response data
            formatted_values = []
            if response.series:
                for series in response.series:
                    series_data = {
                        "metric": series.metric,
                        "tags": series.tags if series.tags else [],
                        "points": []
                    }
                    
                    if series.pointlist:
                        for point in series.pointlist:
                            series_data["points"].append({
                                "timestamp": point[0] if len(point) > 0 else None,
                                "value": point[1] if len(point) > 1 else None
                            })
                    
                    formatted_values.append(series_data)
            
            return {
                "metric_query": metric_query,
                "time_range": {
                    "start": start_time.isoformat(),
                    "end": end_time.isoformat(),
                    "hours_back": hours_back
                },
                "values": formatted_values,
                "total_series": len(formatted_values)
            }
            
    except Exception as e:
        return {
            "error": f"Datadog query failed: {str(e)}",
            "metric_query": metric_query,
            "values": []
        }