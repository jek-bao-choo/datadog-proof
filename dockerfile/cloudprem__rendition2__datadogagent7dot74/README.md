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