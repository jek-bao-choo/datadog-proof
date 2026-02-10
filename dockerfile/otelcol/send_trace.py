import os
from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.exporter.otlp.proto.http.trace_exporter import OTLPSpanExporter
from opentelemetry.sdk.resources import Resource

resource = Resource.create({"service.name": "jek-svc-v6"})
provider = TracerProvider(resource=resource)
exporter = OTLPSpanExporter(
    endpoint="http://localhost:4318/v1/traces",
    # endpoint="https://otlp.datadoghq.com/v1/traces", # Enable this headers only if I want to send to Datadog direct
    # headers={ # Enable this headers only if I want to send to Datadog direct
    #     "dd-api-key": os.getenv("DD_API_KEY"),
    #     "dd-otlp-source": "datadog"
    # }
)
provider.add_span_processor(BatchSpanProcessor(exporter))
trace.set_tracer_provider(provider)

tracer = trace.get_tracer("jek.test.tracer")
with tracer.start_as_current_span("jek-test-span") as span:
    span.set_attribute("jekTestKey", "hello jek protobuf!")
    print("Span created, flushing...")

provider.shutdown()
print("Done! Trace sent via HTTP/protobuf.")
