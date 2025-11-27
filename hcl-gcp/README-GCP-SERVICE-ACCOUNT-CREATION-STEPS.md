[Datadog GCP integration required permission](https://docs.datadoghq.com/integrations/google-cloud-platform/?tab=projectlevelmetriccollection#required-permissions)

# GCP Service Account Creation for Datadog Integration

## Prerequisites
- gcloud CLI installed and authenticated
- Access to GCP project: `change-to-my-project-id`
- Project ID: `change-to-my-project-id`

## Step 1: Create the Service Account

Authenticate with Google Cloud:
   ```bash
   gcloud auth login
   gcloud auth application-default login
   ```

Set your project ID:
   ```bash
   gcloud config set project change-to-my-project-id
   gcloud config set project change-to-my-project-id
   ```

Create a new service account specifically for Datadog integration:

```bash
gcloud iam service-accounts create jek-datadog-integration-sa \
    --display-name="Jek Datadog Integration Service Account" \
    --project=change-to-my-project-id
```

**What this does:** Creates a new service account that Datadog will use to collect metrics and logs from your GCP project.

## Step 2: Grant Required IAM Roles

Grant the necessary permissions for Datadog to monitor your GCP resources:

### Monitoring Viewer Role
Allows Datadog to read metrics from Cloud Monitoring:

```bash
gcloud projects add-iam-policy-binding change-to-my-project-id \
    --member="serviceAccount:jek-datadog-integration-sa@change-to-my-project-id.iam.gserviceaccount.com" \
    --role="roles/monitoring.viewer"
```

### Compute Viewer Role
Allows Datadog to see your compute resources (VMs, GKE, etc.):

```bash
gcloud projects add-iam-policy-binding change-to-my-project-id \
    --member="serviceAccount:jek-datadog-integration-sa@change-to-my-project-id.iam.gserviceaccount.com" \
    --role="roles/compute.viewer"
```

### Cloud Asset Viewer Role
Allows Datadog to discover and inventory your GCP resources:

```bash
gcloud projects add-iam-policy-binding change-to-my-project-id \
    --member="serviceAccount:jek-datadog-integration-sa@change-to-my-project-id.iam.gserviceaccount.com" \
    --role="roles/cloudasset.viewer"
```

### Browser Role
Allows Datadog to discover and list accessible projects:

```bash
gcloud projects add-iam-policy-binding change-to-my-project-id \
    --member="serviceAccount:jek-datadog-integration-sa@change-to-my-project-id.iam.gserviceaccount.com" \
    --role="roles/browser"
```

### Service Account Token Creator Role
Required for Datadog to create short-lived credentials for API calls:

```bash
gcloud projects add-iam-policy-binding change-to-my-project-id \
    --member="serviceAccount:jek-datadog-integration-sa@change-to-my-project-id.iam.gserviceaccount.com" \
    --role="roles/iam.serviceAccountTokenCreator"
```

## Step 3: Enable Required APIs

Enable the necessary GCP APIs for Datadog integration:

```bash
# Enable Cloud Monitoring API - Query Google Cloud metric data
gcloud services enable monitoring.googleapis.com --project=change-to-my-project-id

# Enable Compute Engine API - Discover compute instance data
gcloud services enable compute.googleapis.com --project=change-to-my-project-id

# Enable Cloud Asset API - Request GCP resources and link labels to metrics as tags
gcloud services enable cloudasset.googleapis.com --project=change-to-my-project-id

# Enable Cloud Resource Manager API - Append metrics with correct resources and tags
gcloud services enable cloudresourcemanager.googleapis.com --project=change-to-my-project-id

# Enable IAM API - Authenticate with Google Cloud
gcloud services enable iam.googleapis.com --project=change-to-my-project-id

# Enable Cloud Billing API - Manage billing data for Cloud Cost Management (CCM)
gcloud services enable cloudbilling.googleapis.com --project=change-to-my-project-id
```

**What this does:** These APIs allow Datadog to:
- Query metrics and discover compute resources
- Access cloud asset metadata and link labels as tags
- Append correct resource information to metrics
- Authenticate with Google Cloud
- Access billing data for cost management features

## Step 4: Get the Service Account Unique ID

Datadog requires the **Unique ID** (numeric) of the service account:

```bash
gcloud iam service-accounts describe jek-datadog-integration-sa@change-to-my-project-id.iam.gserviceaccount.com \
    --project=change-to-my-project-id \
    --format="value(uniqueId)"
```

**Expected Output:** A long numeric ID like `117022368667663790219`

**Copy this ID** - you'll need it for the Datadog integration form.

## Step 5: Verify Service Account Creation

Check that your service account was created successfully:

```bash
gcloud iam service-accounts list \
    --project=change-to-my-project-id \
    --filter="email:jek-datadog-integration-sa@change-to-my-project-id.iam.gserviceaccount.com" \
    --format="table(displayName,email,uniqueId)"
```

## Step 6: Get All Details for Datadog Integration

Run this command to get all the information you need for Datadog:

```bash
gcloud iam service-accounts describe jek-datadog-integration-sa@change-to-my-project-id.iam.gserviceaccount.com \
    --project=change-to-my-project-id \
    --format="json"
```

## Information for Datadog Integration Form

When filling out the Datadog GCP integration form, use these values:

| Field | Value |
|-------|-------|
| **Service Account ID** | Copy the Unique ID from Step 4 (numeric) |
| **Default Project** | `change-to-my-project-id` |
| **Projects** | `change-to-my-project-id` |
| **Folders** | Leave empty (unless monitoring specific folders) |

## Optional: Create a Key for Alternative Setup Methods

If you need a JSON key file (for Terraform or manual setup):

```bash
gcloud iam service-accounts keys create ~/jek-datadog-key.json \
    --iam-account=jek-datadog-integration-sa@change-to-my-project-id.iam.gserviceaccount.com \
    --project=change-to-my-project-id
```

**Security Note:** Store this key file securely and never commit it to version control.

## Cleanup (If Needed)

To delete the service account if no longer needed:

```bash
# Delete the service account
gcloud iam service-accounts delete jek-datadog-integration-sa@change-to-my-project-id.iam.gserviceaccount.com \
    --project=change-to-my-project-id
```

## Troubleshooting

### Verify All Granted Permissions

To see a complete list of all roles granted to your service account at the project level, run this command. It's the best way to confirm you haven't missed any steps.

```bash
gcloud projects get-iam-policy change-to-my-project-id \
    --flatten="bindings[].members" \
    --filter="bindings.members:jek-datadog-integration-sa@change-to-my-project-id.iam.gserviceaccount.com" \
    --format="table(bindings.role)" \
    --sort-by="bindings.role"
```

### List All Service Accounts

```bash
gcloud iam service-accounts list --project=change-to-my-project-id
```

---

## Optional: Additional IAM Roles

Grant these roles only if you are using specific Datadog features like Cloud Cost Management or Log Collection.

### For Cloud Cost Management

These roles allow Datadog to collect billing data and provide cost-saving recommendations.

```bash
# Allows viewing billing account and usage data
gcloud projects add-iam-policy-binding change-to-my-project-id \
    --member="serviceAccount:jek-datadog-integration-sa@change-to-my-project-id.iam.gserviceaccount.com" \
    --role="roles/billing.viewer"

# Allows viewing CloudSQL recommendations
gcloud projects add-iam-policy-binding change-to-my-project-id \
    --member="serviceAccount:jek-datadog-integration-sa@change-to-my-project-id.iam.gserviceaccount.com" \
    --role="roles/recommender.cloudsqlViewer"

# Allows viewing Compute Engine recommendations
gcloud projects add-iam-policy-binding change-to-my-project-id \
    --member="serviceAccount:jek-datadog-integration-sa@change-to-my-project-id.iam.gserviceaccount.com" \
    --role="roles/recommender.computeViewer"

# Allows viewing project utilization recommendations
gcloud projects add-iam-policy-binding change-to-my-project-id \
    --member="serviceAccount:jek-datadog-integration-sa@change-to-my-project-id.iam.gserviceaccount.com" \
    --role="roles/recommender.projectUtilViewer"
```

**Note:** The `compute.viewer` role, granted in the core setup, is also required for Cloud Cost Management.

### For Log Collection

If you want to collect **logs** (not just metrics) from GCP, you need to set up a Dataflow pipeline with Pub/Sub. This requires the following additional IAM roles:

### Dataflow Admin Role
Allows the service account to perform Dataflow administrative tasks:

```bash
gcloud projects add-iam-policy-binding change-to-my-project-id \
    --member="serviceAccount:jek-datadog-integration-sa@change-to-my-project-id.iam.gserviceaccount.com" \
    --role="roles/dataflow.admin"
```

### Dataflow Worker Role
Allows the service account to perform Dataflow job operations:

```bash
gcloud projects add-iam-policy-binding change-to-my-project-id \
    --member="serviceAccount:jek-datadog-integration-sa@change-to-my-project-id.iam.gserviceaccount.com" \
    --role="roles/dataflow.worker"
```

### Pub/Sub Viewer Role
Allows the service account to view messages from the Pub/Sub subscription with your GCP logs:

```bash
gcloud projects add-iam-policy-binding change-to-my-project-id \
    --member="serviceAccount:jek-datadog-integration-sa@change-to-my-project-id.iam.gserviceaccount.com" \
    --role="roles/pubsub.viewer"
```

### Pub/Sub Subscriber Role
Allows the service account to consume messages from the Pub/Sub subscription:

```bash
gcloud projects add-iam-policy-binding change-to-my-project-id \
    --member="serviceAccount:jek-datadog-integration-sa@change-to-my-project-id.iam.gserviceaccount.com" \
    --role="roles/pubsub.subscriber"
```

### Pub/Sub Publisher Role
Allows the service account to publish failed messages to a separate subscription for analysis or resending:

```bash
gcloud projects add-iam-policy-binding change-to-my-project-id \
    --member="serviceAccount:jek-datadog-integration-sa@change-to-my-project-id.iam.gserviceaccount.com" \
    --role="roles/pubsub.publisher"
```

### Secret Manager Secret Accessor Role
Allows the service account to access the Datadog API key stored in Secret Manager:

```bash
gcloud projects add-iam-policy-binding change-to-my-project-id \
    --member="serviceAccount:jek-datadog-integration-sa@change-to-my-project-id.iam.gserviceaccount.com" \
    --role="roles/secretmanager.secretAccessor"
```

### Storage Object Admin Role
Allows the service account to read and write to the Cloud Storage bucket for staging files:

```bash
gcloud projects add-iam-policy-binding change-to-my-project-id \
    --member="serviceAccount:jek-datadog-integration-sa@change-to-my-project-id.iam.gserviceaccount.com" \
    --role="roles/storage.objectAdmin"
```

**Note:** Log collection requires additional setup including Pub/Sub topics, subscriptions, log sinks, and a Dataflow pipeline. See the [Datadog GCP Log Collection documentation](https://docs.datadoghq.com/logs/guide/collect-google-cloud-logs-with-push/) for complete setup instructions.

### For Resource Monitoring (Optional)

Depending on what GCP resources you want to monitor, you may need additional roles:

### For GKE Monitoring
```bash
gcloud projects add-iam-policy-binding change-to-my-project-id \
    --member="serviceAccount:jek-datadog-integration-sa@change-to-my-project-id.iam.gserviceaccount.com" \
    --role="roles/container.viewer"
```

### For Cloud SQL Monitoring
```bash
gcloud projects add-iam-policy-binding change-to-my-project-id \
    --member="serviceAccount:jek-datadog-integration-sa@change-to-my-project-id.iam.gserviceaccount.com" \
    --role="roles/cloudsql.viewer"
```

### For BigQuery Monitoring
Allows Datadog to monitor the performance of your BigQuery jobs:

```bash
gcloud projects add-iam-policy-binding change-to-my-project-id \
    --member="serviceAccount:jek-datadog-integration-sa@change-to-my-project-id.iam.gserviceaccount.com" \
    --role="roles/bigquery.resourceViewer"
```
> **Relevance:** Enables Datadog to collect performance metrics and metadata about your BigQuery datasets, jobs, and tables.


**Note:** Enable Resource Collection in the Resource Collection tab of the Google Cloud integration page in Datadog. This allows you to receive resource events when Google's Cloud Asset Inventory detects changes in your cloud resources.

### For Cloud Storage Monitoring
```bash
gcloud projects add-iam-policy-binding change-to-my-project-id \
    --member="serviceAccount:jek-datadog-integration-sa@change-to-my-project-id.iam.gserviceaccount.com" \
    --role="roles/storage.objectViewer"
```

## References

- [Datadog GCP Integration Documentation](https://docs.datadoghq.com/integrations/google_cloud_platform/)
- [GCP IAM Service Accounts](https://cloud.google.com/iam/docs/service-accounts)
- [GCP IAM Roles for Monitoring](https://cloud.google.com/monitoring/access-control)
