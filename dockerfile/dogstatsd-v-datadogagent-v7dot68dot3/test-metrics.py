# /// script
# requires-python = ">=3.9.6"
# dependencies = [
#   "datadog"
# ]
# ///

from datadog import initialize, statsd

options = {
    'statsd_host': '127.0.0.1',
    'statsd_port': 8125
}

initialize(**options)

print("🔍 Sending custom metrics and events to Datadog...")

# Send increment counter
statsd.increment('jek.test_metric.increment', tags=["environment:test"])
print("✓ Sent increment metric: jek.test_metric.increment [environment:test]")

# Send decrement counter  
statsd.decrement('jek.test_metric.decrement', tags=["environment:dev"])
print("✓ Sent decrement metric: jek.test_metric.decrement [environment:dev]")

# Send gauge metric
statsd.gauge('jek.test_metric.gauge', 42, tags=["environment:prod", "team:backend"])
print("✓ Sent gauge metric: jek.test_metric.gauge = 42 [environment:prod, team:backend]")

# Send histogram metric
statsd.histogram('jek.test_metric.response_time', 150.5, tags=["endpoint:api", "method:POST"])
print("✓ Sent histogram metric: jek.test_metric.response_time = 150.5ms [endpoint:api, method:POST]")

# Send timing metric
statsd.timing('jek.test_metric.db_query', 25.3, tags=["database:postgres", "table:users"])
print("✓ Sent timing metric: jek.test_metric.db_query = 25.3ms [database:postgres, table:users]")

print("\n📅 Sending custom events...")

# Send success event
statsd.event('Test Application Started', 'The test application has successfully started and is sending metrics to Datadog.', alert_type='success', tags=['service:jek-test-custom-event', 'environment:test'])
print("✓ Sent event: Test Application Started [success]")

# Send info event  
statsd.event('Deployment Completed', 'Version 1.0.0 deployed successfully with new metrics and event tracking features.', alert_type='info', tags=['service:jek-test-custom-event', 'environment:prod', 'version:1.0.0'])
print("✓ Sent event: Deployment Completed [info]")

# Send warning event
statsd.event('High Response Time Detected', 'API response time exceeded 100ms threshold. Current: 150.5ms', alert_type='warning', tags=['service:jek-test-custom-event', 'endpoint:api', 'alert:performance'])
print("✓ Sent event: High Response Time Detected [warning]")

# Send error event
statsd.event('Database Connection Failed', 'Connection timeout after 5 seconds during health check.', alert_type='error', tags=['service:jek-test-custom-event', 'database:postgres', 'health_check:failed'])
print("✓ Sent event: Database Connection Failed [error]")

print("\n🎉 All metrics and events sent successfully!")
print("📊 Check your Datadog dashboard for:")
print("\n📈 Metrics:")
print("   - jek.test_metric.increment")
print("   - jek.test_metric.decrement") 
print("   - jek.test_metric.gauge")
print("   - jek.test_metric.response_time")
print("   - jek.test_metric.db_query")
print("\n📅 Events:")
print("   - Test Application Started")
print("   - Deployment Completed")
print("   - High Response Time Detected")
print("   - Database Connection Failed")
print("\n💡 Tips:")
print("   - Metrics may take 2-5 minutes to appear in Datadog")
print("   - Events appear in the Event Stream immediately")
print("   - Check Events -> Event Stream in your Datadog dashboard")