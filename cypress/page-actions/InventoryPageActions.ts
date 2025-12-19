/**
 * Inventory Page Actions
 * Application actions for the Inventory page using InventoryPageObjects
 */
import { inventoryPageObjects } from '@page-objects/InventoryPageObjects';
import urls from '@fixtures/urls.json';

export class InventoryPageActions {
  /**
   * Verify user is on the inventory page
   */
  static verifyOnInventoryPage(): void {
    cy.url().should('include', urls.paths.inventory);
    cy.findAllByTestId(inventoryPageObjects.inventoryItemContainerTestId).should('have.length.greaterThan', 0);
  }

  /**
   * Add first item to cart
   */
  static addFirstItemToCart(): void {
    cy.get(inventoryPageObjects.addToCartButtonCSS()).first().click();
  }

  /**
   * Add item to cart by index (1-based)
   * @param index - The index of the item to add (1-based)
   */
  static addItemToCartByIndex(index: number): void {
    cy.get(inventoryPageObjects.addToCartButtonCSSByIndex(index)).click();
  }

  /**
   * Add item to cart by name
   * @param itemName - The name of the item to add
   */
  static addItemToCartByName(itemName: string): void {
    cy.get(inventoryPageObjects.addToCartButtonCSS(itemName)).click();
  }

  /**
   * Get the name of the first inventory item
   * @returns Cypress chainable with the item name
   */
  static getFirstItemName(): Cypress.Chainable<string> {
    return cy.findAllByTestId(inventoryPageObjects.inventoryItemNameContainerTestId).first().invoke('text');
  }

  /**
   * Get the price of the first inventory item
   * @returns Cypress chainable with the item price
   */
  static getFirstItemPrice(): Cypress.Chainable<string> {
    return cy.findAllByTestId(inventoryPageObjects.inventoryItemPriceContainerTestId).first().invoke('text');
  }

  /**
   * Click on the cart icon
   */
  static clickCartIcon(): void {
    cy.findByTestId(inventoryPageObjects.cartIconLinkTestId).click();
  }

  /**
   * Verify cart badge shows the expected count
   * @param expectedCount - The expected number of items in cart
   */
  static verifyCartBadgeCount(expectedCount: number): void {
    cy.findByTestId(inventoryPageObjects.cartBadgeSpanTestId)
      .should('be.visible')
      .and('contain.text', expectedCount.toString());
  }

  /**
   * Verify cart badge is not visible (empty cart)
   */
  static verifyCartBadgeNotVisible(): void {
    cy.findByTestId(inventoryPageObjects.cartBadgeSpanTestId).should('not.exist');
  }

  /**
   * Get the number of items displayed on the inventory page
   * @returns Cypress chainable with the count
   */
  static getItemCount(): Cypress.Chainable<number> {
    return cy.findAllByTestId(inventoryPageObjects.inventoryItemContainerTestId).its('length');
  }
}
