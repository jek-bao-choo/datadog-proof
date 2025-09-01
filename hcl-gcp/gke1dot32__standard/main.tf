terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 6.0"
    }
  }
  required_version = ">= 1.0"
}

provider "google" {
  project = var.project_id
  region  = var.region
}

resource "google_compute_subnetwork" "jek_gke_subnet" {
  name          = "jek-gke-subnet"
  ip_cidr_range = "10.0.0.0/24"
  region        = var.region
  network       = "default"
  
  secondary_ip_range {
    range_name    = "pods"
    ip_cidr_range = "10.1.0.0/16"
  }
  
  secondary_ip_range {
    range_name    = "services" 
    ip_cidr_range = "10.2.0.0/20"
  }
}

resource "google_container_cluster" "jek_gke_cluster" {
  name     = "jek-gke1dot32-standard"
  location = var.region
  
  min_master_version = "1.32"
  
  remove_default_node_pool = true
  initial_node_count       = 1
  
  resource_labels = {
    owner = "jek"
    env   = "test"
  }
  
  networking_mode = "VPC_NATIVE"
  network         = "default"
  subnetwork      = google_compute_subnetwork.jek_gke_subnet.name
  
  ip_allocation_policy {
    cluster_secondary_range_name  = "pods"
    services_secondary_range_name = "services"
  }
  
  deletion_protection = false
}

resource "google_container_node_pool" "jek_primary_nodes" {
  name       = "jek-node-pool"
  cluster    = google_container_cluster.jek_gke_cluster.name
  location   = google_container_cluster.jek_gke_cluster.location
  node_count = 1
  
  node_config {
    machine_type = "e2-medium"
    
    oauth_scopes = [
      "https://www.googleapis.com/auth/cloud-platform"
    ]
    
    labels = {
      owner = "jek"
      env   = "test"
    }
    
    tags = ["jek-gke-node"]
    
    metadata = {
      disable-legacy-endpoints = "true"
    }
  }
}