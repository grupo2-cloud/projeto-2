# Projeto 2 

Este projeto foi desenvolvido com o objetivo de simular um ambiente real de entrega contínua de software, aplicando práticas de CI/CD, conteinerização e infraestrutura como código.
Atualmente, muitas equipes ainda realizam deploys de forma manual ou com pouca automação, o que aumenta o risco de erros e dificulta o controle de versões em produção. Nesse contexto, o projeto propõe a construção de um pipeline automatizado utilizando AWS, Docker e GitHub Actions, garantindo maior confiabilidade, rastreabilidade e padronização no processo de entrega da aplicação.

---

## Tecnologias utilizadas

- Node.js;
- GitHub Actions;
- Docker;
- AWS ECS;
- Amazon ECR;
- Terraform;
- GitHub.

---

## Provedor Cloud Utilizado
 
Amazon Web Services

---

## Estrutura do projeto

O repositório está organizado em três partes principais: aplicação, infraestrutura e automação de deploy.

projeto-2/
    api/        (Aplicação)
    infra/      (Terraform)
    .github/    (CI/CD)
    scripts/policies 

---

## Endpoints

### Gerais
- `GET /` → informações da API (versão e ambiente)
- `GET /health` → health check da aplicação

### Pedidos
- `GET /orders` → lista todos os pedidos
- `GET /orders/:id` → busca pedido por ID
- `POST /orders` → cria um novo pedido
- `PATCH /orders/:id/status` → atualiza status do pedido

## Separação Entre Homologação E Produção

O projeto considera dois ambientes:

- Homologação
Deploy automático via pipeline
Usado para validação de alterações
Ambiente de testes

- Produção
Deploy controlado após validação

http://projeto2-cicd-aws-alb-79728089.sa-east-1.elb.amazonaws.com/health

http://projeto2-cicd-aws-prod-alb-1326657007.sa-east-1.elb.amazonaws.com/health