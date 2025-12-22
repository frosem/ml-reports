/**
 * Inventory Page Actions
 * Application actions for the Inventory page using InventoryPageObjects
 */
import { type Page } from '@playwright/test';
import { allureStep, allureExpect, attachAssertion } from '@playwright-support/AllureTools';
import { inventoryPageObjects } from '@page-objects/InventoryPageObjects';
import urls from '@fixtures/urls.json';

export class InventoryPageActions {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Verify user is on the inventory page
   */
  @allureStep()
  async verifyOnInventoryPage(): Promise<void> {
    const expectedUrl = `${urls.baseUrl}${urls.paths.inventory}`;
    const actualUrl = this.page.url();
    await attachAssertion(expectedUrl, actualUrl);
    await allureExpect(this.page, { errorMessage: `Should be on inventory page but got: ${actualUrl}` }).toHaveURL(expectedUrl);

    const itemCount = await this.page.getByTestId(inventoryPageObjects.inventoryItemContainerTestId).count();
    await allureExpect(itemCount, { label: 'product items', errorMessage: 'Inventory should have at least one item' }).toBeGreaterThan(0);
  }

  /**
   * Add first item to cart
   */
  @allureStep()
  async addFirstItemToCart(): Promise<void> {
    await this.page.locator(inventoryPageObjects.addToCartButtonCSS()).first().click();
  }

  /**
   * Add item to cart by index
   * @param index - The index of the item to add
   */
  @allureStep('Add item to cart by index: {0}')
  async addItemToCartByIndex(index: number): Promise<void> {
    await this.page.locator(inventoryPageObjects.addToCartButtonCSSByIndex(index)).click();
  }

  /**
   * Add item to cart by name
   * @param itemName - The name of the item to add
   */
  @allureStep('Add item to cart: {0}')
  async addItemToCartByName(itemName: string): Promise<void> {
    await this.page.locator(inventoryPageObjects.addToCartButtonCSS(itemName)).click();
  }

  /**
   * Get the name of the first inventory item
   * @returns The item name
   */
  @allureStep()
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
  @allureStep()
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
  @allureStep()
  async clickOnCartIcon(): Promise<void> {
    await this.page.getByTestId(inventoryPageObjects.cartIconLinkTestId).click();
  }

  /**
   * Verify cart badge shows the expected count
   * @param expectedCount - The expected number of items in cart
   */
  @allureStep('Verify cart badge count: {0}')
  async verifyCartBadgeCount(expectedCount: number): Promise<void> {
    const badge = this.page.getByTestId(inventoryPageObjects.cartBadgeSpanTestId);
    await allureExpect(badge).toBeVisible();
    await allureExpect(badge, `Cart badge should show ${expectedCount} item(s)`).toContainText(expectedCount.toString());
  }

  /**
   * Verify cart badge is not visible (empty cart)
   */
  @allureStep()
  async verifyCartBadgeIsNotVisible(): Promise<void> {
    await allureExpect(
      this.page.getByTestId(inventoryPageObjects.cartBadgeSpanTestId)
    ).not.toBeVisible();
  }

  /**
   * Get the number of items displayed on the inventory page
   * @returns the items count
   */
  @allureStep()
  async getItemCount(): Promise<number> {
    return await this.page.getByTestId(inventoryPageObjects.inventoryItemContainerTestId).count();
  }
}
