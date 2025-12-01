/**
 * Cart Page Actions
 * Application actions for the Cart page using CartPageObjects
 */
import { cartPageObjects } from '../page-objects/CartPageObjects';
import urls from '../fixtures/urls.json';

export class CartPageActions {
  /**
   * Verify user is on the cart page
   */
  static verifyOnCartPage(): void {
    cy.url().should('include', urls.paths.cart);
    cy.get(cartPageObjects.cartItemsContainer).should('exist');
  }

  /**
   * Get the number of items in the cart
   * @returns Cypress chainable with the count
   */
  static getCartItemCount(): Cypress.Chainable<number> {
    return cy.get(cartPageObjects.cartItemsContainer).its('length');
  }

  /**
   * Verify cart contains the expected number of items
   * @param expectedCount - The expected number of items
   */
  static verifyCartItemCount(expectedCount: number): void {
    cy.get(cartPageObjects.cartItemsContainer).should('have.length', expectedCount);
  }

  /**
   * Verify cart contains an item with the specified name
   * @param itemName - The name of the item to verify
   */
  static verifyCartContainsItem(itemName: string): void {
    cy.get(cartPageObjects.cartItemNameContainer).should('contain.text', itemName);
  }

  /**
   * Get the name of the first cart item
   * @returns Cypress chainable with the item name
   */
  static getFirstCartItemName(): Cypress.Chainable<string> {
    return cy.get(cartPageObjects.cartItemNameContainer).first().invoke('text');
  }

  /**
   * Get the price of the first cart item
   * @returns Cypress chainable with the item price
   */
  static getFirstCartItemPrice(): Cypress.Chainable<string> {
    return cy.get(cartPageObjects.cartItemPriceContainer).first().invoke('text');
  }

  /**
   * Remove item from cart by index
   * @param index - The index of the item to remove (0-based)
   */
  static removeItemByIndex(index: number): void {
    cy.get(cartPageObjects.cartItemsContainer)
      .eq(index)
      .find(cartPageObjects.removeButton)
      .click();
  }

  /**
   * Click continue shopping button
   */
  static clickContinueShopping(): void {
    cy.get(cartPageObjects.continueShoppingButton).click();
  }

  /**
   * Click checkout button
   */
  static clickCheckout(): void {
    cy.get(cartPageObjects.checkoutButton).click();
  }

  /**
   * Verify cart is empty
   */
  static verifyCartIsEmpty(): void {
    cy.get(cartPageObjects.cartItemsContainer).should('not.exist');
  }
}

