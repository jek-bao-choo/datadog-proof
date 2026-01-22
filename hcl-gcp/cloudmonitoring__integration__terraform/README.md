the [terraform-gcp-datadog-integration](https://github.com/GoogleCloudPlatform/terraform-gcp-datadog-integration) module to automatically collect logs from Google Cloud Platform and send them to Datadog.

**What This Module Does (In Simple Terms):**
Think of this module as an automated pipeline builder. It creates a series of connected components in GCP that:
1. Capture your GCP logs (like application logs, system logs, etc.)
2. Process them through a series of services
3. Send them securely to Datadog for monitoring and analysis

## Architecture: How It Works

Here's the flow of how logs travel from GCP to Datadog:

```
GCP Resources (VMs, Cloud Run, etc.)
        �
    Log Sink (filters and captures logs)
        �
    Pub/Sub Topic (message queue)
        �
    Pub/Sub Subscription (receives messages)
        �
    Dataflow Job (processes and exports)
        �
    Datadog (your monitoring dashboard)
```

### Components Created by the Module

When you run this Terraform module, it automatically creates these GCP resources:

1. **Log Sink**: Captures logs from your GCP project or folder based on filters you specify
2. **Pub/Sub Topic & Subscription**: Acts like a message queue to temporarily hold logs
3. **Secret Manager Secret**: Securely stores your Datadog API key
4. **Dataflow Job**: The worker that processes logs and sends them to Datadog
5. **Cloud Storage Bucket**: Temporary storage for the Dataflow job to use
6. **Networking Components**:
   - Cloud Router
   - Cloud NAT Gateway (allows secure outbound internet access)
   - Firewall rules