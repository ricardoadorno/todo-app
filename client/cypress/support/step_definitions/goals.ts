import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

// Background steps
Given("estou na página de metas", () => {
  cy.visit('/goals');
});

// Goal creation
When("eu preencho o título com {string}", (title: string) => {
  cy.get('[data-testid="goal-title"], input[name="title"]').type(title);
});

When("eu preencho a descrição com {string}", (description: string) => {
  cy.get('[data-testid="goal-description"], textarea[name="description"]').type(description);
});

When("eu seleciono a categoria {string}", (category: string) => {
  cy.get('[data-testid="category-select"], select[name="category"]').select(category);
});

When("eu defino a data limite para {string}", (deadline: string) => {
  // Converter data para formato ISO
  const date = new Date('2025-12-31').toISOString().split('T')[0];
  cy.get('[data-testid="deadline"], input[type="date"]').type(date);
});

Then("a meta {string} deve aparecer na lista", (goalTitle: string) => {
  cy.contains('[data-testid="goal-item"], .goal-item', goalTitle).should('be.visible');
});

Then("deve mostrar status {string}", (status: string) => {
  cy.contains(status).should('be.visible');
});

// Quantifiable goals
When("eu defino o valor alvo como {string}", (targetValue: string) => {
  cy.get('[data-testid="target-value"], input[name="targetValue"]').type(targetValue);
});

When("eu defino o valor atual como {string}", (currentValue: string) => {
  cy.get('[data-testid="current-value"], input[name="currentValue"]').type(currentValue);
});

Then("deve mostrar progresso {string}", (progressText: string) => {
  cy.contains(progressText).should('be.visible');
});

// Subtasks
Given("que existe uma meta {string}", (goalTitle: string) => {
  cy.authenticatedRequest({
    method: 'POST',
    url: `${Cypress.env('apiUrl') || 'http://localhost:3001'}/goals`,
    body: {
      title: goalTitle,
      description: 'Meta de teste',
      category: 'PERSONAL',
      status: 'IN_PROGRESS'
    }
  });
  cy.reload();
});

When("eu clico na meta {string}", (goalTitle: string) => {
  cy.contains('[data-testid="goal-item"]', goalTitle).click();
});

// Usar step comum do common.ts para "eu clico em"

When("eu adiciono a subtarefa {string}", (subtaskTitle: string) => {
  cy.get('[data-testid="subtask-input"], input[name="subtaskTitle"]').type(subtaskTitle);
  cy.get('[data-testid="add-subtask-btn"], .add-subtask-button').click();
});

Then("a meta deve mostrar {string}", (progressText: string) => {
  cy.contains(progressText).should('be.visible');
});

// Subtask completion
Given("que existe uma meta {string} com subtarefas", (goalTitle: string) => {
  cy.authenticatedRequest({
    method: 'POST',
    url: `${Cypress.env('apiUrl') || 'http://localhost:3001'}/goals`,
    body: {
      title: goalTitle,
      description: 'Meta com subtarefas',
      category: 'PERSONAL',
      status: 'IN_PROGRESS',
      subTasks: [
        { title: 'Comprar organizadores', completed: false },
        { title: 'Organizar documentos', completed: false }
      ]
    }
  });
  cy.reload();
});

Given("a subtarefa {string} está pendente", (subtaskTitle: string) => {
  cy.contains('[data-testid="subtask-item"]', subtaskTitle)
    .find('input[type="checkbox"]')
    .should('not.be.checked');
});

When("eu marco a subtarefa {string} como concluída", (subtaskTitle: string) => {
  cy.contains('[data-testid="subtask-item"]', subtaskTitle)
    .find('input[type="checkbox"]')
    .click();
});

Then("a subtarefa deve aparecer como concluída", () => {
  cy.get('[data-testid="subtask-completed"]').should('be.visible');
});

Then("o progresso da meta deve ser atualizado", () => {
  cy.get('[data-testid="goal-progress"]').should('be.visible');
});

Then("deve aparecer uma barra de progresso visual", () => {
  cy.get('[data-testid="progress-bar"], .progress-bar').should('be.visible');
});

// Update quantifiable progress
Given("que existe uma meta {string} com progresso {string}", (goalTitle: string, progress: string) => {
  const [current, target] = progress.split('/');
  cy.authenticatedRequest({
    method: 'POST',
    url: `${Cypress.env('apiUrl') || 'http://localhost:3001'}/goals`,
    body: {
      title: goalTitle,
      description: 'Meta quantificável',
      category: 'PERSONAL',
      status: 'IN_PROGRESS',
      currentValue: parseInt(current),
      targetValue: parseInt(target)
    }
  });
  cy.reload();
});

When("eu altero o valor atual para {string}", (newValue: string) => {
  cy.get('[data-testid="current-value"], input[name="currentValue"]').clear().type(newValue);
});

Then("a barra de progresso deve refletir {int}%", (percentage: number) => {
  cy.get('[data-testid="progress-bar"]').should('have.attr', 'style').and('include', `${percentage}%`);
});

// Filter by status
Given("que existem metas com status {string}, {string} e {string}", (status1: string, status2: string, status3: string) => {
  const statuses = [status1, status2, status3];
  statuses.forEach((status, index) => {
    cy.authenticatedRequest({
      method: 'POST',
      url: `${Cypress.env('apiUrl') || 'http://localhost:3001'}/goals`,
      body: {
        title: `Meta ${status} ${index + 1}`,
        description: `Meta com status ${status}`,
        category: 'PERSONAL',
        status: status.replace(' ', '_').toUpperCase()
      }
    });
  });
  cy.reload();
});

When("eu seleciono o filtro de status {string}", (status: string) => {
  cy.get('[data-testid="status-filter"], .status-filter').select(status);
});

Then("devo ver apenas as metas em progresso", () => {
  cy.get('[data-testid="goal-item"]').each(($el) => {
    cy.wrap($el).should('contain', 'Em Progresso');
  });
});

Then("as metas com outros status não devem aparecer", () => {
  cy.get('[data-testid="goal-item"]').should('not.contain', 'Não Iniciada');
  cy.get('[data-testid="goal-item"]').should('not.contain', 'Concluída');
});

// Complete goal
Given("que existe uma meta {string} em progresso", (goalTitle: string) => {
  cy.authenticatedRequest({
    method: 'POST',
    url: `${Cypress.env('apiUrl') || 'http://localhost:3001'}/goals`,
    body: {
      title: goalTitle,
      description: 'Meta em progresso',
      category: 'PERSONAL',
      status: 'IN_PROGRESS'
    }
  });
  cy.reload();
});

When("eu confirmo a conclusão", () => {
  cy.get('[data-testid="confirm-complete"], .confirm-complete').click();
});

Then("a meta deve aparecer com status {string}", (status: string) => {
  cy.contains(status).should('be.visible');
});

Then("deve mostrar a data de conclusão", () => {
  cy.get('[data-testid="completion-date"], .completion-date').should('be.visible');
});

Then("deve aparecer uma celebração visual", () => {
  cy.get('[data-testid="celebration"], .celebration-animation').should('be.visible');
});

// Pause goal
When("eu adiciono uma nota {string}", (note: string) => {
  cy.get('[data-testid="pause-note"], textarea[name="pauseNote"]').type(note);
});

When("eu confirmo", () => {
  cy.get('[data-testid="confirm-pause"], .confirm-pause').click();
});

Then("a meta deve aparecer com status {string}", (status: string) => {
  cy.contains(status).should('be.visible');
});

Then("deve mostrar a nota explicativa", () => {
  cy.get('[data-testid="pause-note-display"], .pause-explanation').should('be.visible');
});
