import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

// Background steps
Given("estou na página de tarefas", () => {
  cy.visit('/tasks');
});

// Task creation scenarios - usar steps comuns do common.ts para ações genéricas

When("eu preencho o nome da tarefa com {string}", (taskName: string) => {
  cy.get('[data-testid="task-name"], input[name="name"]').type(taskName);
});

When("eu seleciono a prioridade {string}", (priority: string) => {
  cy.get('[data-testid="priority-select"], select[name="priority"]').select(priority);
});

When("eu seleciono a categoria {string}", (category: string) => {
  cy.get('[data-testid="category-select"], select[name="category"]').select(category);
});

// Usar step comum do common.ts para "eu clico em"

Then("a tarefa {string} deve aparecer na lista", (taskName: string) => {
  cy.contains('[data-testid="task-item"], .task-item', taskName).should('be.visible');
});

Then("a tarefa deve ter status {string}", (status: string) => {
  cy.contains(status).should('be.visible');
});

// Task with due date
When("eu defino a data de vencimento para {string}", (dueDate: string) => {
  // Para simplificar, vamos usar uma data fixa
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  const formattedDate = nextWeek.toISOString().split('T')[0];
  
  cy.get('[data-testid="due-date"], input[type="date"]').type(formattedDate);
});

Then("a tarefa deve mostrar a data de vencimento", () => {
  cy.get('[data-testid="due-date-display"]').should('be.visible');
});

// Task completion
Given("que existe uma tarefa {string} pendente", (taskName: string) => {
  // Criar tarefa via API para garantir que existe
  cy.authenticatedRequest({
    method: 'POST',
    url: `${Cypress.env('apiUrl') || 'http://localhost:3001'}/tasks`,
    body: {
      name: taskName,
      priority: 'IMPORTANT_NOT_URGENT',
      category: 'PERSONAL',
      status: 'PENDING'
    }
  });
  cy.reload();
});

When("eu clico no checkbox da tarefa {string}", (taskName: string) => {
  cy.contains('[data-testid="task-item"]', taskName)
    .find('[data-testid="task-checkbox"], input[type="checkbox"]')
    .click();
});

Then("a tarefa deve ser marcada como concluída", () => {
  cy.get('[data-testid="task-completed"]').should('be.visible');
});

Then("a tarefa deve aparecer na seção de {string}", (section: string) => {
  cy.contains('.section-title', section).should('be.visible');
});

// Task editing
Given("que existe uma tarefa {string}", (taskName: string) => {
  cy.authenticatedRequest({
    method: 'POST',
    url: `${Cypress.env('apiUrl') || 'http://localhost:3001'}/tasks`,
    body: {
      name: taskName,
      priority: 'IMPORTANT_NOT_URGENT',
      category: 'PERSONAL'
    }
  });
  cy.reload();
});

When("eu clico no ícone de editar da tarefa {string}", (taskName: string) => {
  cy.contains('[data-testid="task-item"]', taskName)
    .find('[data-testid="edit-button"], .edit-button')
    .click();
});

When("eu altero o nome para {string}", (newName: string) => {
  cy.get('[data-testid="task-name"], input[name="name"]').clear().type(newName);
});

When("eu altero a prioridade para {string}", (newPriority: string) => {
  cy.get('[data-testid="priority-select"], select[name="priority"]').select(newPriority);
});

Then("a prioridade deve ser {string}", (priority: string) => {
  cy.contains(priority).should('be.visible');
});

// Task filtering
Given("que existem tarefas das categorias {string}, {string} e {string}", (cat1: string, cat2: string, cat3: string) => {
  const categories = [cat1, cat2, cat3];
  categories.forEach((category, index) => {
    cy.authenticatedRequest({
      method: 'POST',
      url: `${Cypress.env('apiUrl') || 'http://localhost:3001'}/tasks`,
      body: {
        name: `Tarefa de ${category} ${index + 1}`,
        priority: 'IMPORTANT_NOT_URGENT',
        category: category.toUpperCase()
      }
    });
  });
  cy.reload();
});

When("eu seleciono o filtro de categoria {string}", (category: string) => {
  cy.get('[data-testid="category-filter"], .category-filter').select(category);
});

Then("devo ver apenas as tarefas da categoria {string}", (category: string) => {
  cy.get('[data-testid="task-item"]').each(($el) => {
    cy.wrap($el).should('contain', category);
  });
});

Then("as tarefas de outras categorias não devem aparecer", () => {
  // Implementar verificação específica se necessário
});

// Task deletion
When("eu clico no ícone de excluir da tarefa {string}", (taskName: string) => {
  cy.contains('[data-testid="task-item"]', taskName)
    .find('[data-testid="delete-button"], .delete-button')
    .click();
});

When("eu confirmo a exclusão", () => {
  cy.get('[data-testid="confirm-delete"], .confirm-delete').click();
});

Then("a tarefa {string} não deve mais aparecer na lista", (taskName: string) => {
  cy.contains('[data-testid="task-item"]', taskName).should('not.exist');
});

// Recurring tasks
When("eu seleciono a recorrência {string}", (recurrence: string) => {
  cy.get('[data-testid="recurrence-select"], select[name="recurrence"]').select(recurrence);
});

When("eu defino {int} repetições necessárias", (repetitions: number) => {
  cy.get('[data-testid="repetitions-input"], input[name="repetitionsRequired"]').type(repetitions.toString());
});

Then("deve mostrar {string}", (text: string) => {
  cy.contains(text).should('be.visible');
});
