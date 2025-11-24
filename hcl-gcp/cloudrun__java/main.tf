# Enable required GCP APIs
resource "google_project_service" "cloud_run" {
  project = var.project_id
  service = "run.googleapis.com"

  disable_on_destroy = false
}

resource "google_project_service" "artifact_registry" {
  project = var.project_id
  service = "artifactregistry.googleapis.com"

  disable_on_destroy = false
}

resource "google_project_service" "cloud_build" {
  project = var.project_id
  service = "cloudbuild.googleapis.com"

  disable_on_destroy = false
}

# Create Artifact Registry repository for Docker images
resource "google_artifact_registry_repository" "java_apps" {
  project       = var.project_id
  location      = var.region
  repository_id = var.artifact_registry_name
  description   = "Docker repository for Java applications"
  format        = "DOCKER"

  labels = var.labels

  depends_on = [google_project_service.artifact_registry]
}

# Create service account for Cloud Run
resource "google_service_account" "cloudrun_sa" {
  project      = var.project_id
  account_id   = var.service_account_name
  display_name = "Cloud Run Service Account"
  description  = "Service account for Cloud Run Java demo application"
}

# Grant necessary permissions to the service account
resource "google_project_iam_member" "cloudrun_sa_logging" {
  project = var.project_id
  role    = "roles/logging.logWriter"
  member  = "serviceAccount:${google_service_account.cloudrun_sa.email}"
}

resource "google_project_iam_member" "cloudrun_sa_metrics" {
  project = var.project_id
  role    = "roles/monitoring.metricWriter"
  member  = "serviceAccount:${google_service_account.cloudrun_sa.email}"
}

# Deploy Cloud Run service
resource "google_cloud_run_v2_service" "java_api" {
  project  = var.project_id
  name     = var.service_name
  location = var.region

  labels = var.labels

  template {
    service_account = google_service_account.cloudrun_sa.email

    scaling {
      min_instance_count = var.min_instances
      max_instance_count = var.max_instances
    }

    containers {
      # Image will be updated manually or via CI/CD
      image = "${var.region}-docker.pkg.dev/${var.project_id}/${var.artifact_registry_name}/cloudrun-java-demo:latest"

      ports {
        container_port = var.container_port
      }

      resources {
        limits = {
          cpu    = var.container_cpu
          memory = var.container_memory
        }
      }

      # Startup probe - gives the app time to initialize
      startup_probe {
        http_get {
          path = "/actuator/health"
        }
        initial_delay_seconds = 10
        timeout_seconds       = 3
        period_seconds        = 10
        failure_threshold     = 3
      }

      # Liveness probe - checks if app is running
      liveness_probe {
        http_get {
          path = "/actuator/health"
        }
        initial_delay_seconds = 30
        timeout_seconds       = 3
        period_seconds        = 30
        failure_threshold     = 3
      }
    }
  }

  depends_on = [
    google_project_service.cloud_run,
    google_artifact_registry_repository.java_apps,
    google_service_account.cloudrun_sa
  ]
}

# Allow public (unauthenticated) access to the Cloud Run service
resource "google_cloud_run_v2_service_iam_member" "public_access" {
  project  = google_cloud_run_v2_service.java_api.project
  location = google_cloud_run_v2_service.java_api.location
  name     = google_cloud_run_v2_service.java_api.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}
