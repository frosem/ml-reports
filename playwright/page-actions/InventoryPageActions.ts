/**
 * Inventory Page Actions
 */
import { type Page } from '@playwright/test';
import { allureStep, expect } from '@playwright-support/AllureTools';
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

    const itemCount = await this.getCount(this.page.getByTestId(inventoryPageObjects.inventoryItemContainerTestId));
    await expect(itemCount, { label: 'product items', errorMessage: 'Inventory should have at least one item' }).toBeGreaterThan(0);
  }

  /**
   * Add first item to cart
   */
  @allureStep()
  async addFirstItemToCart(): Promise<void> {
    await this.click(this.page.locator(inventoryPageObjects.addToCartButtonCSS()).first());
  }

  /**
   * Add item to cart by index
   * @param index - The index of the item to add
   */
  @allureStep('Add item to cart by index: {0}')
  async addItemToCartByIndex(index: number): Promise<void> {
    await this.click(this.page.locator(inventoryPageObjects.addToCartButtonCSSByIndex(index)));
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
   * Get the name of the first inventory item
   * @returns The item name
   */
  @allureStep()
  async getFirstItemName(): Promise<string> {
    return await this.getText(
      this.page.getByTestId(inventoryPageObjects.inventoryItemNameContainerTestId).first()
    );
  }

  /**
   * Get the price of the first inventory item
   * @returns The item price
   */
  @allureStep()
  async getFirstItemPrice(): Promise<string> {
    return await this.getText(
      this.page.getByTestId(inventoryPageObjects.inventoryItemPriceContainerTestId).first()
    );
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
   * Get the number of items displayed on the inventory page
   * @returns the items count
   */
  @allureStep()
  async getItemCount(): Promise<number> {
    return await this.getCount(this.page.getByTestId(inventoryPageObjects.inventoryItemContainerTestId));
  }
}
