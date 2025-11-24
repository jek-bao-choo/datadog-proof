variable "project_id" {
  description = "GCP Project ID"
  type        = string
}

variable "region" {
  description = "GCP region for resources"
  type        = string
  default     = "asia-southeast1"
}

variable "service_name" {
  description = "Name of the Cloud Run service"
  type        = string
  default     = "jek-cloudrun-java-api"
}

variable "artifact_registry_name" {
  description = "Name of the Artifact Registry repository"
  type        = string
  default     = "jek-java-apps"
}

variable "service_account_name" {
  description = "Name of the service account for Cloud Run"
  type        = string
  default     = "jek-cloudrun-sa"
}

variable "container_port" {
  description = "Port the container listens on"
  type        = number
  default     = 8080
}

variable "container_memory" {
  description = "Memory allocation for the container"
  type        = string
  default     = "512Mi"
}

variable "container_cpu" {
  description = "CPU allocation for the container"
  type        = string
  default     = "1"
}

variable "min_instances" {
  description = "Minimum number of instances"
  type        = number
  default     = 0
}

variable "max_instances" {
  description = "Maximum number of instances"
  type        = number
  default     = 10
}

variable "labels" {
  description = "Labels to apply to resources"
  type        = map(string)
  default = {
    owner      = "jek"
    env        = "test"
    managed_by = "terraform"
    purpose    = "demo"
  }
}
