output "cluster_name" {
  description = "Name of the GKE cluster"
  value       = google_container_cluster.jek_gke_cluster.name
}

output "cluster_location" {
  description = "Location of the GKE cluster"
  value       = google_container_cluster.jek_gke_cluster.location
}

output "cluster_endpoint" {
  description = "Endpoint of the GKE cluster"
  value       = google_container_cluster.jek_gke_cluster.endpoint
  sensitive   = true
}

output "cluster_ca_certificate" {
  description = "Cluster CA certificate (base64 encoded)"
  value       = google_container_cluster.jek_gke_cluster.master_auth[0].cluster_ca_certificate
  sensitive   = true
}

output "get_credentials_command" {
  description = "Command to configure kubectl"
  value       = "gcloud container clusters get-credentials ${google_container_cluster.jek_gke_cluster.name} --region=${google_container_cluster.jek_gke_cluster.location}"
}