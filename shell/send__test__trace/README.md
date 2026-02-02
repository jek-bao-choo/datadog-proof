# Quick Start: Send OTLP Trace

Send a test trace to Datadog using curl:

```bash
curl -X POST https://otlp.app.datadoghq.com/v1/traces \
  -H "Content-Type: application/json" \
  -H "dd-api-key: YOUR_API_KEY" \
  -d @otlp-trace-test.json
```

Or use the shell script:
```bash
cd shell/send__test__trace
./send-test-trace.sh YOUR_API_KEY
```

# Send trace test 

Useful reference https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/trace/api.md

`TraceId` A valid trace identifier is a 16-byte array with at least one non-zero byte.

`SpanId` A valid span identifier is an 8-byte array with at least one non-zero byte.

## OTLP Tracer Test json file (otlp-trace-test.json)
```
kubectl run tmp --image=nginx:alpine

kubectl exec -it tmp -- curl -OL https://raw.githubusercontent.com/jek-bao-choo/splunk-otel-example/main/infrastructure-kubernetes/eks-ec2-alb-dual-helm-gateway-collectors/trace-test.json

kubectl exec -i -t tmp -c tmp -- sh

# Check that trace-test.json is downloaded
ls 

# For example kubectl exec -it tmp -- curl -vi -X POST http://<the svc name followed by namespace>:4318/v1/traces -H'Content-Type: application/json' -d @trace-test.json

kubectl exec -it tmp -- curl -vi -X POST http://traceid-load-balancing-gateway-splunk-otel-collector.splunk-monitoring:4318/v1/traces -H'Content-Type: application/json' -d @trace-test.json
```

## Zipkin Tracer Test json file (zipkin-yelp.json)
```
kubectl exec -it tmp -- curl -OL https://raw.githubusercontent.com/openzipkin/zipkin/master/zipkin-lens/testdata/yelp.json

# For example kubectl exec -it tmp -- curl -vi -X POST http://<the svc name followed by namespace>:9411/api/v2/spans -H'Content-Type: application/json' -d @yelp.json

kubectl exec -it tmp -- curl -vi -X POST http://traceid-load-balancing-gateway-splunk-otel-collector.splunk-monitoring:9411/api/v2/spans -H'Content-Type: application/json' -d @yelp.json
```