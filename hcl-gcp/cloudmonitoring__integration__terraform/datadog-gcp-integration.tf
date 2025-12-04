variable "datadog_api_key" {
  description = "The API key for Datadog"
  type        = string
  sensitive   = true
}

variable "datadog_app_key" {
  description = "The application key for Datadog"
  type        = string
  sensitive   = true
}

locals {
  folder_ids = []
  project_ids = [
    "datadog-ese-sandbox",
  ]
  roles_to_assign = [
    "roles/cloudasset.viewer",
    "roles/compute.viewer",
    "roles/monitoring.viewer",
    "roles/browser",
    "roles/serviceusage.serviceUsageConsumer",
  ]
  apis_to_enable = [
    "cloudasset.googleapis.com",
    "compute.googleapis.com",
    "monitoring.googleapis.com",
    "cloudresourcemanager.googleapis.com",
  ]
}

terraform {
  required_providers {
    datadog = {
      source  = "DataDog/datadog"
      version = "~> 3.80.0"
    }
    google = {
      source = "hashicorp/google"
    }
  }
}

provider "datadog" {
  api_key = var.datadog_api_key
  app_key = var.datadog_app_key
  api_url = "https://api.datadoghq.com"
}

# Fetch all active, non-system projects in folders
data "google_projects" "folder_projects" {
  for_each = toset(local.folder_ids)
  filter = "parent.id:${each.value} AND lifecycleState:ACTIVE AND NOT projectId:sys*"
}

# Combine explicit projects and folder projects into a single set
locals {
  all_project_ids = toset(
    concat(
      local.project_ids,
      flatten([for f in data.google_projects.folder_projects : [for p in f.projects : p.project_id]])
    )
  )
}

# Enable APIs for all projects in a single step
resource "google_project_service" "enabled_apis" {
  for_each = {
    for combo in setproduct(local.all_project_ids, local.apis_to_enable) :
    "${combo[0]}-${combo[1]}" => { project_id = combo[0], api = combo[1] }
  }

  project = each.value.project_id
  service = each.value.api
}

# Create the service account
resource "google_service_account" "datadog_gcp_service_account" {
  account_id   = "jek-datadog-integration-sa-v2"
  display_name = "Datadog Service Account"
  project      = "datadog-ese-sandbox"

  depends_on = [
    google_project_service.enabled_apis
  ]
}

# Grant the token creator role to the Datadog principal
resource "google_service_account_iam_member" "datadog_gcp_service_account_token_creator" {
  service_account_id = google_service_account.datadog_gcp_service_account.name
  role               = "roles/iam.serviceAccountTokenCreator"
  member             = "serviceAccount:ddgci-b407403db13fb83b515e@datadog-gci-sts-us1-prod.iam.gserviceaccount.com"

  depends_on = [
    google_project_service.enabled_apis,
    google_service_account.datadog_gcp_service_account
  ]
}

# Assign roles to the service account in all projects
resource "google_project_iam_member" "datadog_gcp_service_account_project_roles" {
  for_each = {
    for combo in setproduct(local.project_ids, local.roles_to_assign) :
    "${combo[0]}-${combo[1]}" => { project_id = combo[0], role = combo[1] }
  }

  project = each.value.project_id
  role    = each.value.role
  member  = "serviceAccount:${google_service_account.datadog_gcp_service_account.email}"

  depends_on = [
    google_project_service.enabled_apis,
    google_service_account.datadog_gcp_service_account
  ]
}

# Assign roles to the service account in all folders
resource "google_folder_iam_member" "datadog_gcp_service_account_folder_roles" {
  for_each = {
    for combo in setproduct(local.folder_ids, local.roles_to_assign) :
    "${combo[0]}-${combo[1]}" => { folder_id = combo[0], role = combo[1] }
  }

  folder = each.value.folder_id
  role   = each.value.role
  member = "serviceAccount:${google_service_account.datadog_gcp_service_account.email}"

  depends_on = [
    google_project_service.enabled_apis,
    google_service_account.datadog_gcp_service_account
  ]
}

# Datadog GCP Integration
resource "datadog_integration_gcp_sts" "datadog_integration" {
  depends_on = [
    google_project_service.enabled_apis,
    google_service_account.datadog_gcp_service_account,
    google_service_account_iam_member.datadog_gcp_service_account_token_creator,
    google_project_iam_member.datadog_gcp_service_account_project_roles,
    google_folder_iam_member.datadog_gcp_service_account_folder_roles,
  ]

  client_email                = google_service_account.datadog_gcp_service_account.email
  automute                    = true
  resource_collection_enabled = true
  metric_namespace_configs = [
    {
      id       = "prometheus"
      disabled = true
      filters = []
    }
  ]
  monitored_resource_configs = []
  account_tags = []
  is_per_project_quota_enabled = true
}