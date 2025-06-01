// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration

// Import commands.js using ES2015 syntax:
import './commands';

// Evitar falhas em testes por erros não relacionados
Cypress.on('uncaught:exception', (err, runnable) => {
  // retornando false impede que o Cypress falhe o teste
  return false;
});

// Configuração para requisições
Cypress.on('window:before:load', (win) => {
  // Forçar XHR para usar respostas nativas em vez de XMLHttpRequest interceptado
  // Útil para certas APIs
  win.fetch = null;
});

// Outras configurações globais podem ser adicionadas aqui
