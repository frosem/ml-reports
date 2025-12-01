/// <reference types="cypress" />

describe('SauceDemo Example Test', () => {
  it('should visit the SauceDemo website', () => {
    cy.visit('https://www.saucedemo.com/');
    cy.get('[data-test="username"]').should('be.visible');
  });
});
