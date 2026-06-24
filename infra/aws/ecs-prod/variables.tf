variable "aws_region" {
  type        = string
  description = "Regiao AWS"
}

variable "project_name" {
  type        = string
  description = "Nome do projeto (use sufixo -prod para diferenciar de homologacao)"
  default     = "projeto2-cicd-aws-prod"
}

variable "container_image" {
  type        = string
  description = "Imagem inicial do container"
}

variable "container_port" {
  type        = number
  description = "Porta exposta pelo container"
  default     = 3333
}