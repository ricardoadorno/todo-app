import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

// Background steps
Given("estou na página do dashboard", () => {
  cy.visit('/');
});

// Dashboard overview
Given("que existem dados nas diferentes seções do app", () => {
  // Criar dados de teste para todas as seções
    // Tarefas
  cy.authenticatedRequest({
    method: 'POST',
    url: `${Cypress.env('apiUrl') || 'http://localhost:3001'}/api/tasks`,
    body: {
      name: 'Tarefa Dashboard 1',
      priority: 'URGENT_IMPORTANT',
      category: 'WORK',
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 dias
      status: 'PENDING'
    }
  });
  // Hábitos
  cy.authenticatedRequest({
    method: 'POST',
    url: `${Cypress.env('apiUrl') || 'http://localhost:3001'}/api/habits`,
    body: {
      name: 'Hábito Dashboard',
      description: 'Hábito para dashboard',
      frequency: 'DAILY'
    }
  });
  // Metas
  cy.authenticatedRequest({
    method: 'POST',
    url: `${Cypress.env('apiUrl') || 'http://localhost:3001'}/api/goals`,
    body: {
      title: 'Meta Dashboard',
      description: 'Meta para dashboard',
      category: 'PERSONAL',
      status: 'IN_PROGRESS',
      currentValue: 3,
      targetValue: 10
    }
  });
  // Transações
  cy.authenticatedRequest({
    method: 'POST',
    url: `${Cypress.env('apiUrl') || 'http://localhost:3001'}/api/transactions`,
    body: {
      description: 'Receita Dashboard',
      amount: 3000,
      type: 'INCOME',
      category: 'SALARY',
      date: new Date().toISOString()
    }
  });

  cy.reload();
});

When("eu acesso o dashboard", () => {
  cy.get('[data-testid="dashboard"], .dashboard-container').should('be.visible');
});

Then("devo ver um cartão de {string}", (cardTitle: string) => {
  cy.contains('[data-testid="dashboard-card"], .dashboard-card', cardTitle).should('be.visible');
});

// Upcoming tasks
Given("que existem tarefas com vencimento em {int} dias", (days: number) => {
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + days);
  
  cy.authenticatedRequest({
    method: 'POST',
    url: `${Cypress.env('apiUrl') || 'http://localhost:3001'}/tasks`,
    body: {
      name: 'Tarefa Urgente',
      priority: 'URGENT_IMPORTANT',
      category: 'WORK',
      dueDate: dueDate.toISOString(),
      status: 'PENDING'
    }
  });

  cy.authenticatedRequest({
    method: 'POST',
    url: `${Cypress.env('apiUrl') || 'http://localhost:3001'}/tasks`,
    body: {
      name: 'Tarefa Normal',
      priority: 'IMPORTANT_NOT_URGENT',
      category: 'PERSONAL',
      dueDate: dueDate.toISOString(),
      status: 'PENDING'
    }
  });

  cy.reload();
});

When("eu visualizo a seção {string}", (sectionTitle: string) => {
  cy.contains('[data-testid="dashboard-section"], .dashboard-section', sectionTitle).should('be.visible');
});

Then("devo ver as tarefas ordenadas por data de vencimento", () => {
  cy.get('[data-testid="upcoming-tasks"] [data-testid="task-item"]').should('have.length.greaterThan', 0);
});

Then("tarefas urgentes devem ter destaque visual", () => {
  cy.get('[data-testid="urgent-task"], .urgent-task').should('have.class', 'border-red-500');
});

Then("devo poder marcar tarefas como concluídas diretamente", () => {
  cy.get('[data-testid="task-checkbox"], .task-quick-complete').should('be.visible');
});

// Daily habits
Given("que tenho hábitos configurados para hoje", () => {
  cy.authenticatedRequest({
    method: 'POST',
    url: `${Cypress.env('apiUrl') || 'http://localhost:3001'}/habits`,
    body: {
      name: 'Exercitar-se',
      description: 'Exercício diário',
      frequency: 'DAILY'
    }
  });

  cy.authenticatedRequest({
    method: 'POST',
    url: `${Cypress.env('apiUrl') || 'http://localhost:3001'}/habits`,
    body: {
      name: 'Meditar',
      description: 'Meditação diária',
      frequency: 'DAILY'
    }
  });

  cy.reload();
});

Then("devo ver todos os hábitos do dia", () => {
  cy.get('[data-testid="daily-habits"] [data-testid="habit-item"]').should('have.length.greaterThan', 0);
});

Then("devo ver o status atual de cada hábito", () => {
  cy.get('[data-testid="habit-status"], .habit-status-indicator').should('be.visible');
});

Then("devo poder marcar hábitos como realizados", () => {
  cy.get('[data-testid="habit-complete-btn"], .habit-quick-complete').should('be.visible');
});

