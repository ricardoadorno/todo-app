// This is a type definition file to extend Cypress with our custom commands
// Import this in commands.ts with: import './commands-types';

declare namespace Cypress {
  interface Chainable {
    login(email?: string, password?: string): Chainable<string | null>;
    createTestUser(userData?: any): Chainable<any>;
    authenticatedRequest(options: Partial<Cypress.RequestOptions>): Chainable<Cypress.Response<any>>;
  }
}
