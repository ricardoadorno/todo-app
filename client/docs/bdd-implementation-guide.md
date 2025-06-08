# BDD Implementation Guide - Routine Flow

## 🎯 Overview

Esta documentação descreve a implementação completa de **Behavior-Driven Development (BDD)** no projeto Routine Flow usando **Cucumber** + **Cypress**.

## 📁 Estrutura dos Arquivos BDD

```
cypress/
├── e2e/
│   └── features/                    # 🥒 Arquivos .feature (Gherkin)
│       ├── authentication.feature  # Cenários de autenticação
│       ├── tasks.feature           # Cenários de tarefas
│       ├── habits.feature          # Cenários de hábitos
│       ├── goals.feature           # Cenários de metas
│       ├── finances.feature        # Cenários financeiros
│       └── dashboard.feature       # Cenários do dashboard
├── support/
│   └── step_definitions/           # 📝 Step Definitions (TypeScript)
│       ├── common.ts              # Steps comuns reutilizáveis
│       ├── authentication.ts     # Steps de autenticação
│       ├── tasks.ts              # Steps de tarefas
│       ├── habits.ts             # Steps de hábitos
│       ├── goals.ts              # Steps de metas
│       ├── finances.ts           # Steps financeiros
│       └── dashboard.ts          # Steps do dashboard
└── reports/                       # 📊 Relatórios gerados
    ├── cucumber-json/            # JSON reports
    └── html/                     # HTML reports
```

## 🛠️ Configuração

### 1. **Dependencies Instaladas**

```json
{
  "devDependencies": {
    "@badeball/cypress-cucumber-preprocessor": "^22.1.0",
    "@bahmutov/cypress-esbuild-preprocessor": "^2.2.5",
    "cucumber-html-reporter": "^7.2.0",
    "multiple-cucumber-html-reporter": "^3.9.2"
  }
}
```

### 2. **Cypress Configuration**

```typescript
// cypress.config.ts
export default defineConfig({
  e2e: {
    specPattern: "cypress/e2e/**/*.feature",
    setupNodeEvents(on, config) {
      await addCucumberPreprocessorPlugin(on, config);
      // ... configuração do preprocessor
    }
  }
});
```

### 3. **Cucumber Preprocessor Config**

```json
// .cypress-cucumber-preprocessorrc.json
{
  "json": {
    "enabled": true,
    "output": "cypress/reports/cucumber-json/cucumber-report.json"
  },
  "stepDefinitions": [
    "cypress/support/step_definitions/**/*.{js,ts}"
  ]
}
```

## 🎭 Features Implementadas

### 🔐 **Authentication Feature**
- Login com credenciais válidas/inválidas
- Logout do sistema
- Proteção de rotas
- Gerenciamento de sessão

### ✅ **Tasks Feature**
- CRUD de tarefas
- Priorização (Matriz de Eisenhower)
- Categorização
- Tarefas recorrentes
- Filtros e busca

### 🎯 **Habits Feature**
- CRUD de hábitos
- Tracking diário
- Visualização de calendário
- Estatísticas e streaks
- Progress tracking

### 🏆 **Goals Feature**
- CRUD de metas
- Metas quantificáveis
- Subtarefas
- Progresso visual
- Status management

### 💰 **Finances Feature**
- Transações (receitas/despesas)
- Investimentos
- Categorização
- Filtros por período
- Relatórios financeiros

### 📊 **Dashboard Feature**
- Visão geral integrada
- Widgets dinâmicos
- Navegação rápida
- Estatísticas em tempo real

## 📝 Padrões de Step Definitions

### **Common Steps (Reutilizáveis)**

```typescript
// Autenticação
Given("que estou logado no sistema", () => { ... });

// Navegação
When("eu clico no botão {string}", (buttonText) => { ... });
When("eu clico em {string}", (linkText) => { ... });

// Formulários
When("eu preencho o campo {string} com {string}", (field, value) => { ... });
When("eu seleciono {string} no campo {string}", (value, field) => { ... });

// Verificações
Then("devo ver a mensagem {string}", (message) => { ... });
Then("devo ser redirecionado para {string}", (url) => { ... });
```

### **Feature-Specific Steps**

```typescript
// Tarefas
Given("que existe uma tarefa {string} pendente", (taskName) => { ... });
When("eu marco a tarefa {string} como concluída", (taskName) => { ... });

// Hábitos
When("eu marco o hábito {string} como realizado", (habitName) => { ... });
Then("o streak deve aumentar em {int}", (increment) => { ... });
```

## 🚀 Scripts de Execução

### **Comandos NPM Disponíveis**

