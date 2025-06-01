# Testes E2E com Cypress

Este diretório contém testes end-to-end (E2E) para o projeto Routine Flow utilizando Cypress.

## Estrutura de Testes

Os testes estão organizados da seguinte forma:

```
cypress/
├── e2e/                   # Testes E2E
│   ├── app.cy.ts          # Testes da interface da aplicação
│   └── api/               # Testes da API
│       ├── tasks.cy.ts    # Testes de tarefas
│       ├── goals.cy.ts    # Testes de metas
│       ├── habits.cy.ts   # Testes de hábitos
│       ├── finances.cy.ts # Testes de finanças (transações e investimentos)
│       ├── users.cy.ts    # Testes de usuários
│       └── auth.cy.ts     # Testes de autenticação
├── support/               # Arquivos de suporte
│   ├── commands.ts        # Comandos personalizados
│   ├── commands-types.d.ts# Definições de tipos para comandos
│   └── e2e.ts             # Configurações para testes E2E
└── fixtures/              # Dados fixos para testes
```

## Pré-requisitos

Antes de executar os testes, certifique-se de que:

1. O servidor backend está em execução em `http://localhost:3001` (ou ajuste a URL em `cypress.env.json`)
2. O frontend está em execução em `http://localhost:3000`

## Comandos Disponíveis

- Para abrir o Cypress Test Runner:
  ```bash
  npm run cypress:open
  ```

- Para executar todos os testes em modo headless:
  ```bash
  npm run cypress:run
  ```

- Para executar apenas os testes da API:
  ```bash
  npm run cypress:run -- --spec "cypress/e2e/api/**/*.cy.ts"
  ```

## Solução de Problemas

Se você encontrar erros nos testes:

1. **Problema de Autenticação**: Verifique se a API de autenticação está funcionando corretamente.
   - Teste manualmente o endpoint de login (`POST /auth/login`).
   - Verifique se os comandos personalizados estão funcionando corretamente.

2. **IDs de Usuário Inválidos**: Os testes estão configurados para criar automaticamente usuários de teste.
   - Se ocorrer erro ao criar usuários, ajuste os dados em `cypress.env.json`.

3. **Falhas de Conexão com a API**: Verifique se o servidor está rodando na porta configurada.
   - Ajuste a URL da API em `cypress.env.json` se necessário.

## Extensões

Para implementar novos testes:

1. Use os comandos personalizados existentes (`cy.login()`, `cy.createTestUser()`, `cy.authenticatedRequest()`)
2. Siga o padrão existente para criar/atualizar/excluir recursos
3. Garanta que cada teste limpe os dados criados para evitar efeitos colaterais

---

Mantenha este arquivo atualizado conforme novos testes forem adicionados.
