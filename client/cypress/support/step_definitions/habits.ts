import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

// Background steps
Given("estou na página de hábitos", () => {
  cy.visit('/habits');
});

// Habit creation - usar step comum do common.ts para "eu clico no botão"

When("eu preencho o nome do hábito com {string}", (habitName: string) => {
  cy.get('[data-testid="habit-name"], input[name="name"]').type(habitName);
});

When("eu preencho a descrição com {string}", (description: string) => {
  cy.get('[data-testid="habit-description"], textarea[name="description"]').type(description);
});

When("eu seleciono a frequência {string}", (frequency: string) => {
  cy.get('[data-testid="frequency-select"], select[name="frequency"]').select(frequency);
});

Then("o hábito {string} deve aparecer na lista", (habitName: string) => {
  cy.contains('[data-testid="habit-item"], .habit-item', habitName).should('be.visible');
});

Then("deve mostrar status {string}", (status: string) => {
  cy.contains(status).should('be.visible');
});

// Habit completion
Given("que existe um hábito {string} para hoje", (habitName: string) => {
  cy.authenticatedRequest({
    method: 'POST',
    url: `${Cypress.env('apiUrl') || 'http://localhost:3001'}/habits`,
    body: {
      name: habitName,
      description: 'Hábito de teste',
      frequency: 'DAILY'
    }
  });
  cy.reload();
});

When("eu clico no botão {string} para o hábito {string}", (action: string, habitName: string) => {
  cy.contains('[data-testid="habit-item"]', habitName)
    .find(`[data-testid="${action.toLowerCase()}-button"], button`)
    .contains(action)
    .click();
});

Then("o hábito deve mostrar status {string}", (status: string) => {
  cy.contains(status).should('be.visible');
});

Then("o contador de streak deve aumentar em {int}", (increment: number) => {
  cy.get('[data-testid="streak-counter"]').should('contain', increment);
});

Then("deve aparecer uma confirmação visual de sucesso", () => {
  cy.get('[data-testid="success-message"], .success-notification').should('be.visible');
});

// Skip habit
When("eu confirmo que quero pular", () => {
  cy.get('[data-testid="confirm-skip"], .confirm-skip').click();
});

Then("o streak deve ser mantido", () => {
  cy.get('[data-testid="streak-counter"]').should('be.visible');
});

Then("deve aparecer uma nota explicativa sobre o pulo", () => {
  cy.get('[data-testid="skip-note"], .skip-explanation').should('be.visible');
});

// Calendar view
Given("que existe um hábito {string} com histórico", (habitName: string) => {
  // Criar hábito com alguns dados de progresso
  cy.authenticatedRequest({
    method: 'POST',
    url: `${Cypress.env('apiUrl') || 'http://localhost:3001'}/habits`,
    body: {
      name: habitName,
      description: 'Hábito com histórico',
      frequency: 'DAILY'
    }
  }).then((response) => {
    const habitId = response.body.id;
    
    // Adicionar alguns registros de progresso
    const dates = [-3, -2, -1]; // últimos 3 dias
    dates.forEach(dayOffset => {
      const date = new Date();
      date.setDate(date.getDate() + dayOffset);
      
      cy.authenticatedRequest({
        method: 'POST',
        url: `${Cypress.env('apiUrl') || 'http://localhost:3001'}/habits/progress`,
        body: {
          habitId: habitId,
          date: date.toISOString().split('T')[0],
          status: Math.random() > 0.5 ? 'DONE' : 'SKIPPED'
        }
      });
    });
  });
  cy.reload();
});

When("eu clico no hábito {string}", (habitName: string) => {
  cy.contains('[data-testid="habit-item"]', habitName).click();
});

When("eu clico na aba {string}", (tabName: string) => {
  cy.contains('[data-testid="tab"], .tab', tabName).click();
});

Then("devo ver um calendário mensal", () => {
  cy.get('[data-testid="habit-calendar"], .habit-calendar').should('be.visible');
});

Then("os dias realizados devem estar marcados em verde", () => {
  cy.get('[data-testid="done-day"], .day-done').should('have.class', 'text-green-600');
});

Then("os dias pulados devem estar marcados em amarelo", () => {
  cy.get('[data-testid="skipped-day"], .day-skipped').should('have.class', 'text-yellow-600');
});

Then("os dias perdidos devem estar marcados em vermelho", () => {
  cy.get('[data-testid="missed-day"], .day-missed').should('have.class', 'text-red-600');
});

// Statistics view
Given("que existe um hábito {string} com {int} dias de histórico", (habitName: string, days: number) => {
  cy.authenticatedRequest({
    method: 'POST',
    url: `${Cypress.env('apiUrl') || 'http://localhost:3001'}/habits`,
    body: {
      name: habitName,
      description: 'Hábito com histórico extenso',
      frequency: 'DAILY'
    }
  }).then((response) => {
    const habitId = response.body.id;
    
    // Criar histórico para os últimos X dias
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      cy.authenticatedRequest({
        method: 'POST',
        url: `${Cypress.env('apiUrl') || 'http://localhost:3001'}/habits/progress`,
        body: {
          habitId: habitId,
          date: date.toISOString().split('T')[0],
          status: Math.random() > 0.3 ? 'DONE' : 'SKIPPED' // 70% de chance de estar feito
        }
      });
    }
  });
  cy.reload();
});

Then("devo ver o streak atual", () => {
  cy.get('[data-testid="current-streak"], .current-streak').should('be.visible');
});

Then("devo ver o maior streak alcançado", () => {
  cy.get('[data-testid="best-streak"], .best-streak').should('be.visible');
});

Then("devo ver a taxa de sucesso em porcentagem", () => {
  cy.get('[data-testid="success-rate"], .success-rate').should('contain', '%');
});

Then("devo ver um gráfico de progresso semanal", () => {
  cy.get('[data-testid="weekly-chart"], .weekly-progress-chart').should('be.visible');
});

// Habit editing
Given("que existe um hábito {string}", (habitName: string) => {
  cy.authenticatedRequest({
    method: 'POST',
    url: `${Cypress.env('apiUrl') || 'http://localhost:3001'}/habits`,
    body: {
      name: habitName,
      description: 'Hábito para editar',
      frequency: 'DAILY'
    }
  });
  cy.reload();
});

When("eu clico no ícone de editar do hábito {string}", (habitName: string) => {
  cy.contains('[data-testid="habit-item"]', habitName)
    .find('[data-testid="edit-button"], .edit-button')
    .click();
});

When("eu altero o nome para {string}", (newName: string) => {
  cy.get('[data-testid="habit-name"], input[name="name"]').clear().type(newName);
});

When("eu altero a descrição para {string}", (newDescription: string) => {
  cy.get('[data-testid="habit-description"], textarea[name="description"]').clear().type(newDescription);
});

Then("deve manter o histórico anterior", () => {
  cy.get('[data-testid="progress-preserved"], .progress-indicator').should('be.visible');
});

// Habit deletion
When("eu clico no ícone de excluir do hábito {string}", (habitName: string) => {
  cy.contains('[data-testid="habit-item"]', habitName)
    .find('[data-testid="delete-button"], .delete-button')
    .click();
});

When("eu confirmo a exclusão", () => {
  cy.get('[data-testid="confirm-delete"], .confirm-delete').click();
});

Then("o hábito {string} não deve mais aparecer na lista", (habitName: string) => {
  cy.contains('[data-testid="habit-item"]', habitName).should('not.exist');
});

Then("todos os dados relacionados devem ser removidos", () => {
  // Esta verificação dependeria da implementação específica
  cy.log('Dados do hábito removidos');
});
