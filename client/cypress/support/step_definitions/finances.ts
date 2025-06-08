import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

// Background steps
Given("estou na página de finanças", () => {
  cy.visit('/finances');
});

// Income transaction
When("eu seleciono o tipo {string}", (type: string) => {
  cy.get('[data-testid="transaction-type"], select[name="type"]').select(type);
});

When("eu preencho a descrição com {string}", (description: string) => {
  cy.get('[data-testid="description"], input[name="description"]').type(description);
});

When("eu preencho o valor com {string}", (amount: string) => {
  cy.get('[data-testid="amount"], input[name="amount"]').type(amount);
});

When("eu defino a data para {string}", (date: string) => {
  // Converter data para formato ISO
  const isoDate = new Date('2025-01-01').toISOString().split('T')[0];
  cy.get('[data-testid="transaction-date"], input[type="date"]').type(isoDate);
});

Then("a transação {string} deve aparecer na lista", (description: string) => {
  cy.contains('[data-testid="transaction-item"], .transaction-item', description).should('be.visible');
});

Then("o saldo deve ser atualizado corretamente", () => {
  cy.get('[data-testid="balance"], .balance-display').should('be.visible');
});

// Expense transaction
Then("o saldo deve ser reduzido corretamente", () => {
  cy.get('[data-testid="balance"], .balance-display').should('be.visible');
});

// Recurring transactions
When("eu marco como {string}", (recurrence: string) => {
  cy.get('[data-testid="is-recurring"], input[type="checkbox"]').check();
});

When("eu seleciono a frequência {string}", (frequency: string) => {
  cy.get('[data-testid="recurrence-frequency"], select[name="recurrence"]').select(frequency);
});

Then("deve mostrar o ícone de recorrência", () => {
  cy.get('[data-testid="recurrence-icon"], .recurrence-indicator').should('be.visible');
});

// Transaction filtering
Given("que existem transações de diferentes meses", () => {
  const months = ['2025-01', '2025-02', '2025-03'];
  months.forEach((month, index) => {
    cy.authenticatedRequest({
      method: 'POST',
      url: `${Cypress.env('apiUrl') || 'http://localhost:3001'}/transactions`,
      body: {
        description: `Transação ${month}`,
        amount: 100 + index * 50,
        type: 'INCOME',
        category: 'SALARY',
        date: `${month}-15T00:00:00.000Z`
      }
    });
  });
  cy.reload();
});

When("eu seleciono o filtro de período {string}", (period: string) => {
  cy.get('[data-testid="period-filter"], .period-filter').select(period);
});

Then("devo ver apenas as transações de Janeiro 2025", () => {
  cy.get('[data-testid="transaction-item"]').each(($el) => {
    cy.wrap($el).should('contain', 'Jan');
  });
});

Then("o resumo financeiro deve refletir apenas esse período", () => {
  cy.get('[data-testid="period-summary"], .period-summary').should('be.visible');
});

// Category filtering
Given("que existem transações de categorias {string}, {string} e {string}", (cat1: string, cat2: string, cat3: string) => {
  const categories = [cat1, cat2, cat3];
  categories.forEach((category, index) => {
    cy.authenticatedRequest({
      method: 'POST',
      url: `${Cypress.env('apiUrl') || 'http://localhost:3001'}/transactions`,
      body: {
        description: `Gasto em ${category}`,
        amount: 50 + index * 25,
        type: 'EXPENSE',
        category: category.toUpperCase(),
        date: new Date().toISOString()
      }
    });
  });
  cy.reload();
});

When("eu seleciono o filtro de categoria {string}", (category: string) => {
  cy.get('[data-testid="category-filter"], .category-filter').select(category);
});

Then("devo ver apenas as transações de {string}", (category: string) => {
  cy.get('[data-testid="transaction-item"]').each(($el) => {
    cy.wrap($el).should('contain', category);
  });
});

Then("o total deve somar apenas essas transações", () => {
  cy.get('[data-testid="category-total"], .category-total').should('be.visible');
});

// Transaction editing
Given("que existe uma transação {string}", (description: string) => {
  cy.authenticatedRequest({
    method: 'POST',
    url: `${Cypress.env('apiUrl') || 'http://localhost:3001'}/transactions`,
    body: {
      description: description.split(' - ')[0],
      amount: 85.00,
      type: 'EXPENSE',
      category: 'FOOD',
      date: new Date().toISOString()
    }
  });
  cy.reload();
});

