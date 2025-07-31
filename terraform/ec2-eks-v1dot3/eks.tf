resource "aws_eks_cluster" "main" {
  name     = var.cluster_name
  role_arn = aws_iam_role.eks_cluster.arn
  version  = var.kubernetes_version

  vpc_config {
    subnet_ids              = [aws_subnet.public_1.id, aws_subnet.public_2.id]
    endpoint_private_access = false
    endpoint_public_access  = true
    security_group_ids      = [aws_security_group.eks_cluster.id]
  }

  enabled_cluster_log_types = ["api", "audit"]

  depends_on = [
    aws_iam_role_policy_attachment.eks_cluster_policy,
  ]

  tags = {
    Name  = var.cluster_name
    owner = "jek"
    env   = "test"
  }
}

resource "aws_eks_node_group" "main" {
  cluster_name    = aws_eks_cluster.main.name
  node_group_name = "jek-eks-nodes"
  node_role_arn   = aws_iam_role.eks_nodes.arn
  subnet_ids      = [aws_subnet.public_1.id, aws_subnet.public_2.id]

  capacity_type  = "ON_DEMAND"
  instance_types = [var.node_instance_type]
  ami_type       = "AL2_x86_64"

  scaling_config {
    desired_size = var.node_desired_size
    max_size     = var.node_max_size
    min_size     = var.node_min_size
  }

  update_config {
    max_unavailable = 1
  }

  remote_access {
    ec2_ssh_key               = var.ssh_key_name
    source_security_group_ids = [aws_security_group.eks_nodes.id]
  }

  depends_on = [
    aws_iam_role_policy_attachment.eks_worker_node_policy,
    aws_iam_role_policy_attachment.eks_cni_policy,
    aws_iam_role_policy_attachment.eks_container_registry_policy,
  ]

  tags = {
    Name                                        = "jek-eks-nodes"
    "kubernetes.io/cluster/${var.cluster_name}" = "owned"
    owner                                       = "jek"
    env                                         = "test"
  }
}