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

print("🔍 Sending custom metrics to Datadog...")

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

print("\n🎉 All metrics sent successfully!")
print("📊 Check your Datadog dashboard for:")
print("   - jek.test_metric.increment")
print("   - jek.test_metric.decrement") 
print("   - jek.test_metric.gauge")
print("   - jek.test_metric.response_time")
print("   - jek.test_metric.db_query")
print("\n💡 Tip: Metrics may take 2-5 minutes to appear in Datadog")