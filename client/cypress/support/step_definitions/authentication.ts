import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

// Login scenarios
Given("que estou na página de login", () => {
  cy.visit('/login');
});

When("eu preencho o email com {string}", (email: string) => {
  cy.get('[data-testid="email-input"], input[type="email"]').type(email);
});

When("eu preencho a senha com {string}", (password: string) => {
  cy.get('[data-testid="password-input"], input[type="password"]').type(password);
});

// Usar step comum do common.ts para "eu clico no botão"

Then("eu devo ser redirecionado para o dashboard", () => {
  cy.url().should('include', '/dashboard');
  cy.wait(1000); // Aguardar carregamento
});

Then("devo ver a mensagem {string}", (message: string) => {
  cy.contains(message).should('be.visible');
});

Then("devo ver uma mensagem de erro {string}", (errorMessage: string) => {
  cy.contains(errorMessage).should('be.visible');
});

Then("devo permanecer na página de login", () => {
  cy.url().should('include', '/login');
});

// Logout scenarios - usar step comum do common.ts

When("eu clico no menu do usuário", () => {
  cy.get('[data-testid="user-menu"], [aria-label="Menu do usuário"]').click();
});

Then("não devo ter mais acesso às páginas protegidas", () => {
  cy.visit('/dashboard');
  cy.url().should('include', '/login');
});

// Protected routes scenarios
Given("que não estou logado", () => {
  cy.clearCookies();
  cy.clearLocalStorage();
  cy.window().then((win) => {
    win.sessionStorage.clear();
  });
});

When("eu tento acessar a página {string}", (url: string) => {
  cy.visit(url);
});
