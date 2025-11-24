output "service_url" {
  description = "URL of the Cloud Run service"
  value       = google_cloud_run_v2_service.java_api.uri
}

output "service_name" {
  description = "Name of the Cloud Run service"
  value       = google_cloud_run_v2_service.java_api.name
}

output "artifact_registry_url" {
  description = "URL of the Artifact Registry repository"
  value       = google_artifact_registry_repository.java_apps.name
}

output "service_account_email" {
  description = "Email of the service account"
  value       = google_service_account.cloudrun_sa.email
}

output "test_commands" {
  description = "Commands to test the deployed service"
  value = <<-EOT
    # Test main endpoint:
    curl ${google_cloud_run_v2_service.java_api.uri}/

    # Test info endpoint:
    curl ${google_cloud_run_v2_service.java_api.uri}/info

    # Test health endpoint:
    curl ${google_cloud_run_v2_service.java_api.uri}/actuator/health

    # Test metrics list:
    curl ${google_cloud_run_v2_service.java_api.uri}/actuator/metrics

    # Test JVM memory metrics:
    curl ${google_cloud_run_v2_service.java_api.uri}/actuator/metrics/jvm.memory.used

    # Test GC metrics:
    curl ${google_cloud_run_v2_service.java_api.uri}/actuator/metrics/jvm.gc.pause

    # Test thread metrics:
    curl ${google_cloud_run_v2_service.java_api.uri}/actuator/metrics/jvm.threads.live

    # Test class loading metrics:
    curl ${google_cloud_run_v2_service.java_api.uri}/actuator/metrics/jvm.classes.loaded
  EOT
}