// Goals progress
Given("que tenho metas em progresso", () => {
  cy.authenticatedRequest({
    method: 'POST',
    url: `${Cypress.env('apiUrl') || 'http://localhost:3001'}/goals`,
    body: {
      title: 'Aprender TypeScript',
      description: 'Dominar TypeScript',
      category: 'LEARNING',
      status: 'IN_PROGRESS',
      currentValue: 7,
      targetValue: 10
    }
  });

  cy.authenticatedRequest({
    method: 'POST',
    url: `${Cypress.env('apiUrl') || 'http://localhost:3001'}/goals`,
    body: {
      title: 'Economizar dinheiro',
      description: 'Meta de economia',
      category: 'FINANCIAL',
      status: 'IN_PROGRESS',
      currentValue: 3000,
      targetValue: 10000
    }
  });

  cy.reload();
});

Then("devo ver as metas ordenadas por prioridade", () => {
  cy.get('[data-testid="goals-in-progress"] [data-testid="goal-item"]').should('have.length.greaterThan', 0);
});

Then("devo ver o progresso de cada meta", () => {
  cy.get('[data-testid="goal-progress"], .goal-progress-text').should('be.visible');
});

Then("devo ver barras de progresso visuais", () => {
  cy.get('[data-testid="goal-progress-bar"], .goal-progress-bar').should('be.visible');
});

// Financial summary
Given("que tenho transações do mês atual", () => {
  const currentMonth = new Date();
  
  // Receitas
  cy.authenticatedRequest({
    method: 'POST',
    url: `${Cypress.env('apiUrl') || 'http://localhost:3001'}/transactions`,
    body: {
      description: 'Salário',
      amount: 5000,
      type: 'INCOME',
      category: 'SALARY',
      date: currentMonth.toISOString()
    }
  });

  // Despesas
  cy.authenticatedRequest({
    method: 'POST',
    url: `${Cypress.env('apiUrl') || 'http://localhost:3001'}/transactions`,
    body: {
      description: 'Supermercado',
      amount: 400,
      type: 'EXPENSE',
      category: 'FOOD',
      date: currentMonth.toISOString()
    }
  });

  cy.authenticatedRequest({
    method: 'POST',
    url: `${Cypress.env('apiUrl') || 'http://localhost:3001'}/transactions`,
    body: {
      description: 'Combustível',
      amount: 200,
      type: 'EXPENSE',
      category: 'TRANSPORT',
      date: currentMonth.toISOString()
    }
  });

  cy.reload();
});

Then("devo ver as receitas do mês", () => {
  cy.get('[data-testid="monthly-income"], .monthly-income').should('be.visible');
});

Then("devo ver as despesas do mês", () => {
  cy.get('[data-testid="monthly-expenses"], .monthly-expenses').should('be.visible');
});

// Navigation
When("eu clico em {string} na seção de tarefas", (linkText: string) => {
  cy.get('[data-testid="tasks-section"]').contains('a', linkText).click();
});

Then("devo ser redirecionado para a página de tarefas", () => {
  cy.url().should('include', '/tasks');
});

When("eu clico em {string} na seção de hábitos", (linkText: string) => {
  cy.get('[data-testid="habits-section"]').contains('a', linkText).click();
});

Then("devo ser redirecionado para a página de hábitos", () => {
  cy.url().should('include', '/habits');
});

// Real-time updates
Given("que estou no dashboard", () => {
  cy.get('[data-testid="dashboard"]').should('be.visible');
});

When("eu marco um hábito como realizado", () => {
  cy.get('[data-testid="habit-complete-btn"]').first().click();
});

Then("o contador de hábitos deve ser atualizado instantaneamente", () => {
  cy.get('[data-testid="habits-completed-count"]').should('be.visible');
});

Then("a barra de progresso deve refletir a mudança", () => {
  cy.get('[data-testid="habits-progress-bar"]').should('be.visible');
});

// Weekly statistics
Given("que tenho dados da semana atual", () => {
  const thisWeek = new Date();
  
  // Criar dados para a semana
  for (let i = 0; i < 5; i++) {
    const date = new Date(thisWeek);
    date.setDate(date.getDate() - i);
    
    // Tarefas concluídas
    cy.authenticatedRequest({
      method: 'POST',
      url: `${Cypress.env('apiUrl') || 'http://localhost:3001'}/tasks`,
      body: {
        name: `Tarefa ${i + 1}`,
        priority: 'IMPORTANT_NOT_URGENT',
        category: 'WORK',
        status: 'COMPLETED',
        completedAt: date.toISOString()
      }
    });
  }

  cy.reload();
});

When("eu visualizo as estatísticas semanais", () => {
  cy.get('[data-testid="weekly-stats"], .weekly-statistics').should('be.visible');
});

Then("devo ver quantas tarefas foram concluídas", () => {
  cy.get('[data-testid="tasks-completed-week"], .tasks-completed-count').should('be.visible');
});

Then("devo ver a taxa de sucesso dos hábitos", () => {
  cy.get('[data-testid="habits-success-rate"], .habits-success-rate').should('be.visible');
});

Then("devo ver o progresso das metas", () => {
  cy.get('[data-testid="goals-progress-week"], .goals-weekly-progress').should('be.visible');
});

Then("devo ver o resumo financeiro semanal", () => {
  cy.get('[data-testid="financial-summary-week"], .weekly-financial-summary').should('be.visible');
});
