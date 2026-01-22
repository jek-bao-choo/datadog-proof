# My CloudPrem rendition 2

This follows the Datadog public doc https://docs.datadoghq.com/cloudprem/install/docker/?tab=dockercomposesetup

![](proof1.png)

![](marketecture.png)

## Configure Environment

```bash
# Copy the environment template
cp .env.example .env
```

```bash
docker compose up -d
```

```bash
curl http://localhost:7280/api/v1/version
```

## Reverse Connection
The reverse connection option for Datadog SaaS connectivity to avoid setting up a public ingress. Reverse connection allows CloudPrem to initiate a secured connection with Datadog region and keep it open to allow bidirectional data exchange. Put another way, traffic is initiated by Datadog CloudPrem. No sessions are initiated from Datadog back to CloudPrem. All CloudPrem traffic is sent over SSL. The destination is dependent on the Datadog site. 

Add the datadog site to your inclusion list to allow for CloudPrem to connect to Datadog. All of these domains are CNAME records pointing to a set of static IP addresses. These addresses can be found at https://ip-ranges.datadoghq.com/logs.json. Add all of the ip-ranges to your inclusion list. Therefore, open the 443 TCP port to allow CloudPrem to connect to Datadog. All outbound traffic is sent over SSL through TCP. You can configure the CloudPrem to send traffic through an HTTP/HTTPS proxy. (Datadog team has tested Squid with CloudPrem and it works https://docs.datadoghq.com/agent/configuration/proxy_squid/?tab=linux). Hence, we can configure CloudPrem to use a forward proxy, such as Squid, with the environment variable HTTPS_PROXY.

#### What other log collectors work with CloudPrem as of late Oct 2025? 
The log collectors that work are Datadog Agent, Datadog agent OTEL capabilities, and Observability Pipelines (as well as vector). Personally, I'm not sure if it will work with upstream otel col.