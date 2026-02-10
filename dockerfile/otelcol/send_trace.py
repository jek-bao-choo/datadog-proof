from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.exporter.otlp.proto.http.trace_exporter import OTLPSpanExporter
from opentelemetry.sdk.resources import Resource

resource = Resource.create({"service.name": "jek-svc-v1"})
provider = TracerProvider(resource=resource)
exporter = OTLPSpanExporter(endpoint="http://localhost:4318/v1/traces")
provider.add_span_processor(BatchSpanProcessor(exporter))
trace.set_tracer_provider(provider)

tracer = trace.get_tracer("my.test.tracer")
with tracer.start_as_current_span("test-span") as span:
    span.set_attribute("test.key", "hello jek protobuf!")
    print("Span created, flushing...")

provider.shutdown()
print("Done! Trace sent via HTTP/protobuf.")
