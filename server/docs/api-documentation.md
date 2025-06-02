# Routine Flow API - Documentação

## Documentação da API com OpenAPI/Swagger

Este projeto utiliza o Swagger para documentação automática da API. A documentação está disponível de duas maneiras:

### 1. Swagger UI (Ambiente de Desenvolvimento)

Quando o servidor está em execução, você pode acessar a interface do Swagger UI em:

```
http://localhost:3001/docs
```

Esta interface permite:

- Visualizar todos os endpoints disponíveis
- Testar as chamadas de API diretamente no navegador
- Verificar os modelos de dados e requisições
- Realizar autenticação para testar endpoints protegidos

### 2. Arquivo de Especificação OpenAPI (JSON)

Você pode exportar a especificação OpenAPI completa para um arquivo JSON usando os comandos npm:

```bash
# Exportar para a raiz do projeto (openapi-spec.json)
npm run export:openapi

# Exportar para a pasta docs (docs/openapi-spec.json)
npm run export:openapi:docs
```

## Integrando com Ferramentas Externas

O arquivo de especificação OpenAPI exportado pode ser importado em ferramentas como:

- **Postman**: Importe o arquivo JSON para criar uma coleção completa
- **Insomnia**: Importe o arquivo para testar os endpoints
- **SwaggerHub**: Para colaboração e publicação da documentação
- **Redoc**: Para gerar documentação estática em HTML

## Estrutura da API

A API do Routine Flow segue uma estrutura RESTful com os seguintes recursos principais:

- `/api/tasks` - Gerenciamento de tarefas
- `/api/habits` - Gerenciamento de hábitos
- `/api/goals` - Gerenciamento de metas
- `/api/finances` - Gerenciamento financeiro
- `/api/health` - Informações de saúde
- `/api/users` - Gerenciamento de usuários

## Autenticação

A API utiliza autenticação JWT (JSON Web Token). Para autenticar:

1. Obtenha um token através do endpoint de login
2. Inclua o token no cabeçalho `Authorization: Bearer {token}` para requisições protegidas

## Manutenção da Documentação

Para manter a documentação atualizada:

1. Use os decoradores do Swagger nos controllers e DTOs
2. Documente parâmetros, respostas e exemplos
3. Atualize a versão da API no arquivo `main.ts` quando houver mudanças significativas
