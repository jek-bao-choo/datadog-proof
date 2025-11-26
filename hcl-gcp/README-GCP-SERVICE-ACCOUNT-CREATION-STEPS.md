# GCP Service Account Creation for Datadog Integration

## Prerequisites
- gcloud CLI installed and authenticated
- Access to GCP project: `change-to-my-project-id`
- Project ID: `change-to-my-project-id`

## Step 1: Create the Service Account

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

## Step 3: Get the Service Account Unique ID

Datadog requires the **Unique ID** (numeric) of the service account:

```bash
gcloud iam service-accounts describe jek-datadog-integration-sa@change-to-my-project-id.iam.gserviceaccount.com \
    --project=change-to-my-project-id \
    --format="value(uniqueId)"
```

**Expected Output:** A long numeric ID like `117022368667663790219`

**Copy this ID** - you'll need it for the Datadog integration form.

## Step 4: Verify Service Account Creation

Check that your service account was created successfully:

```bash
gcloud iam service-accounts list \
    --project=change-to-my-project-id \
    --filter="email:jek-datadog-integration-sa@change-to-my-project-id.iam.gserviceaccount.com" \
    --format="table(displayName,email,uniqueId)"
```

## Step 5: Get All Details for Datadog Integration

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
| **Service Account ID** | Copy the Unique ID from Step 3 (numeric) |
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

### Check Service Account Permissions

```bash
gcloud projects get-iam-policy change-to-my-project-id \
    --flatten="bindings[].members" \
    --filter="bindings.members:jek-datadog-integration-sa@change-to-my-project-id.iam.gserviceaccount.com" \
    --format="table(bindings.role)"
```

### List All Service Accounts

```bash
gcloud iam service-accounts list --project=change-to-my-project-id
```

## Additional IAM Roles (Optional)

Depending on what you want to monitor, you may need additional roles:

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
