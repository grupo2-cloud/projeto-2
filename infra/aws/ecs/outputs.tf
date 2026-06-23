output "app_url" {
  value = "http://${aws_lb.app.dns_name}"
}
output "ecs_cluster_name" {
  value = aws_ecs_cluster.main.name
}
output "ecs_service_name" {
  value = aws_ecs_service.app.name
}
output "ecs_task_family" {
  value = aws_ecs_task_definition.app.family
}
output "container_name" {
  value = var.project_name
}
output "ecs_task_execution_role_name" {
  value = aws_iam_role.ecs_task_execution.name
}