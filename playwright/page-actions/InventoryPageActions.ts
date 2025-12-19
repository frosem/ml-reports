/**
 * Inventory Page Actions for Playwright
 * Application actions for the Inventory page using InventoryPageObjects
 */
import { type Page, expect } from '@playwright/test';
import { inventoryPageObjects } from '../../page-objects/InventoryPageObjects';
import urls from '../../fixtures/urls.json';

export class InventoryPageActions {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Verify user is on the inventory page
   */
  async verifyOnInventoryPage(): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(urls.paths.inventory));
    const itemCount = await this.page.getByTestId(inventoryPageObjects.inventoryItemContainerTestId).count();
    expect(itemCount).toBeGreaterThan(0);
  }

  /**
   * Add first item to cart
   */
  async addFirstItemToCart(): Promise<void> {
    await this.page.locator(inventoryPageObjects.addToCartButtonCSS()).first().click();
  }

  /**
   * Add item to cart by index (1-based)
   * @param index - The index of the item to add (1-based)
   */
  async addItemToCartByIndex(index: number): Promise<void> {
    await this.page.locator(inventoryPageObjects.addToCartButtonCSSByIndex(index)).click();
  }

  /**
   * Add item to cart by name
   * @param itemName - The name of the item to add
   */
  async addItemToCartByName(itemName: string): Promise<void> {
    await this.page.locator(inventoryPageObjects.addToCartButtonCSS(itemName)).click();
  }

  /**
   * Get the name of the first inventory item
   * @returns The item name
   */
  async getFirstItemName(): Promise<string> {
    const text = await this.page
      .getByTestId(inventoryPageObjects.inventoryItemNameContainerTestId)
      .first()
      .textContent();
    return (text ?? '').trim();
  }

  /**
   * Get the price of the first inventory item
   * @returns The item price
   */
  async getFirstItemPrice(): Promise<string> {
    const text = await this.page
      .getByTestId(inventoryPageObjects.inventoryItemPriceContainerTestId)
      .first()
      .textContent();
    return (text ?? '').trim();
  }

  /**
   * Click on the cart icon
   */
  async clickCartIcon(): Promise<void> {
    await this.page.getByTestId(inventoryPageObjects.cartIconLinkTestId).click();
  }

  /**
   * Verify cart badge shows the expected count
   * @param expectedCount - The expected number of items in cart
   */
  async verifyCartBadgeCount(expectedCount: number): Promise<void> {
    const badge = this.page.getByTestId(inventoryPageObjects.cartBadgeSpanTestId);
    await expect(badge).toBeVisible();
    await expect(badge).toContainText(expectedCount.toString());
  }

  /**
   * Verify cart badge is not visible (empty cart)
   */
  async verifyCartBadgeNotVisible(): Promise<void> {
    await expect(this.page.getByTestId(inventoryPageObjects.cartBadgeSpanTestId)).not.toBeVisible();
  }

  /**
   * Get the number of items displayed on the inventory page
   * @returns The count
   */
  async getItemCount(): Promise<number> {
    return await this.page.getByTestId(inventoryPageObjects.inventoryItemContainerTestId).count();
  }
}
