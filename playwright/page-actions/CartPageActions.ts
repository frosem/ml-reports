/**
 * Cart Page Actions
 */
import { type Page } from '@playwright/test';
import { allureStep } from '@playwright-support/AllureTools';
import { BasePage } from '@playwright-core/BasePage';
import { cartPageObjects } from '@page-objects/CartPageObjects';
import urls from '@fixtures/urls.json';

export class CartPageActions extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Verify user is on the cart page
   */
  @allureStep()
  async verifyOnCartPage(): Promise<void> {
    await this.assert.url(new RegExp(urls.paths.cart));
    await this.assert.visible(this.page.getByTestId(cartPageObjects.cartItemsContainerTestId).first());
  }

  /**
   * Get the number of items in the cart
   * @returns items count number
   */
  @allureStep()
  async getCartItemCount(): Promise<number> {
    return await this.getCount(this.page.getByTestId(cartPageObjects.cartItemsContainerTestId));
  }

  /**
   * Verify cart contains the expected number of items
   * @param expectedCount - The expected number of items
   */
  @allureStep('Verify cart item count: {0}')
  async verifyCartItemCount(expectedCount: number): Promise<void> {
    await this.assert.count(this.page.getByTestId(cartPageObjects.cartItemsContainerTestId), expectedCount);
  }

  /**
   * Verify cart contains an item with the specified name
   * @param itemName - The name of the item to verify
   */
  @allureStep('Verify cart contains: {0}')
  async verifyCartContainsItem(itemName: string): Promise<void> {
    await this.assert.containsText(this.page.getByTestId(cartPageObjects.cartItemNameContainerTestId), itemName);
  }

  /**
   * Get the name of the first cart item
   * @returns the item name
   */
  @allureStep()
  async getFirstCartItemName(): Promise<string> {
    return await this.getText(
      this.page.getByTestId(cartPageObjects.cartItemNameContainerTestId).first()
    );
  }

  /**
   * Get the price of the first cart item
   * @returns The item price
   */
  @allureStep()
  async getFirstCartItemPrice(): Promise<string> {
    return await this.getText(
      this.page.getByTestId(cartPageObjects.cartItemPriceContainerTestId).first()
    );
  }

  /**
   * Verify the first cart item has the expected price
   * @param expectedPrice - The expected price text
   */
  @allureStep('Verify first cart item price: {0}')
  async verifyFirstCartItemPrice(expectedPrice: string): Promise<void> {
    await this.assert.containsText(
      this.page.getByTestId(cartPageObjects.cartItemPriceContainerTestId).first(),
      expectedPrice
    );
  }

  /**
   * Remove item from cart by index
   * @param index - The index of the item to remove
   */
  @allureStep('Remove item by index: {0}')
  async removeItemButtonByIndex(index: number): Promise<void> {
    await this.click(
      this.page
        .getByTestId(cartPageObjects.cartItemsContainerTestId)
        .nth(index)
        .locator(cartPageObjects.removeButtonCSS)
    );
  }

  /**
   * Click continue shopping button
   */
  @allureStep()
  async clickOnContinueShoppingButton(): Promise<void> {
    await this.click(this.page.getByTestId(cartPageObjects.continueShoppingButtonTestId));
  }

  /**
   * Click checkout button
   */
  @allureStep()
  async clickOnCheckoutButton(): Promise<void> {
    await this.click(this.page.getByTestId(cartPageObjects.checkoutButtonTestId));
  }

  /**
   * Verify cart is empty
   */
  @allureStep()
  async verifyCartIsEmpty(): Promise<void> {
    await this.assert.count(this.page.getByTestId(cartPageObjects.cartItemsContainerTestId), 0);
  }
}
