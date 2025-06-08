import { Given, When, Then, Before, After } from "@badeball/cypress-cucumber-preprocessor";

// Hooks para setup e cleanup
Before(() => {
  cy.setupBDDTest();
});

After(() => {
  cy.cleanupBDDTest();
});

// Common authentication steps
Given("que estou logado no sistema", () => {
  cy.createTestUser().then(user => {
    if (user) {
      cy.login(user.email, 'cypress123');
      // Aguardar autenticação
      cy.wait(500);
    }
  });
});

// Common navigation steps
When("eu clico no botão {string}", (buttonText: string) => {
  cy.contains('button', buttonText).click();
});

When("eu clico em {string}", (linkText: string) => {
  cy.contains(linkText).click();
});

When("eu confirmo", () => {
  cy.get('[data-testid="confirm"], .confirm-button').click();
});

When("eu cancelo", () => {
  cy.get('[data-testid="cancel"], .cancel-button').click();
});

// Common form steps
When("eu preencho o campo {string} com {string}", (fieldName: string, value: string) => {
  cy.get(`[data-testid="${fieldName}"], [name="${fieldName}"], input[placeholder*="${fieldName}"]`).type(value);
});

When("eu seleciono {string} no campo {string}", (value: string, fieldName: string) => {
  cy.get(`[data-testid="${fieldName}"], select[name="${fieldName}"]`).select(value);
});

When("eu clico em salvar", () => {
  cy.contains('button', /salvar|save/i).click();
});

// Common assertion steps
Then("devo ver a mensagem {string}", (message: string) => {
  cy.contains(message).should('be.visible');
});

Then("devo ver o elemento {string}", (element: string) => {
  cy.get(`[data-testid="${element}"], .${element}`).should('be.visible');
});

Then("não devo ver o elemento {string}", (element: string) => {
  cy.get(`[data-testid="${element}"], .${element}`).should('not.exist');
});

Then("devo ser redirecionado para {string}", (url: string) => {
  cy.url().should('include', url);
});

// Common data verification steps
Then("o item {string} deve aparecer na lista", (itemName: string) => {
  cy.contains('[data-testid*="item"], .item', itemName).should('be.visible');
});

Then("o item {string} não deve aparecer na lista", (itemName: string) => {
  cy.contains('[data-testid*="item"], .item', itemName).should('not.exist');
});

// Common error handling steps
Then("devo ver uma mensagem de erro", () => {
  cy.get('[data-testid="error"], .error-message, .alert-error').should('be.visible');
});

Then("devo ver uma mensagem de sucesso", () => {
  cy.get('[data-testid="success"], .success-message, .alert-success').should('be.visible');
});

// Loading states
Then("devo ver um indicador de carregamento", () => {
  cy.get('[data-testid="loading"], .loading, .spinner').should('be.visible');
});

Then("o indicador de carregamento deve desaparecer", () => {
  cy.get('[data-testid="loading"], .loading, .spinner').should('not.exist');
});

// Modal/Dialog steps
When("eu abro o modal {string}", (modalName: string) => {
  cy.get(`[data-testid="${modalName}-modal"], .${modalName}-modal`).should('be.visible');
});

When("eu fecho o modal", () => {
  cy.get('[data-testid="close-modal"], .modal-close, [aria-label="Close"]').click();
});

// Wait for API calls
When("aguardo a resposta da API", () => {
  cy.wait(1000); // Aguardar requisições assíncronas
});

// Common data setup
Given("que existem dados de teste no sistema", () => {
  cy.log('Setting up test data for BDD scenario');
  // Este step pode ser sobrescrito por steps mais específicos em cada feature
});