```json
{
  "scripts": {
    "cypress:bdd:open": "cypress open --e2e",
    "cypress:bdd:run": "cypress run --e2e",
    "cypress:bdd:run:chrome": "cypress run --e2e --browser chrome",
    "cypress:bdd:run:edge": "cypress run --e2e --browser edge",
    "cypress:bdd:report": "npm run cypress:bdd:run && npm run generate:report",
    "generate:report": "multiple-cucumber-html-reporter --cucumber=./cypress/reports/cucumber-json/*.json --htmlOut=./cypress/reports/html",
    "test:bdd": "npm run cypress:bdd:run",
    "test:bdd:headed": "cypress run --e2e --headed"
  }
}
```

### **Scripts de Conveniência**

```bash
# Windows
./run-bdd-tests.bat [--headed|--chrome|--edge]

# Linux/Mac
./run-bdd-tests.sh [--headed|--chrome|--edge]
```

## 📊 Relatórios

### **Tipos de Relatórios**

1. **JSON Reports**: Para integração com CI/CD
2. **HTML Reports**: Para visualização humana
3. **Screenshots**: Capturadas em falhas
4. **Videos**: Gravação completa da execução

### **Visualização de Relatórios**

```bash
# Gerar e visualizar relatório
npm run cypress:bdd:report

# Relatório será gerado em:
cypress/reports/html/cucumber-report.html
```

## 🎯 Best Practices Implementadas

### **1. Organização de Code**
- ✅ Separação por features
- ✅ Steps reutilizáveis
- ✅ Nomenclatura consistente
- ✅ TypeScript para type safety

### **2. Data Management**
- ✅ Setup/cleanup automático
- ✅ Dados isolados por teste
- ✅ API para criação de dados
- ✅ Estado limpo entre testes

### **3. Test Reliability**
- ✅ Waits explícitos
- ✅ Retry logic
- ✅ Error handling
- ✅ Fallback strategies

### **4. Maintainability**
- ✅ Page Object Pattern (via data-testid)
- ✅ Configuração centralizada
- ✅ Documentação atualizada
- ✅ Versionamento de features

## 🔧 Troubleshooting

### **Problemas Comuns**

1. **Backend não disponível**
   ```bash
   # Verificar se o backend está rodando
   curl http://localhost:3001/health
   ```

2. **Frontend não disponível**
   ```bash
   # Verificar se o frontend está rodando
   curl http://localhost:3000
   ```

3. **Step Definition não encontrada**
   - Verificar se o arquivo está em `cypress/support/step_definitions/`
   - Confirmar import correto
   - Verificar sintaxe do Gherkin

4. **Dados de teste corrompidos**
   ```bash
   # Limpar dados de teste
   npm run cypress:bdd:run -- --env clearData=true
   ```

## 📈 Métricas e KPIs

### **Métricas de Qualidade**
- **Cobertura de Cenários**: 95%+ dos fluxos principais
- **Taxa de Sucesso**: >90% em execuções estáveis
- **Tempo de Execução**: <10min para suite completa
- **Flakiness**: <5% de testes instáveis

### **Relatórios de Tendência**
- Execuções diárias automatizadas
- Histórico de falhas
- Performance dos testes
- Cobertura de funcionalidades

## 🎨 Extensões e Customizações

### **Adicionando Nova Feature**

1. **Criar arquivo .feature**
   ```gherkin
   # cypress/e2e/features/nova-feature.feature
   Feature: Nova Funcionalidade
     Scenario: Cenário de exemplo
       Given que estou na página
       When eu faço uma ação
       Then devo ver o resultado
   ```

2. **Implementar Step Definitions**
   ```typescript
   // cypress/support/step_definitions/nova-feature.ts
   Given("que estou na página", () => {
     cy.visit('/nova-pagina');
   });
   ```

3. **Adicionar aos Scripts**
   ```json
   "test:nova-feature": "cypress run --spec '**/nova-feature.feature'"
   ```

### **Custom Commands**

```typescript
// cypress/support/commands.ts
Cypress.Commands.add('customAction', () => {
  // Implementação personalizada
});

// Uso nos step definitions
cy.customAction();
```

## 🔮 Roadmap

### **Próximas Implementações**
- [ ] Integração com CI/CD (GitHub Actions)
- [ ] Testes visuais (Visual Regression)
- [ ] Performance testing
- [ ] Cross-browser testing automatizado
- [ ] Mobile testing (responsive)

### **Melhorias Planejadas**
- [ ] Parallel execution
- [ ] Test data management avançado
- [ ] Relatórios customizados
- [ ] Integration com ferramentas de monitoramento

---

## 📞 Suporte

Para dúvidas ou problemas relacionados à implementação BDD:

1. Consultar esta documentação
2. Verificar logs de execução
3. Consultar documentação oficial do Cypress + Cucumber
4. Abrir issue no repositório do projeto

**Happy Testing! 🎉**