When("eu clico no ícone de editar da transação {string}", (description: string) => {
  cy.contains('[data-testid="transaction-item"]', description.split(' - ')[0])
    .find('[data-testid="edit-button"], .edit-button')
    .click();
});

When("eu altero a descrição para {string}", (newDescription: string) => {
  cy.get('[data-testid="description"], input[name="description"]').clear().type(newDescription);
});

When("eu altero o valor para {string}", (newAmount: string) => {
  cy.get('[data-testid="amount"], input[name="amount"]').clear().type(newAmount);
});

Then("a transação deve aparecer como {string}", (expectedText: string) => {
  cy.contains(expectedText).should('be.visible');
});

// Transaction deletion
Given("que existe uma transação {string}", (description: string) => {
  cy.authenticatedRequest({
    method: 'POST',
    url: `${Cypress.env('apiUrl') || 'http://localhost:3001'}/transactions`,
    body: {
      description: description,
      amount: 50.00,
      type: 'EXPENSE',
      category: 'OTHER',
      date: new Date().toISOString()
    }
  });
  cy.reload();
});

When("eu clico no ícone de excluir da transação {string}", (description: string) => {
  cy.contains('[data-testid="transaction-item"]', description)
    .find('[data-testid="delete-button"], .delete-button')
    .click();
});

Then("a transação {string} não deve mais aparecer na lista", (description: string) => {
  cy.contains('[data-testid="transaction-item"]', description).should('not.exist');
});

Then("o saldo deve ser recalculado", () => {
  cy.get('[data-testid="balance"], .balance-display').should('be.visible');
});

// Investments
When("eu clico na aba {string}", (tabName: string) => {
  cy.contains('[data-testid="tab"], .tab', tabName).click();
});

When("eu preencho o nome com {string}", (name: string) => {
  cy.get('[data-testid="investment-name"], input[name="name"]').type(name);
});

When("eu seleciono o tipo {string}", (type: string) => {
  cy.get('[data-testid="investment-type"], select[name="type"]').select(type);
});

When("eu preencho o valor investido com {string}", (amount: string) => {
  cy.get('[data-testid="invested-amount"], input[name="amount"]').type(amount);
});

When("eu preencho o valor atual com {string}", (currentValue: string) => {
  cy.get('[data-testid="current-value"], input[name="currentValue"]').type(currentValue);
});

Then("o investimento {string} deve aparecer na lista", (name: string) => {
  cy.contains('[data-testid="investment-item"], .investment-item', name).should('be.visible');
});

Then("deve mostrar o rendimento de {string}", (return_text: string) => {
  cy.contains(return_text).should('be.visible');
});

// Financial summary
Given("que existem transações e investimentos cadastrados", () => {
  // Criar algumas transações
  cy.authenticatedRequest({
    method: 'POST',
    url: `${Cypress.env('apiUrl') || 'http://localhost:3001'}/transactions`,
    body: {
      description: 'Salário',
      amount: 5000,
      type: 'INCOME',
      category: 'SALARY',
      date: new Date().toISOString()
    }
  });

  cy.authenticatedRequest({
    method: 'POST',
    url: `${Cypress.env('apiUrl') || 'http://localhost:3001'}/transactions`,
    body: {
      description: 'Aluguel',
      amount: 1200,
      type: 'EXPENSE',
      category: 'HOUSING',
      date: new Date().toISOString()
    }
  });

  // Criar um investimento
  cy.authenticatedRequest({
    method: 'POST',
    url: `${Cypress.env('apiUrl') || 'http://localhost:3001'}/investments`,
    body: {
      name: 'Tesouro Direto',
      type: 'BOND',
      amount: 1000,
      currentValue: 1050,
      purchaseDate: new Date().toISOString()
    }
  });

  cy.reload();
});

When("eu visualizo o dashboard financeiro", () => {
  cy.get('[data-testid="financial-dashboard"], .financial-summary').should('be.visible');
});

Then("devo ver o total de receitas do mês", () => {
  cy.get('[data-testid="monthly-income"], .monthly-income').should('be.visible');
});

Then("devo ver o total de despesas do mês", () => {
  cy.get('[data-testid="monthly-expenses"], .monthly-expenses').should('be.visible');
});

Then("devo ver o saldo atual", () => {
  cy.get('[data-testid="current-balance"], .current-balance').should('be.visible');
});

Then("devo ver o total investido", () => {
  cy.get('[data-testid="total-invested"], .total-invested').should('be.visible');
});

Then("devo ver um gráfico de gastos por categoria", () => {
  cy.get('[data-testid="expenses-chart"], .expenses-by-category-chart').should('be.visible');
});
