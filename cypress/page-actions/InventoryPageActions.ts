/**
 * Inventory Page Actions
 * Application actions for the Inventory page
 */
export class InventoryPageActions {
  /**
   * Verify user is on the inventory page
   */
  static verifyOnInventoryPage(): void {
    cy.url().should('include', '/inventory.html');
    cy.get('.inventory_list').should('be.visible');
  }
}
