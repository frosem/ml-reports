/**
 * Cart Page Actions
 * Application actions for the Cart page using CartPageObjects
 */
import { allureStep } from '@cypress-support/AllureTools';
import { cartPageObjects } from '@page-objects/CartPageObjects';
import urls from '@fixtures/urls.json';

export class CartPageActions {
  /**
   * Verify user is on the cart page
   */
  @allureStep()
  static verifyOnCartPage(): void {
    cy.url().should('include', urls.paths.cart);
    cy.findAllByTestId(cartPageObjects.cartItemsContainerTestId).should('exist');
  }

  /**
   * Get the number of items in the cart
   * @returns items count number
   */
  @allureStep()
  static getCartItemCount(): Cypress.Chainable<number> {
    return cy.findAllByTestId(cartPageObjects.cartItemsContainerTestId).its('length');
  }

  /**
   * Verify cart contains the expected number of items
   * @param expectedCount - The expected number of items
   */
  @allureStep('Verify cart item count: {0}')
  static verifyCartItemCount(expectedCount: number): void {
    cy.findAllByTestId(cartPageObjects.cartItemsContainerTestId).should('have.length', expectedCount);
  }

  /**
   * Verify cart contains an item with the specified name
   * @param itemName - The name of the item to verify
   */
  @allureStep('Verify cart contains: {0}')
  static verifyCartContainsItem(itemName: string): void {
    cy.findAllByTestId(cartPageObjects.cartItemNameContainerTestId).should('contain.text', itemName);
  }

  /**
   * Get the name of the first cart item
   * @returns the item name
   */
  @allureStep()
  static getFirstCartItemName(): Cypress.Chainable<string> {
    return cy.findAllByTestId(cartPageObjects.cartItemNameContainerTestId)
      .first()
      .invoke('text');
  }

  /**
   * Get the price of the first cart item
   * @returns the item price
   */
  @allureStep()
  static getFirstCartItemPrice(): Cypress.Chainable<string> {
    return cy.findAllByTestId(cartPageObjects.cartItemPriceContainerTestId).first().invoke('text');
  }

  /**
   * Verify the first cart item has the expected price
   * @param expectedPrice - The expected price text
   */
  @allureStep('Verify first cart item price: {0}')
  static verifyFirstCartItemPrice(expectedPrice: string): void {
    cy.findAllByTestId(cartPageObjects.cartItemPriceContainerTestId).first().should('contain.text', expectedPrice);
  }

  /**
   * Remove item from cart by index
   * @param index - The index of the item to remove
   */
  @allureStep('Remove item by index: {0}')
  static removeItemButtonByIndex(index: number): void {
    cy.findAllByTestId(cartPageObjects.cartItemsContainerTestId)
      .eq(index)
      .find(cartPageObjects.removeButtonCSS)
      .click();
  }

  /**
   * Click continue shopping button
   */
  @allureStep()
  static clickOnContinueShoppingButton(): void {
    cy.findByTestId(cartPageObjects.continueShoppingButtonTestId).click();
  }

  /**
   * Click checkout button
   */
  @allureStep()
  static clickOnCheckoutButton(): void {
    cy.findByTestId(cartPageObjects.checkoutButtonTestId).click();
  }

  /**
   * Verify cart is empty
   */
  @allureStep()
  static verifyCartIsEmpty(): void {
    cy.findAllByTestId(cartPageObjects.cartItemsContainerTestId).should('not.exist');
  }
}

