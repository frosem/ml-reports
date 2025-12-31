/**
 * Inventory Page Actions
 */
import { type Page } from '@playwright/test';
import { allureStep } from '@playwright-support/AllureTools';
import { BasePage } from '@playwright-core/BasePage';
import { inventoryPageObjects } from '@page-objects/InventoryPageObjects';
import urls from '@fixtures/urls.json';

export class InventoryPageActions extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Verify user is on the inventory page
   */
  @allureStep()
  async verifyOnInventoryPage(): Promise<void> {
    const expectedUrl = `${urls.baseUrl}${urls.paths.inventory}`;
    const actualUrl = this.getCurrentUrl();
    await this.assert.attach(expectedUrl, actualUrl);
    await this.assert.url(expectedUrl, { errorMessage: `Should be on inventory page but got: ${actualUrl}` });
    await this.assert.visible(
      this.page.getByTestId(inventoryPageObjects.inventoryItemContainerTestId).first(),
      'Inventory should have at least one item'
    );
  }

  /**
   * Add item to cart by name
   * @param itemName - The name of the item to add
   */
  @allureStep('Add item to cart: {0}')
  async addItemToCartByName(itemName: string): Promise<void> {
    await this.click(this.page.locator(inventoryPageObjects.addToCartButtonCSS(itemName)));
  }

  /**
   * Click on the cart icon
   */
  @allureStep()
  async clickOnCartIcon(): Promise<void> {
    await this.click(this.page.getByTestId(inventoryPageObjects.cartIconLinkTestId));
  }

  /**
   * Verify cart badge shows the expected count
   * @param expectedCount - The expected number of items in cart
   */
  @allureStep('Verify cart badge count: {0}')
  async verifyCartBadgeCount(expectedCount: number): Promise<void> {
    const badge = this.page.getByTestId(inventoryPageObjects.cartBadgeSpanTestId);
    await this.assert.visible(badge);
    await this.assert.containsText(badge, expectedCount.toString(), `Cart badge should show ${expectedCount} item(s)`);
  }

  /**
   * Verify cart badge is not visible (empty cart)
   */
  @allureStep()
  async verifyCartBadgeIsNotVisible(): Promise<void> {
    await this.assert.hidden(this.page.getByTestId(inventoryPageObjects.cartBadgeSpanTestId));
  }

  /**
   * Verify remove button is visible for a specific item (item was added to cart)
   * @param itemName - The name of the item
   */
  @allureStep('Verify remove button is visible for: {0}')
  async verifyRemoveButtonVisibleForItem(itemName: string): Promise<void> {
    await this.assert.visible(this.page.locator(inventoryPageObjects.removeButtonCSS(itemName)));
  }

  /**
   * Verify the number of items displayed on the inventory page
   * @param expectedCount - Expected number of items
   */
  @allureStep('Verify item count: {0}')
  async verifyItemCount(expectedCount: number): Promise<void> {
    await this.assert.count(this.page.getByTestId(inventoryPageObjects.inventoryItemContainerTestId), expectedCount);
  }

  /**
   * Click on product name to view details
   * @param productName - The name of the product to click
   */
  @allureStep('View product: {0}')
  async clickOnProductName(productName: string): Promise<void> {
    await this.click(
      this.page.getByTestId(inventoryPageObjects.inventoryItemNameContainerTestId).filter({ hasText: productName })
    );
  }

  /**
   * Sort products by option
   * @param sortOption - The sort option value (az, za, lohi, hilo)
   */
  @allureStep('Sort products: {0}')
  async sortProducts(sortOption: 'az' | 'hilo' | 'lohi' | 'za'): Promise<void> {
    await this.page.getByTestId(inventoryPageObjects.sortDropdownTestId).selectOption(sortOption);
  }

  /**
   * Get all product names in current order
   * @returns Array of product names
   */
  @allureStep()
  async getAllProductNames(): Promise<string[]> {
    const names = this.page.getByTestId(inventoryPageObjects.inventoryItemNameContainerTestId);
    return await names.allTextContents();
  }

  /**
   * Get all product prices in current order
   * @returns Array of product prices
   */
  @allureStep()
  async getAllProductPrices(): Promise<string[]> {
    const prices = this.page.getByTestId(inventoryPageObjects.inventoryItemPriceContainerTestId);
    return await prices.allTextContents();
  }

  /**
   * Remove item from cart by name (from inventory page)
   * @param itemName - The name of the item to remove
   */
  @allureStep('Remove from cart: {0}')
  async removeItemFromCartByName(itemName: string): Promise<void> {
    await this.click(this.page.locator(inventoryPageObjects.removeButtonCSS(itemName)));
  }

  /**
   * Verify products are sorted alphabetically A-Z
   */
  @allureStep()
  async verifyProductsSortedAZ(): Promise<void> {
    const names = await this.getAllProductNames();
    const sorted = [...names].sort((a, b) => a.localeCompare(b));
    for (let i = 0; i < names.length; i++) {
      await this.assert.attach(sorted[i], names[i]);
    }
  }

  /**
   * Verify products are sorted alphabetically Z-A
   */
  @allureStep()
  async verifyProductsSortedZA(): Promise<void> {
    const names = await this.getAllProductNames();
    const sorted = [...names].sort((a, b) => b.localeCompare(a));
    for (let i = 0; i < names.length; i++) {
      await this.assert.attach(sorted[i], names[i]);
    }
  }

  /**
   * Verify products are sorted by price low to high
   */
  @allureStep()
  async verifyProductsSortedPriceLowToHigh(): Promise<void> {
    const prices = await this.getAllProductPrices();
    const numericPrices = prices.map(p => parseFloat(p.replace('$', '')));
    const sorted = [...numericPrices].sort((a, b) => a - b);
    for (let i = 0; i < numericPrices.length; i++) {
      await this.assert.attach(sorted[i].toString(), numericPrices[i].toString());
    }
  }

  /**
   * Verify products are sorted by price high to low
   */
  @allureStep()
  async verifyProductsSortedPriceHighToLow(): Promise<void> {
    const prices = await this.getAllProductPrices();
    const numericPrices = prices.map(p => parseFloat(p.replace('$', '')));
    const sorted = [...numericPrices].sort((a, b) => b - a);
    for (let i = 0; i < numericPrices.length; i++) {
      await this.assert.attach(sorted[i].toString(), numericPrices[i].toString());
  }
  }

}
