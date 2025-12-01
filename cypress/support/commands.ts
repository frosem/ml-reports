/// <reference types="cypress" />

// Custom commands for Cypress tests
declare global {
  namespace Cypress {
    interface Chainable {
      // Add custom command type definitions here
    }
  }
}

// Example custom command
// Cypress.Commands.add('login', (username: string, password: string) => {
//   cy.visit('/');
//   cy.get('[data-test="username"]').type(username);
//   cy.get('[data-test="password"]').type(password);
//   cy.get('[data-test="login-button"]').click();
// });
