# Routine Flow API

## Descrição

API backend para o sistema Routine Flow, um gerenciador de produtividade pessoal desenvolvido com NestJS, TypeScript e Prisma.

## Configuração do Projeto

```bash
# Instalar dependências
$ npm install

# Configurar o banco de dados (Prisma)
$ npx prisma migrate dev
$ npx prisma generate

# Povoar o banco com dados de exemplo (opcional)
$ npx prisma db seed
```

## Executar o Projeto

```bash
# Modo de desenvolvimento
$ npm run start:dev

# Modo de produção
$ npm run start:prod
```

## Documentação da API

O Routine Flow API utiliza Swagger para documentação automática de endpoints.

### Acessar a Documentação

Quando o servidor estiver em execução, acesse a documentação Swagger em:

```
http://localhost:3001/docs
```

### Exportar Especificação OpenAPI

Para exportar a documentação em formato OpenAPI (JSON):

```bash
# Exportar para a raiz do projeto (openapi-spec.json)
$ npm run export:openapi

# Exportar para a pasta docs (docs/openapi-spec.json)
$ npm run export:openapi:docs
```

Para mais detalhes sobre a documentação da API, consulte [docs/api-documentation.md](docs/api-documentation.md).

## Testes

```bash
# Testes unitários
$ npm run test

# Testes e2e
$ npm run test:e2e

# Cobertura de testes
$ npm run test:cov
```

## Estrutura da API

A API do Routine Flow segue uma estrutura RESTful com os seguintes recursos:

- `/api/tasks` - Gerenciamento de tarefas
- `/api/habits` - Gerenciamento de hábitos
- `/api/goals` - Gerenciamento de metas
- `/api/transactions` - Gerenciamento de transações financeiras
- `/api/investments` - Gerenciamento de investimentos
- `/api/users` - Gerenciamento de usuários

## Tecnologias Utilizadas

- **NestJS**: Framework modular para Node.js
- **TypeScript**: Linguagem fortemente tipada
- **Prisma**: ORM para acesso ao banco de dados
- **Swagger/OpenAPI**: Documentação automática da API
- **JWT**: Autenticação baseada em tokens
- **Jest**: Framework de testes

## Licença

Este projeto está licenciado sob a licença MIT.
