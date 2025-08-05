#!/usr/bin/env python3
"""
Simple test script to send metrics to Datadog Agent using DogStatsD.
Uses only Python standard library - no external dependencies required.
"""

import socket
import time
import sys
import random


def send_metric(metric_name, value, metric_type="gauge", tags=None, host="localhost", port=8125):
    """
    Send a metric to DogStatsD using UDP.
    
    Args:
        metric_name (str): Name of the metric
        value (float): Value of the metric
        metric_type (str): Type of metric (gauge, counter, histogram, timer)
        tags (list): List of tags to attach to the metric
        host (str): Hostname of DogStatsD server
        port (int): Port of DogStatsD server
    """
    if tags is None:
        tags = []
    
    # Format metric according to DogStatsD protocol
    tag_string = f"|#{','.join(tags)}" if tags else ""
    message = f"{metric_name}:{value}|{metric_type}{tag_string}"
    
    try:
        # Create UDP socket
        sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        sock.settimeout(5)  # 5 second timeout
        
        # Send metric
        sock.sendto(message.encode('utf-8'), (host, port))
        sock.close()
        
        print(f"✓ Sent metric: {message}")
        return True
        
    except socket.error as e:
        print(f"✗ Failed to send metric: {e}")
        return False
    except Exception as e:
        print(f"✗ Unexpected error: {e}")
        return False


def test_connection(host="localhost", port=8125):
    """Test if we can connect to the DogStatsD port."""
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        sock.settimeout(2)
        # Try to connect (UDP doesn't actually connect, but this tests if port is accessible)
        sock.sendto(b"test", (host, port))
        sock.close()
        print(f"✓ Connection test successful to {host}:{port}")
        return True
    except Exception as e:
        print(f"✗ Connection test failed to {host}:{port}: {e}")
        return False


def send_test_counter():
    """Send a test counter metric."""
    return send_metric(
        metric_name="test.counter",
        value=1,
        metric_type="c",
        tags=["environment:test", "source:python_script"]
    )


def send_test_gauge():
    """Send a test gauge metric with a random value."""
    random_value = random.randint(1, 100)
    return send_metric(
        metric_name="test.gauge",
        value=random_value,
        metric_type="g",
        tags=["environment:test", "source:python_script"]
    )


def send_test_histogram():
    """Send a test histogram metric."""
    return send_metric(
        metric_name="test.histogram",
        value=random.uniform(0.1, 2.0),
        metric_type="h",
        tags=["environment:test", "source:python_script"]
    )


def main():
    """Main function to run the metric tests."""
    print("🔍 Testing Datadog Agent DogStatsD Connection")
    print("=" * 50)
    
    # Test connection first
    if not test_connection():
        print("\n❌ Cannot connect to DogStatsD. Is the Datadog Agent running?")
        print("Try: docker-compose up -d")
        sys.exit(1)
    
    print("\n📊 Sending test metrics...")
    
    # Send different types of test metrics
    success_count = 0
    total_tests = 0
    
    tests = [
        ("Counter Metric", send_test_counter),
        ("Gauge Metric", send_test_gauge),
        ("Histogram Metric", send_test_histogram),
    ]
    
    for test_name, test_func in tests:
        total_tests += 1
        print(f"\n{test_name}:")
        if test_func():
            success_count += 1
        
        # Small delay between metrics
        time.sleep(0.5)
    
    print("\n" + "=" * 50)
    print(f"📈 Results: {success_count}/{total_tests} metrics sent successfully")
    
    if success_count == total_tests:
        print("🎉 All tests passed! Check your Datadog dashboard for the metrics:")
        print("   - test.counter")
        print("   - test.gauge")
        print("   - test.histogram")
        print("\n💡 Tip: It may take a few minutes for metrics to appear in Datadog")
    else:
        print("⚠️  Some tests failed. Check the Datadog Agent logs:")
        print("   docker-compose logs datadog-agent")
        sys.exit(1)


if __name__ == "__main__":
    main()