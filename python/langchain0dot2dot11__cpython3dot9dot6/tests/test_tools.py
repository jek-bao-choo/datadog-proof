"""Unit tests for tools."""
import pytest
from unittest.mock import patch, MagicMock
from app.tools.search import search_tool
from app.tools.datadog import datadog_metrics_tool


class TestSearchTool:
    """Test cases for search tool."""
    
    def test_search_tool_empty_query(self):
        """Test search tool with empty query."""
        result = search_tool.invoke({"query": ""})
        assert "error" in result
        assert "Empty search query" in result["error"]
    
    def test_search_tool_whitespace_query(self):
        """Test search tool with whitespace query."""
        result = search_tool.invoke({"query": "   "})
        assert "error" in result
        assert "Empty search query" in result["error"]
    
    @patch('app.tools.search.DDGS')
    def test_search_tool_success(self, mock_ddgs):
        """Test successful search."""
        # Mock DuckDuckGo response
        mock_ddgs.return_value.__enter__.return_value.text.return_value = [
            {
                "title": "Test Result",
                "body": "Test description",
                "href": "https://example.com"
            }
        ]
        
        result = search_tool.invoke({"query": "test query"})
        
        assert result["query"] == "test query"
        assert result["total_results"] == 1
        assert len(result["results"]) == 1
        assert result["results"][0]["title"] == "Test Result"
    
    @patch('app.tools.search.DDGS')
    def test_search_tool_no_results(self, mock_ddgs):
        """Test search with no results."""
        # Mock empty response
        mock_ddgs.return_value.__enter__.return_value.text.return_value = []
        
        result = search_tool.invoke({"query": "test query"})
        
        assert result["query"] == "test query"
        assert result["total_results"] == 0
        assert "No results found" in result["results"][0]["title"]
    
    @patch('app.tools.search.DDGS')
    def test_search_tool_rate_limit(self, mock_ddgs):
        """Test search tool rate limiting."""
        # Mock rate limit exception
        mock_ddgs.return_value.__enter__.return_value.text.side_effect = Exception("202 Ratelimit")
        
        result = search_tool.invoke({"query": "test query"})
        
        assert result["query"] == "test query"
        assert "rate-limited" in result["note"] or "temporarily unavailable" in result["results"][0]["title"]


class TestDatadogTool:
    """Test cases for Datadog tool."""
    
    @patch('app.tools.datadog.config')
    def test_datadog_tool_not_configured(self, mock_config):
        """Test Datadog tool when not configured."""
        mock_config.is_datadog_configured.return_value = False
        
        result = datadog_metrics_tool.invoke({
            "metric_query": "system.cpu.user",
            "time_period": "1h"
        })
        
        assert result["success"] is False
        assert "not configured" in result["error"]
    
    @patch('app.tools.datadog.config')
    def test_datadog_tool_empty_query(self, mock_config):
        """Test Datadog tool with empty query."""
        # Mock configuration as configured to test the empty query logic
        mock_config.is_datadog_configured.return_value = True
        
        result = datadog_metrics_tool.invoke({
            "metric_query": "",
            "time_period": "1h"
        })
        
        assert result["success"] is False
        assert "Empty metric query" in result["error"]
    
    @patch('app.tools.datadog.config')
    @patch('app.tools.datadog.get_datadog_client')
    def test_datadog_tool_success(self, mock_client, mock_config):
        """Test successful Datadog query."""
        # Configure mocks
        mock_config.is_datadog_configured.return_value = True
        
        # Mock API response
        mock_response = MagicMock()
        mock_series = MagicMock()
        mock_series.metric = "system.cpu.user"
        mock_series.display_name = "CPU User"
        mock_series.scope = "*"
        mock_series.tag_set = []
        mock_series.unit = ["percent", None]
        mock_series.pointlist = [[1635724800000, 25.5], [1635724860000, 30.2]]
        mock_response.series = [mock_series]
        
        mock_api_instance = MagicMock()
        mock_api_instance.query_metrics.return_value = mock_response
        
        mock_client.return_value.__enter__.return_value = MagicMock()
        
        with patch('app.tools.datadog.MetricsApi', return_value=mock_api_instance):
            result = datadog_metrics_tool.invoke({
                "metric_query": "system.cpu.user",
                "time_period": "1h"
            })
        
        assert result["success"] is True
        assert result["total_series"] == 1
        assert len(result["values"]) == 1
    
    def test_datadog_tool_invalid_time_period(self):
        """Test Datadog tool with invalid time period."""
        with patch('app.tools.datadog.config') as mock_config:
            mock_config.is_datadog_configured.return_value = True
            
            with patch('app.tools.datadog.get_datadog_client'), \
                 patch('app.tools.datadog.MetricsApi'):
                result = datadog_metrics_tool.invoke({
                    "metric_query": "system.cpu.user",
                    "time_period": "invalid"
                })
        
        # Should still process with default 1h period
        assert "time_period" in result["time_range"]