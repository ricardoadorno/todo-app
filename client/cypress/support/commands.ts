// ***********************************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************************

// Import the type definitions
import './commands-types.d.ts';

// BDD Setup Commands
Cypress.Commands.add('setupBDDTest', () => {
  // Limpar dados anteriores
  cy.clearCookies();
  cy.clearLocalStorage();
  cy.window().then((win) => {
    win.sessionStorage.clear();
  });
  
  // Configurar ambiente de teste
  Cypress.env('testMode', 'bdd');
});

Cypress.Commands.add('cleanupBDDTest', () => {
  // Limpeza após testes BDD
  const testUserId = Cypress.env('testUserId');
  const authToken = Cypress.env('authToken');
  
  if (testUserId && authToken) {
    // Opcional: limpar dados de teste criados
    cy.log('Cleaning up BDD test data');
  }
});

// Comando para fazer login e obter um token de autenticação
Cypress.Commands.add('login', (email = 'test@example.com', password = 'password123') => {
  return cy.request({
    method: 'POST',
    url: `${Cypress.env('apiUrl') || 'http://localhost:3001'}/auth/login`,
    body: { email, password },
    failOnStatusCode: false
  }).then(response => {
    if (response.status === 200 && response.body.token) {
      // Armazenar o token para uso em outros comandos
      Cypress.env('authToken', response.body.token);
      return response.body.token;
    }
    return null;
  });
});

// Comando para criar um usuário de teste
Cypress.Commands.add('createTestUser', (userData = null) => {
  const defaultUser = {
    name: 'Test User',
    email: `test-user-${Math.floor(Math.random() * 10000)}@example.com`,
    password: 'cypress123'
  };
  
  const user = userData || defaultUser;
  
  return cy.request({
    method: 'POST',
    url: `${Cypress.env('apiUrl') || 'http://localhost:3001'}/users`,
    body: user,
    failOnStatusCode: false
  }).then(response => {
    if (response.status === 201) {
      // Salvar o ID do usuário para uso futuro
      Cypress.env('testUserId', response.body.id);
      return response.body;
    }
    return null;
  });
});

// Comando para requisições autenticadas
Cypress.Commands.add('authenticatedRequest', (options) => {
  const token = Cypress.env('authToken');
  
  return cy.request({
    ...options,
    headers: {
      ...options.headers,
      Authorization: token ? `Bearer ${token}` : undefined
    }
  });
});
